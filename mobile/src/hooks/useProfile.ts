import { useState, useEffect } from 'react';
import { dpLoad, dpSave } from '../services/firebase';
import { getProfileKey, getPrefsKey, getUserId } from '../services/auth';
import { loadChamps } from '../services/champs';

export interface Profile { prenom?: string; nom?: string; telephone?: string; email?: string; exploitation?: string; siret?: string; typeAgriculture?: string; }
export interface Prefs { notifications?: boolean; uniteHa?: boolean; villeMeteo?: string; }

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({});
  const [prefs, setPrefs] = useState<Prefs>({});
  const [stats, setStats] = useState({ nbChamps: 0, surface: 0, cultures: '' });
  const load = async () => {
    const uid = await getUserId();
    const [p, pr, champs] = await Promise.all([dpLoad<Profile>(getProfileKey(uid),{}), dpLoad<Prefs>(getPrefsKey(uid),{}), loadChamps()]);
    setProfile(p); setPrefs(pr);
    let totalHa = 0; const cc: Record<string,number> = {};
    for (const c of champs) { totalHa += parseFloat(c.surface)||0; const cul = c.culture||'Inconnu'; cc[cul] = (cc[cul]||0)+1; }
    let top = '', tc = 0; for (const k in cc) { if (cc[k]>tc) { top=k; tc=cc[k]; } }
    setStats({ nbChamps: champs.length, surface: parseFloat(totalHa.toFixed(1)), cultures: champs.length>0?Object.keys(cc).join(', '):'Aucune' });
  };
  useEffect(() => { load(); }, []);
  const saveProfile = async (p: Profile) => { const uid = await getUserId(); await dpSave(getProfileKey(uid), p); setProfile(p); };
  const savePrefs = async (p: Prefs) => { const uid = await getUserId(); await dpSave(getPrefsKey(uid), p); setPrefs(p); };
  return { profile, prefs, stats, saveProfile, savePrefs, reload: load };
}
