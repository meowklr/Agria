-- ============================================
-- Agr'IA - Supabase Database Setup
-- Executer ce script dans le SQL Editor Supabase
-- ============================================

-- Table generique key-value (utilisee par dpLoad/dpSave dans script.js)
CREATE TABLE IF NOT EXISTS agria_data (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE agria_data ENABLE ROW LEVEL SECURITY;

-- Allow public read/write via anon key (pour app client-side)
CREATE POLICY "Enable all for anon" ON agria_data
  FOR ALL USING (true) WITH CHECK (true);

-- Table parcelles (optionnelle, utilisee par sbSaveParcelle dans supabase-functions.js)
CREATE TABLE IF NOT EXISTS parcelles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  nom TEXT,
  surface TEXT,
  culture TEXT,
  type_sol TEXT,
  stade TEXT,
  date_semis TEXT,
  polygon_coords TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE parcelles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for anon" ON parcelles
  FOR ALL USING (true) WITH CHECK (true);

-- Table profiles
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  nom TEXT,
  prenom TEXT,
  telephone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for anon" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- Table mesures
CREATE TABLE IF NOT EXISTS mesures (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  parcelle_id BIGINT REFERENCES parcelles(id) ON DELETE CASCADE,
  temperature DOUBLE PRECISION,
  humidite_sol DOUBLE PRECISION,
  pluviometrie_7j DOUBLE PRECISION,
  evapotranspiration DOUBLE PRECISION,
  date_mesure TIMESTAMPTZ DEFAULT NOW(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'manual'
);

ALTER TABLE mesures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for anon" ON mesures
  FOR ALL USING (true) WITH CHECK (true);

-- Table alertes
CREATE TABLE IF NOT EXISTS alertes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  parcelle_id BIGINT REFERENCES parcelles(id) ON DELETE CASCADE,
  niveau TEXT DEFAULT 'info',
  message TEXT,
  score_risque DOUBLE PRECISION DEFAULT 0,
  date_alerte TIMESTAMPTZ DEFAULT NOW(),
  est_lue BOOLEAN DEFAULT FALSE
);

ALTER TABLE alertes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for anon" ON alertes
  FOR ALL USING (true) WITH CHECK (true);
