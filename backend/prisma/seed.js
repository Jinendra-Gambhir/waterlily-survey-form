 const { PrismaClient } = require('@prisma/client');
 const prisma = new PrismaClient();
 
 async function main() {
   await prisma.question.createMany({
     data: [
       // DEMOGRAPHIC questions
       { title: "What is your full name?", description: "Enter your legal full name", type: "text", category: "demographic" },
       { title: "What is your age?", description: "Your current age in years", type: "number", category: "demographic" },
       { title: "What is your biological sex?", description: "Select male or female", type: "text", category: "demographic" },
       { title: "What is your zip code?", description: "Your current residential zip code", type: "text", category: "demographic" },
 
       // HEALTH questions
       { title: "Do you smoke or use tobacco?", description: "Yes or no", type: "text", category: "health" },
       { title: "Do you drink alcohol?", description: "If yes, how often?", type: "text", category: "health" },
       { title: "Do you have chronic conditions?", description: "e.g., Diabetes, Hypertension", type: "text", category: "health" },
       { title: "Do you require assistance with daily tasks?", description: "e.g., dressing, bathing", type: "text", category: "health" },
       { title: "What is your height (in cm)?", description: "Required for health scoring", type: "number", category: "health" },
       { title: "What is your weight (in kg)?", description: "Required for BMI calculation", type: "number", category: "health" },
 
       // FINANCIAL questions
       { title: "Are you currently insured?", description: "Do you have any health insurance?", type: "text", category: "financial" },
       { title: "What is your total monthly income?", description: "Approximate after-tax income", type: "number", category: "financial" },
       { title: "What are your average monthly expenses?", description: "Bills, rent, groceries, etc.", type: "number", category: "financial" },
       { title: "Do you have long-term care insurance?", description: "Yes, no, or unsure", type: "text", category: "financial" }
     ]
   });
 
   console.log("Questions seeded.");
 }
 main()
   .catch((e) => {
     console.error("Seed error:", e);
     process.exit(1);
   })
   .finally(async () => {
     await prisma.$disconnect();
   });
 