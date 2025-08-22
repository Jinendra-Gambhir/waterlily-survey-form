 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import api from "../services/api";
 
 export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const navigate = useNavigate();
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError("");
     try {
       await api.post("/auth/login", { email, password });
       navigate("/survey");
     } catch (err: any) {
       setError(err?.response?.data?.error || "Login failed");
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
       <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96 space-y-4">
         <h2 className="text-2xl font-bold mb-4">Login</h2>
         {error && <div className="text-red-500 text-sm">{error}</div>}
         <div>
           <label className="block mb-1">Email</label>
           <input type="email" className="w-full border border-gray-300 p-2 rounded"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
         </div>
 
         <div>
           <label className="block mb-1">Password</label>
           <input type="password" className="w-full border border-gray-300 p-2 rounded"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
         </div>
 
         <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full">
           Login
         </button>
 
         <p className="text-sm mt-2">
           Don’t have an account? <a href="/register" className="text-blue-600 underline">Register</a>
         </p>
       </form>
     </div>
   );
 }
 