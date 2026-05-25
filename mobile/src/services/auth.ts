import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  updateEmail as firebaseUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getAuthInstance, dpSave, dpLoad } from './firebase';

export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export async function login(email: string, password: string): Promise<string> {
  const auth = getAuthInstance();
  const cred = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  const key = 'agria_fb_user_' + cred.user.uid;
  const existing = await dpLoad<{ uid: string; email: string; createdAt?: number; lastLogin?: number }>(key, { uid: cred.user.uid, email: email.trim().toLowerCase() });
  existing.lastLogin = Date.now();
  await dpSave(key, existing);
  return cred.user.uid;
}

export async function register(email: string, password: string): Promise<string> {
  const auth = getAuthInstance();
  const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  await dpSave('agria_fb_user_' + cred.user.uid, {
    uid: cred.user.uid,
    email: email.trim().toLowerCase(),
    createdAt: Date.now(),
    lastLogin: Date.now(),
  });
  return cred.user.uid;
}

export async function logout(): Promise<void> {
  const auth = getAuthInstance();
  await signOut(auth);
}

export function listenAuth(callback: (user: User | null) => void): () => void {
  try {
    const auth = getAuthInstance();
    return onAuthStateChanged(auth, callback);
  } catch (e) {
    console.warn('[Auth] listenAuth failed:', (e as Error).message);
    callback(null);
    return () => {};
  }
}

export async function getUserId(): Promise<string> {
  const auth = getAuthInstance();
  const user = auth.currentUser;
  if (!user) throw new Error('Session requise — veuillez vous connecter.');
  return user.uid;
}

export async function getSessionEmail(): Promise<string | null> {
  const auth = getAuthInstance();
  return auth.currentUser?.email || null;
}

export function getPrefsKey(uid: string) { return 'agria_prefs_' + uid; }
export function getChampsKey(uid: string) { return 'agria_champs_' + uid; }
export function getProfileKey(uid: string) { return 'agria_user_profile_' + uid; }
export function getDiagKey(uid: string) { return 'agria_diagnostics_' + uid; }

export async function changePassword(_email: string, oldPwd: string, newPwd: string): Promise<void> {
  if (newPwd.length < 6) throw new Error('Mot de passe : 6 caracteres minimum.');
  const auth = getAuthInstance();
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Session introuvable.');
  const credential = EmailAuthProvider.credential(user.email, oldPwd);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPwd);
}

export async function updateEmail(_oldEmail: string, newEmail: string): Promise<void> {
  const auth = getAuthInstance();
  const user = auth.currentUser;
  if (!user) throw new Error('Session introuvable.');
  await firebaseUpdateEmail(user, newEmail.trim().toLowerCase());
  const key = 'agria_fb_user_' + user.uid;
  const existing = await dpLoad<{ uid: string; email: string; createdAt?: number; lastLogin?: number }>(key, { uid: user.uid, email: newEmail.trim().toLowerCase() });
  await dpSave(key, { ...existing, email: newEmail.trim().toLowerCase(), updatedAt: Date.now() });
}

export async function deleteAuthUser(): Promise<void> {
  const auth = getAuthInstance();
  const user = auth.currentUser;
  if (!user) throw new Error('Aucun utilisateur connecte.');
  await user.delete();
}

export function getDefaultVille(): string { return 'Paris'; }
