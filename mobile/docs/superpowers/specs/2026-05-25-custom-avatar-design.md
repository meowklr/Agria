# Custom Avatar Feature — Design Spec

**Date:** 2026-05-25
**Status:** Draft
**Scope:** Profile avatar photo via camera/gallery, stored in Firebase Storage

---

## Overview

Replace the text-initials avatar circle on the Profil tab screen with a user-uploadable photo. The initials avatar remains as fallback when no photo is set.

## Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  profil.tsx  │────▶│   useProfile     │────▶│  firebase.ts     │
│  (UI)        │     │   (hook)         │     │  (storage)       │
└──────┬───────┘     └──────────────────┘     └────────┬────────┘
       │                                                │
       │  expo-image-picker                             │  Firebase Storage
       │  (camera/gallery)                              │  uploadBytes / getDownloadURL
       ▼                                                ▼
┌──────────────┐                              ┌─────────────────┐
│  Image URI   │                              │ avatars/uid.jpg │
└──────────────┘                              └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │ Firebase RTDB   │
                                              │ Profile.imageUrl│
                                              └─────────────────┘
```

## Data Model Changes

### Profile interface (`src/hooks/useProfile.ts`)

```typescript
export interface Profile {
  prenom?: string;
  nom?: string;
  telephone?: string;
  email?: string;
  ville?: string;
  exploitation?: string;
  siret?: string;
  typeAgriculture?: string;
  imageUrl?: string;   // NEW: Firebase Storage download URL
}
```

No migration needed — optional field, defaults to `undefined` for existing profiles.

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `src/services/firebase.ts` | Modify | Add `getFirebaseStorage()`, `uploadAvatar(uri, uid)`, `deleteAvatar(uid)` |
| `src/hooks/useProfile.ts` | Modify | Add `imageUrl` to Profile, add `uploadAvatar(uri)` method, add `deleteAvatar()` method |
| `app/(tabs)/profil.tsx` | Modify | Replace initials circle with avatar image component, add tap-to-edit ActionSheet |
| `app.json` | Modify | Add `expo-image-picker` plugin config (permissions) |
| `package.json` | Modify | Add `expo-image-picker` dependency |

## UI Design

### Avatar display (profil.tsx header)
- **Has imageUrl:** Show `<Image>` with `borderRadius: 28` (56x56 circle), replacing the current initials `<View>`
- **No imageUrl:** Keep existing initials circle (unchanged)
- **Loading state:** Show spinner on the avatar while upload is in progress

### Tap interaction
- Tapping the avatar opens a React Native `ActionSheet`:
  1. "Prendre une photo" → `launchCameraAsync()`
  2. "Choisir dans la galerie" → `launchImageLibraryAsync()`
  3. "Supprimer la photo" (only if `imageUrl` exists) → delete + revert to initials
  4. "Annuler"

### States to handle
| State | UI |
|-------|----|
| No photo | Initials circle (current behavior) |
| Photo exists | Image displayed |
| Uploading | Spinner overlay on avatar |
| Upload error | Toast/banner error message, revert to previous state |
| Delete success | Revert to initials circle |

## Firebase Storage

### Path convention
```
avatars/{userId}.jpg
```
Single file per user, overwritten on re-upload. No versioning needed.

### Security rules (to be set in Firebase Console)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}.jpg {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Dependencies

- `expo-image-picker` — `npx expo install expo-image-picker`
- Already in `node_modules`: `@firebase/storage` (comes with `firebase` v10)

## Edge Cases

1. **Image too large:** Resize/compress to max 512x512 before upload (reduces storage cost, faster upload)
2. **Network offline:** Show error, keep existing state, do not clear existing `imageUrl`
3. **Storage quota exceeded:** Show user-friendly error "Espace de stockage saturé"
4. **Permission denied:** Handle `expo-image-picker` permission denial gracefully
5. **Concurrent upload:** Disable upload button while upload is in progress (loading state)
6. **Sign-out / account deletion:** Delete avatar file from Storage when account is deleted (in `deleteOwnAccount`)

## Testing Checklist

- [ ] Tap avatar → ActionSheet appears with correct options
- [ ] "Prendre une photo" opens camera
- [ ] "Choisir dans la galerie" opens photo library
- [ ] Selected photo displays correctly as 56x56 circle
- [ ] Photo persists across app restart (Firebase Storage URL saved in profile)
- [ ] "Supprimer" reverts to initials avatar
- [ ] Offline: upload fails gracefully, existing photo remains
- [ ] Firebase Storage bucket shows file at `avatars/{uid}.jpg`
- [ ] Existing profiles without `imageUrl` continue to show initials
