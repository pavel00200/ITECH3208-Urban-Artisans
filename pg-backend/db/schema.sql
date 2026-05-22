-- ============================================================
--  Urban Artisans — PostgreSQL Schema
-- ============================================================

-- users — people who shop on the platform
CREATE TABLE IF NOT EXISTS users (
    id         SERIAL      PRIMARY KEY,
    name       TEXT        NOT NULL,
    email      TEXT        NOT NULL UNIQUE,
    password   TEXT        NOT NULL,
    created_at TIMESTAMP   DEFAULT NOW()
);

-- artisans — people who make and sell products
CREATE TABLE IF NOT EXISTS artisans (
    id         SERIAL      PRIMARY KEY,
    name       TEXT        NOT NULL,
    email      TEXT        NOT NULL UNIQUE,
    craft      TEXT        NOT NULL,
    location   TEXT        NOT NULL,
    created_at TIMESTAMP   DEFAULT NOW()
);

-- products — items available in the shop
CREATE TABLE IF NOT EXISTS products (
    id          SERIAL      PRIMARY KEY,
    slug        TEXT        NOT NULL UNIQUE,
    name        TEXT        NOT NULL,
    price       NUMERIC     NOT NULL,
    description TEXT,
    category    TEXT        NOT NULL,
    img         TEXT        NOT NULL,
    artisan_id  INTEGER     REFERENCES artisans(id),
    added_at    INTEGER,
    created_at  TIMESTAMP   DEFAULT NOW()
);

-- orders — purchases made by users
CREATE TABLE IF NOT EXISTS orders (
    id             SERIAL      PRIMARY KEY,
    user_id        INTEGER     NOT NULL REFERENCES users(id),
    items_json     TEXT        NOT NULL,
    total          NUMERIC     NOT NULL,
    payment_method TEXT        NOT NULL,
    ship_name      TEXT,
    ship_email     TEXT,
    ship_address   TEXT,
    ship_city      TEXT,
    ship_zip       TEXT,
    ship_country   TEXT,
    status         TEXT        NOT NULL DEFAULT 'pending',
    created_at     TEXT        NOT NULL
);