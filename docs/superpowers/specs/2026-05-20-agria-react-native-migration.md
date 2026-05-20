# Agria — React Native Mobile Migration

**Date:** 2026-05-20  
**Scope:** Migration vanilla HTML/CSS/JS → Expo React Native  
**Stack:** Expo SDK 52, expo-router, Firebase RTDB, Leaflet via WebView  
**Design:** Golden Hour, identique à la version web  
**Coexistence:** `web/` (vanilla, reference) + `mobile/` (Expo)

---

## 1. Repo Structure

```
agria/
├── web/                      # Vanilla app (reference)
│   ├── index.html, login.html, dashboard.html, carte.html
│   ├── diagnostic.html, profil.html, style.css, script.js, server.js
├── mobile/                   # Expo React Native
│   ├── app/                  # expo-router file-based routing
│   │   ├── _layout.tsx       # Root layout (theme provider)
│   │   ├── login.tsx
│   │   └── (tabs)/
│   │       ├── _layout.tsx   # Bottom tab navigator
│   │       ├── index.tsx     # Dashboard
│   │       ├── carte.tsx     # Map
│   │       ├── diagnostic.tsx
│   │       └── profil.tsx
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── services/         # Firebase, APIs
│   │   ├── hooks/            # useWeather, useChamps, etc.
│   │   ├── data/             # CROP_DATA, fallbacks
│   │   └── theme/            # Colors, typography, spacing
│   ├── app.json
│   └── package.json
├── docs/
└── README.md
```

## 2. Navigation

- **expo-router** avec bottom tabs (4 onglets) + écran login hors tabs
- Onglets: Accueil, Carte, Diagnostic, Profil
- Pas de header sur les tabs (custom header inline)

## 3. Theme (Golden Hour)

- `#FDF8EE` bg, `#FFFDF6` surface, `#E8B84B` primary
- Police: pas de Fraunces/Outfit en natif → system font (San Francisco / Roboto)
- Radius: 12px cards, ombres via `shadowColor/shadowOffset/shadowOpacity/shadowRadius`

## 4. Services (1:1 web logic)

- **firebase.ts**: init app, dpLoad/Save/Remove (Firebase + AsyncStorage)
- **weather.ts**: fetchMeteoActuelle, fetchPrevisions, city search Nominatim
- **champs.ts**: CRUD parcelles (Firebase keyed by userId)
- **diagnostic.ts**: genererDiagnostic, fetchOpenMeteo
- **predictions.ts**: generatePredictions (from CROP_DATA)
- **auth.ts**: getUserId (AsyncStorage session)

## 5. Screens

### Login
- Email + mdp, boutons Se connecter / Créer compte
- Dev bypass

### Dashboard
- Météo jour (skeleton loading), prévisions 5j (FlatList horizontal)
- 3 alertes exemple, liste parcelles, 3 stats (FlatList)

### Carte (MapScreen)
- `react-native-webview` charge une page HTML Leaflet embarquée
- Communication RN ↔ WebView via `postMessage` / `onMessage`
- Toolbar en overlay RN (dessiner, mes parcelles, localiser, supprimer)
- Bottom sheet RN pour les infos parcelle
- Zoom adapté au bottom sheet

### Diagnostic
- 3 étapes (culture grid, symptomes checklist, ville + analyser)
- Résultat avec scramble text + typewriter + météo + recommandations
- Historique

### Profil
- Identité, exploitation, stats, préférences, sécurité

## 6. Haptics (expo-haptics)

| Déclencheur | Style |
|-------------|-------|
| Bouton press | `ImpactFeedbackStyle.Light` |
| Parcelle créée, profil sauvé | `NotificationFeedbackType.Success` |
| Erreur, collision | `NotificationFeedbackType.Error` |
| Fin dessin parcelle | `ImpactFeedbackStyle.Medium` |

## 7. Carte WebView Communication

```
React Native → WebView: postMessage(JSON.stringify({type:'draw'}))
React Native → WebView: postMessage(JSON.stringify({type:'locate'}))
React Native → WebView: postMessage(JSON.stringify({type:'showParcels'}))

WebView → React Native: postMessage(JSON.stringify({type:'parcelSelect', data: parcel}))
WebView → React Native: postMessage(JSON.stringify({type:'drawComplete', data: coords}))
```

## 8. Data Sync

- Même Firebase RTDB que le web → données partagées entre web et mobile
- AsyncStorage fallback pour usage offline
- Pas de migration de données nécessaire
