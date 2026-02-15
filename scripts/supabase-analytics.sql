-- Analytics: page views voor bezoekersstatistieken in /admin
-- Run in Supabase → SQL Editor (eenmalig)

CREATE TABLE IF NOT EXISTS page_views (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  path VARCHAR(500) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);

-- Optioneel: RLS uitschakelen voor server-side inserts (service role)
-- De app gebruikt SUPABASE_SERVICE_ROLE_KEY voor inserts/selects.
