 const express = require("express");
 const router = express.Router();
 const { getAllQuestions } = require("../controllers/questionController");
 router.get("/", getAllQuestions); // GET /api/questions
 module.exports = router;
 