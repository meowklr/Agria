# Agr'IA — UI/UX Refinement Design

**Date:** 2026-05-19  
**Scope:** UI/UX uniquement — refinement de l'existant (Approche A)  
**Public:** Multi-utilisateurs (cooperative), chaque utilisateur ne peut interagir qu'avec ses propres parcelles.

---

## 1. Structure & Navigation

### Mobile (< 768px)
- **Bottom nav inchangée** : 4 onglets (Accueil, Carte, Diagnostic, Profil), fixe en bas, backdrop-filter blur.
- La page Carte est full-bleed (pas centrée).

### Desktop (>= 1024px)
- **Top-bar** remplace la bottom-nav sur les pages statiques (dashboard, diagnostic, profil). Logo à gauche, liens centrés, icône notifications à droite.
- **Contenu centré** : `max-width: 960px`, `margin: 0 auto`, padding 24px + 84px bottom pour la bottom-nav.
- **Page Carte** : reste full-bleed. La bottom-nav y est conservée (zone interactive).
- **Page Login** : `max-width: 480px` centré.

### Page Carte — desktop spécifique
- Sidebar gauche (280px) avec météo résumée, liste "Mes parcelles", alertes, bouton "Nouvelle parcelle".
- Le side panel (détail parcelle) reste à droite en overlay.

---

## 2. Page Carte — Parcelles

### Distinction mes parcelles / autres
- **Mes parcelles** : contour vert `#4caf50`, remplissage semi-transparent, nom visible en tooltip permanent au centre.
- **Parcelles des autres** : contour gris `#9e9e9e`, pointillés, remplissage très léger, **pas de nom** — tooltip remplacé par "Parcelle voisine".
- Au clic sur une parcelle voisine : le side panel affiche "Parcelle voisine" sans détails modifiables.

### Dessin
- **Un seul système** : le dessin Leaflet natif (polyline + circleMarker, déjà dans carte.html).
- Supprimer le système `L.Draw.Polygon` dupliqué dans `script.js` (fonction `initCarte`).
- Aimantation (déjà fait) : snap à 15m des sommets existants.
- Fermeture auto (déjà fait) : reclic sur le 1er point.

### Zoom au clic
- `selectParcel()` fait `map.fitBounds()` avec padding 60px, maxZoom 16, animation 0.6s (déjà fait).

### Edition des parcelles
- Pouvoir configurer sa parcelle juste après l'avoir dessiné, en spécifiant ses specs.

---

## 3. Dashboard

### Météo du jour
- Box `.meteo-card` : `overflow: hidden` (corrigé), pas de débordement du `::before` ni du glow.
- Décor intérieur repositionné (top: -20px, right: -20px, taille 140px).

### Prévisions
- API forecast sans `cnt=5` → aggrégation par jour : `temp_max` max, `temp_min` min, icône du milieu de journée.
- Jour courant exclu, affichage des 5 jours suivants.
- Desktop : cartes plus larges, grille 5 colonnes.

### Alertes
- Desktop : alertes à droite de la météo (grid 2 colonnes).
- Conserver les 3 alertes statiques (gel, sécheresse, fongicide).

### Parcelles (dashboard)
- Desktop : grille 2 colonnes au lieu d'une liste verticale.
- Chaque carte affiche : nom, culture, surface, stade (badge), flèche pour détail.

---

## 4. Système Visuel

### Direction : "brut agricole + minimaliste"
- Palette inchangée : `#606E52` (primary), `#91A56E` (secondary), `#C0CCA4` (tertiary), `#f6f7f4` (bg), `#FFFFFF` (surface).
- Typos inchangées : Cormorant Garamond (titres), Plus Jakarta Sans (corps).
- Suppression des doublons CSS.

### Mode sombre (nouveau)
- Via `prefers-color-scheme: dark` dans une media query.
- Fonds sombres (`#1a1f1a`, `#2a2f2a`), verts atténués, contraste réduit.
- Pas de toggle utilisateur — automatique.

### Nettoyage CSS
- Supprimer les définitions en double (`.previsions-card:hover` ×2, `.symptome-item:hover` ×2, `.symptome-check` ×2, `.carte-full` styles dupliqués).
- Corriger l'accolade en trop ligne 1302.

---

## 5. Code Cleanup

- **unifier le dessin** : garder seulement le système de carte.html, retirer `L.Draw.Polygon` de `initCarte()` dans script.js.
- **CSS** : nettoyer les 5 doublons identifiés + l'erreur de syntaxe.
- **Parcelles voisines** : remplacer le nom par "Parcelle voisine" dans `loadAllChampsOnMap()` et `renderAllParcels()`.

---

## 6. Exclusions

- Pas de redesign complet des pages Diagnostic et Profil (elles suivent le système visuel, le centrage desktop).
- Pas de migration framework (reste vanilla HTML/CSS/JS).

## 7. Précisions

- Utilisation de supabase.
- Pwa pour configurer app mobile.
