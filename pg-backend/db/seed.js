import pg from "pg";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "urban_artisans",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "artisans",
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
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
    await client.query(
      "TRUNCATE orders, products, artisans, users RESTART IDENTITY CASCADE"
    );
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

// ── products ─────────────────────────────────────────────
await client.query(`
  INSERT INTO products
  (slug, name, price, description, about, category, img, artisan_id, added_at)
  VALUES

    ('bracelet-wood-silver',
    'Handcrafted Natural Stone Beaded Bracelet',
    39,
    'Premium handcrafted beaded bracelet made with natural stones and artisan detailing.',
    'This artisan bracelet is carefully handcrafted using natural stone beads and durable elastic threading. Designed for both casual and modern fashion, it offers a stylish minimalist look while reflecting authentic handmade craftsmanship.',
    'Jewelry',
    '/img/bracelet.png',
    1,
    20250901),

    ('earrings-filigree',
    'Elegant Silver Filigree Drop Earrings',
    45,
    'Beautiful handcrafted silver filigree earrings designed with delicate artisan patterns.',
    'These handcrafted filigree earrings feature elegant silver detailing inspired by traditional artisan jewelry techniques. Lightweight and stylish, they are perfect for formal occasions, parties, and modern everyday fashion.',
    'Jewelry',
    '/img/earrings.png',
    1,
    20250903),

    ('pendant-octopus',
    'Handcrafted Octopus Pendant Necklace',
    59,
    'Unique artisan octopus pendant necklace crafted with detailed handmade design.',
    'Inspired by ocean themes and artistic creativity, this handcrafted octopus pendant necklace combines unique design with artisan craftsmanship. A bold jewelry accessory designed for fashion lovers and collectors.',
    'Jewelry',
    '/img/necklace.png',
    1,
    20250904),

    ('bracelet-earth-tones',
    'Earth Tone Handmade Beaded Bracelet',
    42,
    'Handcrafted earth-tone bracelet featuring natural inspired bead colors.',
    'This handmade bracelet combines earthy natural tones with artisan beadwork to create a fashionable minimalist accessory. Comfortable for daily wear and ideal for modern casual styling.',
    'Jewelry',
    '/img/bracelet 1.png',
    1,
    20250906),

    ('earrings-filigree-drop',
    'Luxury Filigree Drop Earrings for Women',
    49,
    'Elegant handcrafted filigree drop earrings designed with timeless artisan detailing.',
    'These luxury filigree earrings are handcrafted with elegant detailing and lightweight comfort. Their timeless design makes them ideal for weddings, formal events, and premium fashion collections.',
    'Jewelry',
    '/img/Filigree Drop Earrings.png',
    1,
    20250907),

    ('bowl-wooden',
    'Handcrafted Wooden Bowl with Dark Grain Finish',
    149,
    'Premium hand-turned wooden bowl featuring rich dark grain texture.',
    'Carefully hand-turned by skilled artisans, this wooden bowl features a premium dark grain finish that adds warmth and elegance to dining tables and home interiors. Ideal as both decor and functional tableware.',
    'Home Decor',
    '/img/wooden bowl.png',
    2,
    20250901),

    ('wall-african',
    'Hand Painted African Wall Art Decor',
    97,
    'Authentic African-inspired wall art featuring handcrafted decorative patterns.',
    'This handcrafted African wall artwork blends traditional cultural inspiration with contemporary home decor aesthetics. Designed to enhance living rooms, offices, and modern interior spaces.',
    'Home Decor',
    '/img/Art.png',
    2,
    20250902),

    ('sculpture-eagle',
    'Hand Carved Eagle and Globe Sculpture',
    167,
    'Luxury handcrafted eagle sculpture featuring detailed carving and globe design.',
    'This premium eagle and globe sculpture symbolizes strength, freedom, and craftsmanship. Hand carved with intricate detail, it serves as an eye-catching decorative centerpiece for luxury interiors.',
    'Home Decor',
    '/img/Eagle & Globe.png',
    2,
    20250904),

    ('bowl-dark-grain',
    'Rustic Wooden Bowl with Rich Dark Grain',
    139,
    'Elegant handcrafted wooden bowl designed with premium dark grain finish.',
    'Designed with rich natural wood textures and artisan finishing, this decorative wooden bowl adds rustic charm and sophistication to modern and traditional interior spaces.',
    'Home Decor',
    '/img/wooden bowl 1.png',
    2,
    20250906),

    ('wall-african-blue',
    'Blue African Wall Art Decor for Modern Homes',
    50,
    'Handmade African blue wall art inspired by traditional cultural patterns.',
    'This handcrafted African wall artwork blends cultural heritage with contemporary interior design. Carefully created by skilled artisans, this decorative piece adds elegance and artistic character to modern homes.',
    'Home Decor',
    '/img/Art 1.png',
    2,
    20250907),

    ('robe-batik',
    'Traditional Batik Patterned Robe',
    79,
    'Lightweight handcrafted batik robe designed with traditional cultural patterns.',
    'This artisan batik robe combines cultural heritage with modern comfort. Made using lightweight fabric and elegant handcrafted patterns, it is ideal for stylish home wear and relaxed fashion.',
    'Clothing',
    '/img/robe.png',
    3,
    20250902),

    ('robe-midnight',
    'Midnight Stars Pattern Luxury Robe',
    85,
    'Premium midnight stars robe featuring elegant artisan-inspired patterns.',
    'Featuring soft premium fabric and elegant midnight star patterns, this handcrafted robe provides luxury comfort and sophisticated style for modern lifestyle fashion.',
    'Clothing',
    '/img/mens robe.png',
    3,
    20250903),

    ('skirt-cotton',
    'Hand Stitched Cotton Skirt for Women',
    55,
    'Breathable handcrafted cotton skirt made with artisan stitching.',
    'This handcrafted cotton skirt is designed for comfort, breathability, and modern casual fashion. Featuring artisan hand stitching and lightweight fabric for all-day wear.',
    'Clothing',
    '/img/skirt.png',
    3,
    20250901),

    ('robe-batik-long',
    'Full Length Batik Patterned Robe',
    92,
    'Elegant full-length batik robe featuring handcrafted cultural patterns.',
    'This full-length artisan robe combines traditional batik-inspired design with elegant flowing comfort. Ideal for premium lounge wear and stylish modern fashion.',
    'Clothing',
    '/img/robe 1.png',
    3,
    20250906),

    ('skirt-cotton-beige',
    'Beige Handmade Cotton Skirt',
    58,
    'Minimalist beige cotton skirt crafted with soft breathable fabric.',
    'Designed with soft breathable cotton and handcrafted stitching, this beige artisan skirt offers timeless minimalist fashion and everyday comfort.',
    'Clothing',
    '/img/skirt 1.png',
    3,
    20250907),

    ('hairpin-dragonfly',
    'Pearl Dragonfly Hair Pin Accessory',
    19,
    'Elegant handcrafted dragonfly hair pin featuring pearl detailing.',
    'This artisan hair accessory combines delicate pearl details with dragonfly-inspired artistic design. A fashionable handmade accessory suitable for parties and elegant styling.',
    'Accessories',
    '/img/hairpin.png',
    4,
    20250902),

    ('scratcher-turtle',
    'Hand Carved Turtle Back Scratcher',
    24,
    'Unique turtle-shaped back scratcher handcrafted with detailed artisan wood carving.',
    'Handcrafted from durable wood, this turtle-inspired back scratcher combines functionality with decorative artisan craftsmanship. A unique handmade accessory for home use.',
    'Accessories',
    '/img/scratcher.png',
    4,
    20250901),

    ('mask-batik-3pc',
    'Handmade Batik Face Mask Set (3 Pieces)',
    29,
    'Comfortable handmade batik face mask set designed with traditional patterns.',
    'This reusable handmade batik face mask set combines breathable comfort with traditional artisan-inspired patterns. Stylish and practical for daily use.',
    'Accessories',
    '/img/mask.png',
    4,
    20250903),

    ('hairpin-pearl-wing',
    'Handcrafted Leather Key Holder with Brass Clip',
    21,
    'Premium handcrafted leather key holder made with durable brass hardware.',
    'This handcrafted leather key holder combines premium leather craftsmanship with strong brass hardware for durability and minimalist everyday style.',
    'Accessories',
    '/img/Brass.png',
    4,
    20250906),

    ('scratcher-wood',
    'Natural Canvas Tote Bag Handmade Design',
    22,
    'Eco-friendly handcrafted canvas tote bag featuring durable stitching.',
    'This reusable canvas tote bag is handcrafted with durable fabric and minimalist artisan styling. Ideal for shopping, travel, work, and eco-friendly daily use.',
    'Accessories',
    '/img/Tote.png',
    4,
    20250907)
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