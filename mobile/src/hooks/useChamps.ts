import { useState, useEffect, useCallback } from 'react';
import { loadChamps, addChamp, updateChamp, deleteChamp, Champ } from '../services/champs';

export function useChamps() {
  const [champs, setChamps] = useState<Champ[]>([]);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { const c = await loadChamps(); setChamps(c); setLoading(false); }, []);
  useEffect(() => { refresh(); }, []);
  const add = async (c: Champ) => { await addChamp(c); await refresh(); };
  const update = async (id: string, data: Champ) => { await updateChamp(id, data); await refresh(); };
  const remove = async (id: string) => { await deleteChamp(id); await refresh(); };
  return { champs, loading, refresh, add, update, remove };
}
