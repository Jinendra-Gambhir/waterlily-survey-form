 const { PrismaClient, Prisma } = require('@prisma/client');
 const prisma = new PrismaClient();
 const submitResponses = async (req, res) => {
   const userId = req.userId; 
   const { responses } = req.body;
 
   if (!Array.isArray(responses) || responses.length === 0) {
     return res.status(400).json({ error: "Responses must be a non-empty array." });
   }
   const getres = await prisma.response.findMany({ where: { userId } });
   const latestByQ = new Map();
   for (const r of responses) {
     if (r && Number.isInteger(r.questionId)) latestByQ.set(r.questionId, r.answer ?? "");
   }
 
   try {
     const data = Array.from(latestByQ.entries()).map(([questionId, answer]) => ({
       userId,
       questionId,
       answer,
     }));
     await prisma.$transaction(
       [
         prisma.response.deleteMany({ where: { userId } }),
         prisma.response.createMany({ data }),
       ],
       { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
     );
 
     return res.status(201).json({ message: "Responses saved (replaced previous set)." });
   } catch (error) {
     console.error("Replace-set failed:", error);
     return res.status(500).json({ error: "Failed to save responses." });
   }
 };
 const getMyResponses = async (req, res) => {
   const userId = req.userId;
   try {
     const responses = await prisma.response.findMany({
       where: { userId },
       include: {
         question: {
           select: {
             id: true,
             title: true,
             description: true,
             type: true,
             category: true,
           }
         }
       },
     });
 
     res.json(responses);
   } catch (error) {
     console.error("Error fetching responses:", error);
     res.status(500).json({ error: "Failed to fetch responses." });
   }
 };
 const upsertMyResponses = async (req, res) => {
   const userId = req.userId;
   const { responses } = req.body;
 
   if (!Array.isArray(responses) || responses.length === 0) {
     return res.status(400).json({ error: "Responses must be a non-empty array." });
   }
   const latestByQ = new Map();
   for (const r of responses) {
     if (!r || !Number.isInteger(r.questionId)) continue;
     latestByQ.set(r.questionId, r.answer ?? "");
   }
   const questionIds = Array.from(latestByQ.keys());
 
   try {
     const result = await prisma.$transaction(async (tx) => {
       const existing = await tx.response.findMany({
         where: { userId, questionId: { in: questionIds } },
         select: { questionId: true },
       });
       const existingSet = new Set(existing.map((e) => e.questionId));
       const toUpdate = [];
       const toCreate = [];
       for (const qid of questionIds) {
         const answer = latestByQ.get(qid);
         if (existingSet.has(qid)) toUpdate.push({ questionId: qid, answer });
         else toCreate.push({ questionId: qid, answer });
       }

       const updateOps = toUpdate.map(({ questionId, answer }) =>
         tx.response.updateMany({
           where: { userId, questionId },
           data: { answer },
         })
       );
 
       const createOp = toCreate.length
         ? tx.response.createMany({
             data: toCreate.map(({ questionId, answer }) => ({
               userId,
               questionId,
               answer,
             })),
           })
         : null;
 
       const updated = updateOps.length ? await Promise.all(updateOps) : [];
       const created = createOp ? await createOp : { count: 0 };
 
       return {
         updatedCount: updated.reduce((n, r) => n + r.count, 0),
         createdCount: created.count ?? 0,
         intended: { toUpdate: toUpdate.length, toCreate: toCreate.length }
       };
     }, {
       isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
     });
 
     return res.json({
       message: "Responses processed.",
       updatedRowsAffected: result.updatedCount,
       createdCount: result.createdCount,
       intended: result.intended,
     });
   } catch (error) {
     console.error("Error upserting responses:", error);
     return res.status(500).json({ error: "Failed to upsert responses." });
   }
 };
 
 module.exports = { submitResponses, getMyResponses, upsertMyResponses };
 