import { dpLoad, dpSave } from './firebase';
import { getChampsKey, getUserId, generateId } from './auth';

export interface Champ {
  id: string; nom: string; culture: string; typeSol: string; stade: string;
  surface: string; dateSemis: string; dureeJours?: number; notes?: string;
  polygonCoords?: number[][]; irrigation?: string;
}

export async function loadChamps(): Promise<Champ[]> {
  const uid = await getUserId(); return dpLoad<Champ[]>(getChampsKey(uid), []);
}
export async function saveChamps(champs: Champ[]): Promise<void> {
  const uid = await getUserId(); await dpSave(getChampsKey(uid), champs);
}
export async function addChamp(champ: Champ): Promise<Champ> {
  champ.id = champ.id || generateId(); const uid = await getUserId();
  const key = getChampsKey(uid); let champs: Champ[] = [];
  try { champs = await dpLoad<Champ[]>(key, []); } catch {}
  champs.push(champ); await dpSave(key, champs); return champ;
}
export async function updateChamp(id: string, data: Champ): Promise<void> {
  const uid = await getUserId(); const key = getChampsKey(uid);
  let champs: Champ[] = []; try { champs = await dpLoad<Champ[]>(key, []); } catch {}
  champs = champs.map(c => c.id === id ? data : c); await dpSave(key, champs);
}
export async function deleteChamp(id: string): Promise<Champ[]> {
  const uid = await getUserId(); const key = getChampsKey(uid);
  let champs: Champ[] = []; try { champs = await dpLoad<Champ[]>(key, []); } catch {}
  champs = champs.filter(c => c.id !== id); await dpSave(key, champs); return champs;
}
