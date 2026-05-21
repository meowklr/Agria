import AsyncStorage from '@react-native-async-storage/async-storage';

export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function uidKey(email: string): string { return 'agria_uid_' + email.trim().toLowerCase(); }
function credKey(email: string): string { return 'agria_cred_' + email.trim().toLowerCase(); }

export async function getSession() { try { const s = await AsyncStorage.getItem('agria_session'); return s ? JSON.parse(s) : null; } catch { return null; } }

export async function isLoggedIn(): Promise<boolean> { const s = await getSession(); return s !== null; }

export async function checkSessionValid(): Promise<boolean> {
  const s = await getSession();
  if (!s || !s.lastLogin) return false;
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (Date.now() - s.lastLogin > thirtyDays) { await logout(); return false; }
  const forced = await AsyncStorage.getItem('agria_force_logout_' + s.userId);
  if (forced === 'true') { await AsyncStorage.removeItem('agria_force_logout_' + s.userId); await logout(); return false; }
  await AsyncStorage.setItem('agria_session', JSON.stringify({ ...s, lastLogin: Date.now() }));
  return true;
}

export async function getSessionEmail(): Promise<string | null> {
  const s = await getSession();
  return s?.email || null;
}

export async function getUserId(): Promise<string> {
  const session = await getSession();
  if (!session) throw new Error('Session requise — veuillez vous connecter.');
  return session.userId;
}

export function getPrefsKey(uid: string) { return 'agria_prefs_' + uid; }
export function getChampsKey(uid: string) { return 'agria_champs_' + uid; }
export function getProfileKey(uid: string) { return 'agria_user_profile_' + uid; }
export function getDiagKey(uid: string) { return 'agria_diagnostics_' + uid; }

function hashPwd(pwd: string): string {
  let h = 0;
  for (let i = 0; i < pwd.length; i++) { h = ((h << 5) - h + pwd.charCodeAt(i)) | 0; }
  return 'h_' + Math.abs(h).toString(36);
}

export async function register(email: string, password: string): Promise<string> {
  if (!email.trim() || !password.trim()) throw new Error('Email et mot de passe requis.');
  const e = email.trim().toLowerCase();
  const existing = await AsyncStorage.getItem(credKey(e));
  if (existing) throw new Error('Un compte existe deja avec cet email.');

  const userId = generateId();
  const hashed = hashPwd(password);
  await AsyncStorage.setItem(credKey(e), JSON.stringify({ password: hashed, userId, pwd: password, lastLogin: Date.now() }));
  await AsyncStorage.setItem(uidKey(e), userId);
  await AsyncStorage.setItem('agria_session', JSON.stringify({ userId, email: e, lastLogin: Date.now() }));
  return userId;
}

export async function login(email: string, password: string): Promise<string> {
  if (!email.trim() || !password.trim()) throw new Error('Email et mot de passe requis.');
  const e = email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(credKey(e));
  if (!raw) throw new Error('Aucun compte trouve avec cet email.');

  const cred = JSON.parse(raw);
  const hashed = hashPwd(password);
  if (cred.password !== hashed) throw new Error('Mot de passe incorrect.');

  cred.lastLogin = Date.now();
  await AsyncStorage.setItem(credKey(e), JSON.stringify(cred));
  await AsyncStorage.setItem('agria_session', JSON.stringify({ userId: cred.userId, email: e, lastLogin: Date.now() }));
  return cred.userId;
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove(['agria_session', 'agria_user', 'agria_ville']);
}

export async function changePassword(email: string, oldPwd: string, newPwd: string): Promise<void> {
  const e = email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem(credKey(e));
  if (!raw) throw new Error('Compte introuvable.');
  const cred = JSON.parse(raw);
  const oldHash = hashPwd(oldPwd);
  if (cred.password !== oldHash) throw new Error('Ancien mot de passe incorrect.');
  if (newPwd.length < 4) throw new Error('Nouveau mot de passe : 4 caracteres minimum.');
  cred.password = hashPwd(newPwd);
  cred.pwd = newPwd;
  await AsyncStorage.setItem(credKey(e), JSON.stringify(cred));
}

export async function updateEmail(oldEmail: string, newEmail: string): Promise<void> {
  const oe = oldEmail.trim().toLowerCase();
  const ne = newEmail.trim().toLowerCase();
  if (oe === ne) return;
  const existing = await AsyncStorage.getItem(credKey(ne));
  if (existing) throw new Error('Cet email est deja utilise.');
  const credRaw = await AsyncStorage.getItem(credKey(oe));
  if (!credRaw) throw new Error('Compte introuvable.');
  const uidRaw = await AsyncStorage.getItem(uidKey(oe));
  await AsyncStorage.setItem(credKey(ne), credRaw);
  await AsyncStorage.setItem(uidKey(ne), uidRaw || credRaw);
  await AsyncStorage.removeItem(credKey(oe));
  await AsyncStorage.removeItem(uidKey(oe));
  const s = await getSession();
  if (s) await AsyncStorage.setItem('agria_session', JSON.stringify({ ...s, email: ne }));
}

export function getDefaultVille(): string { return 'Paris'; }
