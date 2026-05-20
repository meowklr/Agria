# Agria — Golden Hour Redesign

**Date:** 2026-05-20  
**Scope:** Redesign complet — design system, toutes les pages, refonte CSS/HTML  
**Direction:** Golden Hour / Champs de blé — chaleureux, cinématique, épuré  
**Contrainte:** Mobile-first, vue unique verticale sur desktop (max-width 420px centré)

---

## 1. Design System

### Palette

| Variable | Valeur | Usage |
|----------|--------|-------|
| `--bg` | `#FDF8EE` | Fond principal crème chaud |
| `--surface` | `#FFFDF6` | Cards, modales, inputs |
| `--primary` | `#E8B84B` | Boutons, accents, logo |
| `--primary-hover` | `#D4A853` | Hover boutons, liens, icônes actives |
| `--accent` | `#C4704A` | Badges, alertes douces |
| `--danger` | `#B5533A` | Danger, urgent, warning rouge |
| `--info` | `#B8D4E8` | Météo, infos, éléments froids |
| `--success` | `#7A9E5A` | Succès, validation |
| `--text` | `#3D2E1F` | Texte principal |
| `--text-secondary` | `#6B5D4F` | Texte secondaire |
| `--text-muted` | `#A89880` | Labels, placeholders |
| `--border` | `#EBE3D3` | Bordures, séparateurs |

### Typographie

- **Titres**: Fraunces (serif chaud)
- **Corps/UI**: Outfit (géométrique chaleureux)
- Tailles: 16px base, titres 20-28px, météo 56px

### Rayons & Ombres

- Radius: `--radius-sm: 8px`, `--radius: 12px`, `--radius-lg: 16px`, `--radius-xl: 20px`
- Ombres chaudes: `box-shadow` avec `rgba(61,46,31,0.06)` à `rgba(61,46,31,0.12)`

### Easing

- `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)`
- `--ease-spring`: `cubic-bezier(0.22, 1, 0.36, 1)`

---

## 2. Layout

- Mobile-first, single column everywhere
- `max-width: 420px` centré sur desktop, fond extérieur `#F3EFE6`
- Header fixe: logo gauche, notif droite, backdrop blur
- Bottom nav 4 onglets fixe bas, hauteur 64px + safe-area
- Contenu padding 16px, bottom 84px
- Pas de grilles desktop, pas de sidebars

---

## 3. Composants

### Cards
- Fond `--surface`, bordure `1px solid --border`, radius 16px, padding 20px
- Ombre `0 2px 12px rgba(61,46,31,0.06)`

### Boutons
- Hauteur 48px, radius 12px, texte 16px
- Primaire: fond `--primary`, scale(0.97) on :active, 120ms
- Secondaire: bordure `--primary`, fond transparent
- Danger: fond `--danger`, texte blanc

### Inputs
- Hauteur 48px, radius 12px, fond `--surface`, bordure `--border`
- Focus: bordure `--primary`, glow or

### Bottom Nav
- 4 icônes + libellé 10px
- Actif: couleur `--primary` + point doré 4px au-dessus

### Badges
- Radius 6px, padding 2px 8px, texte 11px blanc
- Succès: `--success`, Warning: `--accent`, Danger: `--danger`

### Fond texturé
- SVG noise overlay sur body, opacity 0.03, pointer-events none

---

## 4. Animations (épurées)

| Élément | Animation | Durée |
|---------|-----------|-------|
| Page load | Stagger reveal (30ms gap) | 200ms |
| Bouton :active | scale(0.97) | 120ms |
| Input focus | Bordure + glow | 180ms |
| Carte hover | translateY(-2px) | 200ms |
| Bottom sheet | Slide up + overshoot | 300ms |
| Toast | Slide up, fade out 3s | 250ms |
| Page transition | Blur + fade | 150ms |
| Diagnostic résultat | Typewriter | 80ms/char |

- Hover gated behind `@media (hover: hover)`
- `prefers-reduced-motion` : tout 0ms
- Aucune animation sur: scroll horizontal, toggle, accordéon

---

## 5. Pages

### Login
- Logo Agria grand centré, tagline, formulaire email+mdp
- Pas d'animation de fond

### Dashboard
1. Météo du jour (grande carte teintée info)
2. Prévisions 5 jours (scroll horizontal)
3. Alertes (exemples, 3 cartes empilées, bord gauche coloré)
4. Mes parcelles (liste)
5. Stats en grille 2×2: champs, hectares, culture dominante (3 cartes, pas de "prochain semis")

### Carte
- Map 400px haut, outils overlay, recherche top
- Panneau info sous la map (plus de side panel)
- Zoom sur parcelle: padding bas pour dégager le panneau info

### Diagnostic
- 3 étapes visuelles, grille 2col cultures, checklist symptômes, ville + analyser
- Résultat + météo + recommandations
- Historique

### Profil
- Cartes empilées: identité, exploitation, stats (3), préférences, sécurité

---

## 6. Règles

- Thème clair uniquement (`color-scheme: light only`)
- Alertes marquées comme exemples
- Zoom parcelle adapté au panneau info inférieur
- Suppression "prochain semis" dans les stats
- Pas de mode sombre
