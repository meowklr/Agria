# Agria

Assistant agricole intelligent pour la gestion de parcelles, le diagnostic de cultures et la météo.

## Fonctionnalites

- **Carte satellite interactive** — tracez vos parcelles sur fond satellite, visualisez celles des autres agriculteurs
- **Dessin de parcelles** — tracez des polygones avec aimantation intelligente aux parcelles existantes, fermeture automatique
- **Meteo en temps reel** — temperature, humidite, previsions sur 5 jours via OpenWeatherMap
- **Diagnostic de cultures** — identification de maladies fongiques et parasitaires avec recommandations de traitement
- **Gestion multi-utilisateurs** — chaque agriculteur voit et gere ses propres parcelles, les autres sont anonymisees
- **Predictions agronomiques** — estimation de recolte, besoins en eau, fertilisation par culture
- **Sauvegarde cloud** — donnees synchronisees via Supabase avec fallback localStorage

## Stack technique

- **Frontend** — HTML5, CSS3, JavaScript (vanilla)
- **Carte** — Leaflet.js avec tuiles satellite ArcGIS
- **Base de donnees** — Firebase
- **APIs** — OpenWeatherMap, Open-Meteo, Nominatim (geocoding)
- **Design** — Mobile-first, responsive

## Pages

| Page | Description |
|------|-------------|
| `login.html` | Connexion / creation de compte |
| `dashboard.html` | Tableau de bord : meteo, previsions, alertes, parcelles |
| `carte.html` | Carte satellite interactive avec outils de dessin |
| `diagnostic.html` | Diagnostic de maladies en 3 etapes |
| `profil.html` | Profil utilisateur et preferences |

## Demarrer

1. Cloner le depot
2. Ouvrir `login.html` dans un navigateur
3. Pour activer Supabase, configurer les variables dans `script.js` :
   ```js
   var SUPABASE_CONFIG = {
     URL: "https://votre-projet.supabase.co",
     ANON_KEY: "votre-cle-anon",
     ENABLED: true
   };
   ```
4. Creer les tables Supabase :
   - `agria_data` (key TEXT PRIMARY KEY, value TEXT, updated_at TIMESTAMPTZ)
   - Optionnel : `profiles`, `parcelles`, `mesures`, `alertes` (voir `supabase-functions.js`)

## Structure

```
agria/
├── login.html
├── dashboard.html
├── carte.html
├── diagnostic.html
├── profil.html
├── style.css
├── script.js
├── supabase-functions.js
├── memo.txt
├── design/
│   ├── design-system.html
│   ├── brand-book-a4.html
│   └── brand-book-a4.pdf
└── docs/
    └── superpowers/
        └── specs/
```

## Licence

Projet prive — usage interne cooperative.
