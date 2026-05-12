import { Router } from "express";
import pool from "../db/database.js";

const router = Router();

// POST /login
// body: { email, password }
// returns user info on success, 401 on wrong credentials
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    return res.json({ success: true, id: user.id, name: user.name, email: user.email });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
 
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required." });
  }
 
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }
 
  try {
    // check if email is already taken before inserting
    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );
 
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "An account with this email already exists." });
    }
 
    // insert the new user and return their details
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name.trim(), email.trim().toLowerCase(), password]
    );
 
    const user = result.rows[0];
    return res.status(201).json({ success: true, id: user.id, name: user.name, email: user.email });
 
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});
export default router;