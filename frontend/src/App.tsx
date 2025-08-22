 import React from 'react';
 import './App.css';
 import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Login from "./pages/Login";
 import Register from "./pages/Register";
 import Survey from "./pages/Survey";
 import Responses from "./pages/Responses";
 
 function App() {  
   return (
     <div className="App">
       <BrowserRouter>
         <Routes>
          <Route path="/" element={<Login />} />

           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/survey" element={<Survey />} />
           <Route path="/responses" element={<Responses />} />
         </Routes>
       </BrowserRouter>
     </div>
   );
 }
 
 export default App;
 