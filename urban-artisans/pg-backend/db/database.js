import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

// reads connection settings from .env
const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || "urban_artisans",
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "artisans",
});

// test the connection when the server first starts
pool.connect((err, client, release) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err.message);
    console.error("Make sure PostgreSQL is running and .env settings are correct.");
  } else {
    console.log("PostgreSQL connected successfully.");
    release();
  }
});

export default pool;