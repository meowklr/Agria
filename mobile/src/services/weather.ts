import { CONFIG, METEO_FALLBACK } from '../data/config';
export interface MeteoData { ville: string; temp: number; humidity: number; description: string; icone: string; }
export interface Prevision { jour: string; tempMax: number; tempMin: number; icone: string; }

function iconMap(iconCode: string): string {
  const m: Record<string, string> = { '01d':'sun','01n':'moon','02d':'cloud-sun','02n':'cloud-moon','03d':'cloud','03n':'cloud','04d':'cloud','04n':'cloud','09d':'cloud-drizzle','10d':'cloud-rain','11d':'cloud-bolt','13d':'snowflake','50d':'smog' };
  return m[iconCode] || 'cloud-sun';
}
function joursFrancais(): string[] { return ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']; }

export async function fetchMeteoActuelle(ville: string): Promise<MeteoData> {
  try {
    const r = await fetch(`${CONFIG.OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(ville)}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=fr`);
    if (!r.ok) throw new Error('API error');
    const d = await r.json();
    return { ville: d.name, temp: Math.round(d.main.temp), humidity: d.main.humidity, description: d.weather[0].description, icone: iconMap(d.weather[0].icon) };
  } catch { return METEO_FALLBACK; }
}

export async function fetchPrevisions(ville: string): Promise<Prevision[]> {
  try {
    const r = await fetch(`${CONFIG.OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(ville)}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=fr`);
    if (!r.ok) throw new Error('API error');
    const d = await r.json(); const jours = joursFrancais();
    const jm: Record<string, { jour: string; tempMax: number; tempMin: number; icone: string; count: number }> = {};
    for (const item of d.list) {
      const dt = new Date(item.dt_txt);
      const key = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
      if (!jm[key]) jm[key] = { jour: jours[dt.getDay()], tempMax: item.main.temp_max, tempMin: item.main.temp_min, icone: item.weather[0].icon, count: 1 };
      else { if (item.main.temp_max > jm[key].tempMax) jm[key].tempMax = item.main.temp_max; if (item.main.temp_min < jm[key].tempMin) jm[key].tempMin = item.main.temp_min; jm[key].count++; if (jm[key].count === 4) jm[key].icone = item.weather[0].icon; }
    }
    const todayKey = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}`;
    const res: Prevision[] = [];
    for (const k in jm) { if (k !== todayKey) res.push({ jour: jm[k].jour, tempMax: Math.round(jm[k].tempMax), tempMin: Math.round(jm[k].tempMin), icone: iconMap(jm[k].icone) }); }
    return res.slice(0, 5);
  } catch { return METEO_FALLBACK.previsions; }
}

export async function searchCities(query: string): Promise<string[]> {
  try {
    const r = await fetch(`${CONFIG.NOMINATIM_SEARCH_URL}?q=${encodeURIComponent(query)},France&format=json&limit=5`, { headers: { 'User-Agent': 'Agria/2.0' } });
    const d = await r.json(); if (!Array.isArray(d)) return [];
    return d.map((item: any) => item.display_name.split(',')[0]);
  } catch { return []; }
}

export async function fetchCoordonnees(ville: string): Promise<{ lat: number; lon: number }> {
  try {
    const r = await fetch(`${CONFIG.NOMINATIM_SEARCH_URL}?q=${encodeURIComponent(ville)},France&format=json&limit=1`, { headers: { 'User-Agent': 'Agria/2.0' } });
    const d = await r.json(); if (!d.length) throw new Error('Not found');
    return { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon) };
  } catch { return { lat: 48.8566, lon: 2.3522 }; }
}
