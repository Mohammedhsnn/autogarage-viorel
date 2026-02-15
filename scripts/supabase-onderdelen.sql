-- Onderdelen-tabel voor /onderdelen zoeken en admin beheer
-- Run in Supabase → SQL Editor (eenmalig)

CREATE TABLE IF NOT EXISTS onderdelen (
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
CREATE INDEX IF NOT EXISTS idx_onderdelen_motorcode ON onderdelen(motorcode);
CREATE INDEX IF NOT EXISTS idx_onderdelen_active ON onderdelen(is_active);
CREATE INDEX IF NOT EXISTS idx_onderdelen_category ON onderdelen(category);
