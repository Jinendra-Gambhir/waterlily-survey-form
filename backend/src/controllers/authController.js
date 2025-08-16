 const { PrismaClient } = require("@prisma/client");
 const bcrypt = require("bcryptjs");
 const { generateToken } = require("../utils/jwt");
 const prisma = new PrismaClient();

 const register = async (req, res) => {
   const { email, password } = req.body;
 
   try {
     // Check if user already exists
     const existingUser = await prisma.user.findUnique({ where: { email } });
     if (existingUser) return res.status(400).json({ error: "User already exists" });
 
     // Hash password for secure storage
     const hashedPassword = await bcrypt.hash(password, 10);
 
     // Create new user in database
     const user = await prisma.user.create({
       data: { email, password: hashedPassword },
     });
 
     // Generate authentication token and set as HTTP-only cookie
     const token = generateToken(user.id);
     res.cookie("token", token, { httpOnly: true });
 
     res.json({ message: "User registered successfully" });
   } catch (err) {
     res.status(500).json({ error: "Registration failed" });
   }
 };
 const login = async (req, res) => {
   const { email, password } = req.body;
 
   try {
     // Look up user by email
     const user = await prisma.user.findUnique({ where: { email } });
     if (!user) return res.status(400).json({ error: "Invalid credentials" });
 
     // Compare entered password with hashed password in database
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
 
     // Generate authentication token and set as HTTP-only cookie
     const token = generateToken(user.id);
     res.cookie("token", token, { httpOnly: true });
 
     res.json({ message: "Login successful" });
   } catch (err) {
     res.status(500).json({ error: "Login failed" });
   }
 };
 const logout = (req, res) => {
   res.clearCookie("token");
   res.json({ message: "Logged out" });
 };
 
 module.exports = { register, login, logout };
 