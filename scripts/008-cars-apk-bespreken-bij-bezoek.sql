-- APK zonder vaste datum: bespreken bij bezoek (geen apk_date op de site)
-- Voer dit uit in Supabase: Project → SQL Editor → Run (één keer per database).
ALTER TABLE cars ADD COLUMN IF NOT EXISTS apk_bespreken_bij_bezoek BOOLEAN NOT NULL DEFAULT false;

-- PostgREST schema-cache verversen (meestal niet nodig; bij twijfel na ALTER uitvoeren)
NOTIFY pgrst, 'reload schema';
