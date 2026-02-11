-- Complete Database Restore Script
-- Dit script zet alle tabellen en data terug na een per ongelukse verwijdering

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS car_features CASCADE;
DROP TABLE IF EXISTS car_images CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table for admin authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cars table
CREATE TABLE cars (
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
CREATE TABLE car_images (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_features table
CREATE TABLE car_features (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    feature VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table for managing diensten/tarieven
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'main', -- 'main' or 'additional' or 'pricing_card'
    price INTEGER, -- Price in cents (null means "op aanvraag" or "vanaf X")
    price_label VARCHAR(100), -- Display label like "Vanaf €89" or "€39" or "Op aanvraag"
    icon_name VARCHAR(100), -- Icon identifier (e.g., 'Wrench', 'Shield', 'Car')
    icon_color VARCHAR(50) DEFAULT 'blue', -- Color for icon background
    features TEXT[], -- Array of features/included items
    badge_text VARCHAR(100), -- Optional badge text like "Populair" or "2 jaar garantie"
    badge_color VARCHAR(50) DEFAULT 'blue', -- Badge color
    button_text VARCHAR(100) DEFAULT 'Meer informatie', -- CTA button text
    button_color VARCHAR(50) DEFAULT 'blue', -- Button color
    is_pricing_card BOOLEAN DEFAULT FALSE, -- Show in pricing section
    sort_order INTEGER DEFAULT 0, -- For ordering services
    is_active BOOLEAN DEFAULT TRUE, -- Show/hide service
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, name, role) 
VALUES ('admin@autogarage-viorel.nl', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample cars with proper data
INSERT INTO cars (brand, model, year, price, mileage, fuel, transmission, doors, seats, color, description, apk_date, owners, status) VALUES
('Volkswagen', 'Golf', 2020, 18500, 45000, 'Benzine', 'Handgeschakeld', 5, 5, 'Zwart', 'Zeer nette Volkswagen Golf in perfecte staat. Altijd netjes onderhouden en rijdt als nieuw. Ideaal voor dagelijks gebruik.', '2025-08-15', 2, 'available'),
('Toyota', 'Corolla', 2019, 16900, 52000, 'Hybrid', 'Automaat', 5, 5, 'Wit', 'Zuinige Toyota Corolla Hybrid met lage onderhoudskosten. Perfect voor wie milieubewust wil rijden zonder in te leveren op comfort.', '2025-11-22', 1, 'available'),
('BMW', '3 Serie', 2018, 24500, 68000, 'Diesel', 'Automaat', 4, 5, 'Grijs', 'Sportieve BMW 3 Serie met luxe uitrusting. Krachtige dieselmotor gecombineerd met comfort en prestaties.', '2025-06-10', 2, 'available'),
('Ford', 'Focus', 2021, 19800, 28000, 'Benzine', 'Handgeschakeld', 5, 5, 'Blauw', 'Moderne Ford Focus met de nieuwste veiligheidssystemen. Lage kilometerstand en in uitstekende conditie.', '2026-03-18', 1, 'available'),
('Opel', 'Astra', 2019, 15200, 58000, 'Benzine', 'Handgeschakeld', 5, 5, 'Rood', 'Betrouwbare Opel Astra met goede prijs-kwaliteitverhouding. Ideaal als gezinsauto of voor woon-werkverkeer.', '2025-09-05', 2, 'available'),
('Peugeot', '308', 2020, 17600, 41000, 'Diesel', 'Automaat', 5, 5, 'Grijs', 'Comfortabele Peugeot 308 met zuinige dieselmotor en automatische transmissie. Perfect voor lange ritten.', '2025-12-14', 1, 'available'),
('Renault', 'Clio', 2021, 14900, 32000, 'Benzine', 'Handgeschakeld', 5, 5, 'Blauw', 'Compacte en zuinige Renault Clio. Perfect voor in de stad en toch comfortabel voor langere ritten.', '2026-01-20', 1, 'available'),
('Hyundai', 'i30', 2020, 16800, 38000, 'Benzine', 'Automaat', 5, 5, 'Zilver', 'Betrouwbare Hyundai i30 met uitgebreide garantie. Ruim en comfortabel met moderne uitrusting.', '2025-09-30', 1, 'available'),
('Kia', 'Picanto', 2022, 13500, 18000, 'Benzine', 'Handgeschakeld', 5, 4, 'Rood', 'Jonge Kia Picanto, ideaal als eerste auto of voor in de stad. Zeer zuinig en betrouwbaar.', '2026-05-12', 1, 'available'),
('Mazda', 'CX-5', 2019, 22900, 55000, 'Benzine', 'Automaat', 5, 5, 'Zwart', 'Sportieve SUV met uitstekende rijeigenschappen. Ruim en praktisch voor gezinnen.', '2025-07-18', 2, 'available')
ON CONFLICT DO NOTHING;

-- Insert car images (using real car image URLs)
INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop', true, 1),
(2, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop', true, 1),
(3, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', true, 1),
(4, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop', true, 1),
(5, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', true, 1),
(6, 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop', true, 1),
(7, 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop', true, 1),
(8, 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&h=300&fit=crop', true, 1),
(9, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop', true, 1),
(10, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop', true, 1)
ON CONFLICT DO NOTHING;

-- Insert car features
INSERT INTO car_features (car_id, feature) VALUES
-- VW Golf features
(1, 'Airconditioning'), (1, 'Navigatiesysteem'), (1, 'Bluetooth'), (1, 'Cruise control'), (1, 'Elektrische ramen'), (1, 'Centrale vergrendeling'),
-- Toyota Corolla features  
(2, 'Hybride motor'), (2, 'Automatische transmissie'), (2, 'Airco'), (2, 'Navigatie'), (2, 'Parkeersensoren'), (2, 'LED verlichting'),
-- BMW 3 Serie features
(3, 'Leder interieur'), (3, 'Xenon koplampen'), (3, 'Sportonderstel'), (3, 'Navigatie Professional'), (3, 'Verwarmde stoelen'), (3, 'Keyless entry'),
-- Ford Focus features
(4, 'SYNC 3 infotainment'), (4, 'Adaptieve cruise control'), (4, 'Lane keeping assist'), (4, 'Automatische noodrem'), (4, 'Klimaatregeling'), (4, 'Sportvelgen'),
-- Opel Astra features
(5, 'IntelliLink infotainment'), (5, 'Airconditioning'), (5, 'Cruise control'), (5, 'Elektrische ramen'), (5, 'Boordcomputer'), (5, 'Radio/CD'),
-- Peugeot 308 features
(6, 'Automatische transmissie'), (6, 'Navigatiesysteem'), (6, 'Parkeerhulp'), (6, 'Klimaatregeling'), (6, 'Bluetooth'), (6, 'USB aansluiting'),
-- Renault Clio features
(7, 'Touchscreen display'), (7, 'Airconditioning'), (7, 'Bluetooth'), (7, 'Elektrische ramen'), (7, 'Centrale vergrendeling'), (7, 'ABS'),
-- Hyundai i30 features
(8, 'Automatische transmissie'), (8, 'Navigatie'), (8, 'Verwarmde stoelen'), (8, 'Parkeersensoren'), (8, 'Cruise control'), (8, 'Bluetooth'),
-- Kia Picanto features
(9, 'Airconditioning'), (9, 'Bluetooth'), (9, 'Elektrische ramen'), (9, 'Radio/USB'), (9, 'Centrale vergrendeling'), (9, 'ABS'),
-- Mazda CX-5 features
(10, 'AWD vierwielaandrijving'), (10, 'Navigatiesysteem'), (10, 'Leder interieur'), (10, 'Verwarmde stoelen'), (10, 'Parkeersensoren'), (10, 'Cruise control')
ON CONFLICT DO NOTHING;

-- Services tabel blijft leeg - deze kan via het admin panel worden gevuld
-- De admin kan via /admin/services nieuwe diensten toevoegen
