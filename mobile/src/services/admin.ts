import AsyncStorage from '@react-native-async-storage/async-storage';
import { dpLoad, dpSave, dpRemove, dpListKeys } from './firebase';
import { generateId, deleteAuthUser } from './auth';
import type { Champ } from './champs';
import type { Profile } from '../hooks/useProfile';

export interface AdminUser {
  userId: string;
  email: string;
  profile: Profile | null;
  nbChamps: number;
  surfaceHa: number;
  lastLogin: number | null;
  createdAt: number | null;
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

export async function clearLogs(): Promise<void> {
  await dpRemove(LOG_KEY);
}

async function getEmailMap(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  const entries = await dpListKeys('agria_fb_user_');
  for (const e of entries) {
    try {
      const parsed = typeof e.value === 'string' ? JSON.parse(e.value) : e.value;
      if (parsed && typeof parsed === 'object' && parsed.uid && parsed.email) {
        map[parsed.uid] = parsed.email.trim().toLowerCase();
      }
    } catch {}
  }
  return map;
}

async function findUserEmail(userId: string): Promise<string | null> {
  const entries = await dpListKeys('agria_fb_user_');
  for (const e of entries) {
    try {
      const parsed = typeof e.value === 'string' ? JSON.parse(e.value) : e.value;
      if (parsed && typeof parsed === 'object' && parsed.uid === userId && parsed.email) {
        return parsed.email.trim().toLowerCase();
      }
    } catch {}
  }
  return null;
}

export async function loadAllUsers(): Promise<AdminUser[]> {
  const entries = await dpListKeys('agria_fb_user_');
  const users: AdminUser[] = [];

  for (const e of entries) {
    let userData: { uid: string; email: string; createdAt?: number; lastLogin?: number } | null = null;
    try {
      const parsed = typeof e.value === 'string' ? JSON.parse(e.value) : e.value;
      if (parsed && typeof parsed === 'object' && parsed.uid && parsed.email) {
        userData = parsed;
      }
    } catch {}
    if (!userData) continue;

    const userId = userData.uid;
    const email = userData.email.trim().toLowerCase();

    const profile = await dpLoad<Profile | null>('agria_user_profile_' + userId, null);
    const champs = await dpLoad<Champ[]>('agria_champs_' + userId, []);
    const surface = (champs || []).reduce((s, c) => s + (parseFloat(c.surface) || 0), 0);

    users.push({
      userId,
      email,
      profile,
      nbChamps: (champs || []).length,
      surfaceHa: surface,
      lastLogin: userData.lastLogin || null,
      createdAt: userData.createdAt || null,
    });
  }
  return users;
}

export async function loadAllChamps(): Promise<AdminChamp[]> {
  const emailMap = await getEmailMap();
  const champEntries = await dpListKeys('agria_champs_');
  const all: AdminChamp[] = [];

  for (const ck of champEntries) {
    const userId = ck.key.replace('agria_champs_', '');
    const champs: Champ[] = typeof ck.value === 'string' ? JSON.parse(ck.value) : ck.value;
    if (!Array.isArray(champs)) continue;
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

  await dpRemove('agria_fb_user_' + userId);
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

export async function forceLogoutUser(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  const entries = await dpListKeys('agria_fb_user_');
  for (const entry of entries) {
    try {
      const parsed = typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
      if (parsed && typeof parsed === 'object' && parsed.email === e && parsed.uid) {
        await dpSave('agria_force_logout_' + parsed.uid, 'true');
        await logAction('Deconnexion forcee', `${e} deconnecte`, 'danger');
        return;
      }
    } catch {}
  }
  throw new Error('Utilisateur introuvable.');
}

export async function checkForceLogout(userId: string): Promise<boolean> {
  const v = await dpLoad<string>('agria_force_logout_' + userId, '');
  return v === 'true';
}

export async function deleteOwnAccount(userId: string): Promise<void> {
  await dpRemove('agria_fb_user_' + userId);
  await dpRemove('agria_champs_' + userId);
  await dpRemove('agria_user_profile_' + userId);
  await dpRemove('agria_prefs_' + userId);
  await dpRemove('agria_diagnostics_' + userId);
  await dpRemove('agria_force_logout_' + userId);
  await dpRemove('agria_session');
  await logAction('Suppression compte', `Compte ${userId.slice(0, 10)}... supprime par le proprietaire`, 'danger');
  await deleteAuthUser();
}

export async function listOrphanData(): Promise<{ type: string; key: string; detail: string }[]> {
  const fbEntries = await dpListKeys('agria_fb_user_');
  const validUids: Set<string> = new Set();
  for (const e of fbEntries) {
    try {
      const p = typeof e.value === 'string' ? JSON.parse(e.value) : e.value;
      if (p && typeof p === 'object' && p.uid) validUids.add(p.uid);
    } catch {}
  }

  const orphans: { type: string; key: string; detail: string }[] = [];

  const categories: [string, string][] = [
    ['agria_champs_', 'Parcelle'],
    ['agria_user_profile_', 'Profil'],
    ['agria_prefs_', 'Preferences'],
    ['agria_diagnostics_', 'Diagnostics'],
  ];

  for (const [prefix, label] of categories) {
    const entries = await dpListKeys(prefix);
    for (const ck of entries) {
      const uid = ck.key.replace(prefix, '');
      if (!validUids.has(uid) && uid.length > 0 && uid !== 'logs') {
        let detail = `uid: ${uid.slice(0, 10)}...`;
        try {
          const v = typeof ck.value === 'string' ? JSON.parse(ck.value) : ck.value;
          if (Array.isArray(v)) {
            detail = `${v.length} elements — uid: ${uid.slice(0, 10)}...`;
          } else if (v && typeof v === 'object') {
            detail = `${v?.prenom || ''} ${v?.nom || ''} — uid: ${uid.slice(0, 10)}...`.trim() || detail;
          }
        } catch {}
        orphans.push({ type: label, key: ck.key, detail });
      }
    }
  }

  return orphans;
}

export async function cleanOrphanData(): Promise<{ removed: string[] }> {
  const fbEntries = await dpListKeys('agria_fb_user_');
  const validUids: Set<string> = new Set();
  for (const e of fbEntries) {
    try {
      const p = typeof e.value === 'string' ? JSON.parse(e.value) : e.value;
      if (p && typeof p === 'object' && p.uid) validUids.add(p.uid);
    } catch {}
  }

  const removed: string[] = [];

  const prefixes = ['agria_champs_', 'agria_user_profile_', 'agria_prefs_', 'agria_diagnostics_'];
  for (const prefix of prefixes) {
    const entries = await dpListKeys(prefix);
    for (const ck of entries) {
      const uid = ck.key.replace(prefix, '');
      if (!validUids.has(uid) && uid.length > 0 && uid !== 'logs') {
        await dpRemove(ck.key);
        removed.push(prefix.replace('agria_', '').replace('_', ' ') + ' de ' + uid.slice(0, 8) + '...');
      }
    }
  }

  if (removed.length > 0) await logAction('Nettoyage BDD', `${removed.length} donnees orphelines supprimees`, 'success');
  return { removed };
}

export async function purgeInactiveUsers(): Promise<{ count: number }> {
  const fbEntries = await dpListKeys('agria_fb_user_');
  const sixMonths = 180 * 24 * 60 * 60 * 1000;
  let count = 0;

  for (const e of fbEntries) {
    let userData: { uid: string; email: string; lastLogin?: number } | null = null;
    try {
      const p = typeof e.value === 'string' ? JSON.parse(e.value) : e.value;
      if (p && typeof p === 'object' && p.uid && p.email) userData = p;
    } catch {}
    if (!userData?.uid) continue;

    const lastActivity = userData.lastLogin || null;
    if (!lastActivity) continue;
    if (Date.now() - lastActivity > sixMonths) {
      await deleteUserData(userData.uid);
      count++;
    }
  }

  if (count > 0) await logAction('Purge comptes', `${count} comptes inactifs (>6 mois) supprimes`, 'danger');
  return { count };
}
