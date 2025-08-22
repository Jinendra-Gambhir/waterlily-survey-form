import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

// Types
type Category = "demographic" | "health" | "financial";

type Question = {
  id: number;
  title: string;
  description?: string;
  type: string;
  category: Category;
};

type ResponseItem = {
  id: number;
  userId: number;
  questionId: number;
  answer: string;
  question: Question;
  createdAt?: string;
};

const categories: Array<"" | Category> = ["", "demographic", "health", "financial"];

export default function Responses() {
  const [rows, setRows] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState<"" | Category>("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"category" | "question" | "updated">("category");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<ResponseItem[]>("/responses"); // assumes api baseURL is /api
        setRows(res.data || []);
      } catch (e) {
        console.error(e);
        setError("Failed to load responses.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Deduplicate by questionId (keep latest by highest id)
  const deduped = useMemo(() => {
    const byQ = new Map<number, ResponseItem>();
    for (const r of rows) {
      const existing = byQ.get(r.questionId);
      if (!existing || r.id > existing.id) byQ.set(r.questionId, r);
    }

    let list = Array.from(byQ.values());

    if (category) list = list.filter((r) => r.question?.category === category);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => {
        const t = r.question?.title?.toLowerCase() || "";
        const d = r.question?.description?.toLowerCase() || "";
        const a = (r.answer || "").toLowerCase();
        return t.includes(q) || d.includes(q) || a.includes(q);
      });
    }

    const cmp: Record<typeof sort, (a: ResponseItem, b: ResponseItem) => number> = {
      category: (a, b) => (a.question?.category || "").localeCompare(b.question?.category || "") || (a.question?.title || "").localeCompare(b.question?.title || ""),
      question: (a, b) => (a.question?.title || "").localeCompare(b.question?.title || ""),
      updated: (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime(),
    } as const;

    return list.sort(cmp[sort]);
  }, [rows, category, query, sort]);

  const toCSV = () => {
    const header = ["Category", "Question", "Description", "Answer", "Updated"];
    const lines = deduped.map((r) => [
      r.question?.category || "",
      r.question?.title || "",
      r.question?.description || "",
      r.answer || "",
      r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
    ]);
    const csv = [header, ...lines]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `responses.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyAll = async () => {
    const text = deduped
      .map((r) => `${r.question?.category} • ${r.question?.title}: ${r.answer}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {
      alert("Copy failed");
    }
  };

  const Badge = ({ children }: { children: string }) => (
    <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs capitalize">
      {children}
    </span>
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="h-8 w-56 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="border rounded overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`grid grid-cols-12 gap-3 px-3 py-3 ${i % 2 ? "bg-white" : "bg-gray-50/50"}`}>
              <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <>
       <Navbar />
    <div className="max-w-6xl mx-auto p-4">
      {/* Header + controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold">Survey Responses</h1>

        <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
      
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-700">Question</th>
              <th className="text-left px-3 py-2 font-medium text-gray-700 w-72">Answer</th>
            </tr>
          </thead>
          <tbody>
            {deduped.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  No responses found.
                </td>
              </tr>
            ) : (
              deduped.map((r, idx) => (
                <tr key={r.id} className={idx % 2 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="text-left px-3 py-2">{r.question?.title}<div className="text-gray-500 mt-0.5">{r.question?.description || "-"}</div></td>
                  <td className="text-left px-3 py-2 break-words">{r.answer || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
