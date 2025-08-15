/**
 * index.js
 * -----------------------
 * Entry point of the backend application.
 * Sets up Express server, loads environment variables,
 * applies middleware, registers API routes, and starts the server.
 */

 const express = require("express");
 const cors = require("cors");
 const cookieParser = require("cookie-parser");
 const dotenv = require("dotenv");
 
 // Import route definitions
 const authRoutes = require("./routes/authRoutes");         // Handles user authentication-related endpoints
 const questionRoutes = require("./routes/questionRoutes"); // Handles survey question CRUD operations
 const responseRoutes = require("./routes/responseRoutes"); // Handles survey response submissions and retrieval
 
 // Load environment variables from .env file
 dotenv.config();
 
 // Initialize Express application
 const app = express();
 
 /* ------------------------
    Global Middleware Setup
 -------------------------*/
 
 // Parse incoming JSON requests
 app.use(express.json());
 
 // Parse cookies in request headers
 app.use(cookieParser());
 
 // Enable CORS (Cross-Origin Resource Sharing) for the frontend
 app.use(cors({
   origin: "http://localhost:3000", // Allow requests from React frontend
   credentials: true                // Allow sending cookies with requests
 }));
 
 /* ------------------------
    API Route Registration
 -------------------------*/
 
 // Authentication routes (login, register, logout, etc.)
 app.use("/api/auth", authRoutes);
 
 // Survey question routes (create, read, update, delete questions)
 app.use("/api/questions", questionRoutes);
 
 // Survey response routes (submit and fetch responses)
 app.use("/api/responses", responseRoutes);
 
 /* ------------------------
    Start the Server
 -------------------------*/
 
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
   console.log(`✅ Server running on http://localhost:${PORT}`);
 });
 