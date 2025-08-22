 import axios from "axios";

 const api = axios.create({
   baseURL: "http://localhost:5000/api",
   withCredentials: true, // send/receive JWT cookies
 });
 
 export default api;
 