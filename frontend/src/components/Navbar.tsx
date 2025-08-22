 import { Link, useNavigate, useLocation } from "react-router-dom";
 import api from "../services/api";
 
 export default function Navbar() {
   const navigate = useNavigate();
   const location = useLocation();
   const logout = async () => {
     try {
       await api.post("/auth/logout");
       navigate("/login");
     } catch (err) {
       console.error("Logout failed");
     }
   };
   const isActive = (path: string) =>
     location.pathname === path ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600";
 
   return (
     <nav className="bg-white border-b shadow-sm p-4 mb-6">
       <div className="max-w-4xl mx-auto flex justify-between items-center">
         <div className="space-x-4">
           <Link to="/survey" className={isActive("/survey")}>Survey</Link>
           <Link to="/responses" className={isActive("/responses")}>My Responses</Link>
         </div>
         <button onClick={logout} className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded">
           Logout
         </button>
       </div>
     </nav>
   );
 }
 