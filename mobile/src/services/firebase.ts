import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove, Database } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FB = {
  apiKey: "REMOVED_FIREBASE_API_KEY",
  authDomain: "projet-etude-2026-256f3.firebaseapp.com",
  databaseURL: "https://projet-etude-2026-256f3-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "projet-etude-2026-256f3",
  storageBucket: "projet-etude-2026-256f3.firebasestorage.app",
  messagingSenderId: "733207661064",
  appId: "1:733207661064:web:d9256d9310d0b15e469fbd"
};

let app: FirebaseApp | null = null;
let db: Database | null = null;

function getApp(): FirebaseApp | null {
  if (app) return app;
  try { app = getApps().length === 0 ? initializeApp(FB) : getApps()[0]; return app; }
  catch { return null; }
}
function getDb(): Database | null {
  if (db) return db;
  const a = getApp(); if (!a) return null;
  db = getDatabase(a); return db;
}
function safeKey(key: string): string { return key.replace(/[.#$\/\[\]]/g, '_'); }

export async function dpLoad<T>(key: string, fallback: T): Promise<T> {
  try { const local = await AsyncStorage.getItem(key); if (local) return JSON.parse(local); } catch {}
  const database = getDb();
  if (database) {
    try { const snap = await get(ref(database, 'agriaData/' + safeKey(key))); if (snap.exists()) { const v = snap.val(); await AsyncStorage.setItem(key, JSON.stringify(v)); return v; } } catch {}
  }
  return fallback;
}
export async function dpSave<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  const database = getDb();
  if (database) { try { await set(ref(database, 'agriaData/' + safeKey(key)), value); } catch {} }
}
export async function dpRemove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
  const database = getDb();
  if (database) { try { await remove(ref(database, 'agriaData/' + safeKey(key))); } catch {} }
}
export async function dpLoadAll<T>(prefix: string): Promise<T[]> {
  const database = getDb();
  if (database) {
    try { const snap = await get(ref(database, 'agriaData')); if (snap.exists()) { const data = snap.val(); const r: T[] = []; const sp = safeKey(prefix); for (const k in data) { if (k.indexOf(sp) === 0 && data[k]) r.push(data[k]); } if (r.length > 0) return r; } } catch {}
  }
  const r: T[] = []; const keys = await AsyncStorage.getAllKeys();
  for (const k of keys) { if (k && k.indexOf(prefix) === 0) { try { const v = await AsyncStorage.getItem(k); if (v) r.push(JSON.parse(v)); } catch {} } }
  return r;
}

export async function dpLoadAllObjects<T>(prefix: string): Promise<Array<{ key: string; value: T }>> {
  const database = getDb();
  if (database) {
    try {
      const snap = await get(ref(database, 'agriaData'));
      if (snap.exists()) {
        const data = snap.val();
        const r: Array<{ key: string; value: T }> = [];
        const sp = safeKey(prefix);
        for (const k in data) {
          if (k.indexOf(sp) === 0 && data[k]) r.push({ key: k, value: data[k] });
        }
        if (r.length > 0) return r;
      }
    } catch {}
  }
  const r: Array<{ key: string; value: T }> = [];
  const keys = await AsyncStorage.getAllKeys();
  for (const k of keys) {
    if (k && k.indexOf(prefix) === 0) {
      try {
        const v = await AsyncStorage.getItem(k);
        if (v) r.push({ key: k, value: JSON.parse(v) });
      } catch {}
    }
  }
  return r;
}

export async function dpListKeys(prefix: string): Promise<{ key: string; value: string }[]> {
  const results: { key: string; value: string }[] = [];
  const seen = new Set<string>();

  const database = getDb();
  if (database) {
    try {
      const snap = await get(ref(database, 'agriaData'));
      if (snap.exists()) {
        const data = snap.val();
        const sp = safeKey(prefix);
        for (const rawKey in data) {
          if (rawKey.indexOf(sp) === 0 && data[rawKey]) {
            const val = JSON.stringify(data[rawKey]);
            results.push({ key: rawKey, value: val });
            seen.add(rawKey);
          }
        }
      }
    } catch {}
  }

  const keys = await AsyncStorage.getAllKeys();
  for (const k of keys) {
    if (k && k.indexOf(prefix) === 0 && !seen.has(safeKey(k))) {
      try {
        const v = await AsyncStorage.getItem(k);
        if (v) results.push({ key: k, value: v });
      } catch {}
    }
  }
  return results;
}

export async function dpGetAllKeys(prefix: string): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return keys.filter(k => k && typeof k === 'string' && k.indexOf(prefix) === 0) as string[];
}
