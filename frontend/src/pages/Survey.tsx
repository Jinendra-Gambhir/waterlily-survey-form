import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export type Question = {
  id: number;
  title: string;
  description?: string;
  type: "text" | "number";
  category: "demographic" | "health" | "financial";
};

export type GroupedQuestions = {
  demographic: Question[];
  health: Question[];
  financial: Question[];
};

export default function Survey() {
  const [questions, setQuestions] = useState<GroupedQuestions | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    let alive = true;

    const toGrouped = (input: any): GroupedQuestions => {
      // If backend already returns grouped { demographic, health, financial }
      if (
        input &&
        typeof input === "object" &&
        Array.isArray(input.demographic) &&
        Array.isArray(input.health) &&
        Array.isArray(input.financial)
      ) {
        return input as GroupedQuestions;
      }

      // If backend returns a flat array of questions
      const arr: Question[] = Array.isArray(input) ? input : [];
      const grouped: GroupedQuestions = { demographic: [], health: [], financial: [] };
      for (const q of arr) {
        if (q?.category === "demographic") grouped.demographic.push(q);
        else if (q?.category === "health") grouped.health.push(q);
        else if (q?.category === "financial") grouped.financial.push(q);
      }
      return grouped;
    };

    (async () => {
      try {
        const { data } = await api.get("/questions");
        const grouped = toGrouped(data);
        if (alive) setQuestions(grouped);
      } catch (e: any) {
        console.error(e);
        if (alive) {
          setError(e?.response?.data?.error || "Failed to load questions.");
          // Set empty state so you don't get stuck on "Loading..."
          setQuestions({ demographic: [], health: [], financial: [] });
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Flatten questions (Demographic → Health → Financial)
  const flat = useMemo(() => {
    if (!questions) return [] as Question[];
    return [...questions.demographic, ...questions.health, ...questions.financial];
  }, [questions]);

   const total = flat.length;
   const current = flat[currentIndex];

  const handleChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const numberConstraints = (q: Question) => {
    if (q.type !== "number") return {};
    return { min: 0, max: 1000000, step: 1 };
    // If you later store min/max per question, pipe them through here.
  };

  const isYesNo = (q: Question) => {
    const t = (q.title || "").toLowerCase();
    const d = (q.description || "").toLowerCase();
    return (
      t.includes("yes/no") ||
      d.includes("yes/no") ||
      /^do\s|^did\s|^have\s|^has\s|^are\s|^is\s|^was\s|^were\s/.test(t)
    );
  };

  const renderAnswer = (q: Question) => {
    if (isYesNo(q)) {
      return (
        <div className="flex flex-col gap-2 mt-2">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name={`q-${q.id}`}
              value="Yes"
              checked={answers[q.id] === "Yes"}
              onChange={() => handleChange(q.id, "Yes")}
              required
            />
            <span>Yes</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name={`q-${q.id}`}
              value="No"
              checked={answers[q.id] === "No"}
              onChange={() => handleChange(q.id, "No")}
              required
            />
            <span>No</span>
          </label>
        </div>
      );
    }

    if (q.type === "number") {
      const { min, max, step } = numberConstraints(q);
      return (
        <input
          type="number"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
          value={answers[q.id] ?? ""}
          onChange={(e) => handleChange(q.id, e.target.value)}
          required
          min={min}
          max={max}
          step={step}
          placeholder="Enter number"
        />
      );
    }

    return (
      <input
        type="text"
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
        value={answers[q.id] ?? ""}
        onChange={(e) => handleChange(q.id, e.target.value)}
        required
        placeholder="Type your answer"
      />
    );
  };

  const goNext = () => {
    if (!current) return;
    const val = (answers[current.id] ?? "").toString().trim();

    if (!val) {
      alert("Please answer the question before continuing.");
      return;
    }

    if (current.type === "number") {
      const num = Number(val);
      const { min = -Infinity, max = Infinity } = numberConstraints(current);
      if (Number.isNaN(num) || num < min || num > max) {
        alert(`Please enter a valid number between ${min} and ${max}.`);
        return;
      }
    }

    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing = flat.filter((q) => !(answers[q.id] ?? "").toString().trim());
    if (missing.length) {
      alert("Please complete all questions before submitting.");
      return;
    }

    const payload = flat.map((q) => ({
      questionId: q.id,
      answer: answers[q.id],
    }));

    try {
      await api.post("/responses", { responses: payload }); // change to "/api/responses" if needed
      navigate("/responses");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || "Failed to submit survey.");
    }
  };

  if (!questions) return <div className="p-4">Loading...</div>;

  // No questions case (prevents endless loading and gives feedback)
  if (total === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-4">Survey</h1>
          {error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div>No questions available.</div>
          )}
        </div>
      </>
    );
  }

  const pct = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Survey</h1>
        {error && (
          <div className="mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded p-3">
            {error}
          </div>
        )}

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>
              Question {Math.min(currentIndex + 1, total)} of {total}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded">
            <div
              className="h-2 bg-gray-900 rounded"
              style={{ width: `${pct}%` }}
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              role="progressbar"
            />
          </div>
        </div>

        {current && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-left">
                <div className="font-medium text-gray-900">
                  {current.title} <span className="text-red-500">*</span>
                </div>
                {current.description && (
                  <div className="text-gray-500 mt-0.5">{current.description}</div>
                )}
              </div>

              <div className="mt-3">{renderAnswer(current)}</div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>

              {currentIndex < total - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="px-5 py-2 rounded bg-gray-900 text-white hover:opacity-90"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-gray-900 text-white hover:opacity-90"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </>
  );
}
