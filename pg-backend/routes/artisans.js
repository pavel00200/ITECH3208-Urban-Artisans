import { Router } from "express";
import pool from "../db/database.js";

const router = Router();

// GET /artisans
// returns all artisans (public info only, no email)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, craft, location FROM artisans ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get artisans error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

// GET /artisans/:id
// returns a single artisan along with their products
router.get("/:id", async (req, res) => {
  try {
    const artisanResult = await pool.query(
      "SELECT id, name, craft, location FROM artisans WHERE id = $1",
      [req.params.id]
    );

    if (artisanResult.rows.length === 0) {
      return res.status(404).json({ message: "Artisan not found." });
    }

    const artisan = artisanResult.rows[0];

    const productsResult = await pool.query(
      "SELECT slug, name, price, img FROM products WHERE artisan_id = $1",
      [artisan.id]
    );

    res.json({ ...artisan, products: productsResult.rows });

  } catch (err) {
    console.error("Get artisan error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;