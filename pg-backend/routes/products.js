import express from "express";
import pool from "../db/database.js";

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get products error:", err.message);

    res.status(500).json({
      error: "Failed to load products",
    });
  }
});

// Get single product by ID or slug
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;

    let result;

    if (/^\d+$/.test(identifier)) {
      result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [identifier]
      );
    } else {
      result = await pool.query(
        "SELECT * FROM products WHERE slug = $1",
        [identifier]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get product detail error:", err.message);

    res.status(500).json({
      error: "Failed to load product",
    });
  }
});

export default router;