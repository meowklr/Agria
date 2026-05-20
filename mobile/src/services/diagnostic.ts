import { CONFIG, OPENMETEO_FALLBACK } from '../data/config';
import { fetchCoordonnees } from './weather';

export interface DiagnosticResult {
  nom: string; gravite: 'danger' | 'warning' | 'info'; explication: string;
  recommandations: string[]; meteo: { precipitations7j: number[]; tempMax: number[]; tempMin: number[] };
}

export async function fetchOpenMeteo(lat: number, lon: number) {
  try { const r = await fetch(`${CONFIG.OPENMETEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&past_days=7&forecast_days=1`); const d = await r.json(); return { precipitations7j: d.daily.precipitation_sum.slice(0,7), tempMax: d.daily.temperature_2m_max.slice(0,7), tempMin: d.daily.temperature_2m_min.slice(0,7) }; }
  catch { return OPENMETEO_FALLBACK; }
}

const baseDiags: Record<string, { nom: string; gravite: 'danger'|'warning'|'info'; symptomes: string[] }[]> = {
  ble: [{nom:'Septoriose',gravite:'warning',symptomes:['taches','jaunissement']},{nom:'Rouille jaune',gravite:'danger',symptomes:['jaunissement','taches']},{nom:'Fusariose',gravite:'danger',symptomes:['fletrissement','pourriture']}],
  mais: [{nom:'Pyrale du mais',gravite:'warning',symptomes:['insectes','fletrissement']},{nom:'Charbon du mais',gravite:'danger',symptomes:['taches','pourriture']},{nom:'Helminthosporiose',gravite:'warning',symptomes:['taches','jaunissement']}],
  tournesol: [{nom:'Mildiou',gravite:'danger',symptomes:['jaunissement','fletrissement','croissance']},{nom:'Sclerotinia',gravite:'danger',symptomes:['fletrissement','pourriture']},{nom:'Phomopsis',gravite:'warning',symptomes:['taches','jaunissement']}],
  colza: [{nom:'Sclerotinia',gravite:'danger',symptomes:['fletrissement','pourriture']},{nom:'Phoma',gravite:'warning',symptomes:['taches','jaunissement']},{nom:'Altises',gravite:'info',symptomes:['insectes','croissance']}],
  vigne: [{nom:'Mildiou',gravite:'danger',symptomes:['taches','jaunissement','fletrissement']},{nom:'Oidium',gravite:'warning',symptomes:['taches','fletrissement']},{nom:'Botrytis',gravite:'danger',symptomes:['pourriture','taches']}],
};
const expls: Record<string, string> = {
  'Septoriose':'Maladie fongique frequente du ble. Taches brunes, peut reduire le rendement de 20 a 40%.',
  'Rouille jaune':'Champignon formant des pustules jaune-orange. Se propage par temps frais et humide.',
  'Fusariose':'Maladie grave affectant les epis et les tiges.',
  'Pyrale du mais':'Insecte ravageur, larves creusent des galeries dans les tiges.',
  'Charbon du mais':'Tumeurs sur les epis et les tiges.',
  'Helminthosporiose':'Lesions necrotiques sur les feuilles de mais.',
  'Mildiou':'Champignon parasite, taches jaunes et feutrage blanc sous les feuilles.',
  'Sclerotinia':'Deperissement des tiges et des capitules.',
  'Phomopsis':'Lesions brunes sur les tiges.',
  'Altises':'Petits coleopteres perforant les feuilles.',
  'Oidium':'Feutrage blanc poudreux sur feuilles et grappes.',
  'Botrytis':'Pourriture grise affectant les grappes.',
};
const recs: Record<string, string[]> = {
  'Septoriose':['Fongicide triazole stade 2-3 noeuds.','Rotation des cultures.','Intervenir avant periode humide.'],
  'Rouille jaune':['Varietes resistantes.','Fongicide des premieres pustules.','Eviter semis trop denses.'],
  'Fusariose':['Fongicide a la floraison.','Detruire residus infectes.','Rotation 2 ans sans cereales.'],
  'Pyrale du mais':['Insecticide biologique.','Broyer cannes apres recolte.','Installer trichogrammes.'],
  'Charbon du mais':['Retirer parties infectees.','Eviter blessures mecaniques.','Rotation longue 3-4 ans.'],
  'Helminthosporiose':['Fongicide preventif.','Hybrides tolerants.','Fertilisation equilibree.'],
  'Mildiou':['Fongicide cuprique.','Bon drainage.','Supprimer feuilles atteintes.'],
  'Sclerotinia':['Fongicide a la floraison.','Eviter exces irrigation.','Labour profond.'],
  'Phomopsis':['Fongicide automne/printemps.','Semences certifiees.','Rotation 3 ans.'],
  'Altises':['Semis precoce.','Insecticide si attaque severe.','Favoriser auxiliaires.'],
  'Oidium':['Fongicide soufre.','Effeuillage pour aerer.','Surveiller symptomes.'],
  'Botrytis':['Bonne aeration par la taille.','Fongicide a la nouaison.','Limiter azote.'],
};

export async function runDiagnostic(culture: string, symptomes: string[], ville: string): Promise<DiagnosticResult> {
  const diags = baseDiags[culture] || baseDiags.ble;
  let bestScore = 0, best = diags[0];
  for (const d of diags) { let score = 0; for (const s of symptomes) { if (d.symptomes.includes(s)) score++; } if (score > bestScore) { bestScore = score; best = d; } }
  const gravite = symptomes.length >= 4 ? 'danger' : best.gravite;
  const coords = await fetchCoordonnees(ville);
  const meteo = await fetchOpenMeteo(coords.lat, coords.lon);
  return { nom: best.nom, gravite, explication: expls[best.nom] || 'Diagnostic etabli.', recommandations: recs[best.nom] || ['Consulter un technicien.'], meteo };
}
