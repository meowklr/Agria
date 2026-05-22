const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, BorderStyle, WidthType, PageBreak, Header, Footer, PageNumber, ShadingType, TabStopPosition, TabStopType, convertInchesToTwip, LevelFormat, ExternalHyperlink, TableOfContents } = require('docx');
const fs = require('fs');

const FONT_SERIF = 'Georgia';
const FONT_SANS = 'Calibri';
const PRIMARY = 'E8B84B';
const TEXT = '3D2E1F';
const TEXT_SEC = '6B5D4F';
const TEXT_MUTED = 'A89880';
const BORDER = 'EBE3D3';
const SURFACE = 'FFFDF6';
const ACCENT = 'C4704A';

const pageMargins = { top: convertInchesToTwip(0.98), bottom: convertInchesToTwip(0.98), left: convertInchesToTwip(0.79), right: convertInchesToTwip(0.79) };

function sectionPage() {
  return { properties: { page: { margin: pageMargins } } };
}

function heading1(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    run: { font: FONT_SERIF, size: 40, color: TEXT },
  });
}

function heading2(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    border: { bottom: { color: PRIMARY, size: 6, space: 4, style: BorderStyle.SINGLE } },
    run: { font: FONT_SERIF, size: 28, color: TEXT },
  });
}

function heading3(text) {
  return new Paragraph({
    text, heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 80 },
    run: { font: FONT_SERIF, size: 24, color: TEXT },
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT_SANS, size: 22, color: opts.color || TEXT, bold: opts.bold, italics: opts.italics })],
    spacing: { after: 120 },
    alignment: opts.alignment || AlignmentType.JUSTIFIED,
  });
}

function boldPara(text) {
  return para(text, { bold: true });
}

function italicPara(text) {
  return para(text, { italics: true, color: TEXT_SEC });
}

function bullet(text) {
  return new Paragraph({
    children: [new TextRun({ text: `•  ${text}`, font: FONT_SANS, size: 22, color: TEXT })],
    spacing: { after: 60 },
    indent: { left: 400 },
  });
}

function numbered(n, text) {
  return new Paragraph({
    children: [new TextRun({ text: `${n}.  ${text}`, font: FONT_SANS, size: 22, color: TEXT })],
    spacing: { after: 60 },
    indent: { left: 400 },
  });
}

function tableRow(cells, isHeader = false) {
  return new TableRow({
    children: cells.map((c, i) => new TableCell({
      children: [new Paragraph({
        children: [new TextRun({ text: c, font: FONT_SANS, size: 20, bold: isHeader, color: isHeader ? 'FFFFFF' : TEXT })],
        spacing: { after: 0 },
      })],
      shading: isHeader ? { type: ShadingType.SOLID, color: PRIMARY } : (i % 2 === 0 ? undefined : { type: ShadingType.SOLID, color: SURFACE }),
      borders: { bottom: { color: BORDER, size: 1, style: BorderStyle.SINGLE } },
    })),
  });
}

function makeTable(headers, rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tableRow(headers, true), ...rows.map(r => tableRow(r))],
  });
}

function tag(text) {
  return `[${text}]`;
}

function blockquote(text) {
  return new Paragraph({
    children: [new TextRun({ text, font: FONT_SANS, size: 22, italics: true, color: TEXT_SEC })],
    spacing: { after: 120 },
    indent: { left: 400 },
    border: { left: { color: PRIMARY, size: 12, space: 12, style: BorderStyle.SINGLE } },
  });
}

// ==================== BUILD DOCUMENT ====================

const sections = [];

// --- COVER ---
sections.push({
  properties: {
    page: { margin: pageMargins },
  },
  children: [
    new Paragraph({ spacing: { before: 3000 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'A', font: FONT_SERIF, size: 120, bold: true, color: 'FFFFFF', shading: { type: ShadingType.SOLID, color: PRIMARY } })],
    }),
    new Paragraph({ spacing: { after: 200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Agria', font: FONT_SERIF, size: 64, bold: true, color: TEXT })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { after: 600 },
      children: [new TextRun({ text: 'Assistant agricole intelligent pour la gestion\nde parcelles et le diagnostic de cultures', font: FONT_SANS, size: 26, color: TEXT_SEC })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [new TextRun({ text: 'Rapport de projet — Mai 2026', font: FONT_SANS, size: 22, color: TEXT_MUTED })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Application mobile & web pour coopératives agricoles', font: FONT_SANS, size: 22, color: TEXT_MUTED })] }),
  ],
});

// --- SOMMAIRE ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('Sommaire'),
    para('1.  Remerciements'),
    para('2.  Résumé / Abstract'),
    para('3.  Introduction'),
    para('4.  Veille technologique'),
    para('    4.1  Panorama des solutions agritech'),
    para('    4.2  Technologies mobiles — React Native vs alternatives'),
    para('    4.3  Cartographie — Leaflet et OpenStreetMap'),
    para('    4.4  Backend — Firebase vs Supabase'),
    para('5.  Analyse des besoins'),
    para('    5.1  Besoin identifié'),
    para('    5.2  Personas utilisateurs'),
    para('    5.3  Cas d\'usage'),
    para('6.  Conception'),
    para('    6.1  Architecture globale'),
    para('    6.2  Design system Golden Hour'),
    para('    6.3  Parcours utilisateur'),
    para('7.  Réalisation'),
    para('    7.1  Stack technique'),
    para('    7.2  Application mobile (Expo React Native)'),
    para('    7.3  Application web (vanilla)'),
    para('    7.4  Fonctionnalités détaillées'),
    para('8.  Problèmes rencontrés et solutions'),
    para('9.  Conclusion & perspectives'),
    para('10.  Annexes'),
  ],
});

// --- 1. REMERCIEMENTS ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('1. Remerciements'),
    para('Ce projet a été réalisé dans le cadre d\'un travail d\'étude et de conception d\'application mobile. Nous tenons à remercier l\'ensemble des contributeurs qui ont participé à l\'élaboration de cette solution, ainsi que les agriculteurs et membres de coopératives dont les retours ont permis d\'orienter les choix fonctionnels et ergonomiques.'),
    para('Nous remercions également la communauté open-source pour les bibliothèques et outils mis à disposition — React Native, Expo, Leaflet, Firebase, OpenWeatherMap, Open-Meteo et Nominatim — sans lesquels ce projet n\'aurait pu voir le jour.'),
  ],
});

// --- 2. RESUME ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('2. Résumé / Abstract'),
    heading3('Résumé'),
    para('Agria est une application mobile et web destinée aux agriculteurs en coopérative. Elle propose une carte satellite interactive permettant de tracer et gérer des parcelles agricoles, un module de diagnostic de maladies des cultures en trois étapes, un suivi météorologique en temps réel avec prévisions sur cinq jours, et des prédictions agronomiques (estimation de récolte, besoins en eau, fertilisation).'),
    para('Le projet repose sur une architecture double : une version web historique en HTML/CSS/JavaScript vanilla, et une version mobile développée avec le framework Expo React Native (SDK 54, TypeScript, expo-router). Les données sont synchronisées via Firebase Realtime Database avec un fallback en stockage local (AsyncStorage / localStorage). Le design suit le thème « Golden Hour » inspiré des champs de blé au coucher de soleil.'),
    heading3('Abstract'),
    italicPara('Agria is a mobile and web application designed for cooperative farmers. It features an interactive satellite map for parcel management, a three-step crop disease diagnostic tool, real-time weather monitoring with five-day forecasts, and agronomic predictions. Built with Expo React Native and Firebase Realtime Database, it offers offline-capable data persistence and a warm "Golden Hour" design system.'),
  ],
});

// --- 3. INTRODUCTION ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('3. Introduction'),
    heading3('3.1  Contexte'),
    para('L\'agriculture française fait face à des défis majeurs : changement climatique, pression sur les rendements, nécessité de réduire les intrants, et vieillissement de la population agricole. Dans ce contexte, la digitalisation des exploitations n\'est plus un luxe mais une nécessité. Pourtant, les solutions existantes restent souvent coûteuses, complexes, ou mal adaptées aux petites et moyennes exploitations.'),
    para('Les coopératives agricoles, qui regroupent des centaines d\'exploitants, ont besoin d\'outils simples et accessibles pour aider leurs membres à mieux gérer leurs parcelles, identifier rapidement les maladies, et anticiper les conditions météorologiques.'),
    heading3('3.2  Problématique'),
    para('Comment fournir aux agriculteurs d\'une coopérative un outil mobile, intuitif et gratuit leur permettant de cartographier et gérer leurs parcelles sur fond satellite, diagnostiquer les maladies de leurs cultures en quelques clics, consulter la météo et les prévisions localisées, et stocker leurs données de manière sécurisée et accessible partout ?'),
    heading3('3.3  Objectifs'),
    bullet('Développer une application mobile iOS/Android avec React Native'),
    bullet('Maintenir une version web de référence en vanilla JavaScript'),
    bullet('Intégrer une carte satellite interactive avec outils de dessin'),
    bullet('Proposer un diagnostic de cultures en trois étapes (culture, symptômes, localisation)'),
    bullet('Assurer la synchronisation cloud des données avec persistance locale'),
    bullet('Appliquer un design system cohérent et chaleureux adapté au monde agricole'),
  ],
});

// --- 4. VEILLE TECHNOLOGIQUE ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('4. Veille technologique'),
    heading3('4.1  Panorama des solutions agritech'),
    para('Le marché des outils numériques agricoles est en pleine expansion. Plusieurs solutions commerciales existent, mais présentent des limitations pour notre public cible.'),
    makeTable(['Solution', 'Forces', 'Limitations'], [
      ['FarmLogs', 'Cartographie avancée, analyse de rendement', 'Payant, centré grandes cultures US'],
      ['AgriWebb', 'Gestion de troupeaux, traçabilité', 'Élevage uniquement, abonnement élevé'],
      ['Geofolia', 'Réglementaire PAC, conforme France', 'Interface lourde, desktop uniquement'],
      ['MesParcelles', 'Simple, français, planification', 'Pas de diagnostic, pas de mobile natif'],
      ['Agria (notre projet)', 'Mobile-first, gratuit, diagnostic intégré, carte satellite', 'Prototype, couverture maladies limitée'],
    ]),
    para('On constate qu\'aucune solution gratuite et mobile ne combine à la fois cartographie, diagnostic, météo et gestion multi-utilisateurs. C\'est précisément le positionnement d\'Agria.'),
    heading3('4.2  Technologies mobiles — React Native vs alternatives'),
    makeTable(['Critère', 'React Native (Expo)', 'Flutter', 'PWA'], [
      ['Performance', 'Bonne (bridge JS→natif)', 'Excellente (compile natif)', 'Limitée'],
      ['Écosystème', 'Très large, npm', 'Large, pub.dev', 'Web standard'],
      ['Courbe d\'apprentissage', 'Faible (React existant)', 'Moyenne (Dart)', 'Très faible'],
      ['WebView carto', 'Excellent', 'Bon', 'Natif (Leaflet)'],
      ['Notifications push', 'expo-notifications', 'firebase_messaging', 'Service Worker'],
      ['Mode hors-ligne', 'AsyncStorage + sync', 'sqflite/hive', 'IndexedDB'],
    ]),
    para('Le choix de React Native via Expo a été motivé par la productivité (hot reload, expo-router), l\'accès aux APIs natives sans configuration complexe, et la réutilisation des compétences JavaScript existantes du projet web.'),
    heading3('4.3  Cartographie — Leaflet et OpenStreetMap'),
    para('Le choix de Leaflet.js couplé aux tuiles satellite ArcGIS/Esri s\'est imposé face à Google Maps (payant au-delà d\'un quota) et Mapbox (coût élevé). Leaflet est léger (~40 Ko), open-source, et offre des fonctionnalités avancées comme le dessin de polygones, le snapping, et le géocodage via Nominatim (OpenStreetMap). Sur mobile, Leaflet est intégré dans une WebView (react-native-webview), ce qui permet de réutiliser le même code cartographique entre les deux plateformes.'),
    heading3('4.4  Backend — Firebase vs Supabase'),
    para('Le projet a démarré avec Supabase (PostgreSQL), mais a migré vers Firebase Realtime Database pour plusieurs raisons : gratuité plus généreuse au niveau starter, synchronisation temps réel native, SDK JavaScript compatible React Native sans configuration supplémentaire, et simplicité du modèle clé-valeur (pas de schéma SQL à maintenir). Un système de persistence hybride a été conçu : chaque écriture est stockée dans AsyncStorage/localStorage et dans Firebase. À la lecture, le stockage local est interrogé en priorité (réponse instantanée), puis Firebase est vérifié en arrière-plan.'),
  ],
});

// --- 5. ANALYSE DES BESOINS ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('5. Analyse des besoins'),
    heading3('5.1  Besoin identifié'),
    para('Lors de nos échanges avec des membres de coopératives agricoles, plusieurs constats ont émergé :'),
    bullet('Manque d\'outils simples : les logiciels existants (Geofolia, MesParcelles) sont perçus comme complexes et chronophages.'),
    bullet('Besoin de mobilité : les agriculteurs sont sur le terrain, pas devant un bureau. Le téléphone est l\'outil le plus accessible.'),
    bullet('Diagnostic rapide : identifier une maladie tôt peut sauver une récolte. Un outil d\'aide au diagnostic, même simple, a une vraie valeur.'),
    bullet('Partage encadré : dans une coopérative, voir les parcelles des autres est utile, mais les données personnelles doivent rester protégées.'),
    bullet('Prévisions fiables : la météo est le facteur n°1 de décision au quotidien.'),
    heading3('5.2  Personas utilisateurs'),
    makeTable(['Persona', 'Profil', 'Besoin principal'], [
      ['Julien, 45 ans', 'Céréalier, 120 ha, coopérateur', 'Suivre ses parcelles de blé et maïs, diagnostiquer les maladies fongiques'],
      ['Marie, 38 ans', 'Viticultrice, 30 ha, conversion bio', 'Anticiper mildiou et oïdium, consulter la météo locale avant traitement'],
      ['Paul, 52 ans', 'Administrateur coopérative', 'Superviser les parcelles, gérer les comptes, suivre les diagnostics'],
    ]),
    heading3('5.3  Cas d\'usage'),
    numbered(1, 'Cartographie des parcelles — L\'agriculteur trace sa parcelle sur la carte satellite, lui attribue un nom, une culture, une date de semis.'),
    numbered(2, 'Consultation météo — Depuis le tableau de bord, il vérifie la température, l\'humidité et les prévisions à 5 jours pour sa commune.'),
    numbered(3, 'Diagnostic d\'une maladie — En trois étapes (choix de la culture, sélection des symptômes, localisation), l\'application identifie la maladie probable et propose des recommandations.'),
    numbered(4, 'Prédictions agronomiques — Estimation de récolte, besoins en eau et fertilisation calculés selon la culture et les conditions locales.'),
    numbered(5, 'Administration — L\'administrateur accède à un back-office pour gérer les utilisateurs, consulter les parcelles et les logs.'),
  ],
});

// --- 6. CONCEPTION ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('6. Conception'),
    heading3('6.1  Architecture globale'),
    para('Le projet suit une architecture double stack où la version web vanilla sert de référence fonctionnelle, et la version mobile React Native en est le miroir moderne.'),
    bullet('Application mobile : Expo SDK 54, TypeScript, expo-router. File-based routing, bottom tabs (Dashboard, Carte, Diagnostic, Profil), admin panel protégé.'),
    bullet('Application web : HTML5, CSS3, Vanilla JS. 5 pages statiques servies par Node.js, design mobile-first (max-width 420px centré).'),
    bullet('Services : Firebase RTDB, OpenWeatherMap, Open-Meteo. 10 modules de service (auth, champs, diagnostic, weather, predictions, alerts, admin).'),
    bullet('Composants UI : 10 composants réutilisables (Badge, Button, Card, Input, Typography, DropDown, LoaderBar, etc.).'),
    heading3('6.2  Design system Golden Hour'),
    para('Le design system « Golden Hour » s\'inspire de la lumière chaude des champs de blé au coucher de soleil. Il repose sur trois piliers :'),
    bullet('Palette crème/chaud : fond #FDF8EE, accent blé #E8B84B, texte brun #3D2E1F.'),
    bullet('Typographie duale : Fraunces (serif chaud) pour les titres, Outfit (géométrique) pour le corps et l\'UI.'),
    bullet('Ombres chaudes : box-shadow avec une teinte brune plutôt que noire, pour une profondeur naturelle.'),
    bullet('Animations fluides : basées sur react-native-reanimated, easing curves naturelles, transitions de 200-300ms.'),
    para('Ce thème est verrouillé en mode clair uniquement (color-scheme: light), choix assumé pour renforcer l\'identité visuelle chaleureuse et la lisibilité en extérieur.'),
    heading3('6.3  Parcours utilisateur'),
    numbered(1, 'Connexion — Écran de login obligatoire à la première ouverture (sauf admin).'),
    numbered(2, 'Dashboard — Vue d\'ensemble : météo actuelle, prévisions, alertes, liste des parcelles.'),
    numbered(3, 'Carte — Carte satellite Leaflet en WebView avec outils de dessin, badges de parcelles, recherche de commune.'),
    numbered(4, 'Diagnostic — Workflow 3 étapes : sélection culture → symptômes → localisation → résultat avec recommandations.'),
    numbered(5, 'Profil — Informations utilisateur, préférences, historique des diagnostics.'),
    numbered(6, 'Admin (back-office) — Gestion des utilisateurs, consultation des parcelles, logs système.'),
  ],
});

// --- 7. REALISATION ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('7. Réalisation'),
    heading3('7.1  Stack technique'),
    makeTable(['Couche', 'Technologie', 'Version'], [
      ['Framework mobile', 'Expo React Native', 'SDK 54, React 19.1, RN 0.81'],
      ['Routing', 'expo-router', '6.0'],
      ['Base de données', 'Firebase Realtime Database', '10.14'],
      ['Stockage local', 'AsyncStorage', '2.2'],
      ['Cartographie', 'Leaflet.js (via WebView)', '1.9'],
      ['Météo', 'OpenWeatherMap + Open-Meteo', '—'],
      ['Géocodage', 'Nominatim (OpenStreetMap)', '—'],
      ['Animations', 'react-native-reanimated', '4.1'],
      ['Gestes', 'react-native-gesture-handler', '2.28'],
      ['Notifications', 'expo-notifications', '0.32'],
      ['Haptiques', 'expo-haptics', '15.0'],
      ['Polices', 'Fraunces + Outfit', '—'],
      ['Langage', 'TypeScript', '5.9'],
    ]),
    heading3('7.2  Application mobile (Expo React Native)'),
    para('L\'application mobile est structurée autour du file-based routing d\'expo-router :'),
    makeTable(['Route', 'Fichier', 'Rôle'], [
      ['/login', 'login.tsx', 'Connexion utilisateur'],
      ['/(tabs)/', 'index.tsx', 'Dashboard (météo, alertes, parcelles)'],
      ['/(tabs)/carte', 'carte.tsx', 'Carte satellite + dessin de parcelles'],
      ['/(tabs)/diagnostic', 'diagnostic.tsx', 'Diagnostic 3 étapes'],
      ['/(tabs)/profil', 'profil.tsx', 'Profil utilisateur'],
      ['/notifications', 'notifications.tsx', 'Centre de notifications'],
      ['/(admin)/', 'index.tsx', 'Back-office administrateur'],
    ]),
    heading3('7.3  Application web (vanilla)'),
    para('La version web, antérieure, est conservée comme référence. Elle est composée de 6 pages HTML statiques, un fichier CSS unique (style.css), un fichier JavaScript applicatif (script.js), et un serveur Node.js léger pour le déploiement. Le design mobile-first limite la largeur maximale à 420 pixels pour simuler un écran de téléphone sur desktop.'),
    heading3('7.4  Fonctionnalités détaillées'),
    boldPara('Carte satellite interactive'),
    bullet('Affichage Leaflet avec tuiles satellite Esri/ArcGIS'),
    bullet('Dessin de polygones avec fermeture automatique et snapping aux parcelles existantes'),
    bullet('Badges nominatifs liés aux parcelles, visibles à tous les niveaux de zoom'),
    bullet('Parcelles personnelles avec bordures pleines, parcelles des autres avec pointillés'),
    bullet('Panneau latéral de configuration (nom, culture, type de sol, date de semis, notes)'),
    bullet('Undo / suppression de polygone, recherche de commune via Nominatim'),
    boldPara('Diagnostic de cultures'),
    bullet('5 cultures supportées : blé, maïs, tournesol, colza, vigne'),
    bullet('3 étapes : choix culture → sélection symptômes (taches, jaunissement, flétrissement, insectes, pourriture, croissance anormale) → localisation'),
    bullet('Moteur de matching pondéré comparant les symptômes à une base de 15 maladies'),
    bullet('Résultat : nom de la maladie, gravité (danger/warning/info), explication, recommandations de traitement'),
    bullet('Données météo contextuelles via Open-Meteo, historique des diagnostics consultable'),
    boldPara('Météo et prévisions'),
    bullet('Température, humidité, description via OpenWeatherMap'),
    bullet('Prévisions sur 5 jours (température min/max, icône météo)'),
    bullet('Icônes mappées vers des pictogrammes lisibles, fallback en cas d\'indisponibilité API'),
    boldPara('Synchronisation et persistance'),
    bullet('Modèle local-first : lecture instantanée depuis AsyncStorage, écriture dans AsyncStorage + Firebase'),
    bullet('Fonctions génériques dpLoad, dpSave, dpRemove, dpLoadAll avec clés assainies automatiquement'),
    boldPara('Back-office administrateur'),
    bullet('Vue des utilisateurs, parcelles, logs système, accessible uniquement aux comptes administrateurs'),
  ],
});

// --- 8. PROBLEMES RENCONTRES ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('8. Problèmes rencontrés et solutions'),
    heading3('8.1  Migration Supabase → Firebase'),
    boldPara('Problème : '), para('Le projet initial utilisait Supabase (PostgreSQL) comme backend. La configuration des tables, des politiques RLS, et la gestion des tokens JWT se sont avérées trop complexes. Le SDK Supabase pour React Native présentait des problèmes d\'initialisation.'),
    boldPara('Solution : '), para('Migration complète vers Firebase Realtime Database. Le modèle clé-valeur élimine le besoin de schéma SQL et de migrations. Le SDK Firebase est natif React Native. La base « projet-etude-2026 » hébergée en Europe (europe-west1) garantit la conformité RGPD.'),
    heading3('8.2  Carte Leaflet dans une WebView React Native'),
    boldPara('Problème : '), para('Leaflet.js est une bibliothèque DOM. L\'intégrer directement dans React Native est impossible sans WebView. La communication entre le code React Native (TypeScript) et le code Leaflet (JavaScript dans la WebView) nécessite un pont de messages.'),
    boldPara('Solution : '), para('Utilisation de react-native-webview avec un système de messages postMessage/onMessage. Le HTML Leaflet est injecté dans la WebView, et les événements sont relayés au code React Native pour mise à jour de l\'état et persistance.'),
    heading3('8.3  Dessin de polygones sur mobile'),
    boldPara('Problème : '), para('La fonction de dessin de parcelles était difficile à utiliser sur mobile : le point de départ était trop petit pour être cliqué avec le doigt, la fermeture manuelle du polygone échouait souvent.'),
    boldPara('Solution : '),
    bullet('Élargissement de la zone de clic du premier point (hitbox augmentée).'),
    bullet('Fermeture automatique du polygone lorsque l\'utilisateur approche du point d\'origine.'),
    bullet('Système de snapping (aimantation) aux parcelles adjacentes pour éviter les chevauchements.'),
    heading3('8.4  Safe areas et bordures iPhone'),
    boldPara('Problème : '), para('Sur iPhone (notch, Dynamic Island), certains éléments passaient sous la caméra frontale. En bas, les éléments disparaissaient derrière la barre de contrôle (Home Indicator).'),
    boldPara('Solution : '), para('Intégration de react-native-safe-area-context et application de padding top/bottom calculés dynamiquement via useSafeAreaInsets(). Application du hook sur tous les écrans.'),
    heading3('8.5  Badges de parcelles instables'),
    boldPara('Problème : '), para('Les badges affichant le nom des parcelles ne suivaient pas correctement leur parcelle lors du zoom/dézoom. Ils étaient parfois décalés ou disparaissaient.'),
    boldPara('Solution : '), para('Ancrage des badges au barycentre de chaque polygone. Recalcul de la position à chaque événement de zoom et de déplacement. Visibilité masquée automatiquement lorsque le badge sort de la zone visible de la carte.'),
    heading3('8.6  Authentification et flux de connexion'),
    boldPara('Problème : '), para('La page de login ne s\'affichait pas systématiquement à l\'ouverture de l\'application mobile. Certains utilisateurs accédaient directement au dashboard sans être identifiés, causant des incohérences de données.'),
    boldPara('Solution : '), para('Mise en place d\'un guard d\'authentification dans le layout racine qui vérifie la présence d\'un identifiant utilisateur valide. Si absent, redirection forcée vers /login. Exception pour l\'accès admin.'),
    heading3('8.7  Synchronisation localStorage ↔ cloud'),
    boldPara('Problème : '), para('Sans connexion internet, l\'application devait continuer à fonctionner. Mais à la reconnexion, les données locales pouvaient entrer en conflit avec les données distantes.'),
    boldPara('Solution : '), para('Stratégie local-first avec écriture traversante : chaque sauvegarde écrit d\'abord en local, puis tente l\'écriture cloud. Si le cloud est indisponible, l\'écriture locale est conservée sans erreur. Pas de résolution de conflits complexes : la dernière écriture gagne (last-write-wins).'),
    heading3('8.8  Clavier et scroll dans les formulaires'),
    boldPara('Problème : '), para('Dans le panneau de configuration des parcelles, le clavier masquait les champs de saisie. Le scroll ne remontait pas automatiquement.'),
    boldPara('Solution : '), para('Implémentation d\'un KeyboardAvoidingView avec comportement padding. Ajout d\'un DateWheelPicker personnalisé pour éviter le clavier natif sur la date de semis. Bouton de fermeture explicite du clavier sur le champ notes.'),
  ],
});

// --- 9. CONCLUSION ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('9. Conclusion & perspectives'),
    heading3('9.1  Bilan'),
    para('Le projet Agria a abouti à une application fonctionnelle couvrant l\'ensemble des cas d\'usage identifiés :'),
    bullet('Version mobile React Native avec 7 écrans, bottom tab navigation, back-office admin.'),
    bullet('Version web vanilla de référence avec 5 pages.'),
    bullet('Carte satellite interactive avec dessin et badges de parcelles.'),
    bullet('Diagnostic de 15 maladies sur 5 cultures avec recommandations.'),
    bullet('Météo temps réel et prévisions 5 jours.'),
    bullet('Persistance hybride locale + cloud (Firebase).'),
    bullet('Design system cohérent Golden Hour sur les deux plateformes.'),
    para('Le projet a suivi 62 commits d\'évolution, partant d\'un simple prototype web pour aboutir à une application mobile complète avec authentification, synchronisation cloud, et administration.'),
    heading3('9.2  Acquis techniques'),
    bullet('Maîtrise d\'Expo React Native et expo-router.'),
    bullet('Intégration de Leaflet.js dans une WebView React Native.'),
    bullet('Conception d\'un système de persistance local-first avec Firebase RTDB.'),
    bullet('Mise en place d\'un design system complet (palette, typographie, composants, animations).'),
    bullet('Gestion des spécificités mobiles : safe areas, haptiques, notifications push, gestes.'),
    heading3('9.3  Perspectives'),
    para('Plusieurs axes d\'amélioration sont envisagés pour les versions futures :'),
    bullet('Analyse de sol : intégration de données pédologiques via API géospatiales (INRAE, GISSol).'),
    bullet('Recommandations IA : remplacer le moteur de matching pondéré par un modèle de classification avancé ou un LLM spécialisé en agronomie.'),
    bullet('Mode hors-ligne complet : mise en cache des tuiles cartographiques pour un usage sans connexion.'),
    bullet('PWA : transformation de la version web en Progressive Web App.'),
    bullet('Intégration Agrichat : conseils contextualisés sur les intrants et solutions de traitement.'),
    bullet('Couverture de cultures élargie : ajout de l\'orge, du pois, de la betterave, et des cultures maraîchères.'),
    bullet('Cartographie avancée : calcul automatique de surface (hectares) à partir du polygone dessiné.'),
    blockquote('Agria démontre qu\'il est possible de concevoir un outil agricole moderne, mobile, gratuit et accessible, en s\'appuyant exclusivement sur des technologies open-source et des APIs publiques. Le projet pose les fondations d\'une plateforme plus ambitieuse au service des coopératives.'),
  ],
});

// --- 10. ANNEXES ---
sections.push({
  properties: { page: { margin: pageMargins } },
  children: [
    heading1('10. Annexes'),
    heading3('10.1  Glossaire'),
    makeTable(['Terme', 'Définition'], [
      ['AsyncStorage', 'API de stockage clé-valeur asynchrone pour React Native, persistante sur l\'appareil.'],
      ['Expo', 'Plateforme de développement React Native gérant la compilation, la publication, et l\'accès aux APIs natives.'],
      ['expo-router', 'Système de routing basé sur l\'arborescence des fichiers, inspiré de Next.js.'],
      ['Firebase RTDB', 'Base de données NoSQL temps réel de Google, synchronisée automatiquement entre clients.'],
      ['Leaflet.js', 'Bibliothèque JavaScript open-source de cartographie interactive (~40 Ko).'],
      ['Nominatim', 'Service de géocodage d\'OpenStreetMap (adresse ↔ coordonnées GPS).'],
      ['Open-Meteo', 'API météorologique gratuite et open-source, sans clé requise.'],
      ['OpenWeatherMap', 'Service météo avec API gratuite (limité à 60 appels/min).'],
      ['React Native', 'Framework de Meta permettant le développement d\'apps mobiles en JavaScript/React.'],
      ['WebView', 'Composant affichant du contenu web (HTML/CSS/JS) dans une application native.'],
    ]),
    heading3('10.2  APIs et services externes'),
    makeTable(['Service', 'Usage', 'Gratuité'], [
      ['OpenWeatherMap Current', 'Météo actuelle par ville', '60 appels/min gratuits'],
      ['OpenWeatherMap Forecast', 'Prévisions 5 jours / 3h', 'Inclus dans le plan gratuit'],
      ['Open-Meteo', 'Données météo historiques (7j) pour diagnostic', 'Entièrement gratuit'],
      ['Nominatim', 'Géocodage (ville → coordonnées)', 'Gratuit, 1 req/s max'],
      ['ArcGIS/Esri tiles', 'Tuiles satellite pour Leaflet', 'Gratuit, usage raisonnable'],
      ['Firebase RTDB', 'Synchronisation des données', '1 Go stockage + 10 Go transfert gratuits'],
    ]),
    heading3('10.3  Structure du projet'),
    para('agria/'),
    para('    ├── web/                         Version vanilla (référence)'),
    para('    │   ├── index.html               Dashboard'),
    para('    │   ├── login.html               Authentification'),
    para('    │   ├── carte.html               Carte satellite + dessin'),
    para('    │   ├── diagnostic.html          Diagnostic 3 étapes'),
    para('    │   ├── profil.html              Profil utilisateur'),
    para('    │   ├── style.css                Design system Golden Hour'),
    para('    │   ├── script.js                Logique applicative'),
    para('    │   └── server.js                Serveur Node.js'),
    para('    ├── mobile/                      Version Expo React Native'),
    para('    │   ├── app/                     Routes expo-router'),
    para('    │   │   ├── _layout.tsx          Layout racine (auth guard)'),
    para('    │   │   ├── login.tsx            Connexion'),
    para('    │   │   ├── (tabs)/              Navigation bottom tabs'),
    para('    │   │   │   ├── index.tsx        Dashboard'),
    para('    │   │   │   ├── carte.tsx        Carte (WebView)'),
    para('    │   │   │   ├── diagnostic.tsx   Diagnostic'),
    para('    │   │   │   └── profil.tsx       Profil'),
    para('    │   │   └── (admin)/             Back-office'),
    para('    │   │       ├── index.tsx        Panel admin'),
    para('    │   │       ├── utilisateurs.tsx Gestion utilisateurs'),
    para('    │   │       └── parcelles.tsx    Vue parcelles'),
    para('    │   └── src/                     Sources'),
    para('    │       ├── components/          10 composants UI'),
    para('    │       ├── services/            10 modules (auth, firebase, etc.)'),
    para('    │       ├── hooks/               Hooks personnalisés'),
    para('    │       ├── data/                Config, constantes, fallbacks'),
    para('    │       └── theme/               Colors, fonts, spacing'),
    para('    ├── docs/                        Documentation, specs'),
    para('    ├── design/                      Brand book, design system'),
    para('    └── presentation-agria.html      Présentation du projet'),
    heading3('10.4  Références'),
    numbered(1, 'Documentation Expo — docs.expo.dev'),
    numbered(2, 'Documentation React Native — reactnative.dev'),
    numbered(3, 'Documentation Firebase — firebase.google.com/docs'),
    numbered(4, 'Documentation Leaflet.js — leafletjs.com/reference.html'),
    numbered(5, 'API OpenWeatherMap — openweathermap.org/api'),
    numbered(6, 'API Open-Meteo — open-meteo.com/en/docs'),
    numbered(7, 'API Nominatim — nominatim.org/release-docs/latest/api'),
  ],
});

// ==================== GENERATE ====================

const doc = new Document({
  creator: 'Agria Project',
  title: 'Agria — Rapport de projet',
  description: 'Rapport de projet Agria - Assistant agricole intelligent',
  sections,
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('rapport-agria.docx', buffer);
  console.log('rapport-agria.docx généré avec succès !');
});
