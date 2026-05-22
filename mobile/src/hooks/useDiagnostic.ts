import { useState } from 'react';
import { runDiagnostic, DiagnosticResult } from '../services/diagnostic';
import { dpLoad, dpSave } from '../services/firebase';
import { getDiagKey, getUserId } from '../services/auth';

export interface DiagHistoryEntry { nom: string; titre: string; gravite: string; explication: string; recommandations: string[]; culture: string; symptomes: string[]; ville: string; date: string; createdAt: number; }

function labelCulture(culture: string) {
  const map: Record<string, string> = { ble: 'Blé', mais: 'Maïs', tournesol: 'Tournesol', colza: 'Colza', vigne: 'Vigne' };
  return map[culture] || culture || 'Culture';
}

function buildDiagTitle(culture: string, nom: string) {
  return 'Analyse ' + labelCulture(culture) + ' - ' + nom;
}

export function useDiagnostic() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<DiagHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const loadHistory = async () => { const uid = await getUserId(); const h = await dpLoad<DiagHistoryEntry[]>(getDiagKey(uid), []); setHistory(h); };
  const analyse = async (culture: string, symptomes: string[], ville: string) => {
    setLoading(true); const diag = await runDiagnostic(culture, symptomes, ville);
    const now = Date.now();
    const entry: DiagHistoryEntry = { nom: diag.nom, titre: buildDiagTitle(culture, diag.nom), gravite: diag.gravite, explication: diag.explication, recommandations: diag.recommandations, culture, symptomes, ville, date: new Date(now).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})+' '+new Date(now).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}), createdAt: now };
    const uid = await getUserId(); let hist = await dpLoad<DiagHistoryEntry[]>(getDiagKey(uid), []); hist.unshift(entry); if (hist.length > 20) hist = hist.slice(0, 20); await dpSave(getDiagKey(uid), hist);
    setResult(diag); setHistory(hist); setLoading(false);
  };
  const reset = () => setResult(null);
  const removeFromHistory = async (createdAt: number) => {
    const uid = await getUserId();
    let hist = await dpLoad<DiagHistoryEntry[]>(getDiagKey(uid), []);
    hist = hist.filter(h => h.createdAt !== createdAt);
    await dpSave(getDiagKey(uid), hist);
    setHistory(hist);
  };
  return { result, history, loading, analyse, reset, removeFromHistory, loadHistory };
}
