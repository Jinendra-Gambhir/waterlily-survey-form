 const { PrismaClient } = require("@prisma/client");
 const prisma = new PrismaClient();
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
 