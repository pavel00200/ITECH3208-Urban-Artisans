import pg from "pg";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { createRequire } from "module";
const require = createRequire(import.meta.url);
console.log(process.env.DB_PASSWORD);
const pool = new Pool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || "urban_artisans",
  user:     process.env.DB_USER     || "postgres",
  password: process.env.DB_PASSWORD || "artisans",
});

async function seed() {
  const client = await pool.connect();

  try {
    console.log("Connected to PostgreSQL.");
    console.log("Seeding database...\n");

    // run schema first — creates tables if they don't exist
    const schema = readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    await client.query(schema);
    console.log("[OK] Tables created.");

    // clear existing data so seed can be run multiple times safely
    await client.query("TRUNCATE orders, products, artisans, users RESTART IDENTITY CASCADE");
    console.log("[OK] Old data cleared.");

    // ── users ───────────────────────────────────────────────
    await client.query(`
      INSERT INTO users (name, email, password) VALUES
        ('Demo User',       'test@gmail.com',     '123456'),
        ('Dipendra Sharma', 'dipendra@gmail.com', 'hashed_1'),
        ('Sita Rai',        'sita@gmail.com',     'hashed_2'),
        ('Rohan Thapa',     'rohan@gmail.com',    'hashed_3')
    `);
    console.log("[OK] Users inserted.");

  // ── artisans ─────────────────────────────────────────────
  await client.query(`
    INSERT INTO artisans (name, email, craft, location) VALUES
      ('Maya Tamang',   'maya@artisans.com',   'Jewelry',     'Sydney, NSW'),
      ('Bikram Lama',   'bikram@artisans.com', 'Home Decor',  'Melbourne, VIC'),
      ('Sunita Magar',  'sunita@artisans.com', 'Clothing',    'Brisbane, QLD'),
      ('Hari Shrestha', 'hari@artisans.com',   'Accessories', 'Perth, WA')
  `);
  console.log("[OK] Artisans inserted.");

    // ── products — all 20 matching frontend products.js ──────
    await client.query(`
      INSERT INTO products (slug, name, price, description, category, img, artisan_id, added_at) VALUES
        ('bracelet-wood-silver',   'Handcrafted Beaded Bracelet',   39,  'Hand-beaded bracelet using natural stones.',       'Jewelry',     '/img/bracelet.png',               1, 20250901),
        ('earrings-filigree',      'Filigree Earrings',              45,  'Delicate silver filigree drop earrings.',          'Jewelry',     '/img/earrings.png',               1, 20250903),
        ('pendant-octopus',        'Octopus Pendant',                59,  'Handcrafted octopus pendant necklace.',            'Jewelry',     '/img/necklace.png',               1, 20250904),
        ('bracelet-earth-tones',   'Beaded Bracelet — Earth Tones',  42,  'Earth-tone beaded bracelet.',                      'Jewelry',     '/img/bracelet 1.png',             1, 20250906),
        ('earrings-filigree-drop', 'Filigree Drop Earrings',         49,  'Elegant filigree drop style earrings.',            'Jewelry',     '/img/Filigree Drop Earrings.png', 1, 20250907),
        ('bowl-wooden',            'Wooden Bowl',                   149,  'Hand-turned wooden bowl, dark grain finish.',      'Home Decor',  '/img/wooden bowl.png',            2, 20250901),
        ('wall-african',           'African Wall Art',               97,  'Hand-painted decorative wall panel.',              'Home Decor',  '/img/Art.png',                    2, 20250902),
        ('sculpture-eagle',        'Eagle & Globe Sculpture',       167,  'Hand-carved eagle perched on a globe.',            'Home Decor',  '/img/Eagle & Globe.png',          2, 20250904),
        ('bowl-dark-grain',        'Wooden Bowl — Dark Grain',      139,  'Wooden bowl with rich dark grain finish.',         'Home Decor',  '/img/wooden bowl 1.png',          2, 20250906),
        ('wall-african-blue',      'African Wall Art — Blue',        50,  'Blue-toned African decorative wall art.',          'Home Decor',  '/img/Art 1.png',                  2, 20250907),
        ('robe-batik',             'Batik Patterned Robe',           79,  'Lightweight robe with traditional batik print.',   'Clothing',    '/img/robe.png',                   3, 20250902),
        ('robe-midnight',          'Midnight Stars Robe',            85,  'Robe featuring a midnight stars pattern.',         'Clothing',    '/img/mens robe.png',              3, 20250903),
        ('skirt-cotton',           'Handcrafted Cotton Skirt',       55,  'Breathable cotton skirt, hand-stitched.',          'Clothing',    '/img/skirt.png',                  3, 20250901),
        ('robe-batik-long',        'Batik Robe — Long',              92,  'Full-length batik patterned robe.',                'Clothing',    '/img/robe 1.png',                 3, 20250906),
        ('skirt-cotton-beige',     'Cotton Skirt — Beige',           58,  'Beige handcrafted cotton skirt.',                  'Clothing',    '/img/skirt 1.png',                3, 20250907),
        ('hairpin-dragonfly',      'Pearl Dragonfly Hair Pin',       19,  'Delicate hair pin with pearl dragonfly detail.',   'Accessories', '/img/hairpin.png',                4, 20250902),
        ('scratcher-turtle',       'Turtle Back Scratcher',          24,  'Hand-carved turtle-shaped back scratcher.',        'Accessories', '/img/scratcher.png',              4, 20250901),
        ('mask-batik-3pc',         'Batik Face Mask (3pc)',          29,  'Set of 3 handmade batik face masks.',              'Accessories', '/img/mask.png',                   4, 20250903),
        ('hairpin-pearl-wing',     'Leather Key Fob — Brass',        21,  'Leather key fob with brass hardware.',             'Accessories', '/img/Brass.png',                  4, 20250906),
        ('scratcher-wood',         'Canvas Tote — Natural',          22,  'Natural canvas tote bag, hand-stitched.',          'Accessories', '/img/Tote.png',                   4, 20250907)
    `);
    console.log("[OK] Products inserted (20 items).");

    // ── sample orders ─────────────────────────────────────────
    await client.query(`
      INSERT INTO orders (user_id, items_json, total, payment_method, ship_name, ship_email, ship_address, ship_city, ship_zip, ship_country, status, created_at) VALUES
        (1, '[{"name":"Wooden Bowl","price":149,"qty":1,"img":"/img/wooden bowl.png"}]',       149, 'card',   'Demo User',       'test@gmail.com',     '12 George St',        'Sydney',      '2000', 'Australia', 'delivered',  '1/10/2026'),
        (1, '[{"name":"Filigree Earrings","price":45,"qty":2,"img":"/img/earrings.png"}]',      90, 'cod',    'Demo User',       'test@gmail.com',     '45 Collins St',       'Melbourne',   '3000', 'Australia', 'shipped',    '2/14/2026'),
        (2, '[{"name":"Batik Patterned Robe","price":79,"qty":1,"img":"/img/robe.png"}]',       79, 'paypal', 'Dipendra Sharma', 'dipendra@gmail.com', '8 Queen St',          'Brisbane',    '4000', 'Australia', 'pending',    '3/1/2026'),
        (3, '[{"name":"African Wall Art","price":97,"qty":1,"img":"/img/Art.png"}]',            97, 'card',   'Sita Rai',        'sita@gmail.com',     '22 Hay St',           'Perth',       '6000', 'Australia', 'processing', '3/20/2026')
    `);
    console.log("[OK] Sample orders inserted.");

    console.log("\nDatabase seeded successfully.");
    console.log("  Users:    4");
    console.log("  Artisans: 4");
    console.log("  Products: 20");
    console.log("  Orders:   4");

  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();