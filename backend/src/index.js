 const express = require("express");
 const cors = require("cors");
 const cookieParser = require("cookie-parser");
 const dotenv = require("dotenv");
 const authRoutes = require("./routes/authRoutes");         
 const questionRoutes = require("./routes/questionRoutes"); 
 const responseRoutes = require("./routes/responseRoutes");
 dotenv.config();
 const app = express();
 app.use(express.json());
 app.use(cookieParser());
 app.use(cors({
   origin: "http://localhost:3000",
   credentials: true              
 })); 
 app.use("/api/auth", authRoutes);
 app.use("/api/questions", questionRoutes);
 app.use("/api/responses", responseRoutes);

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
 });
 