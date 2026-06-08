# Agria — Rapport de projet

**Assistant agricole intelligent — Gestion de parcelles et diagnostic de cultures**

| | |
|---|---|
| Formation | Bachelor 1 — Sup de Vinci |
| Thématique | IA & Agriculture |
| Année | 2025 / 2026 |
| Équipe | Mathieu, Nathan, Timéo, Lucas T. |
| Rendu | Mai 2026 |

---

## Sommaire

1. Remerciements
2. Résumé / Abstract
3. Introduction
4. Conformité au Cahier des Charges
   - 4.1 Objectifs pédagogiques
   - 4.2 Sitemap
   - 4.3 Layout
   - 4.4 Contraintes techniques
   - 4.5 Architecture technique
5. Équipe et organisation
6. État de l'art et veille technologique
   - 6.1 État de l'art — Solutions agritech existantes
   - 6.2 Veille technologique — Technologies mobiles
   - 6.3 Veille technologique — Cartographie
   - 6.4 Veille technologique — Backend
7. Analyse des besoins
   - 7.1 Constats issus de la veille
   - 7.2 Personas utilisateurs
   - 7.3 Cas d'usage
8. Conception
   - 8.1 Architecture globale
   - 8.2 Design system Golden Hour
   - 8.3 Parcours utilisateur
9. Réalisation
   - 9.1 Stack technique
   - 9.2 Structure de l'application
   - 9.3 Modules détaillés
10. Problèmes rencontrés et solutions
11. Critères d'évaluation
    - 11.1 Pertinence de la problématique et de la solution
    - 11.2 Fonctionnalités réalisées
    - 11.3 Qualité de l'interface
    - 11.4 Intégration IA et architecture technique
    - 11.5 Qualité du rapport et de la soutenance
12. Perspectives
13. Conclusion
14. Annexes

---

## 1. Remerciements

Ce projet a été réalisé dans le cadre du cursus Bachelor 1 de Sup de Vinci, sur la thématique « IA & Agriculture ».

Nous remercions nos encadrants pédagogiques pour leur accompagnement tout au long de ce projet.

Nous remercions également la communauté open-source pour les bibliothèques et outils mis à disposition : React Native, Expo, Leaflet, Firebase, OpenWeatherMap, Open-Meteo, Nominatim et Make.com.

---

## 2. Résumé / Abstract

### Résumé

Agria est une application mobile destinée aux agriculteurs en coopérative, développée avec Expo React Native (SDK 54, TypeScript). Elle propose un tableau de bord météo avec alertes enrichies par IA, une carte satellite interactive pour la gestion des parcelles avec calcul de surface, un module de diagnostic des maladies de cultures en trois étapes (algorithme de matching local + enrichissement IA via Make.com) couvrant 15 maladies sur 5 cultures, un espace profil utilisateur et un back-office d'administration. Les données sont synchronisées via Firebase Realtime Database avec persistance locale. Firebase Authentication sécurise l'accès. Make.com assure l'automatisation no-code : les données sont envoyées par webhook, traitées par un agent IA, et les résultats sont réécrits dans Firebase. Le design suit le thème « Golden Hour », inspiré des champs de blé au coucher de soleil.

### Abstract

Agria is a mobile application for cooperative farmers, built with Expo React Native (SDK 54, TypeScript). It features a weather dashboard with AI-enriched alerts, an interactive satellite map for parcel management with automatic surface calculation, a three-step crop disease diagnostic module (local matching algorithm + AI enrichment via Make.com, covering 15 diseases across 5 crops), a user profile section, and an admin back-office. Data is synchronized via Firebase Realtime Database with local persistence. Firebase Authentication secures access. Make.com handles no-code automation: data is sent via webhook, processed by an AI agent, and results are written back to Firebase. The design follows the "Golden Hour" theme.

---

## 3. Introduction

### 3.1 Contexte

L'agriculture française est confrontée à des défis croissants : variabilité climatique, pression sur les rendements, nécessité de réduire les intrants, et difficulté d'accès à des outils numériques simples pour les exploitations de taille moyenne.

Les coopératives agricoles regroupent des centaines d'exploitants mais les solutions logicielles existantes (Geofolia, MesParcelles) sont souvent perçues comme complexes, coûteuses ou uniquement accessibles sur ordinateur. Le téléphone mobile, que chaque agriculteur a dans sa poche, reste sous-exploité.

### 3.2 Problématique

Comment fournir aux agriculteurs un outil mobile permettant de cartographier leurs parcelles, diagnostiquer des maladies de cultures, consulter la météo localisée, et recevoir des alertes personnalisées, le tout de manière intuitive et sans connexion internet permanente ?

### 3.3 Objectifs

- Développer une application mobile iOS/Android avec Expo React Native
- Intégrer une carte satellite interactive avec dessin de parcelles et calcul de surface
- Proposer un diagnostic de cultures en trois étapes guidées, avec enrichissement IA via Make.com
- Mettre en place un système d'alertes météo avec scoring de risque et enrichissement IA
- Assurer la synchronisation cloud via Firebase avec persistance locale
- Intégrer un outil no-code (Make.com) pour l'automatisation et l'IA

---

## 4. Conformité au Cahier des Charges

### 4.1 Objectifs pédagogiques

| Exigence CDC | Réponse Agria |
|---|---|
| Compréhension d'une problématique entrepreneuriale réelle | Analyse du secteur agritech et des solutions existantes (voir §6) |
| Démarche de projet technique | Développement collaboratif sur une semaine, architecture documentée |
| Veille technologique | 8 sources analysées (§6) : INRAE, Météo-France, e-Phytia, Plantix, API-Agro... |
| Solution digitale répondant à un besoin identifié | Application mobile fonctionnelle testée via Expo Go |
| Acquis techniques : no-code, dev, IA, cloud, réseau | No-code : Make.com ; Développement : React Native/TypeScript ; IA : algorithme de matching local + agent IA Make.com pour enrichissement ; Cloud : Firebase RTDB + Auth ; Réseau : APIs REST |
| Intelligence collective et créativité | Travail collaboratif, design system co-construit |

### 4.2 Sitemap

| Page CDC | Fichier dans le projet | Statut |
|---|---|---|
| Accueil | `app/(tabs)/index.tsx` (Dashboard) | Livré |
| Diagnostic IA | `app/(tabs)/diagnostic.tsx` | Livré |
| Carte interactive | `app/(tabs)/carte.tsx` | Livré |
| Communauté (optionnel) | — | Non retenu |
| Tableau de bord | Intégré au Dashboard | Livré |
| Administration | `app/(admin)/` (4 pages) | Livré |
| Mon compte | `app/(tabs)/profil.tsx` | Livré |
| Connexion / Inscription | `app/login.tsx` | Livré |
| Notifications | `app/notifications.tsx` | Livré |

### 4.3 Layout

| Élément CDC | Implémentation |
|---|---|
| En-tête : logo + navigation | Bottom tab bar (Dashboard / Carte / Diagnostic / Profil), header avec nom "Agria" |
| Zone contenu : données agricoles, résultats IA, carte | Chaque onglet dédié : météo sur dashboard, résultat sur diagnostic, carte Leaflet |
| Pied de page : mentions légales, CGU, contact, réseaux sociaux | Présents dans l'écran Profil (modals consultables) |

### 4.4 Contraintes techniques

Le cahier des charges impose l'utilisation d'un outil no-code/low-code. Notre réponse :

- **Make.com** (no-code) : utilisé pour l'automatisation des alertes météo (scoring 7 facteurs) et l'enrichissement IA des diagnostics (agent GPT). Le scénario Make.com reçoit les données via webhook, les analyse avec un agent IA, et retourne un rapport structuré.
- **Firebase Realtime Database** (low-code / serverless) : backend sans serveur à gérer, modèle clé-valeur simple, pas de schéma SQL.
- **Expo** (low-code) : framework simplifiant le développement React Native (pas de configuration Xcode/Android Studio, compilation gérée, APIs natives accessibles sans code natif).

Les outils no-code testés (Bubble.io, FlutterFlow) n'ont pas été retenus car ils ne permettaient pas l'intégration d'une carte interactive Leaflet avec dessin de polygones et snapping — fonctionnalité centrale du projet.

### 4.5 Architecture technique

Le cahier des charges demande une architecture cloud et réseau simplifiée :

| Couche CDC | Implémentation Agria |
|---|---|
| Capteurs IoT (simulés) | APIs OpenWeatherMap et Open-Meteo (température, humidité, précipitations) |
| Serveur cloud | Firebase Realtime Database + Firebase Authentication (europe-west1) |
| Application mobile | Expo React Native SDK 54 |
| IA | Algorithme de matching local pour le diagnostic + agent IA Make.com (webhook → AI Agent → rapport) |
| Déploiement cloud | Firebase pour les données et l'authentification ; Make.com pour l'orchestration IA |

**Schéma d'architecture :**

```
+------------------------------------------------------------------+
|                     APPLICATION MOBILE                            |
|                  Expo React Native SDK 54                         |
|                                                                   |
|  +-----------+  +--------+  +----------+  +----------+           |
|  | Dashboard |  | Carte  |  |Diagnostic|  |  Profil  |           |
|  | (Accueil) |  |(WebView|  | (3 étapes)|  | (Compte) |           |
|  |           |  | Leaflet)|  |          |  |          |           |
|  +-----+-----+  +---+----+  +----+-----+  +----+-----+           |
|        |             |            |             |                 |
|        +-------------+------------+-------------+                 |
|                      |                                            |
|           AsyncStorage (stockage local)                           |
+----------------------+-------------------------------------------+
                       | HTTPS
          +------------+-------------+
          |            |             |
+---------v--+  +------v-----+  +---v------------+
|  Firebase  |  |  APIs      |  |   Make.com     |
|  RTDB      |  |  Météo     |  |  (No-code)     |
|  + Auth    |  |            |  |                |
|            |  |            |  |  Webhook       |
| europe-    |  | OpenWeather |  |  -> AI Agent  |
| west1      |  | Open-Meteo |  |  -> Rapport IA |
+------------+  | Nominatim  |  +----------------+
                +------------+
```

---

## 5. Équipe et organisation

L'équipe est composée de quatre étudiants : Mathieu, Nathan, Timéo et Lucas T.

Le projet s'est déroulé sur une semaine. Les tâches ont été réparties au fur et à mesure en fonction des besoins et des compétences de chacun, sans rôles formels prédéfinis. L'équipe s'est organisée autour de quatre grands axes de travail :

- **Interface et écrans** : dashboard, diagnostic, profil, composants UI
- **Carte et services météo** : intégration Leaflet, WebView, APIs OpenWeatherMap et Open-Meteo
- **Données, backend et admin** : Firebase, authentification, persistance, back-office
- **Automatisation et intégration** : Make.com, webhooks, rapports IA

Un tableau Trello a été utilisé en début de projet pour visualiser les tâches.

L'outil DeepSeek a été utilisé ponctuellement pour accélérer certaines portions de code et aider au débogage.

---

## 6. État de l'art et veille technologique

### 6.1 État de l'art — Solutions agritech existantes

L'état de l'art recense les outils numériques agricoles déjà disponibles sur le marché. Plusieurs solutions existent, mais aucune ne couvre l'ensemble des besoins de notre public cible :

| Solution | Forces | Limitations |
|---|---|---|
| **FarmLogs** | Cartographie, analyse de rendement | Payant, centré grandes cultures (États-Unis) |
| **AgriWebb** | Traçabilité, gestion de troupeaux | Élevage uniquement, abonnement élevé |
| **Geofolia** | Conforme PAC, réglementaire français | Desktop uniquement, interface lourde |
| **MesParcelles** | Simple, français | Pas de diagnostic, pas de mobile natif |
| **Plantix** | Diagnostic par photo | Dépend de la qualité photo, peu adapté au contexte français |
| **Agria** | Mobile-first, gratuit, diagnostic intégré, carte satellite | Prototype, couverture limitée à 5 cultures pour le diagnostic |

Aucune solution gratuite et mobile ne combine cartographie interactive, diagnostic de maladies, météo localisée et alertes intelligentes.

### 6.2 Veille technologique — Technologies mobiles

| Critère | React Native (Expo) | Flutter | PWA |
|---|---|---|---|
| Performance | Bonne (bridge JS → natif) | Excellente (compile natif) | Limitée |
| Écosystème | Très large (npm) | Large (pub.dev) | Web standard |
| Courbe d'apprentissage | Faible (React/JS) | Moyenne (Dart) | Très faible |
| WebView carto | Excellente (react-native-webview) | Bonne | Native |
| Notifications push | expo-notifications | firebase_messaging | Service Worker |
| Mode hors-ligne | AsyncStorage + sync | sqflite/hive | IndexedDB |

Le choix d'Expo React Native a été motivé par la productivité (hot reload, expo-router), l'accès aux APIs natives sans configuration complexe (haptiques, notifications, safe areas), et la possibilité de réutiliser le code cartographique entre un prototype web antérieur et la version mobile via WebView.

### 6.3 Veille technologique — Cartographie (Leaflet et OpenStreetMap)

Leaflet.js a été choisi pour la carte interactive. C'est une bibliothèque open-source légère (~40 Ko) qui offre le dessin de polygones, le snapping (aimantation aux parcelles adjacentes), et le géocodage via Nominatim (OpenStreetMap). Les tuiles satellite proviennent d'ArcGIS/Esri, gratuites pour un usage raisonnable.

Les alternatives comme Google Maps (payant au-delà d'un quota) et Mapbox (coût élevé) ont été écartées.

Sur mobile, Leaflet est intégré dans une WebView (`react-native-webview`), avec un système de messages `postMessage`/`onMessage` pour la communication entre le code React Native (TypeScript) et le code cartographique (JavaScript).

### 6.4 Veille technologique — Backend (Firebase vs Supabase)

Le projet a démarré avec Supabase (PostgreSQL) mais a migré vers Firebase Realtime Database pour plusieurs raisons :

- **Simplicité** : le modèle clé-valeur de Firebase élimine le besoin de schéma SQL et de migrations.
- **SDK React Native natif** : le SDK Supabase présentait des problèmes d'initialisation sous React Native.
- **Synchronisation temps réel** : Firebase propage automatiquement les modifications entre clients.
- **Gratuité** : quota généreux (1 Go stockage, 10 Go transfert par mois).
- **Hébergement européen** : base `projet-etude-2026` située en `europe-west1`, garantissant la conformité RGPD.

---

## 7. Analyse des besoins

### 7.1 Constats issus de la veille

L'analyse des solutions existantes et des sources documentaires (INRAE, Météo-France, e-Phytia) a permis d'identifier cinq besoins principaux :

1. **Mobilité** : les agriculteurs travaillent sur le terrain. Le téléphone est l'outil le plus accessible, contrairement à un ordinateur de bureau.
2. **Simplicité** : les logiciels existants (Geofolia, MesParcelles) sont perçus comme complexes. Une interface épurée est nécessaire.
3. **Diagnostic rapide** : identifier une maladie tôt peut réduire les pertes de récolte. Un outil d'aide au diagnostic, même simple, a une valeur concrète.
4. **Météo localisée** : la météo est le principal facteur de décision au quotidien (traitements, semis, irrigation).
5. **Gestion centralisée** : regrouper parcelles, diagnostics et alertes dans une seule application évite la dispersion des informations.

### 7.2 Personas utilisateurs

Les personas suivants ont été créés pour guider la conception de l'application :

| Persona | Profil | Besoin principal |
|---|---|---|
| **Julien, 45 ans** | Céréalier, 120 ha, coopérateur | Suivre ses parcelles de blé et maïs, diagnostiquer les maladies fongiques rapidement |
| **Marie, 38 ans** | Viticultrice, 30 ha, conversion bio | Anticiper mildiou et oïdium, consulter la météo locale avant traitement |
| **Paul, 52 ans** | Administrateur de coopérative | Superviser les adhérents, gérer les comptes et consulter les statistiques d'usage |

### 7.3 Cas d'usage

1. **Cartographie des parcelles** : l'agriculteur trace sa parcelle sur la carte satellite, lui attribue un nom, une culture, un type de sol, un stade de développement et une date de semis. La surface est calculée automatiquement en hectares.
2. **Consultation météo** : depuis le tableau de bord, il consulte la température, l'humidité et les prévisions à 5 jours pour sa commune.
3. **Diagnostic d'une maladie** : en trois étapes (choix de la culture, sélection des symptômes, localisation), l'application identifie la maladie probable via un algorithme de matching local. L'utilisateur peut ensuite envoyer les données à Make.com pour obtenir un diagnostic enrichi par IA.
4. **Alertes intelligentes** : un algorithme de scoring local évalue 7 facteurs météo (température, humidité, pluie, neige, gel). Les données sont envoyées à Make.com où un agent IA analyse le risque et génère des recommandations personnalisées, ensuite réécrites dans Firebase.
5. **Administration** : l'administrateur accède au back-office pour gérer les utilisateurs, les parcelles, purger les comptes inactifs et consulter les logs.

---

## 8. Conception

### 8.1 Architecture globale

L'application suit une architecture en couches :

- **Présentation** : écrans Expo Router (`app/`), composants UI réutilisables (`src/components/`)
- **Logique métier** : hooks personnalisés (`src/hooks/`), services (`src/services/`)
- **Données** : persistance hybride AsyncStorage + Firebase Realtime Database
- **Services externes** : APIs météo, géocodage Nominatim, webhooks Make.com

**Schéma des couches :**

```
+--------------------------------------------------+
|                  ÉCRANS (app/)                     |
|  login  |  (tabs)/index  |  carte  |  diagnostic  |
|  profil |  notifications |  (admin)/*             |
+--------------------------------------------------+
|              HOOKS (src/hooks/)                    |
|  useAlerts  useChamps  useDiagnostic              |
|  useWeather  useNotifications  useProfile         |
+--------------------------------------------------+
|            SERVICES (src/services/)                |
|  auth  firebase  champs  diagnostic  weather      |
|  predictions  alerts  riskAlert  admin            |
+--------------------------------------------------+
|              DONNÉES                               |
|  AsyncStorage (local) + Firebase RTDB (cloud)     |
+--------------------------------------------------+
|         APIs EXTERNES                              |
|  OpenWeatherMap  Open-Meteo  Nominatim  Make.com  |
+--------------------------------------------------+
```

### 8.2 Design system « Golden Hour »

Le design system s'inspire de la lumière chaude des champs de blé au coucher de soleil. Il est appliqué de façon cohérente sur l'ensemble de l'application.

| Pilier | Spécification |
|---|---|
| Palette | Fond `#FDF8EE` (crème), accent `#E8B84B` (blé doré), texte `#3D2E1F` (brun), secondaire `#6B5D4F` |
| Typographie | Fraunces (serif) pour les titres, Outfit (géométrique) pour le corps et l'UI |
| Ombres | Teinte brune plutôt que noire — profondeur naturelle et organique |
| Coins | `border-radius` 12-16 px sur les cartes, 20 px sur les boutons |
| Animations | `react-native-reanimated`, easing naturelles, transitions 200-300 ms |
| Retours | Haptiques via `expo-haptics` (succès, erreur, impact léger/moyen) |

L'application est verrouillée en mode clair (`userInterfaceStyle: "light"`), choix assumé pour la lisibilité en extérieur.

Le design system est documenté dans un brand book complet (`design/brand-book-a4.html`) et une page de référence (`design/design-system.html`), qui détaillent l'ensemble des règles typographiques, colorimétriques et de mise en page.

### 8.3 Parcours utilisateur

1. **Connexion** : écran de login à la première ouverture. Possibilité de créer un compte. Un accès "développeur" permet d'entrer dans le back-office admin.
2. **Dashboard** : météo actuelle, prévisions 5 jours en scroll horizontal, alertes classées par niveau de risque, liste des parcelles avec détails expansibles.
3. **Carte** : carte satellite Leaflet en WebView, dessin de polygones avec calcul de surface, badges sur les parcelles, recherche de commune, panneau de configuration latéral.
4. **Diagnostic** : workflow 3 étapes (culture → symptômes → localisation) avec barre de progression. Résultat affichant la maladie identifiée, sa gravité, une explication, des recommandations et les données météo locales.
5. **Profil** : informations personnelles, statistiques de l'exploitation, photo de profil, changement d'email/mot de passe, suppression de compte, mentions légales/CGU/contact.
6. **Notifications** : centre de notifications avec badge des non-lus, swipe pour supprimer, historique des rapports IA.
7. **Administration** : accessible via l'accès développeur. Dashboard stats, CRUD parcelles, gestion utilisateurs (déconnexion forcée, suppression), logs système, nettoyage BDD, purge des comptes inactifs.

---

## 9. Réalisation

### 9.1 Stack technique

| Couche | Technologie | Version |
|---|---|---|
| Framework mobile | Expo React Native | SDK 54, React 19.1, React Native 0.81 |
| Routing | expo-router | 6.0 (file-based) |
| Langage | TypeScript | 5.9 |
| Base de données cloud | Firebase Realtime Database | 10.14 |
| Stockage local | AsyncStorage | 2.2 |
| Cartographie | Leaflet.js (via react-native-webview) | 1.9 |
| Météo actuelle | OpenWeatherMap API | Current Weather |
| Prévisions / historique | Open-Meteo | — |
| Géocodage | Nominatim (OpenStreetMap) | — |
| Animations | react-native-reanimated | 4.1 |
| Gestes | react-native-gesture-handler | 2.28 |
| Notifications | expo-notifications | 0.32 |
| Haptiques | expo-haptics | 15.0 |
| Polices | Fraunces + Outfit (Google Fonts) | — |
| Automatisation no-code | Make.com | — |

### 9.2 Structure de l'application

```
mobile/
├── app/
│   ├── _layout.tsx              # Layout racine (auth guard)
│   ├── index.tsx                 # Redirection auth (login ou tabs)
│   ├── login.tsx                 # Connexion / Inscription
│   ├── notifications.tsx         # Centre de notifications
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Bottom tab bar
│   │   ├── index.tsx             # Dashboard (accueil)
│   │   ├── carte.tsx             # Carte satellite interactive
│   │   ├── diagnostic.tsx        # Diagnostic 3 étapes
│   │   └── profil.tsx            # Profil utilisateur
│   └── (admin)/
│       ├── _layout.tsx           # Admin tab bar (dark theme)
│       ├── index.tsx             # Dashboard admin
│       ├── parcelles.tsx         # CRUD parcelles
│       ├── utilisateurs.tsx      # Gestion utilisateurs
│       └── logs.tsx              # Logs et maintenance
├── src/
│   ├── components/               # 10 composants UI réutilisables
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── DateWheelPicker.tsx
│   │   ├── DropDown.tsx
│   │   ├── Input.tsx
│   │   ├── LoaderBar.tsx
│   │   ├── NotificationBell.tsx
│   │   ├── ScreenFade.tsx
│   │   └── Typography.tsx
│   ├── services/                 # 10 modules de logique métier
│   │   ├── admin.ts
│   │   ├── adminRefresh.ts
│   │   ├── alerts.ts
│   │   ├── auth.ts
│   │   ├── champs.ts
│   │   ├── diagnostic.ts
│   │   ├── firebase.ts
│   │   ├── predictions.ts
│   │   ├── riskAlert.ts
│   │   └── weather.ts
│   ├── hooks/                    # 6 hooks personnalisés
│   │   ├── useAlerts.ts
│   │   ├── useChamps.ts
│   │   ├── useDiagnostic.ts
│   │   ├── useNotifications.ts
│   │   ├── useProfile.ts
│   │   └── useWeather.ts
│   ├── data/                     # Données statiques et configuration
│   │   ├── config.ts
│   │   └── cropData.ts
│   └── theme/
│       └── index.ts              # Design system (couleurs, polices, espacements)
├── design/                       # Brand book, design system HTML, scénario Make.com
├── assets/                       # Icônes (adaptive-icon, icon)
├── app.json                      # Configuration Expo
├── package.json
└── tsconfig.json
```

### 9.3 Modules détaillés

#### Dashboard (page d'accueil)

Le dashboard est l'écran principal. Il affiche :

- **Météo du jour** : température, état du ciel, humidité, fournies par l'API OpenWeatherMap. La ville est modifiable par l'utilisateur (recherche avec suggestions via Nominatim).
- **Prévisions 5 jours** : températures min/max en scroll horizontal, calculées à partir de l'API OpenWeatherMap Forecast (données toutes les 3 heures).
- **Alertes intelligentes** : un algorithme de scoring local évalue 7 facteurs météo. L'utilisateur peut rafraîchir manuellement les alertes, ce qui envoie les données à Make.com pour enrichissement IA (voir §9.3 Alertes et Make.com).
- **Parcelles** : liste des parcelles enregistrées, expansible pour voir les détails (culture, type de sol, stade, date de semis, notes). Actions disponibles : voir sur la carte, supprimer. Statistiques en bas de page : nombre de parcelles, surface totale, culture dominante.
- **Recherche de ville** : champ de recherche avec autocomplétion via Nominatim.

#### Diagnostic (module IA)

Le module de diagnostic fonctionne en trois étapes :

1. **Choix de la culture** : 5 cultures disponibles (blé, maïs, tournesol, colza, vigne), présentées sous forme de cartes avec icônes.
2. **Sélection des symptômes** : 6 symptômes observables (jaunissement, taches brunes, flétrissement, présence d'insectes, croissance ralentie, pourriture), sous forme de cases à cocher.
3. **Localisation** : saisie de la ville (avec suggestions) pour enrichir le diagnostic avec les données météo des 7 derniers jours via l'API Open-Meteo (précipitations, températures min/max).

Un algorithme de matching local compare les symptômes saisis à une base de 15 maladies référencées (3 maladies par culture) et identifie la maladie la plus probable. Le résultat affiche le nom de la maladie, son niveau de gravité (danger / warning / info), une explication et des recommandations de traitement.

L'utilisateur peut ensuite demander un **diagnostic enrichi par IA** en renseignant son adresse email. Les données (culture, symptômes, ville, diagnostic local, données météo) sont envoyées à un webhook Make.com. Côté Make.com, un agent IA analyse ces données et génère un rapport détaillé. Ce rapport est renvoyé à l'application, stocké dans Firebase, et accessible dans le centre de notifications.

Le flux complet est donc :
1. Webhook Make.com reçoit les données de diagnostic
2. L'agent IA (Make.com AI Agent) traite les données avec un prompt spécialisé agronomie
3. Le rapport structuré est renvoyé à l'application via la réponse HTTP
4. L'application stocke le rapport localement et dans Firebase Realtime Database
5. Une notification push est déclenchée pour informer l'utilisateur

Un historique des diagnostics locaux est conservé (20 dernières entrées), consultable sur la même page avec swipe pour supprimer.

#### Carte interactive

La carte utilise Leaflet.js intégré dans une WebView React Native, avec des tuiles satellite ArcGIS/Esri.

Fonctionnalités :

- **Dessin de polygones** : l'utilisateur trace sa parcelle en posant des points sur la carte. Le polygone se ferme automatiquement à l'approche du point d'origine. La surface est calculée automatiquement en hectares.
- **Snapping** : les nouveaux points s'aimantent aux parcelles existantes pour éviter les chevauchements.
- **Badges** : chaque parcelle affiche un badge avec son nom, ancré au barycentre du polygone. Les badges restent visibles à tous les niveaux de zoom.
- **Distinction visuelle** : les parcelles personnelles ont des bordures pleines, les parcelles des autres utilisateurs ont des bordures en pointillés.
- **Panneau de configuration** : formulaire glissant (nom, culture, type de sol, stade de développement, date de semis via un DateWheelPicker, notes libres).
- **Recherche de commune** : barre de recherche avec géocodage Nominatim.
- **Communication bidirectionnelle** : `postMessage` / `onMessage` entre React Native et la WebView pour transmettre les événements de dessin, sélection, et mise à jour.

Le composant gère également :
- L'interaction entre le clavier et le panneau de configuration (KeyboardAvoidingView)
- La fermeture du panneau par geste de glissement (PanResponder)
- Le mode dessin avec retour visuel (bouton activé/désactivé)
- L'undo et la suppression de polygone

#### Alertes et Make.com

Le système d'alertes combine deux mécanismes complémentaires :

1. **Scoring local** : un algorithme évalue 7 facteurs de risque à partir de la météo actuelle (température ≤ 2°C, température ≤ 7°C, humidité ≥ 85%, humidité ≥ 70%, pluie/averse/orage, neige/gel/verglas, présence de cultures sensibles). Score ≥ 5 : danger. Score ≥ 3 : vigilance. Score < 3 : info. L'alerte est affichée dans le dashboard.

2. **Enrichissement IA via Make.com** : les données d'alerte (météo, prévisions 3 jours, parcelles concernées, score de risque) sont envoyées à un webhook Make.com. Le flux complet est le suivant :
   - **Webhook entrant** : Make.com reçoit les données structurées (ville, météo, prévisions, parcelles, score)
   - **Agent IA** : un module AI Agent (Make.com) traite les données avec un prompt spécialisé en agronomie. Il génère une analyse du risque, un message en français, et une recommandation concrète
   - **Parsing JSON** : la réponse de l'agent IA est parsée
   - **Webhook répondant** : Make.com renvoie la réponse structurée à l'application (statut HTTP 200 + JSON)
   - **Stockage Firebase** : côté application, le rapport enrichi est sauvegardé dans Firebase Realtime Database via les fonctions `dpSave`

Les alertes sont limitées à 3 (les plus récentes), avec suppression automatique des anciennes.

Le scénario Make.com complet est documenté dans `design/make-scenario-agria.json`. Il décrit l'enchaînement des modules : Webhook personnalisé → AI Agent (prompt agronome) → Parse JSON → Webhook Respond.

#### Profil utilisateur

L'écran Profil regroupe :

- **Photo de profil** : avatar personnalisable (initiales par défaut, possibilité de prendre une photo ou d'en choisir une dans la galerie, suppression possible). Le choix de la source utilise l'ActionSheet native sur iOS.
- **Informations personnelles** : prénom, nom, téléphone. Section expansible.
- **Exploitation** : nom d'exploitation, SIRET, type d'agriculture. Section expansible.
- **Statistiques** : nombre de parcelles, surface totale, culture dominante.
- **Paramètres** : changement d'email, changement de mot de passe (avec réauthentification), suppression du compte, toggle notifications, toggle unité hectares.
- **Déconnexion** : bouton de déconnexion.
- **Informations légales** : mentions légales, CGU, contact — affichés dans des modals.
- **Réseaux sociaux** : icônes Facebook, X, Instagram, LinkedIn — non fonctionnels (maquette).

#### Administration (back-office)

Accessible via un compte administrateur, le back-office utilise un thème sombre distinct (`#1a1510`). Il comprend quatre onglets :

1. **Dashboard** : nombre d'utilisateurs, nombre de parcelles, hectares totaux, culture dominante, moyenne de parcelles par utilisateur, liste des 10 derniers utilisateurs.
2. **Parcelles** : recherche, tri (par nom/surface/email), affichage compact ou détaillé, édition (nom, culture, type de sol, surface), suppression, création de parcelle pour un utilisateur, filtre par utilisateur.
3. **Utilisateurs** : recherche, fiche détaillée expansible, déconnexion forcée, suppression de compte avec toutes ses données, lien vers les parcelles de l'utilisateur.
4. **Logs** : historique des actions (créations, modifications, suppressions), nettoyage des données orphelines, purge des comptes inactifs (> 6 mois), vidage des logs.

Un système d'événements (`adminRefresh.ts`) permet de rafraîchir les données du back-office après une modification.

#### Notifications

Le centre de notifications (`app/notifications.tsx`) affiche :

- Les rapports IA générés par Make.com (accessibles via notification push ou depuis le dashboard)
- Un badge indiquant les notifications non lues
- Un swipe-to-delete pour supprimer une notification
- L'expansion d'une notification pour lire le rapport complet
- La réception de notifications programmées (`expo-notifications`) avec redirection automatique depuis le dashboard

#### Persistance des données

Le système de persistance (`firebase.ts`) utilise une approche hybride :

- **Lecture** : l'application lit d'abord depuis AsyncStorage (réponse instantanée), puis vérifie Firebase en arrière-plan pour synchroniser.
- **Écriture** : chaque sauvegarde écrit dans AsyncStorage puis tente l'écriture Firebase. Si Firebase est indisponible, l'écriture locale est conservée.
- **Clés** : les caractères interdits par Firebase (`.`, `#`, `$`, `/`, `[`, `]`) sont automatiquement remplacés.
- **Fonctions génériques** : `dpLoad`, `dpSave`, `dpRemove`, `dpLoadAll`, `dpLoadAllObjects`, `dpListKeys` permettent de manipuler n'importe quel type de données avec le même mécanisme.

Les données utilisateur sont stockées sous des préfixes dédiés :
- `agria_fb_user_` : compte utilisateur (uid, email, dates)
- `agria_champs_` : parcelles
- `agria_user_profile_` : profil
- `agria_prefs_` : préférences
- `agria_diagnostics_` : historique des diagnostics
- `agria_alert_` : alertes météo
- `agria_admin_logs` : logs administrateur

#### Configuration Firebase Auth et sécurité

**Firebase Authentication** est configuré avec le fournisseur email/mot de passe. Les fonctions `signInWithEmailAndPassword` (connexion) et `createUserWithEmailAndPassword` (inscription) du SDK Firebase sont utilisées. L'état d'authentification est surveillé via `onAuthStateChanged` dans le layout racine : si l'utilisateur n'est pas connecté, il est redirigé vers l'écran de login ; s'il l'est, il accède au dashboard ou au back-office.

La réauthentification (`reauthenticateWithCredential`) est exigée pour les opérations sensibles : changement de mot de passe et suppression de compte.

**Firebase Realtime Database** est protégé par des règles de sécurité configurées dans la console Firebase. Les données sont stockées sous le nœud `agriaData/`. Les règles appliquées sont :

- Lecture et écriture réservées aux utilisateurs authentifiés (`auth != null`)
- Pas d'accès public aux données

La base de données est hébergée dans la région `europe-west1`, garantissant que les données personnelles des utilisateurs restent sur des serveurs situés en Europe (conformité RGPD).

Le projet Firebase (`projet-etude-2026`) est configuré avec une clé API restreinte, stockée dans les variables d'environnement (`EXPO_PUBLIC_FIREBASE_*`) et jamais exposée dans le code source (le fichier `.env` est dans `.gitignore`).

---

## 10. Problèmes rencontrés et solutions

### 10.1 Migration Supabase vers Firebase

**Problème** : le projet initial utilisait Supabase (PostgreSQL). La configuration des politiques RLS (Row Level Security) et les problèmes d'initialisation du SDK React Native ont bloqué l'équipe.

**Solution** : migration vers Firebase Realtime Database. Le modèle clé-valeur supprime le besoin de schéma SQL. Le SDK Firebase est natif React Native. La base est hébergée en Europe (europe-west1).

### 10.2 Intégration de Leaflet dans une WebView React Native

**Problème** : Leaflet.js est une bibliothèque DOM, incompatible avec le rendu natif de React Native.

**Solution** : utilisation de `react-native-webview` avec un système de messages `postMessage` / `onMessage`. Les événements de la carte (clic, dessin, sélection) sont transmis en JSON structuré entre la WebView et React Native. Cette approche a permis de conserver la richesse fonctionnelle de Leaflet (dessin, snapping, badges) dans l'application mobile.

### 10.3 Dessin de polygones sur écran tactile

**Problème** : le point de départ du polygone était trop petit pour être touché avec le doigt ; la fermeture manuelle échouait fréquemment.

**Solution** : élargissement de la zone de clic du premier point. Fermeture automatique du polygone lorsque l'utilisateur approche du point d'origine. Système de snapping pour éviter les chevauchements entre parcelles.

### 10.4 Safe areas sur iPhone

**Problème** : certains éléments d'interface passaient sous l'encoche (notch) ou la Dynamic Island. En bas, le contenu disparaissait derrière la barre d'accueil.

**Solution** : intégration de `react-native-safe-area-context` et du hook `useSafeAreaInsets()` sur tous les écrans pour calculer dynamiquement les marges supérieures et inférieures.

### 10.5 Badges de parcelles instables

**Problème** : les badges affichant le nom des parcelles ne suivaient pas correctement leur polygone lors du zoom, ou disparaissaient.

**Solution** : ancrage des badges au barycentre (centre de masse) du polygone plutôt qu'au premier point. Recalcul de position à chaque événement de zoom (`zoomend`) et de déplacement (`moveend`). Masquage automatique quand le badge sort de la zone visible.

### 10.6 Authentification et garde d'accès

**Problème** : la page de login ne s'affichait pas systématiquement à l'ouverture. Certains utilisateurs accédaient au dashboard sans être identifiés.

**Solution** : mise en place d'un guard d'authentification dans le layout racine (`app/_layout.tsx`) avec `onAuthStateChanged`. L'écran `app/index.tsx` agit comme point d'entrée unique : il écoute l'état d'authentification et redirige vers le dashboard (si connecté) ou le login (si déconnecté).

### 10.7 Synchronisation hors-ligne

**Problème** : sans connexion internet, l'application devait continuer à fonctionner. À la reconnexion, les données locales pouvaient entrer en conflit avec les données distantes.

**Solution** : stratégie d'écriture traversante. Chaque sauvegarde écrit d'abord en local (AsyncStorage), puis tente l'écriture Firebase. Si Firebase est indisponible, l'écriture locale est conservée. En cas de conflit, la dernière modification est conservée.

### 10.8 Clavier masquant les formulaires

**Problème** : dans le panneau de configuration des parcelles et les formulaires du profil, le clavier masquait les champs de saisie.

**Solution** : utilisation de `KeyboardAvoidingView` avec comportement `padding`. Création d'un `DateWheelPicker` personnalisé pour éviter le clavier natif sur le champ de date. Gestion des événements clavier pour permettre la fermeture du panneau de configuration par glissement.

### 10.9 Migration du prototype web vers React Native

**Problème** : un premier prototype fonctionnel avait été développé en HTML/CSS/JavaScript pour valider les concepts (dashboard, carte Leaflet, diagnostic). Les contraintes du cahier des charges imposaient une application mobile native.

**Solution** : le code Leaflet a été réutilisé dans la WebView React Native, évitant de tout réécrire. Le reste de l'application (navigation, composants UI, authentification, persistance) a été reconstruit en React Native avec TypeScript et Expo Router. Le design system Golden Hour, initialement défini en CSS, a été porté en objet TypeScript (`theme/index.ts`) pour être partagé entre tous les composants.

---

## 11. Critères d'évaluation

### 11.1 Pertinence de la problématique et de la solution

| Point évalué | Réponse |
|---|---|
| Besoin identifié | Constats issus de la veille technologique et de l'analyse des solutions existantes |
| Adéquation thématique CDC | IA & Agriculture : algorithme de diagnostic, alertes intelligentes enrichies par IA via Make.com |
| Impact potentiel | Voir détail ci-dessous |

**Évaluation de l'impact potentiel sur les pratiques agricoles :**

- **Détection précoce des maladies** : en guidant l'agriculteur dans l'identification des symptômes et en proposant un diagnostic en moins de deux minutes, l'application peut réduire le délai entre l'apparition des premiers signes et la mise en place d'un traitement. Une intervention rapide limite la propagation et les pertes de récolte.
- **Centralisation des données** : en regroupant parcelles, diagnostics et alertes dans une seule application mobile, Agria évite la dispersion des informations entre plusieurs outils (carnet papier, SMS météo, logiciel de bureau). Le temps gagné peut être réinvesti dans le travail de terrain.
- **Aide à la décision météo** : les prévisions à 5 jours et les alertes de risque (gel, humidité élevée) aident l'agriculteur à planifier ses interventions (traitements, semis, irrigation) au moment le plus favorable, réduisant le gaspillage d'intrants.
- **Accessibilité** : l'application est gratuite et fonctionne sur un simple téléphone, sans abonnement ni matériel coûteux. Elle peut donc être utilisée par des exploitations de toute taille, y compris les plus modestes qui n'ont pas accès aux solutions payantes du marché.

### 11.2 Fonctionnalités réalisées

| Fonctionnalité | Statut |
|---|---|
| Application mobile testable | Livré — testée sur iOS et Android via Expo Go |
| Carte interactive avec parcelles | Livré — Leaflet + polygones + snapping + badges |
| Diagnostic guidé | Livré — 3 étapes, 15 maladies, 5 cultures |
| Tableau de bord météo + alertes | Livré — OpenWeatherMap + Open-Meteo + Make.com |
| Synchronisation cloud | Livré — Firebase RTDB + AsyncStorage |
| Back-office administrateur | Livré — CRUD, logs, purge, nettoyage |
| Profil utilisateur | Livré — infos, exploitation, préférences, sécurité |
| Outil no-code intégré | Livré — Make.com pour alertes et rapports IA |
| Notifications | Livré — centre avec badge, swipe, push natif partiel |
| Communauté | Non retenu (optionnel dans le CDC) |

### 11.3 Qualité de l'interface

- Design system Golden Hour cohérent sur l'ensemble de l'application
- Typographie Fraunces / Outfit appliquée uniformément
- Animations fluides (react-native-reanimated) et retours haptiques
- Navigation par onglets (bottom tabs) intuitive
- Indicateur de progression visible dans le diagnostic
- Composants UI réutilisables (10 composants)

### 11.4 Intégration IA et architecture technique

- Algorithme de matching par symptômes (15 maladies, 5 cultures, 6 symptômes)
- Enrichissement IA via Make.com : agent IA analyse les données de diagnostic et génère des rapports détaillés
- Automatisation no-code Make.com pour les alertes (webhook → agent IA → rapport)
- Architecture cloud Firebase (europe-west1) avec règles de sécurité
- Firebase Authentication configuré (email/mot de passe)
- Persistance locale avec synchronisation cloud
- Double source météo (OpenWeatherMap + Open-Meteo)

### 11.5 Qualité du rapport et de la soutenance

Le rapport est structuré pour répondre point par point au cahier des charges et inclut les diagrammes d'architecture ainsi qu'une auto-évaluation transparente des fonctionnalités livrées.

---

## 12. Perspectives

### Court terme

- Élargir la couverture du diagnostic à 7 cultures (ajout de l'orge et du soja, déjà présents dans les données agronomiques)
- Import/export des parcelles au format GeoJSON
- Module communautaire léger : partage de diagnostics entre membres d'une même coopérative

### Moyen terme

- Diagnostic par photo : remplacer la sélection manuelle de symptômes par une analyse d'image (vision par ordinateur)
- Remplacer l'algorithme de matching par un modèle de classification entraîné sur des données réelles
- Déploiement sur l'App Store et Google Play
- Intégration avec les données PAC (Télépac) pour l'import des parcelles officielles
- Module de gestion des intrants avec historique

---

## 13. Conclusion

Ce projet a permis de livrer une application mobile fonctionnelle couvrant les modules exigés par le cahier des charges : carte interactive, diagnostic de cultures, tableau de bord météo avec alertes, et back-office d'administration.

L'exigence no-code/low-code est satisfaite par l'utilisation de Make.com pour l'automatisation et de Firebase pour le backend. Les choix techniques (Expo React Native, Leaflet, Firebase) ont permis de développer une application native en une semaine, en réutilisant le code cartographique d'un prototype antérieur.

Le design system Golden Hour donne une identité visuelle cohérente à l'application, adaptée à une utilisation en extérieur.

Les principales pistes d'amélioration concernent l'enrichissement du diagnostic (passage à un vrai modèle de machine learning, diagnostic par photo) et le déploiement en production.

---

## 14. Annexes

### A. Glossaire

| Terme | Définition |
|---|---|
| **AsyncStorage** | Stockage clé-valeur asynchrone natif React Native, utilisé pour la persistance locale |
| **expo-router** | Bibliothèque de routing basée sur l'arborescence des fichiers, inspirée de Next.js |
| **Firebase RTDB** | Firebase Realtime Database : base NoSQL JSON en temps réel hébergée par Google Cloud |
| **Leaflet.js** | Bibliothèque JavaScript open-source légère (~40 Ko) pour cartes interactives |
| **Make.com** | Plateforme d'automatisation no-code (ex-Integromat), workflows déclenchés par webhooks |
| **Nominatim** | Service de géocodage OpenStreetMap (adresse ↔ coordonnées GPS) |
| **Open-Meteo** | API météorologique gratuite et open-source, sans clé API requise |
| **OpenWeatherMap** | Service météo avec API gratuite (limitée à 60 appels/minute) |
| **WebView** | Composant React Native permettant d'afficher du contenu HTML/JS dans une app native |

### B. APIs et services externes

| Service | Usage | Gratuité |
|---|---|---|
| OpenWeatherMap Current | Météo actuelle par ville | 60 appels/min gratuits |
| OpenWeatherMap Forecast | Prévisions 5 jours / 3h | Inclus dans le plan gratuit |
| Open-Meteo | Données météo historiques (7j) pour diagnostic | Gratuit, pas de clé |
| Nominatim | Géocodage (ville → coordonnées) | Gratuit, 1 req/s max |
| ArcGIS/Esri | Tuiles satellite pour Leaflet | Gratuit, usage raisonnable |
| Firebase RTDB | Synchronisation des données | 1 Go stockage + 10 Go transfert gratuits |
| Make.com | Automatisation alertes et rapports IA | Plan gratuit |

### C. Maladies couvertes par le diagnostic (15 maladies, 5 cultures)

| Culture | Maladies |
|---|---|
| Blé | Septoriose, Rouille jaune, Fusariose |
| Maïs | Pyrale du maïs, Charbon du maïs, Helminthosporiose |
| Tournesol | Mildiou, Sclérotinia, Phomopsis |
| Colza | Sclérotinia, Phoma, Altises |
| Vigne | Mildiou, Oïdium, Botrytis |

### D. Données agronomiques (CROP_DATA)

Le fichier `src/data/cropData.ts` contient des données agronomiques détaillées pour 7 cultures (blé, maïs, tournesol, colza, vigne, lavande, sorgho). Chaque culture documente : période de semis, durée du cycle, mois de récolte, besoins en eau, besoins en azote, rendement moyen, sols favorables et défavorables, résistance à la sécheresse et notes agronomiques.

Ces données sont utilisées par le module `predictions.ts` qui implémente — côté code — la logique de calcul pour la date estimée de récolte, le score de sol, les besoins en eau, les alertes irrigation, la fertilisation recommandée et le rendement estimé. Ces calculs ne sont actuellement pas exposés dans l'interface utilisateur de l'application mobile ; seule la surface en hectares (calculée automatiquement lors du tracé de la parcelle sur la carte) est visible.

### E. Sources de la veille

| Source | Thème |
|---|---|
| Ministère de l'Agriculture | Usages de l'IA pour la performance des exploitations |
| INRAE | Impacts du changement climatique, rendements, modélisation |
| Météo-France | Données climatiques locales |
| e-Phytia | Portail d'identification des maladies et ravageurs |
| Plantix | Application de diagnostic par photo (référence) |
| MesParcelles | Outil de gestion parcellaire (référence concurrentielle) |
| API-Agro | Catalogue de données agricoles ouvertes |
| Eaufrance | Ressources en eau et sécheresse |

### F. Documentation technique

- Documentation Expo : `docs.expo.dev`
- Documentation React Native : `reactnative.dev`
- Documentation Firebase : `firebase.google.com/docs`
- Documentation Leaflet.js : `leafletjs.com/reference.html`
- API OpenWeatherMap : `openweathermap.org/api`
- API Open-Meteo : `open-meteo.com/en/docs`
- API Nominatim : `nominatim.org/release-docs/latest/api`
