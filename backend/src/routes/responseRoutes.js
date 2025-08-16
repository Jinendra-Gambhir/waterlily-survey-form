 const express = require("express");
 const router = express.Router();
 const { submitResponses, getMyResponses } = require("../controllers/responseController");
 const authenticate = require("../middleware/authMiddleware");
 router.post("/", authenticate, submitResponses); // POST /api/responses
 router.get("/", authenticate, getMyResponses); // GET /api/responses/me 
 module.exports = router;
 