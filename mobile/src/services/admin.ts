import AsyncStorage from '@react-native-async-storage/async-storage';
import { dpLoad, dpSave, dpRemove, dpListKeys } from './firebase';
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

export async function clearLogs(): Promise<void> {
  await dpRemove(LOG_KEY);
}

async function getEmailMap(): Promise<Record<string, string>> {
  const map: Record<string, string> = {};
  const entries = await dpListKeys('agria_uid_');
  for (const e of entries) {
    try {
      const parsed = JSON.parse(e.value);
      if (parsed && typeof parsed === 'object' && parsed.userId && parsed.email) {
        map[parsed.userId] = parsed.email.trim().toLowerCase();
      } else {
        const raw = unsafeEmail(e.key);
        if (raw && raw.includes('@')) map[e.value] = raw;
      }
    } catch {
      const raw = unsafeEmail(e.key);
      if (raw && raw.includes('@')) map[e.value] = raw;
    }
  }
  return map;
}

async function findUserEmail(userId: string): Promise<string | null> {
  const entries = await dpListKeys('agria_uid_');
  for (const e of entries) {
    try {
      const parsed = JSON.parse(e.value);
      if (parsed && typeof parsed === 'object' && parsed.userId === userId) {
        return parsed.email?.trim().toLowerCase() || null;
      }
    } catch {}
    if (e.value === userId) {
      const raw = unsafeEmail(e.key);
      if (raw && raw.includes('@')) return raw;
    }
  }
  return null;
}

function unsafeEmail(key: string): string {
  return key.replace('agria_uid_', '')
    .replace(/_com$/i, '.com').replace(/_fr$/i, '.fr')
    .replace(/_net$/i, '.net').replace(/_org$/i, '.org')
    .replace(/_io$/i, '.io').replace(/_dev$/i, '.dev');
}

export async function loadAllUsers(): Promise<AdminUser[]> {
  const uidEntries = await dpListKeys('agria_uid_');
  const users: AdminUser[] = [];

  for (const e of uidEntries) {
    let userId: string | null = null;
    let email: string | null = null;

    try {
      const parsed = JSON.parse(e.value);
      if (parsed && typeof parsed === 'object' && parsed.userId && parsed.email) {
        userId = parsed.userId;
        email = parsed.email.trim().toLowerCase();
      } else {
        userId = parsed;
        email = null;
      }
    } catch {
      userId = e.value;
      email = null;
    }

    if (!userId) continue;
    if (!email) {
      const raw = unsafeEmail(e.key);
      if (raw && raw.includes('@')) email = raw;
    }
    if (!email) continue;

    const profile = await dpLoad<Profile | null>('agria_user_profile_' + userId, null);
    const champs = await dpLoad<Champ[]>('agria_champs_' + userId, []);
    const surface = (champs || []).reduce((s, c) => s + (parseFloat(c.surface) || 0), 0);

    let lastLogin: number | null = null;
    let password: string | null = null;
    const credKey = 'agria_cred_' + email;
    const cred = await dpLoad<any>(credKey, null);
    if (cred) { lastLogin = cred.lastLogin || null; password = cred.pwd || null; }

    users.push({ userId, email, profile, nbChamps: (champs || []).length, surfaceHa: surface, lastLogin, password });
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

  const email = await findUserEmail(userId);
  if (email) {
    await dpRemove('agria_uid_' + email);
    await dpRemove('agria_cred_' + email);
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

export async function getUserPassword(email: string): Promise<string | null> {
  const cred = await dpLoad<any>('agria_cred_' + email.trim().toLowerCase(), null);
  return cred?.pwd || null;
}

export async function forceLogoutUser(email: string): Promise<void> {
  const e = email.trim().toLowerCase();
  const cred = await dpLoad<any>('agria_cred_' + e, null);
  if (cred?.userId) {
    await dpSave('agria_force_logout_' + cred.userId, 'true');
    await logAction('Deconnexion forcee', `${e} deconnecte`, 'danger');
  }
}

export async function checkForceLogout(userId: string): Promise<boolean> {
  const v = await dpLoad<string>('agria_force_logout_' + userId, '');
  return v === 'true';
}

export async function deleteOwnAccount(userId: string): Promise<void> {
  const email = await findUserEmail(userId);
  if (email) {
    await dpRemove('agria_uid_' + email);
    await dpRemove('agria_cred_' + email);
  }

  await dpRemove('agria_champs_' + userId);
  await dpRemove('agria_user_profile_' + userId);
  await dpRemove('agria_prefs_' + userId);
  await dpRemove('agria_diagnostics_' + userId);
  await dpRemove('agria_force_logout_' + userId);
  await dpRemove('agria_session');

  await logAction('Suppression compte', `Compte ${userId.slice(0, 10)}... supprime par le proprietaire`, 'danger');
}

export async function listOrphanData(): Promise<{ type: string; key: string; detail: string }[]> {
  const uidEntries = await dpListKeys('agria_uid_');
  const validUids: Set<string> = new Set();
  for (const e of uidEntries) {
    try { const p = JSON.parse(e.value); if (p && typeof p === 'object' && p.userId) validUids.add(p.userId); } catch { if (e.value) validUids.add(e.value); }
  }

  const orphans: { type: string; key: string; detail: string }[] = [];

  const champEntries = await dpListKeys('agria_champs_');
  for (const ck of champEntries) {
    const uid = ck.key.replace('agria_champs_', '');
    if (!validUids.has(uid)) {
      const champs: Champ[] = typeof ck.value === 'string' ? JSON.parse(ck.value) : ck.value;
      if (Array.isArray(champs)) {
        for (const c of champs) orphans.push({ type: 'Parcelle', key: ck.key, detail: `"${c.nom || '?'}" (${c.surface} ha) — uid: ${uid.slice(0, 10)}...` });
      }
    }
  }

  const profileEntries = await dpListKeys('agria_user_profile_');
  for (const pk of profileEntries) {
    const uid = pk.key.replace('agria_user_profile_', '');
    if (!validUids.has(uid)) {
      const p: Profile | null = typeof pk.value === 'string' ? JSON.parse(pk.value) : pk.value;
      orphans.push({ type: 'Profil', key: pk.key, detail: `${p?.prenom || ''} ${p?.nom || ''} — uid: ${uid.slice(0, 10)}...` });
    }
  }

  const prefsEntries = await dpListKeys('agria_prefs_');
  for (const pk of prefsEntries) {
    const uid = pk.key.replace('agria_prefs_', '');
    if (!validUids.has(uid)) orphans.push({ type: 'Preferences', key: pk.key, detail: `uid: ${uid.slice(0, 10)}...` });
  }

  const diagEntries = await dpListKeys('agria_diagnostics_');
  for (const dk of diagEntries) {
    const uid = dk.key.replace('agria_diagnostics_', '');
    if (!validUids.has(uid)) orphans.push({ type: 'Diagnostics', key: dk.key, detail: `uid: ${uid.slice(0, 10)}...` });
  }

  return orphans;
}

export async function cleanOrphanData(): Promise<{ removed: string[] }> {
  const uidEntries = await dpListKeys('agria_uid_');
  const validUids: Set<string> = new Set();
  for (const e of uidEntries) {
    try { const p = JSON.parse(e.value); if (p && typeof p === 'object' && p.userId) validUids.add(p.userId); } catch { if (e.value) validUids.add(e.value); }
  }

  const removed: string[] = [];

  const champEntries = await dpListKeys('agria_champs_');
  for (const ck of champEntries) {
    const uid = ck.key.replace('agria_champs_', '');
    if (!validUids.has(uid)) { await dpRemove(ck.key); removed.push('Parcelles de ' + uid.slice(0, 8) + '...'); }
  }

  const profileEntries = await dpListKeys('agria_user_profile_');
  for (const pk of profileEntries) {
    const uid = pk.key.replace('agria_user_profile_', '');
    if (!validUids.has(uid)) { await dpRemove(pk.key); removed.push('Profil de ' + uid.slice(0, 8) + '...'); }
  }

  const prefsEntries = await dpListKeys('agria_prefs_');
  for (const pk of prefsEntries) {
    const uid = pk.key.replace('agria_prefs_', '');
    if (!validUids.has(uid)) { await dpRemove(pk.key); removed.push('Preferences de ' + uid.slice(0, 8) + '...'); }
  }

  const diagEntries = await dpListKeys('agria_diagnostics_');
  for (const dk of diagEntries) {
    const uid = dk.key.replace('agria_diagnostics_', '');
    if (!validUids.has(uid)) { await dpRemove(dk.key); removed.push('Diagnostics de ' + uid.slice(0, 8) + '...'); }
  }

  if (removed.length > 0) await logAction('Nettoyage BDD', `${removed.length} donnees orphelines supprimees`, 'success');
  return { removed };
}

export async function purgeInactiveUsers(): Promise<{ count: number }> {
  const uidEntries = await dpListKeys('agria_uid_');
  const sixMonths = 180 * 24 * 60 * 60 * 1000;
  let count = 0;

  for (const e of uidEntries) {
    let userId: string | null = null;
    let email: string | null = null;

    try {
      const p = JSON.parse(e.value);
      if (p && typeof p === 'object' && p.userId && p.email) { userId = p.userId; email = p.email; }
    } catch { userId = e.value; }

    if (!userId) continue;
    if (!email) { const raw = unsafeEmail(e.key); if (raw && raw.includes('@')) email = raw; }
    if (!email) continue;

    const cred = await dpLoad<any>('agria_cred_' + email, null);
    const lastActivity = cred?.lastLogin || null;

    if (!lastActivity) {
      const profile = await dpLoad<any>('agria_user_profile_' + userId, null);
      if (!profile) continue;
      if (Date.now() - sixMonths > 0) { await deleteUserData(userId); count++; }
      continue;
    }

    if (Date.now() - lastActivity > sixMonths) {
      await deleteUserData(userId);
      count++;
    }
  }

  if (count > 0) await logAction('Purge comptes', `${count} comptes inactifs (>6 mois) supprimes`, 'danger');
  return { count };
}
