import { useState } from 'react';
import { runDiagnostic, DiagnosticResult } from '../services/diagnostic';
import { dpLoad, dpSave } from '../services/firebase';
import { getDiagKey, getUserId } from '../services/auth';

export interface DiagHistoryEntry { nom: string; gravite: string; explication: string; recommandations: string[]; culture: string; symptomes: string[]; ville: string; date: string; }

export function useDiagnostic() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<DiagHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const loadHistory = async () => { const uid = await getUserId(); const h = await dpLoad<DiagHistoryEntry[]>(getDiagKey(uid), []); setHistory(h); };
  const analyse = async (culture: string, symptomes: string[], ville: string) => {
    setLoading(true); const diag = await runDiagnostic(culture, symptomes, ville);
    const entry: DiagHistoryEntry = { nom: diag.nom, gravite: diag.gravite, explication: diag.explication, recommandations: diag.recommandations, culture, symptomes, ville, date: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})+' '+new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) };
    const uid = await getUserId(); let hist = await dpLoad<DiagHistoryEntry[]>(getDiagKey(uid), []); hist.unshift(entry); if (hist.length > 20) hist = hist.slice(0, 20); await dpSave(getDiagKey(uid), hist);
    setResult(diag); setHistory(hist); setLoading(false);
  };
  const reset = () => setResult(null);
  return { result, history, loading, analyse, reset, loadHistory };
}
