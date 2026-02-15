-- Afspraken voor online booking (/afspraak en admin)
-- Run in Supabase → SQL Editor (eenmalig)

CREATE TABLE IF NOT EXISTS appointments (
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

CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_date_slot ON appointments(appointment_date, time_slot) WHERE status != 'cancelled';
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
