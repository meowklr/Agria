# Configuration Supabase pour Agr'IA

## Étapes à suivre :

### 1. Remplacer les identifiants dans script.js
```javascript
var SUPABASE_CONFIG = {
  URL: "https://YOUR_PROJECT.supabase.co",      // Remplacez par votre Project URL
  ANON_KEY: "YOUR_ANON_PUBLIC_KEY",             // Remplacez par votre Anon Public Key
  ENABLED: true
};
```

### 2. Créer la table Supabase
1. Allez dans le dashboard Supabase
2. Cliquez sur **SQL Editor** (à gauche)
3. Créez une nouvelle requête
4. Copiez et exécutez ce code SQL :

```sql
-- Créer la table pour stocker les données de l'application
CREATE TABLE agria_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Créer la table pour les profils utilisateurs
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Ajouter une politique de sécurité (RLS)
ALTER TABLE agria_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read" ON agria_data FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert" ON agria_data FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON agria_data FOR UPDATE USING (auth.role() = 'authenticated');
```

### 3. Configurer l'authentification
1. Allez dans **Authentication → Providers**
2. Activez **Email** (pour les identifiants email/mot de passe)

### 4. Tester la connexion
Après avoir remplacé les identifiants, ouvrez la console (F12) et testez :
```javascript
var sb = getSupabase();
console.log('Supabase connecté :', sb);
```

## Fonctionnalités disponibles

Le code utilise déjà ces fonctions :
- `dpLoad(key, fallback)` : Charger depuis Supabase (avec fallback localStorage)
- `dpSave(key, value)` : Sauvegarder dans Supabase + localStorage
- `dpRemove(key)` : Supprimer des données
- `getSupabase()` : Récupérer le client Supabase

Elles fonctionnent **avec fallback en localStorage** si Supabase n'est pas disponible.
