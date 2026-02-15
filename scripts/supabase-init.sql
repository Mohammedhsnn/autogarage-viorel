-- ============================================================
-- supabase-init.sql – Volledige Supabase-setup voor Autogarage Viorel
-- Run dit script één keer in Supabase Dashboard → SQL Editor.
-- Maakt alle tabellen die de app gebruikt: users, cars, car_images,
-- car_features, services, page_content.
-- ============================================================

-- Verwijder in juiste volgorde (vanwege foreign keys)
DROP TABLE IF EXISTS page_content CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS onderdelen CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS car_features CASCADE;
DROP TABLE IF EXISTS car_images CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cars table (price als INTEGER, zoals in de app)
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
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create car_features table
CREATE TABLE car_features (
  id SERIAL PRIMARY KEY,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  feature VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table (diensten, beheer via Admin → Diensten beheren)
CREATE TABLE services (
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

-- onderdelen: voor /onderdelen zoekpagina en admin
CREATE TABLE onderdelen (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  artikelnummer VARCHAR(100),
  merk VARCHAR(100),
  motorcode VARCHAR(100),
  versnellingsbakcode VARCHAR(100),
  chassisnummer VARCHAR(100),
  kba_nummer VARCHAR(100),
  category VARCHAR(100) DEFAULT 'overig',
  price INTEGER,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_onderdelen_merk ON onderdelen(merk);
CREATE INDEX IF NOT EXISTS idx_onderdelen_artikelnummer ON onderdelen(artikelnummer);
CREATE INDEX IF NOT EXISTS idx_onderdelen_active ON onderdelen(is_active);

-- appointments: online afspraak boeking (/afspraak en admin)
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(5) NOT NULL,
  service VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  vehicle_info VARCHAR(255),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX idx_appointments_date_slot ON appointments(appointment_date, time_slot) WHERE status != 'cancelled';
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- page_views: voor analytics (bezoekers in /admin)
CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  path VARCHAR(500) NOT NULL
);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_path ON page_views(path);

-- page_content: bewerkbare teksten per pagina (o.a. /diensten)
CREATE TABLE page_content (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(100) UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin-gebruiker voor /admin login (wachtwoord: ViorelAdmin12)
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@autogarage-viorel.nl', '$2b$10$C8rCXlKI9wM6ylOs8wjtvu2/Kab7WhsISNxotvdCAghI/2Fz8TxHG', 'Admin', 'admin')
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Seed page_content voor dienstenpagina (optioneel; /diensten is nu statisch, dit is voor als je later CMS wilt)
INSERT INTO page_content (page_slug, content) VALUES (
  'diensten',
  '{
    "hero": {
      "badge": "Professionele autoservice",
      "title": "Onze Diensten",
      "subtitle": "Van preventief onderhoud tot complexe reparaties – bij Autogarage Viorel bent u verzekerd van vakkundig werk, eerlijke prijzen en persoonlijke service.",
      "cta_primary": "Bel voor advies",
      "cta_secondary": "Plan een afspraak"
    },
    "main_section": {
      "title": "Onze Hoofddiensten",
      "subtitle": "Wij bieden een compleet pakket aan autoservices."
    },
    "additional_section": {
      "title": "Aanvullende Services",
      "subtitle": "Naast onze hoofddiensten bieden wij ook gespecialiseerde services."
    },
    "how_we_work": {
      "title": "Hoe wij werken",
      "subtitle": "Ons werkproces is transparant en gericht op uw tevredenheid.",
      "steps": [
        { "number": 1, "title": "Afspraak maken", "description": "Bel ons of maak online een afspraak." },
        { "number": 2, "title": "Diagnose & Offerte", "description": "Wij onderzoeken uw auto en geven een transparante offerte." },
        { "number": 3, "title": "Vakkundig werk", "description": "Na goedkeuring voeren wij het werk vakkundig uit." },
        { "number": 4, "title": "Oplevering", "description": "Uw auto wordt opgeleverd met garantie en uitleg." }
      ]
    },
    "pricing_section": {
      "title": "Transparante Prijzen",
      "subtitle": "Geen verrassingen achteraf. Onze prijzen zijn helder en eerlijk."
    }
  }'::jsonb
)
ON CONFLICT (page_slug) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = CURRENT_TIMESTAMP;

-- Klaar. Occasions voeg je toe via Admin → Auto's → Nieuwe auto.
