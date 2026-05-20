import AsyncStorage from '@react-native-async-storage/async-storage';

export function generateId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

export async function getSession() { try { const s = await AsyncStorage.getItem('agria_session'); return s ? JSON.parse(s) : null; } catch { return null; } }

export async function getUserId(): Promise<string> {
  let session = await getSession();
  if (!session) { session = { userId: generateId(), email: (await AsyncStorage.getItem('agria_user')) || 'invite@agria.fr' }; await AsyncStorage.setItem('agria_session', JSON.stringify(session)); }
  return session.userId;
}
export function getPrefsKey(uid: string) { return 'agria_prefs_' + uid; }
export function getChampsKey(uid: string) { return 'agria_champs_' + uid; }
export function getProfileKey(uid: string) { return 'agria_user_profile_' + uid; }
export function getDiagKey(uid: string) { return 'agria_diagnostics_' + uid; }

export async function login(email: string): Promise<string> {
  const userId = generateId(); await AsyncStorage.setItem('agria_session', JSON.stringify({ userId, email })); await AsyncStorage.setItem('agria_user', email); return userId;
}
export async function logout(): Promise<void> { await AsyncStorage.multiRemove(['agria_session', 'agria_user', 'agria_ville']); }
export function getDefaultVille(): string { return 'Paris'; }
