import { Champ } from './champs';
import { CONFIG } from '../data/config';
import { fetchMeteoActuelle, fetchPrevisions, MeteoData, Prevision } from './weather';

type RiskLevel = 'danger' | 'warning' | 'info';

function hasSensitiveCulture(champs: Champ[]) {
  return champs.some(c => ['vigne', 'colza', 'ble', 'mais', 'tournesol'].includes(c.culture?.toLowerCase()));
}

function buildFieldSummary(champs: Champ[]) {
  if (champs.length === 0) return 'Aucune parcelle enregistrée.';
  const counts: Record<string, number> = {};
  champs.forEach(c => {
    const culture = c.culture?.toLowerCase() || 'inconnue';
    counts[culture] = (counts[culture] || 0) + 1;
  });
  const entries = Object.entries(counts).map(([cul, count]) => `${count}x ${cul}`);
  return `Parcelles: ${champs.length}. Cultures: ${entries.join(', ')}.`;
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

  if (score >= 5) return { level: 'danger', label: 'GRAVE', reason: 'Conditions froides et humides, fortement défavorables aux cultures sensibles.', score, factors };
  if (score >= 3) return { level: 'warning', label: 'ATTENTION', reason: 'Conditions à risque modéré : suivez de près vos parcelles.', score, factors };
  return { level: 'info', label: 'INFO', reason: 'Conditions stables. Restez vigilant selon l’évolution météo.', score, factors };
}

function buildMessage(city: string, meteo: MeteoData, champs: Champ[], riskLevel: RiskLevel) {
  const summary = buildFieldSummary(champs);
  const riskText = riskLevel === 'danger' ? 'niveau de risque élevé' : riskLevel === 'warning' ? 'niveau de risque modéré' : 'niveau de risque faible';
  return `Aujourd’hui à ${city} : ${meteo.temp}°C, ${meteo.description}, humidité ${meteo.humidity}%. ${summary} ${riskText}.`;
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

  await fetch(CONFIG.MAKE_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return {
    title: `Alerte météo du jour — ${risk.label}`,
    body: message,
  };
}
