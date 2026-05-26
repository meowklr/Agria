import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove, Database } from 'firebase/database';
import '@firebase/component';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

function getReactNativePersistence(storage: typeof AsyncStorage) {
  const STORAGE_AVAILABLE_KEY = '__sak';

  const Persistence = class {
    type = 'LOCAL' as const;

    async _isAvailable(): Promise<boolean> {
      try {
        if (!storage) return false;
        await storage.setItem(STORAGE_AVAILABLE_KEY, '1');
        await storage.removeItem(STORAGE_AVAILABLE_KEY);
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: unknown): Promise<void> {
      return storage.setItem(key, JSON.stringify(value));
    }

    async _get<T>(key: string): Promise<T | null> {
      const json = await storage.getItem(key);
      return json ? (JSON.parse(json) as T) : null;
    }

    _remove(key: string): Promise<void> {
      return storage.removeItem(key);
    }

    _addListener(_key: string, _listener: (value: unknown) => void): void {}
    _removeListener(_key: string, _listener: (value: unknown) => void): void {}
  };

  return Persistence;
}

const FB = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
};

const configured = !!(FB.apiKey && FB.databaseURL);

let app: FirebaseApp | null = null;
let db: Database | null = null;
let auth: Auth | null = null;
let initAttempted = false;

function tryInitFirebase(): boolean {
  if (initAttempted) return !!auth;
  initAttempted = true;

  if (!configured) {
    if (__DEV__) console.warn('[Firebase] Configuration .env incomplete — missing keys:', {
      apiKey: !!FB.apiKey,
      databaseURL: !!FB.databaseURL,
      projectId: !!FB.projectId,
    });
    return false;
  }

  try {
    if (getApps().length > 0) {
      app = getApps()[0];
    } else {
      app = initializeApp(FB);
    }
    db = getDatabase(app);
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    return true;
  } catch (e) {
    console.warn('[Firebase] init failed, running offline:', (e as Error).message);
    app = null;
    db = null;
    auth = null;
    return false;
  }
}

let initTimer: ReturnType<typeof setTimeout> | null = null;

export function scheduleFirebaseInit(): void {
  if (auth) return;
  if (initTimer) return;
  initTimer = setTimeout(() => {
    initTimer = null;
    if (!auth) {
      initAttempted = false;
      tryInitFirebase();
    }
  }, 0);
}

export function getAuthInstance(): Auth {
  tryInitFirebase();
  if (!auth) throw new Error('Firebase non initialise — verifiez le fichier .env');
  return auth;
}

function safeKey(key: string): string { return key.replace(/[.#$\/\[\]]/g, '_'); }

function getDb(): Database | null {
  tryInitFirebase();
  return db;
}

export async function checkFirebaseConnection(): Promise<boolean> {
  const database = getDb();
  if (!database) return false;
  try {
    const connectedSnap = await get(ref(database, '.info/connected'));
    return connectedSnap.val() === true;
  } catch {
    return false;
  }
}

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
