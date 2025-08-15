/**
 * authMiddleware.js
 * -----------------------
 * Why: We need to ensure that only authenticated users can access certain routes in our application.
 * Purpose: Middleware that checks for a valid JWT in the user's cookies and attaches the user ID to the request object.
 */

 const { verifyToken } = require("../utils/jwt");

 /**
  * Why: Protect routes from unauthorized access.
  * Purpose: Validates the JWT from cookies, extracts the user ID, and allows the request to continue if valid.
  * @param {object} req - Express request object.
  * @param {object} res - Express response object.
  * @param {function} next - Function to move to the next middleware or route handler.
  * @returns {void} - Calls `next()` if token is valid, otherwise sends a 401 Unauthorized response.
  */
 const authenticate = (req, res, next) => {
   const token = req.cookies.token; // Read JWT from cookies
 
   if (!token) {
     return res.status(401).json({ error: "No token provided" }); // Token missing
   }
 
   try {
     const decoded = verifyToken(token); // Validate token
     req.userId = decoded.userId; // Attach user ID to request for later use
     next(); // Proceed to the next middleware or route
   } catch (err) {
     return res.status(401).json({ error: "Invalid token" }); // Token invalid or expired
   }
 };
 
 module.exports = authenticate;
 