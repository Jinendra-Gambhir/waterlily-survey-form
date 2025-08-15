/**
 * questionController.js
 * -----------------------
 * Why: The application needs a way to retrieve survey questions from the database so the frontend can display them.
 * Purpose: Fetches all questions from the database, groups them by category, and returns them in a structured format.
 */

 const { PrismaClient } = require("@prisma/client");
 const prisma = new PrismaClient();
 
 /**
  * Why: The frontend requires all available questions grouped by category for organized display.
  * Purpose: Retrieves all unique questions, sorts them by ID, groups them by category, and sends them in JSON format.
  * @route GET /api/questions
  * @access Public
  */
 const getAllQuestions = async (req, res) => {
   try {
     const questions = await prisma.question.findMany({
       distinct: ['id'], // Avoid duplicate rows
       orderBy: { id: 'asc' }
     });
 
     // Group questions by category without duplicate check
     const grouped = questions.reduce((acc, q) => {
       acc[q.category] = acc[q.category] || [];
       acc[q.category].push(q);
       return acc;
     }, {});
 
     res.json(grouped);
   } catch (error) {
     console.error("Failed to fetch questions", error);
     res.status(500).json({ error: "Failed to fetch questions" });
   }
 };
 
 module.exports = { getAllQuestions };
 