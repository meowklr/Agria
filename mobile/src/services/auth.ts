import AsyncStorage from '@react-native-async-storage/async-storage';

export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function uidKey(email: string): string { return 'agria_uid_' + email.trim().toLowerCase(); }
function credKey(email: string): string { return 'agria_cred_' + email.trim().toLowerCase(); }

export async function getSession() { try { const s = await AsyncStorage.getItem('agria_session'); return s ? JSON.parse(s) : null; } catch { return null; } }

export async function isLoggedIn(): Promise<boolean> { const s = await getSession(); return s !== null; }

export async function getUserId(): Promise<string> {
  const session = await getSession();
  if (!session) throw new Error('Session requise — veuillez vous connecter.');
  return session.userId;
}

export function getPrefsKey(uid: string) { return 'agria_prefs_' + uid; }
export function getChampsKey(uid: string) { return 'agria_champs_' + uid; }
export function getProfileKey(uid: string) { return 'agria_user_profile_' + uid; }
export function getDiagKey(uid: string) { return 'agria_diagnostics_' + uid; }

async function hashPwd(pwd: string): Promise<string> {
  const enc = new TextEncoder().encode(pwd);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function register(email: string, password: string): Promise<string> {
  if (!email.trim() || !password.trim()) throw new Error('Email et mot de passe requis.');
  const e = email.trim().toLowerCase();
  const existing = await AsyncStorage.getItem(credKey(e));
  if (existing) throw new Error('Un compte existe deja avec cet email.');

  const userId = generateId();
  const hashed = await hashPwd(password);
  await AsyncStorage.setItem(credKey(e), JSON.stringify({ password: hashed, userId, pwd: password }));
  await AsyncStorage.setItem(uidKey(e), userId);
  await AsyncStorage.setItem('agria_session', JSON.stringify({ userId, email: e }));
  return userId;
}

export async function login(email: string, password: string): Promise<string> {
  if (!email.trim() || !password.trim()) throw new Error('Email et mot de passe requis.');
  const e = email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(credKey(e));
  if (!raw) throw new Error('Aucun compte trouve avec cet email.');

  const cred = JSON.parse(raw);
  const hashed = await hashPwd(password);
  if (cred.password !== hashed) throw new Error('Mot de passe incorrect.');

  await AsyncStorage.setItem('agria_session', JSON.stringify({ userId: cred.userId, email: e }));
  return cred.userId;
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove(['agria_session', 'agria_user', 'agria_ville']);
}

export function getDefaultVille(): string { return 'Paris'; }
