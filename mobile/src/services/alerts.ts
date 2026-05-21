import { dpLoadAll, dpLoadAllObjects, dpSave, dpRemove } from './firebase';

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

const ALERT_KEY_PREFIX = 'agria_alert_';
const MAX_ALERTS = 3;

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
  const rawAlerts = await dpLoadAll<AlertPayload>(ALERT_KEY_PREFIX);
  const items = rawAlerts.map(normalizePayload);
  return items.sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, MAX_ALERTS);
}

export async function addAlert(payload: AlertPayload): Promise<AlertItem> {
  const item = normalizePayload(payload);
  await dpSave(ALERT_KEY_PREFIX + item.id, item.payload);

  const allAlerts = await dpLoadAllObjects<AlertPayload>(ALERT_KEY_PREFIX);
  const normalized = allAlerts.map(({ key, value }) => ({ key, item: normalizePayload(value) }));
  const extra = normalized
    .sort((a, b) => (b.item.date || '').localeCompare(a.item.date || ''))
    .slice(MAX_ALERTS);

  await Promise.all(extra.map(({ key }) => dpRemove(key)));
  return item;
}

export async function saveAlerts(alerts: AlertItem[]): Promise<void> {
  const trimmed = alerts.slice(0, MAX_ALERTS);
  await Promise.all(trimmed.map(alert => dpSave(ALERT_KEY_PREFIX + alert.id, alert.payload)));
}

export async function dismissAlert(id: string): Promise<void> {
  await dpRemove(ALERT_KEY_PREFIX + id);
}
