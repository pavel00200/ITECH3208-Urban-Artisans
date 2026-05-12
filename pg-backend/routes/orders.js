import { Router } from "express";
import pool from "../db/database.js";

const router = Router();

// POST /orders
// saves a new order after checkout
// body: { userId, items, total, paymentMethod, shipping, date }
router.post("/", async (req, res) => {
  const { userId, items, total, paymentMethod, shipping, date } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Order must have at least one item." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO orders
        (user_id, items_json, total, payment_method,
         ship_name, ship_email, ship_address, ship_city, ship_zip, ship_country,
         status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', $11)
       RETURNING id`,
      [
        userId || 1,
        JSON.stringify(items),
        total,
        paymentMethod,
        shipping.name,
        shipping.email,
        shipping.address,
        shipping.city,
        shipping.zip,
        shipping.country,
        date,
      ]
    );

    res.json({ success: true, orderId: result.rows[0].id });

  } catch (err) {
    console.error("Create order error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// GET /orders/:userId
// returns all orders for a user, newest first
router.get("/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC",
      [req.params.userId]
    );

    // parse items_json back to array before sending to frontend
    const orders = result.rows.map((o) => ({
      ...o,
      items: JSON.parse(o.items_json),
    }));

    res.json(orders);

  } catch (err) {
    console.error("Get orders error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;