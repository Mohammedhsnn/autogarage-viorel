-- ============================================================
-- 001-create-tables.sql
-- Gebruik: Eerste keer database opzetten (voegt alleen tabellen toe, wist niets).
-- Run dit in Supabase SQL Editor als de database nog leeg is.
-- ============================================================

-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cars table (occasions)
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    fuel VARCHAR(50) NOT NULL,
    transmission VARCHAR(50) NOT NULL,
    doors INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    color VARCHAR(50) NOT NULL,
    description TEXT,
    apk_date DATE,
    owners INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_images table
CREATE TABLE IF NOT EXISTS car_images (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_features table
CREATE TABLE IF NOT EXISTS car_features (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table (diensten/tarieven, beheer via Admin → Diensten beheren)
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'main',
    price INTEGER,
    price_label VARCHAR(100),
    icon_name VARCHAR(100),
    icon_color VARCHAR(50) DEFAULT 'blue',
    features TEXT[],
    badge_text VARCHAR(100),
    badge_color VARCHAR(50) DEFAULT 'blue',
    button_text VARCHAR(100) DEFAULT 'Meer informatie',
    button_color VARCHAR(50) DEFAULT 'blue',
    is_pricing_card BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);

-- Alleen admin gebruiker (wachtwoord: admin123)
-- Belangrijk: wijzig dit wachtwoord na eerste login!
INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@autogarage-viorel.nl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Geen sample data. Occasions voeg je toe via het admin panel (Admin → Auto's → Nieuwe auto).
