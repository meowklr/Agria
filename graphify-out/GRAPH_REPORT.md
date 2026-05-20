# Graph Report - agria  (2026-05-20)

## Corpus Check
- Corpus is ~17,498 words - fits in a single context window. You may not need a graph.

## Summary
- 60 nodes · 84 edges · 8 communities
- Extraction: 80% EXTRACTED · 20% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Golden Hour Design System|Golden Hour Design System]]
- [[_COMMUNITY_Web Parcel Drawing & CRUD|Web Parcel Drawing & CRUD]]
- [[_COMMUNITY_React Native Expo Migration|React Native Expo Migration]]
- [[_COMMUNITY_Agria Core Features & Stack|Agria Core Features & Stack]]
- [[_COMMUNITY_Web Weather & Authentication|Web Weather & Authentication]]
- [[_COMMUNITY_Mobile App Configuration|Mobile App Configuration]]
- [[_COMMUNITY_Cloud Backup & Supabase|Cloud Backup & Supabase]]
- [[_COMMUNITY_Leaflet Map & WebView Integration|Leaflet Map & WebView Integration]]

## God Nodes (most connected - your core abstractions)
1. `Expo React Native Migration` - 12 edges
2. `Golden Hour Design System` - 11 edges
3. `Agria Project` - 8 edges
4. `script.js (Application Core)` - 8 edges
5. `Agria Tech Stack` - 6 edges
6. `Polygon Drawing System` - 6 edges
7. `3-Step Diagnostic Workflow` - 6 edges
8. `Firebase Compat SDKs (v10.14.1)` - 5 edges
9. `Parcel CRUD (addChamp/updateChamp/deleteChamp)` - 5 edges
10. `Firebase` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Mobile Service Layer (1:1 Web Logic)` --semantically_similar_to--> `script.js (Application Core)`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-05-20-agria-react-native-migration.md → web/dashboard.html
- `Firebase Realtime Database (Mobile)` --semantically_similar_to--> `Firebase`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-05-20-agria-react-native-migration.md → README.md
- `AsyncStorage Fallback` --semantically_similar_to--> `Cloud Sync (Supabase + localStorage)`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-05-20-agria-react-native-migration.md → README.md
- `script.js (Application Core)` --references--> `supabase-functions.js`  [INFERRED]
  web/dashboard.html → README.md
- `Leaflet via React Native WebView` --semantically_similar_to--> `Leaflet Map Instance`  [INFERRED] [semantically similar]
  docs/superpowers/specs/2026-05-20-agria-react-native-migration.md → web/carte.html

## Hyperedges (group relationships)
- **Parcel Drawing Full Workflow** — web_polygon_drawing, web_snap_system, web_parcel_crud, web_parcel_undo, web_side_panel [INFERRED 0.85]
- **Golden Hour Design Applied to Web Pages** — golden_hour_design_system, golden_hour_palette, golden_hour_typography, web_style_css, web_vanilla_app [INFERRED 0.88]
- **React Native Mirror of Web Functionality** — rn_expo_migration, rn_leaflet_webview, web_leaflet_map, rn_services, web_script_js, rn_data_sync [INFERRED 0.82]

## Communities (8 total, 0 thin omitted)

### Community 0 - "Golden Hour Design System"
Cohesion: 0.20
Nodes (11): Brand Book A4 PDF, Design System Reference Page, Bottom Navigation Bar, Golden Hour UI Components, Golden Hour Design System, Mobile-First Single-Column Layout, Light Theme Only, Golden Hour Color Palette (+3 more)

### Community 1 - "Web Parcel Drawing & CRUD"
Cohesion: 0.27
Nodes (10): Drawing Bug: Polygon Closure Failure, Agronomic Predictions Feature, CROP_DATA Object, generatePredictions Function, Parcel CRUD (addChamp/updateChamp/deleteChamp), Undo Stack for Parcel Operations, Polygon Drawing System, Parcel Search Bar (+2 more)

### Community 2 - "React Native Expo Migration"
Cohesion: 0.22
Nodes (10): .expo Folder (Expo Dev Config), Firebase, Web-Mobile Data Sync, Expo React Native Migration, expo-router (File-based Routing), Expo SDK 52, Firebase Realtime Database (Mobile), Expo Haptics (+2 more)

### Community 3 - "Agria Core Features & Stack"
Cohesion: 0.27
Nodes (10): Golden Hour Animation System, Agria Project, Parcel Drawing Feature, Crop Diagnostic Feature, Multi-user Management, Leaflet.js, Nominatim Geocoding, Open-Meteo API (+2 more)

### Community 4 - "Web Weather & Authentication"
Cohesion: 0.43
Nodes (7): Real-time Weather Feature, OpenWeatherMap API, Dashboard Weather Widget, Firebase Compat SDKs (v10.14.1), Login Authentication, Profile Page, script.js (Application Core)

### Community 5 - "Mobile App Configuration"
Cohesion: 0.67
Nodes (4): Agria Mobile Application, Expo App Configuration (app.json), Expo Asset/Build System, Agria App Icon (icon.png)

### Community 6 - "Cloud Backup & Supabase"
Cohesion: 0.50
Nodes (4): Cloud Sync (Supabase + localStorage), Supabase, supabase-functions.js, AsyncStorage Fallback

### Community 7 - "Leaflet Map & WebView Integration"
Cohesion: 0.50
Nodes (4): ArcGIS Satellite Tiles, Leaflet via React Native WebView, RN-WebView postMessage Protocol, Leaflet Map Instance

## Knowledge Gaps
- **13 isolated node(s):** `ArcGIS Satellite Tiles`, `Multi-user Management`, `Expo SDK 52`, `expo-router (File-based Routing)`, `RN-WebView postMessage Protocol` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Expo React Native Migration` connect `React Native Expo Migration` to `Golden Hour Design System`, `Agria Core Features & Stack`, `Cloud Backup & Supabase`, `Leaflet Map & WebView Integration`?**
  _High betweenness centrality (0.405) - this node is a cross-community bridge._
- **Why does `Golden Hour Design System` connect `Golden Hour Design System` to `React Native Expo Migration`, `Agria Core Features & Stack`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **Why does `Agria Project` connect `Agria Core Features & Stack` to `Web Parcel Drawing & CRUD`, `React Native Expo Migration`, `Web Weather & Authentication`, `Cloud Backup & Supabase`?**
  _High betweenness centrality (0.255) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Golden Hour Design System` (e.g. with `Design System Reference Page` and `Brand Book A4 PDF`) actually correct?**
  _`Golden Hour Design System` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `script.js (Application Core)` (e.g. with `supabase-functions.js` and `Mobile Service Layer (1:1 Web Logic)`) actually correct?**
  _`script.js (Application Core)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ArcGIS Satellite Tiles`, `Multi-user Management`, `Golden Hour Color Palette` to the rest of the system?**
  _17 weakly-connected nodes found - possible documentation gaps or missing edges._