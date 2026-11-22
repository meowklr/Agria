# Agria

Application de suivi agricole pour gérer des parcelles sur carte satellite, consulter la météo locale, réaliser des diagnostics de cultures et suivre des alertes agronomiques. Projet de fin de 1ère année, réalisé en groupe.

Le dépôt regroupe l'application mobile sous Expo / React Native dans le dossier `mobile/` ainsi que le prototype web initial dans `web/`.

## Fonctionnement

L'application permet aux agriculteurs de créer un compte, de tracer leurs parcelles sur une carte satellite et d'y associer une culture, un type de sol, une date de semis et un stade de développement. À partir de ces données et des prévisions météo, elle calcule des estimations de besoins en eau, de fertilisation et de récolte.

Un module de diagnostic aide à identifier des maladies ou ravageurs en plusieurs étapes et propose des recommandations de traitement. L'application mobile inclut aussi un système de notifications locales, des alertes de risque météo et un espace d'administration pour consulter les utilisateurs, les parcelles et les journaux d'activité.

## Stack technique

L'application mobile (`mobile/`) est développée en TypeScript avec React Native (0.81), Expo (SDK 54) et Expo Router. La carte interactive repose sur Leaflet dans une WebView avec les tuiles satellite ArcGIS. Les données et l'authentification s'appuient sur Firebase (Authentication et Realtime Database) avec un repli local via AsyncStorage. Les données météo et de géocodage proviennent d'OpenWeatherMap, d'Open-Meteo et de Nominatim, et les alertes ou diagnostics peuvent déclencher des webhooks Make.

La version web (`web/`) est écrite en HTML5, CSS3 et JavaScript vanilla, accompagnée d'un serveur HTTP statique minimal sous Node.js (`web/server.js`).

## Prérequis

- Node.js (version 18 ou supérieure recommandée) et npm
- Un émulateur Android/iOS ou l'application Expo Go pour tester le mobile
- Un projet Firebase (Authentication et Realtime Database activés)
- Une clé API OpenWeatherMap pour les données météo temps réel

## Installation et lancement

### Application mobile

1. Se placer dans le dossier `mobile` et installer les dépendances :

```bash
cd mobile
npm install
```

Le script `postinstall` exécute `scripts/patch-firebase-auth.js` et `patch-package` afin d'adapter `@firebase/auth` pour React Native.

2. Créer un fichier `.env` à partir de `mobile/.env.example` et renseigner les variables :

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_OPENWEATHER_API_KEY=
EXPO_PUBLIC_MAKE_WEBHOOK_URL=
EXPO_PUBLIC_MAKE_DIAGNOSTIC_WEBHOOK_URL=
```

3. Démarrer le serveur Expo :

```bash
npm start
```

Pour lancer directement sur Android ou iOS en build natif :

```bash
npm run android
npm run ios
```

### Prototype web

Le dossier `web/` fonctionne avec un serveur Node.js sans dépendances externes :

1. Copier `web/config.example.js` vers `web/config.js` et renseigner les clés Firebase, OpenWeatherMap et Make si besoin.
2. Lancer le serveur :

```bash
cd web
node server.js
```

L'application est ensuite accessible sur `http://localhost:8080` (redirection vers `login.html`).

## Structure des fichiers

```text
Agria/
├── mobile/
│   ├── app/
│   │   ├── (admin)/          Ecrans du back-office (dashboard, parcelles, utilisateurs, logs)
│   │   ├── (tabs)/           Navigation principale (accueil, carte, diagnostic, profil)
│   │   ├── _layout.tsx       Layout racine et gestion des notifications
│   │   ├── index.tsx         Point d'entree et redirection
│   │   ├── login.tsx         Connexion et inscription
│   │   └── notifications.tsx Affichage des rapports et alertes
│   ├── src/
│   │   ├── components/       Composants UI reutilisables
│   │   ├── data/             Configuration API et referentiel des cultures
│   │   ├── hooks/            Hooks React (parcelles, meteo, alertes, diagnostic, profil)
│   │   ├── services/         Appels Firebase, meteo, predictions et administration
│   │   └── theme/            Couleurs, typographie et rayons
│   ├── scripts/              Script postinstall pour Firebase Auth
│   ├── android/              Projet natif Android genere par Expo
│   ├── assets/               Icones de l'application
│   ├── design/               Charte graphique et scenario Make
│   ├── .env.example          Modele des variables d'environnement
│   ├── app.json              Configuration Expo
│   └── package.json          Dependances et scripts mobiles
├── web/
│   ├── index.html            Redirection vers la page de connexion
│   ├── login.html            Connexion et inscription
│   ├── dashboard.html        Tableau de bord et meteo
│   ├── carte.html            Carte satellite et dessin de parcelles
│   ├── diagnostic.html       Diagnostic des cultures
│   ├── notifications.html    Centre de notifications
│   ├── profil.html           Profil utilisateur
│   ├── script.js             Logique metier et appels API
│   ├── style.css             Feuille de styles
│   └── server.js             Serveur HTTP local (port 8080)
├── presentation/             Support HTML de presentation et captures d'ecran
└── docs/                     Specifications et documents de conception
```

## Auteurs

- [meowklr](https://github.com/meowklr)
- [Teferi268](https://github.com/Teferi268)
- [lucasthevenet19-oss](https://github.com/lucasthevenet19-oss)
- [Skyfox268](https://github.com/Skyfox268)

## Licence

Ce projet est distribué sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
