import express from "express";
import cors from "cors";
import authRoutes    from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes   from "./routes/orders.js";
import artisanRoutes from "./routes/artisans.js";

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// mount all route files
app.use("/",         authRoutes);
app.use("/products", productRoutes);
app.use("/orders",   orderRoutes);
app.use("/artisans", artisanRoutes);

// health check — visit https://itech3208-urban-artisans.onrender.com/health to confirm server is running
app.get("/health", (req, res) => {
  res.json({
    status: "Urban Artisans API is running",
    database: "PostgreSQL",
    port: PORT,
    routes: [
      "POST   /login",
      "GET    /products",
      "GET    /products/:slug",
      "POST   /orders",
      "GET    /orders/:userId",
      "GET    /artisans",
      "GET    /artisans/:id",
    ],
  });
});

app.listen(PORT, () => {
  console.log(`\n  Urban Artisans Backend (PostgreSQL)`);
  console.log(`  Running at  http://localhost:${PORT}`);
  console.log(`  Health:     http://localhost:${PORT}/health\n`);
});