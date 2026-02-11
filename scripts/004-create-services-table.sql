-- Alleen de services-tabel toevoegen (als je al 001 of 002 hebt gedraaid)
-- Run in Supabase SQL Editor. Daarna kun je diensten beheren via Admin → Diensten beheren.

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
