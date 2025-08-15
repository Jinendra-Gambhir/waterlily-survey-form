/**
 * questionRoutes.js
 * -----------------------
 * Why: Routes are needed to fetch survey questions from the database.
 * Purpose: Defines the API endpoint to retrieve all available survey questions.
 */

 const express = require("express");
 const router = express.Router();
 const { getAllQuestions } = require("../controllers/questionController");
 
 /**
  * Why: The frontend needs a way to load all survey questions for display.
  * Purpose: Handles GET requests to return all survey questions.
  */
 router.get("/", getAllQuestions); // GET /api/questions
 
 module.exports = router;
 