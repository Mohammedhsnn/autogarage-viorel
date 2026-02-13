-- Admin-wachtwoord bijwerken naar ViorelAdmin12
-- Run in Supabase → SQL Editor (één keer, daarna inloggen met ViorelAdmin12)

UPDATE users
SET password_hash = '$2b$10$C8rCXlKI9wM6ylOs8wjtvu2/Kab7WhsISNxotvdCAghI/2Fz8TxHG'
WHERE role = 'admin';

-- Als er geen admin is: voeg toe (e-mail mag je aanpassen)
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@autogarage-viorel.nl',
  '$2b$10$C8rCXlKI9wM6ylOs8wjtvu2/Kab7WhsISNxotvdCAghI/2Fz8TxHG',
  'Admin',
  'admin'
)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
