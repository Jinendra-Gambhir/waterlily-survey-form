/**
 * responseRoutes.js
 * -----------------------
 * Why: Routes are needed to submit and retrieve survey responses.
 * Purpose: Defines endpoints for saving new survey responses and retrieving a user's own responses.
 */

 const express = require("express");
 const router = express.Router();
 const { submitResponses, getMyResponses } = require("../controllers/responseController");
 const authenticate = require("../middleware/authMiddleware");
 
 /**
  * Why: Users must be able to submit answers to survey questions.
  * Purpose: Handles POST requests to save survey responses to the database.
  *          Protected by authentication to ensure only logged-in users can submit.
  */
 router.post("/", authenticate, submitResponses); // POST /api/responses
 
 /**
  * Why: Users should be able to view their own submitted responses.
  * Purpose: Handles GET requests to return survey responses for the authenticated user.
  */
 router.get("/", authenticate, getMyResponses); // GET /api/responses/me
 
 module.exports = router;
 