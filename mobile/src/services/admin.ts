import AsyncStorage from '@react-native-async-storage/async-storage';
import { dpLoad, dpSave, dpRemove } from './firebase';
import { generateId } from './auth';
import type { Champ } from './champs';
import type { Profile } from '../hooks/useProfile';

export interface AdminUser {
  userId: string;
  email: string;
  profile: Profile | null;
  nbChamps: number;
  surfaceHa: number;
  lastLogin: number | null;
  password: string | null;
}

export interface AdminChamp {
  userId: string;
  email: string;
  champ: Champ;
}

export interface AdminLog {
  id: string;
  date: number;
  action: string;
  detail: string;
  type: 'info' | 'success' | 'danger';
}

const LOG_KEY = 'agria_admin_logs';

async function logAction(action: string, detail: string, type: AdminLog['type'] = 'info') {
  const existing = await dpLoad<AdminLog[]>(LOG_KEY, []);
  existing.unshift({ id: generateId(), date: Date.now(), action, detail, type });
  if (existing.length > 200) existing.length = 200;
  await dpSave(LOG_KEY, existing);
}

export async function loadLogs(): Promise<AdminLog[]> {
  return dpLoad<AdminLog[]>(LOG_KEY, []);
}

export async function getUserPassword(email: string): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem('agria_cred_' + email.trim().toLowerCase());
    if (!raw) return null;
    return JSON.parse(raw).pwd || null;
  } catch { return null; }
}

export async function forceLogoutUser(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  const raw = await AsyncStorage.getItem('agria_cred_' + e);
  if (raw) {
    const cred = JSON.parse(raw);
    await AsyncStorage.setItem('agria_force_logout_' + cred.userId, 'true');
    await logAction('Deconnexion forcee', `${e} deconnecte`, 'danger');
  }
}

export async function checkForceLogout(userId: string): Promise<boolean> {
  const v = await AsyncStorage.getItem('agria_force_logout_' + userId);
  return v === 'true';
}

export async function clearForceLogout(userId: string): Promise<void> {
  await AsyncStorage.removeItem('agria_force_logout_' + userId);
}

export async function deleteOwnAccount(userId: string): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const uidKeys = keys.filter(k => k.startsWith('agria_uid_'));
  for (const k of uidKeys) {
    const uid = await AsyncStorage.getItem(k);
    if (uid === userId) {
      await dpRemove(k);
      const email = k.replace('agria_uid_', '');
      await dpRemove('agria_cred_' + email);
      break;
    }
  }

  await dpRemove('agria_champs_' + userId);
  await dpRemove('agria_user_profile_' + userId);
  await dpRemove('agria_prefs_' + userId);
  await dpRemove('agria_diagnostics_' + userId);
  await dpRemove('agria_force_logout_' + userId);
  await dpRemove('agria_session');

  await logAction('Suppression compte', `Compte ${userId.slice(0, 10)}... supprime par le proprietaire`, 'danger');
}

export async function clearLogs(): Promise<void> {
  await dpRemove(LOG_KEY);
}

export async function loadAllUsers(): Promise<AdminUser[]> {
  const keys = await AsyncStorage.getAllKeys();
  const uidKeys = keys.filter(k => k.startsWith('agria_uid_'));
  const users: AdminUser[] = [];

  for (const k of uidKeys) {
    const email = k.replace('agria_uid_', '');
    const uid = await AsyncStorage.getItem(k);
    if (!uid) continue;

    const profile = await dpLoad<Profile | null>('agria_user_profile_' + uid, null);
    const champs = await dpLoad<Champ[]>('agria_champs_' + uid, []);
    const surface = (champs || []).reduce((s, c) => s + (parseFloat(c.surface) || 0), 0);

    let lastLogin: number | null = null;
    let password: string | null = null;
    try {
      const credRaw = await AsyncStorage.getItem('agria_cred_' + email);
      if (credRaw) { const c = JSON.parse(credRaw); lastLogin = c.lastLogin || null; password = c.pwd || null; }
    } catch {}

    users.push({ userId: uid, email, profile, nbChamps: (champs || []).length, surfaceHa: surface, lastLogin, password });
  }
  return users;
}

export async function loadAllChamps(): Promise<AdminChamp[]> {
  const keys = await AsyncStorage.getAllKeys();
  const champKeys = keys.filter(k => k.startsWith('agria_champs_'));
  const uidKeys = keys.filter(k => k.startsWith('agria_uid_'));
  const emailMap: Record<string, string> = {};

  for (const k of uidKeys) {
    const email = k.replace('agria_uid_', '');
    const uid = await AsyncStorage.getItem(k);
    if (uid) emailMap[uid] = email;
  }

  const all: AdminChamp[] = [];
  for (const ck of champKeys) {
    const userId = ck.replace('agria_champs_', '');
    const champs = await dpLoad<Champ[]>(ck, []);
    for (const c of champs) {
      all.push({ userId, email: emailMap[userId] || userId, champ: c });
    }
  }
  return all;
}

export async function loadUserChamps(userId: string): Promise<Champ[]> {
  return dpLoad<Champ[]>('agria_champs_' + userId, []);
}

export async function deleteAdminChamp(userId: string, champId: string): Promise<void> {
  const key = 'agria_champs_' + userId;
  const champs = await dpLoad<Champ[]>(key, []);
  const target = champs.find(c => c.id === champId);
  const updated = champs.filter(c => c.id !== champId);
  await dpSave(key, updated);
  if (target) await logAction('Suppression parcelle', `"${target.nom}" (${target.surface} ha) de ${userId}`, 'danger');
}

export async function updateAdminChamp(userId: string, champId: string, data: Partial<Champ>): Promise<void> {
  const key = 'agria_champs_' + userId;
  const champs = await dpLoad<Champ[]>(key, []);
  const updated = champs.map(c => c.id === champId ? { ...c, ...data } : c);
  await dpSave(key, updated);
  await logAction('Edition parcelle', `"${data.nom || champId}" modifiee`, 'info');
}

export async function createAdminChamp(userId: string, champ: Champ): Promise<void> {
  champ.id = champ.id || generateId();
  const key = 'agria_champs_' + userId;
  const champs = await dpLoad<Champ[]>(key, []);
  champs.push(champ);
  await dpSave(key, champs);
  await logAction('Creation parcelle', `"${champ.nom}" (${champ.surface} ha) pour ${userId}`, 'success');
}

export async function deleteUserData(userId: string): Promise<void> {
  const profile = await dpLoad<Profile | null>('agria_user_profile_' + userId, null);
  const champs = await dpLoad<Champ[]>('agria_champs_' + userId, []);

  const keys = await AsyncStorage.getAllKeys();
  const uidKeys = keys.filter(k => k.startsWith('agria_uid_'));
  for (const k of uidKeys) {
    const uid = await AsyncStorage.getItem(k);
    if (uid === userId) {
      const email = k.replace('agria_uid_', '');
      await dpRemove(k);
      await dpRemove('agria_cred_' + email);
      break;
    }
  }

  await dpRemove('agria_champs_' + userId);
  await dpRemove('agria_user_profile_' + userId);
  await dpRemove('agria_prefs_' + userId);
  await dpRemove('agria_diagnostics_' + userId);
  await dpRemove('agria_force_logout_' + userId);

  const session = await AsyncStorage.getItem('agria_session');
  if (session) {
    try {
      const s = JSON.parse(session);
      if (s.userId === userId) await AsyncStorage.removeItem('agria_session');
    } catch {}
  }

  await logAction('Suppression utilisateur', `${profile?.prenom || ''} ${profile?.nom || ''} (${champs.length} parcelles)`, 'danger');
}

export async function listOrphanData(): Promise<{ type: string; key: string; detail: string }[]> {
  const keys = await AsyncStorage.getAllKeys();
  const uidKeys = keys.filter(k => k.startsWith('agria_uid_'));
  const validUids: Set<string> = new Set();
  for (const k of uidKeys) {
    const uid = await AsyncStorage.getItem(k);
    if (uid) validUids.add(uid);
  }

  const orphans: { type: string; key: string; detail: string }[] = [];

  const champKeys = keys.filter(k => k.startsWith('agria_champs_'));
  for (const ck of champKeys) {
    const uid = ck.replace('agria_champs_', '');
    if (!validUids.has(uid)) {
      const champs = await dpLoad<Champ[]>(ck, []);
      for (const c of champs) orphans.push({ type: 'Parcelle', key: ck, detail: `"${c.nom || '?'}" (${c.surface} ha) — uid: ${uid.slice(0, 10)}...` });
    }
  }

  const profileKeys = keys.filter(k => k.startsWith('agria_user_profile_'));
  for (const pk of profileKeys) {
    const uid = pk.replace('agria_user_profile_', '');
    if (!validUids.has(uid)) {
      const p = await dpLoad<Profile | null>(pk, null);
      orphans.push({ type: 'Profil', key: pk, detail: `${p?.prenom || ''} ${p?.nom || ''} — uid: ${uid.slice(0, 10)}...` });
    }
  }

  const prefsKeys = keys.filter(k => k.startsWith('agria_prefs_'));
  for (const pk of prefsKeys) {
    const uid = pk.replace('agria_prefs_', '');
    if (!validUids.has(uid)) {
      orphans.push({ type: 'Preferences', key: pk, detail: `uid: ${uid.slice(0, 10)}...` });
    }
  }

  const diagKeys = keys.filter(k => k.startsWith('agria_diagnostics_'));
  for (const dk of diagKeys) {
    const uid = dk.replace('agria_diagnostics_', '');
    if (!validUids.has(uid)) {
      orphans.push({ type: 'Diagnostics', key: dk, detail: `uid: ${uid.slice(0, 10)}...` });
    }
  }

  return orphans;
}

export async function cleanOrphanData(): Promise<{ removed: string[] }> {
  const keys = await AsyncStorage.getAllKeys();
  const uidKeys = keys.filter(k => k.startsWith('agria_uid_'));
  const validUids: Set<string> = new Set();

  for (const k of uidKeys) {
    const uid = await AsyncStorage.getItem(k);
    if (uid) validUids.add(uid);
  }

  const removed: string[] = [];
  const champKeys = keys.filter(k => k.startsWith('agria_champs_'));
  for (const ck of champKeys) {
    const uid = ck.replace('agria_champs_', '');
    if (!validUids.has(uid)) {
      await dpRemove(ck);
      removed.push('Parcelles de ' + uid.slice(0, 8) + '...');
    }
  }

  const profileKeys = keys.filter(k => k.startsWith('agria_user_profile_'));
  for (const pk of profileKeys) {
    const uid = pk.replace('agria_user_profile_', '');
    if (!validUids.has(uid)) {
      await dpRemove(pk);
      removed.push('Profil de ' + uid.slice(0, 8) + '...');
    }
  }

  if (removed.length > 0) await logAction('Nettoyage BDD', `${removed.length} donnees orphelines supprimees`, 'success');
  return { removed };
}

export async function purgeInactiveUsers(): Promise<{ count: number }> {
  const keys = await AsyncStorage.getAllKeys();
  const uidKeys = keys.filter(k => k.startsWith('agria_uid_'));
  const sixMonths = 180 * 24 * 60 * 60 * 1000;
  let count = 0;

  for (const k of uidKeys) {
    const email = k.replace('agria_uid_', '');
    const uid = await AsyncStorage.getItem(k);
    if (!uid) continue;

    const sessionRaw = await AsyncStorage.getItem('agria_session');
    let lastActivity: number | null = null;

    const credRaw = await AsyncStorage.getItem('agria_cred_' + email);
    if (credRaw) {
      try {
        const cred = JSON.parse(credRaw);
        if (cred.lastLogin) lastActivity = cred.lastLogin;
      } catch {}
    }

    if (!lastActivity) {
      const profileKeys = keys.filter(pk => pk === 'agria_user_profile_' + uid);
      if (profileKeys.length === 0) continue;
      lastActivity = 0;
    }

    if (lastActivity && (Date.now() - lastActivity > sixMonths)) {
      await deleteUserData(uid);
      await dpRemove('agria_uid_' + email);
      await dpRemove('agria_cred_' + email);
      await dpRemove('agria_force_logout_' + uid);
      count++;
    }
  }

  if (count > 0) await logAction('Purge comptes', `${count} comptes inactifs (>6 mois) supprimes`, 'danger');
  return { count };
}
