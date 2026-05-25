# Custom Avatar Photo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let users set a profile photo from camera or gallery, uploaded to Firebase Storage, displayed instead of initials avatar on the Profil tab.

**Architecture:** `expo-image-picker` captures the photo, `firebase/storage` uploads to `avatars/{uid}.jpg`, the download URL is saved in the `Profile` via existing `dpSave`, and `profil.tsx` shows the image with tap-to-edit ActionSheet.

**Tech Stack:** expo-image-picker, Firebase Storage (@firebase/storage bundled in firebase)

---

### Task 1: Install expo-image-picker and configure permissions

**Files:**
- Modify: `package.json`
- Modify: `app.json`

- [ ] **Step 1: Install expo-image-picker**

```bash
npx expo install expo-image-picker
```

Expected: package added to `package.json` with compatible version for Expo SDK 54.

- [ ] **Step 2: Add plugin config to app.json**

In `app.json`, add to the `plugins` array:

```json
{
  "plugins": [
    "expo-router",
    "expo-asset",
    "expo-font",
    "expo-notifications",
    [
      "expo-image-picker",
      {
        "photosPermission": "Agria a besoin d'acces a vos photos pour personnaliser votre profil.",
        "cameraPermission": "Agria a besoin d'acces a l'appareil photo pour votre avatar."
      }
    ]
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json app.json
git commit -m "feat: add expo-image-picker dependency and permissions"
```

---

### Task 2: Add Firebase Storage support

**Files:**
- Modify: `src/services/firebase.ts:1-5,22-24,26-57`

- [ ] **Step 1: Import Firebase Storage SDK**

Change the imports at the top of `firebase.ts` to add Storage:

```typescript
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove, Database } from 'firebase/database';
import { getAuth as fbGetAuth, initializeAuth as fbInitAuth, Auth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
```

- [ ] **Step 2: Add storage instance variable**

Add `let firebaseStorage: FirebaseStorage | null = null;` after line 25 (after `let initAttempted = false;`):

```typescript
let firebaseStorage: FirebaseStorage | null = null;
```

- [ ] **Step 3: Initialize storage in tryInitFirebase**

Inside `tryInitFirebase()`, after `db = getDatabase(app);` (line 34), add:

```typescript
firebaseStorage = getStorage(app);
```

And in the catch block (lines 51-56), reset it:

```typescript
firebaseStorage = null;
```

- [ ] **Step 4: Add getFirebaseStorage export**

After `getAuthInstance()`, add:

```typescript
export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) throw new Error('Storage non initialise');
  return firebaseStorage;
}
```

- [ ] **Step 5: Add uploadAvatar function**

Add after `getFirebaseStorage`:

```typescript
async function imageToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return await response.blob();
}

export async function uploadAvatar(uid: string, localUri: string): Promise<string> {
  const storage = getFirebaseStorage();
  const path = `avatars/${uid}.jpg`;
  const fileRef = storageRef(storage, path);
  const blob = await imageToBlob(localUri);
  await uploadBytes(fileRef, blob);
  const downloadUrl = await getDownloadURL(fileRef);
  return downloadUrl;
}

export async function deleteAvatar(uid: string): Promise<void> {
  const storage = getFirebaseStorage();
  const path = `avatars/${uid}.jpg`;
  const fileRef = storageRef(storage, path);
  try {
    await deleteObject(fileRef);
  } catch (e: any) {
    if (e.code !== 'storage/object-not-found') throw e;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add src/services/firebase.ts
git commit -m "feat: add Firebase Storage support with uploadAvatar and deleteAvatar"
```

---

### Task 3: Update Profile interface and useProfile hook

**Files:**
- Modify: `src/hooks/useProfile.ts:6,23-25`
- Modify: `src/services/auth.ts:66` (optional — add avatar key helper)

- [ ] **Step 1: Add imageUrl to Profile interface**

Change line 6 of `useProfile.ts`:

```typescript
export interface Profile { prenom?: string; nom?: string; telephone?: string; email?: string; ville?: string; exploitation?: string; siret?: string; typeAgriculture?: string; imageUrl?: string; }
```

- [ ] **Step 2: Add uploadAvatar and deleteAvatar methods to useProfile**

Add inside the `useProfile()` function, after `savePrefs`:

```typescript
const [avatarUploading, setAvatarUploading] = useState(false);

const uploadAvatar = async (localUri: string): Promise<string> => {
  setAvatarUploading(true);
  try {
    const uid = await getUserId();
    const { uploadAvatar: doUpload } = await import('../services/firebase');
    const imageUrl = await doUpload(uid, localUri);
    const updated = { ...profile, imageUrl };
    await dpSave(getProfileKey(uid), updated);
    setProfile(updated);
    return imageUrl;
  } finally {
    setAvatarUploading(false);
  }
};

const deleteUserAvatar = async (): Promise<void> => {
  const uid = await getUserId();
  const { deleteAvatar: doDelete } = await import('../services/firebase');
  await doDelete(uid);
  const updated = { ...profile, imageUrl: undefined };
  delete updated.imageUrl;
  await dpSave(getProfileKey(uid), updated);
  setProfile(updated);
};
```

- [ ] **Step 3: Export the new values from useProfile**

Change the return statement:

```typescript
return { profile, prefs, stats, saveProfile, savePrefs, reload: load, avatarUploading, uploadAvatar, deleteUserAvatar };
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useProfile.ts
git commit -m "feat: add imageUrl to Profile, uploadAvatar and deleteUserAvatar to useProfile hook"
```

---

### Task 4: Update Profil screen with avatar image and picker

**Files:**
- Modify: `app/(tabs)/profil.tsx:1,23,42,52-63`

- [ ] **Step 1: Add expo-image-picker and ActionSheet imports**

Add to the imports on line 1:

```typescript
import * as ImagePicker from 'expo-image-picker';
```

Already on line 1: `import { View, Text, ScrollView, Switch, TouchableOpacity, Modal, Alert, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager } from 'react-native';`
Add `Image, ActivityIndicator, ActionSheetIOS` to this import:

```typescript
import { View, Text, ScrollView, Switch, TouchableOpacity, Modal, Alert, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Image, ActivityIndicator } from 'react-native';
```

- [ ] **Step 2: Destructure new values from useProfile**

Change line 23 of `profil.tsx`:

```typescript
const { profile, prefs, stats, saveProfile, savePrefs, avatarUploading, uploadAvatar, deleteUserAvatar } = useProfile();
```

- [ ] **Step 3: Add avatar picker handler**

Add after `showSaved` function (after line 35):

```typescript
const handleAvatarPress = () => {
  const options = profile.imageUrl
    ? ['Prendre une photo', 'Choisir dans la galerie', 'Supprimer la photo', 'Annuler']
    : ['Prendre une photo', 'Choisir dans la galerie', 'Annuler'];
  const cancelIndex = options.length - 1;
  const deleteIndex = profile.imageUrl ? 2 : -1;

  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      { options, cancelButtonIndex: cancelIndex, destructiveButtonIndex: deleteIndex },
      async (idx) => {
        if (idx === 0) await pickAndUpload('camera');
        else if (idx === 1) await pickAndUpload('gallery');
        else if (idx === 2 && profile.imageUrl) await deleteUserAvatar();
      }
    );
  } else {
    Alert.alert('Photo de profil', undefined, [
      { text: 'Prendre une photo', onPress: () => pickAndUpload('camera') },
      { text: 'Choisir dans la galerie', onPress: () => pickAndUpload('gallery') },
      ...(profile.imageUrl ? [{ text: 'Supprimer la photo', style: 'destructive' as const, onPress: () => deleteUserAvatar() }] : []),
      { text: 'Annuler', style: 'cancel' },
    ]);
  }
};

const pickAndUpload = async (type: 'camera' | 'gallery') => {
  try {
    const permission = type === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusee', 'Autorisez l\'acces dans les reglages de votre telephone.');
      return;
    }
    const result = type === 'camera'
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      await uploadAvatar(result.assets[0].uri);
    }
  } catch (e: any) {
    Alert.alert('Erreur', e.message || 'Impossible de charger la photo.');
  }
};
```

- [ ] **Step 4: Replace initials avatar with image component**

Replace the avatar section (lines 52-63 of profil.tsx):

```typescript
{/* HEADER AVATAR */}
<View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20, paddingHorizontal: 4 }}>
  <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
    {profile.imageUrl ? (
      <View style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', backgroundColor: colors.border }}>
        <Image source={{ uri: profile.imageUrl }} style={{ width: 56, height: 56 }} />
      </View>
    ) : (
      <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{initials}</Text>
      </View>
    )}
    {avatarUploading && (
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 28, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#fff" size="small" />
      </View>
    )}
  </TouchableOpacity>
  <View style={{ flex: 1 }}>
    <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>
      {prenom ? prenom + ' ' + nom : 'Mon profil'}
    </Text>
    {expl ? <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.sans, marginTop: 2 }}>{expl}</Text> : null}
  </View>
</View>
```

- [ ] **Step 5: Add ActionSheetIOS to Platform import**

Ensure `ActionSheetIOS` is available. On Android, `Alert.alert` is used instead (already handled in the handler). On iOS, `ActionSheetIOS` is imported from `react-native`. Add it to the existing import:

The line 1 already imports from `react-native`. Add `ActionSheetIOS`:

```typescript
import { View, Text, ScrollView, Switch, TouchableOpacity, Modal, Alert, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Image, ActivityIndicator, ActionSheetIOS } from 'react-native';
```

- [ ] **Step 6: Commit**

```bash
git add app/(tabs)/profil.tsx
git commit -m "feat: add avatar image picker, upload, and display on Profil screen"
```

---

### Task 5: Clean up avatar on account deletion

**Files:**
- Modify: `src/services/admin.ts` (or wherever `deleteOwnAccount` is defined)

- [ ] **Step 1: Add avatar deletion to account deletion flow**

Find the `deleteOwnAccount` function. Before deleting the Firebase Auth user, delete the avatar file:

Add at the top of the function or inside the try block before user deletion:

```typescript
try {
  const { deleteAvatar } = await import('./firebase');
  await deleteAvatar(uid);
} catch {}
```

- [ ] **Step 2: Commit**

```bash
git add src/services/admin.ts
git commit -m "feat: delete avatar from storage on account deletion"
```

---

### Task 6: Verify and test

- [ ] **Step 1: TypeScript check**

```bash
npx tsc --noEmit --project tsconfig.json
```
Expected: no errors

- [ ] **Step 2: Run the app and test the flow**

1. Open Profil tab → see initials avatar (unchanged if no photo)
2. Tap avatar → ActionSheet appears with "Prendre une photo" / "Choisir dans la galerie" / "Annuler"
3. Select "Choisir dans la galerie" → pick a photo
4. See spinner on avatar while uploading
5. See photo displayed as 56x56 circle
6. Tap avatar again → see "Supprimer la photo" option
7. Select "Supprimer" → initials avatar reappears
8. Restart app → photo still displayed (persisted from Firebase Storage)
9. Check Firebase Console → Storage → `avatars/{uid}.jpg` exists

- [ ] **Step 3: Commit if any fixes needed**

```bash
git add -A
git commit -m "chore: final adjustments and verification"
```
