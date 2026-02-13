-- Page content for editable texts (diensten and other pages)
-- Run in Supabase SQL Editor. Content can be edited later by the client.

CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_slug VARCHAR(100) UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed diensten page content (klant kan dit later aanpassen)
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
      "subtitle": "Wij bieden een compleet pakket aan autoservices, van dagelijks onderhoud tot specialistische reparaties."
    },
    "additional_section": {
      "title": "Aanvullende Services",
      "subtitle": "Naast onze hoofddiensten bieden wij ook gespecialiseerde services voor uw auto."
    },
    "how_we_work": {
      "title": "Hoe wij werken",
      "subtitle": "Ons werkproces is transparant, efficiënt en altijd gericht op uw tevredenheid.",
      "steps": [
        { "number": 1, "title": "Afspraak maken", "description": "Bel ons of maak online een afspraak op een moment dat u uitkomt." },
        { "number": 2, "title": "Diagnose & Offerte", "description": "Wij onderzoeken uw auto en geven een duidelijke, transparante offerte." },
        { "number": 3, "title": "Vakkundig werk", "description": "Na uw goedkeuring voeren wij het werk vakkundig en zorgvuldig uit." },
        { "number": 4, "title": "Oplevering", "description": "Uw auto wordt opgeleverd met garantie en uitleg over het uitgevoerde werk." }
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
