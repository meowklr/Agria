import { dpLoadAll, dpLoadAllObjects, dpSave, dpRemove } from './firebase';
import { getUserId } from './auth';

export type AlertLevel = 'danger' | 'warning' | 'info' | 'success' | string;

export interface AlertPayload {
  id?: string;
  date?: string;
  city?: string;
  title?: string;
  body?: string;
  alert?: {
    level?: AlertLevel;
    label?: string;
    reason?: string;
    message?: string;
  };
  weather?: Record<string, any>;
  forecast?: Record<string, any>[];
  fields?: Record<string, any>[];
  risk?: Record<string, any>;
  [key: string]: any;
}

export interface AlertItem {
  id: string;
  date: string;
  title: string;
  body: string;
  level: AlertLevel;
  city?: string;
  payload: AlertPayload;
}

const MAX_ALERTS = 3;
const DEDUP_WINDOW_MS = 4 * 60 * 60 * 1000;

async function alertPrefix(): Promise<string> {
  const uid = await getUserId();
  return `agria_alert_make_${uid}_`;
}

function formatId(payload: AlertPayload): string {
  if (payload.id) return payload.id;
  const date = (payload.date || '').slice(0, 10);
  const city = (payload.city || 'unknown').replace(/[^a-z0-9_-]+/gi, '_').slice(0, 30);
  const level = payload.alert?.level || 'info';
  return `a_${date}_${city}_${level}`;
}

function normalizePayload(payload: AlertPayload): AlertItem {
  const date = payload.date || new Date().toISOString();
  const id = payload.id || formatId(payload);
  const title = payload.title || (payload.alert?.label ? `Alerte météo — ${payload.alert.label}` : `Alerte météo ${payload.city ? 'pour ' + payload.city : ''}`);
  const body = payload.body || payload.alert?.message || payload.alert?.reason || 'Nouvelle alerte météo reçue.';
  const level = payload.alert?.level || 'info';
  return { id, date, title, body, level, city: payload.city, payload: { ...payload, id, date } };
}

export async function loadAlerts(): Promise<AlertItem[]> {
  const prefix = await alertPrefix();
  const rawAlerts = await dpLoadAll<AlertPayload>(prefix);
  const items = rawAlerts.map(normalizePayload);
  const { kept, removed } = dedupByCity(items);
  const sorted = kept.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const beyondLimit = sorted.slice(MAX_ALERTS);
  const toRemove = [...removed, ...beyondLimit];
  if (toRemove.length > 0) {
    await Promise.all(toRemove.map(a => dpRemove(prefix + a.id)));
  }
  return sorted.slice(0, MAX_ALERTS);
}

function dedupByCity(items: AlertItem[]): { kept: AlertItem[]; removed: AlertItem[] } {
  const byCity = new Map<string, AlertItem[]>();
  for (const item of items) {
    const key = (item.city || '').toLowerCase().trim();
    if (!byCity.has(key)) byCity.set(key, []);
    byCity.get(key)!.push(item);
  }
  const removed: AlertItem[] = [];
  for (const [, cityAlerts] of byCity) {
    cityAlerts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const newest = new Date(cityAlerts[0].date || '').getTime();
    for (let i = 1; i < cityAlerts.length; i++) {
      const t = new Date(cityAlerts[i].date || '').getTime();
      if (newest - t < DEDUP_WINDOW_MS) {
        removed.push(cityAlerts[i]);
      }
    }
  }
  const removedIds = new Set(removed.map(r => r.id));
  return { kept: items.filter(i => !removedIds.has(i.id)), removed };
}

export async function addAlert(payload: AlertPayload): Promise<AlertItem> {
  const item = normalizePayload(payload);
  const prefix = await alertPrefix();
  await dpSave(prefix + item.id, item.payload);

  const allAlerts = await dpLoadAllObjects<AlertPayload>(prefix);
  const normalized = allAlerts.map(({ key, value }) => ({ key, item: normalizePayload(value) }));
  const extra = normalized
    .sort((a, b) => (b.item.date || '').localeCompare(a.item.date || ''))
    .slice(MAX_ALERTS);

  await Promise.all(extra.map(({ key }) => dpRemove(key)));
  return item;
}

export async function saveDirectAlert(payload: AlertPayload): Promise<void> {
  const item = normalizePayload(payload);
  const prefix = await alertPrefix();
  await dpSave(prefix + item.id, item.payload);
}

export async function dismissAlert(id: string): Promise<void> {
  const prefix = await alertPrefix();
  await dpRemove(prefix + id);
}

export async function dismissAlertsForOtherCities(keepCity: string): Promise<void> {
  const prefix = await alertPrefix();
  const raw = await dpLoadAllObjects<AlertPayload>(prefix);
  const toRemove = raw
    .filter(({ value }) => (value.city || '').toLowerCase() !== keepCity.toLowerCase())
    .map(({ key }) => key);
  await Promise.all(toRemove.map(k => dpRemove(k)));
}
