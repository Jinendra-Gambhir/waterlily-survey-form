/**
 * authRoutes.js
 * -----------------------
 * Why: Routes are needed to define API endpoints for user authentication actions.
 * Purpose: Maps HTTP requests for registration, login, and logout to their respective controller functions.
 */

 const express = require("express");
 const router = express.Router();
 const { register, login, logout } = require("../controllers/authController");
 
 /**
  * Why: Allows new users to create accounts.
  * Purpose: Handles POST requests to register a new user.
  */
 router.post("/register", register);
 
 /**
  * Why: Authenticates existing users.
  * Purpose: Handles POST requests for user login.
  */
 router.post("/login", login);
 
 /**
  * Why: Ends a user session.
  * Purpose: Handles POST requests for user logout.
  */
 router.post("/logout", logout);
 
 module.exports = router;
 