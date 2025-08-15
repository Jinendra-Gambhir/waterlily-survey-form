/**
 * jwt.js
 * -----------------------
 * Why: JWT (JSON Web Token) is needed for secure authentication and session management in our application.
 * Purpose: Provides utility functions to generate and verify JWTs for user authentication.
 */

 const jwt = require("jsonwebtoken");

 /**
  * Why: We need a way to issue a token when a user logs in or registers.
  * Purpose: Creates a signed JWT containing the user's ID, valid for 1 day.
  * @param {number} userId - Unique identifier of the authenticated user.
  * @returns {string} - Signed JWT token.
  */
 const generateToken = (userId) => {
   return jwt.sign({ userId }, process.env.JWT_SECRET, {
     expiresIn: "1d", // Token expires in 1 day
   });
 };
 
 /**
  * Why: We need to validate incoming tokens to ensure they are authentic and unexpired.
  * Purpose: Verifies a JWT using the secret key from environment variables.
  * @param {string} token - The JWT to verify.
  * @returns {object} - Decoded token payload if valid.
  * @throws {Error} - If the token is invalid or expired.
  */
 const verifyToken = (token) => {
   return jwt.verify(token, process.env.JWT_SECRET);
 };
 
 module.exports = { generateToken, verifyToken };
 