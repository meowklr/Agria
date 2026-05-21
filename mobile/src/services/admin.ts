import AsyncStorage from '@react-native-async-storage/async-storage';
import { dpLoad, dpSave, dpRemove } from './firebase';
import type { Champ } from './champs';
import type { Profile } from '../hooks/useProfile';

export interface AdminUser {
  userId: string;
  email: string;
  profile: Profile | null;
  nbChamps: number;
  surfaceHa: number;
}

export interface AdminChamp {
  userId: string;
  email: string;
  champ: Champ;
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

    users.push({ userId: uid, email, profile, nbChamps: (champs || []).length, surfaceHa: surface });
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

export async function deleteAdminChamp(userId: string, champId: string): Promise<void> {
  const key = 'agria_champs_' + userId;
  const champs = await dpLoad<Champ[]>(key, []);
  const updated = champs.filter(c => c.id !== champId);
  await dpSave(key, updated);
}

export async function deleteUserData(userId: string): Promise<void> {
  await dpRemove('agria_champs_' + userId);
  await dpRemove('agria_user_profile_' + userId);
}
