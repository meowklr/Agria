import { CROP_DATA } from '../data/cropData';
import { Champ } from './champs';

export interface Prediction {
  date_recolte_estimee: string; score_sol: { score: number; texte: string };
  besoins_eau_total_m3: number; alerte_irrigation: { active: boolean; message: string };
  fertilisation: { azote_total_kg: number; fractionnement: string; cout_estime_euros: number };
  rendement_estime: { min: number; max: number; unite: string };
  recommandation_globale: string; notes: string; resistance_secheresse: string; duree_vie_ans: number;
}

export function generatePredictions(field: Champ): Prediction | { error: string } {
  const crop = CROP_DATA[field.culture]; if (!crop) return { error: 'Culture inconnue' };
  const area = parseFloat(field.surface) || 1;
  const sowingDate = field.dateSemis ? new Date(field.dateSemis + 'T00:00:00') : null;
  let soilScore: number, soilText: string;
  if (crop.sols_favorables.includes(field.typeSol)) { soilScore = 5; soilText = 'Sol tres favorable.'; }
  else if (crop.sols_defavorables.includes(field.typeSol)) { soilScore = 1; soilText = 'Sol defavorable.'; }
  else { soilScore = 3; soilText = 'Sol acceptable.'; }
  const waterNeedM3 = Math.round(((crop.besoins_eau_mm.min + crop.besoins_eau_mm.max) / 2) * 10 * area);
  let irrigationAlert = false, irrigationMsg = '';
  if ((!field.irrigation || field.irrigation === 'Aucun') && (crop.resistance_secheresse === 'Faible' || crop.resistance_secheresse === 'Tres faible')) {
    irrigationAlert = true; irrigationMsg = "[Exemple] Cette culture necessite une irrigation. Sans apport d'eau, les pertes de rendement peuvent etre importantes.";
  }
  const azoteTotal = Math.round(((crop.besoin_azote_kg_ha.min + crop.besoin_azote_kg_ha.max) / 2) * area);
  const coutEngrais = Math.round(azoteTotal * 1.20);
  const rendMin = Math.round((crop.rendement_moyen_q_ha.min / 10) * area * 10) / 10;
  const rendMax = Math.round((crop.rendement_moyen_q_ha.max / 10) * area * 10) / 10;
  const uniteRend = field.culture === 'Lavande' ? "kg d'huile" : field.culture === 'Vigne' ? 'hl' : 'tonnes';
  let recolteEstimee = '';
  if (sowingDate && crop.duree_cycle_jours) { const r = new Date(sowingDate); r.setDate(r.getDate() + crop.duree_cycle_jours); recolteEstimee = `${String(r.getDate()).padStart(2,'0')}/${String(r.getMonth()+1).padStart(2,'0')}/${r.getFullYear()}`; }
  else { recolteEstimee = crop.recolte_mois; }
  let recommandation = ''; if (soilScore >= 4 && !irrigationAlert) recommandation = 'Conditions favorables.'; else if (soilScore >= 3 && !irrigationAlert) recommandation = 'Conditions acceptables.'; else if (soilScore >= 2) recommandation = 'Conditions defavorables.'; else recommandation = 'Culture deconseillee sur ce sol.';
  return { date_recolte_estimee: recolteEstimee, score_sol: { score: soilScore, texte: soilText }, besoins_eau_total_m3: waterNeedM3, alerte_irrigation: { active: irrigationAlert, message: irrigationMsg }, fertilisation: { azote_total_kg: azoteTotal, fractionnement: crop.fractionnement_engrais, cout_estime_euros: coutEngrais }, rendement_estime: { min: rendMin, max: rendMax, unite: uniteRend }, recommandation_globale: recommandation, notes: crop.notes_agronomiques, resistance_secheresse: crop.resistance_secheresse, duree_vie_ans: crop.duree_vie_ans };
}
