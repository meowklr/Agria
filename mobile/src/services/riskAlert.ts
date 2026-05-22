import { Champ } from './champs';
import { CONFIG } from '../data/config';
import { fetchMeteoActuelle, fetchPrevisions, MeteoData, Prevision } from './weather';

type RiskLevel = 'danger' | 'warning' | 'info';

function hasSensitiveCulture(champs: Champ[]) {
  return champs.some(c => ['vigne', 'colza', 'ble', 'mais', 'tournesol'].includes(c.culture?.toLowerCase()));
}

function computeRiskLevel(meteo: MeteoData, champs: Champ[]): { level: RiskLevel; label: string; reason: string; score: number; factors: Record<string, boolean | number> } {
  const desc = meteo.description.toLowerCase();
  let score = 0;
  const factors: Record<string, boolean | number> = {
    cold: false,
    cool: false,
    highHumidity: false,
    mediumHumidity: false,
    rainOrStorm: false,
    freezeRisk: false,
    sensitiveCulture: hasSensitiveCulture(champs),
  };

  if (meteo.temp <= 2) { score += 2; factors.cold = true; }
  else if (meteo.temp <= 7) { score += 1; factors.cool = true; }
  if (meteo.humidity >= 85) { score += 2; factors.highHumidity = true; }
  else if (meteo.humidity >= 70) { score += 1; factors.mediumHumidity = true; }
  if (desc.includes('pluie') || desc.includes('averse') || desc.includes('orage')) { score += 2; factors.rainOrStorm = true; }
  if (desc.includes('neige') || desc.includes('verglas') || desc.includes('gel')) { score += 2; factors.freezeRisk = true; }

  if (score >= 5) return { level: 'danger', label: 'Risque élevé', reason: 'Conditions froides et humides, défavorables pour vos cultures.', score, factors };
  if (score >= 3) return { level: 'warning', label: 'Vigilance', reason: 'Conditions à risque modéré, surveillez vos parcelles.', score, factors };
  return { level: 'info', label: 'Info', reason: 'Conditions normales pour la saison. Pas de risque particulier.', score, factors };
}

function buildMessage(city: string, meteo: MeteoData, champs: Champ[], riskLevel: RiskLevel) {
  const temp = `${meteo.temp}°C avec ${meteo.description}`;
  if (champs.length === 0) return `Aujourd'hui à ${city} : ${temp}, humidité ${meteo.humidity}%. Aucune parcelle enregistrée.`;
  const culturesList = champs.map(c => c.culture || 'culture inconnue').filter((v, i, a) => a.indexOf(v) === i).join(', ');
  const riskText = riskLevel === 'danger' ? 'Risque élevé' : riskLevel === 'warning' ? 'Vigilance recommandée' : 'Conditions stables';
  return `Aujourd'hui à ${city} : ${temp}, humidité ${meteo.humidity}%. ${champs.length} parcelle(s) en ${culturesList}. ${riskText}.`;
}

function selectForecasts(previsions: Prevision[]) {
  return previsions.slice(0, 3).map(p => ({ jour: p.jour, tempMax: p.tempMax, tempMin: p.tempMin }));
}

export async function sendMorningRiskAlert(city: string, champs: Champ[]) {
  const meteo = await fetchMeteoActuelle(city);
  const previsions = await fetchPrevisions(city);
  const risk = computeRiskLevel(meteo, champs);
  const message = buildMessage(city, meteo, champs, risk.level);
  const payload = {
    date: new Date().toISOString(),
    city,
    weather: meteo,
    forecast: selectForecasts(previsions),
    fields: champs.map(c => ({ id: c.id, nom: c.nom, culture: c.culture, surface: c.surface, stade: c.stade, dateSemis: c.dateSemis, typeSol: c.typeSol, irrigation: c.irrigation })),
    risk: {
      level: risk.level,
      score: risk.score,
      label: risk.label,
      reason: risk.reason,
      computedFactors: risk.factors,
    },
    alert: {
      level: risk.level,
      label: risk.label,
      reason: risk.reason,
      message,
    },
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    await fetch(CONFIG.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch {
    // Webhook delivery is non-critical — the user still gets local alert
  }

  return {
    title: `Alerte météo du jour — ${risk.label}`,
    body: message,
  };
}
