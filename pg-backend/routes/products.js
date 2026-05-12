import { Router } from "express";
import pool from "../db/database.js";

const router = Router();

// GET /products
// returns all products sorted newest first
router.get("/", async (req, res) => {
  const { category } = req.query;

  try {
    let result;

    if (category && category !== "All") {
      result = await pool.query(
        "SELECT * FROM products WHERE category = $1 ORDER BY added_at DESC",
        [category]
      );
    } else {
      result = await pool.query(
        "SELECT * FROM products ORDER BY added_at DESC"
      );
    }

    res.json(result.rows);

  } catch (err) {
    console.error("Get products error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});
// GET /products/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Get product error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});
// GET /products/:slug
router.get("/:slug", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE slug = $1",
      [req.params.slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("Get product error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;