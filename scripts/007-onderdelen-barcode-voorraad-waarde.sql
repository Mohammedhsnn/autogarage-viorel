-- Barcode, voorraad (intern), waarde/inkoop (intern) — niet tonen aan bezoekers via API
ALTER TABLE onderdelen ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);
ALTER TABLE onderdelen ADD COLUMN IF NOT EXISTS voorraad INTEGER;
ALTER TABLE onderdelen ADD COLUMN IF NOT EXISTS waarde INTEGER;
