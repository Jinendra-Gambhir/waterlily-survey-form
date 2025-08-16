 const { verifyToken } = require("../utils/jwt");
 const authenticate = (req, res, next) => {
   const token = req.cookies.token;
 
   if (!token) {
     return res.status(401).json({ error: "No token provided" });
   }
 
   try {
     const decoded = verifyToken(token);
     req.userId = decoded.userId; 
     next(); 
   } catch (err) {
     return res.status(401).json({ error: "Invalid token" });
   }
 };
 
 module.exports = authenticate;
 