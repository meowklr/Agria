import { useState, useEffect } from 'react';
import { dpLoad, dpSave } from '../services/firebase';
import { getProfileKey, getPrefsKey, getUserId } from '../services/auth';
import { loadChamps } from '../services/champs';

export interface Profile { prenom?: string; nom?: string; telephone?: string; email?: string; ville?: string; exploitation?: string; siret?: string; typeAgriculture?: string; imageBase64?: string; }
export interface Prefs { notifications?: boolean; uniteHa?: boolean; villeMeteo?: string; }

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({});
  const [prefs, setPrefs] = useState<Prefs>({});
  const [stats, setStats] = useState({ nbChamps: 0, surface: 0, topCulture: '-', nbCultures: 0 });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const load = async () => {
    const uid = await getUserId();
    const [p, pr, champs] = await Promise.all([dpLoad<Profile>(getProfileKey(uid),{}), dpLoad<Prefs>(getPrefsKey(uid),{}), loadChamps()]);
    setProfile(p); setPrefs(pr);
    let totalHa = 0; const cc: Record<string,number> = {};
    for (const c of champs) { totalHa += parseFloat(c.surface)||0; const cul = c.culture||'Inconnu'; cc[cul] = (cc[cul]||0)+1; }
    let top = '', tc = 0; for (const k in cc) { if (cc[k]>tc) { top=k; tc=cc[k]; } }
    setStats({ nbChamps: champs.length, surface: parseFloat(totalHa.toFixed(1)), topCulture: top || '-', nbCultures: Object.keys(cc).length });
  };
  useEffect(() => { load(); }, []);
  const saveProfile = async (p: Profile) => { const uid = await getUserId(); await dpSave(getProfileKey(uid), p); setProfile(p); };
  const savePrefs = async (p: Prefs) => { const uid = await getUserId(); await dpSave(getPrefsKey(uid), p); setPrefs(p); };

  const uploadAvatar = async (localUri: string): Promise<void> => {
    setAvatarUploading(true);
    try {
      const uid = await getUserId();
      const response = await fetch(localUri);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Lecture image echouee'));
        reader.readAsDataURL(blob);
      });
      const updated = { ...profile, imageBase64: base64 };
      await dpSave(getProfileKey(uid), updated);
      setProfile(updated);
    } finally {
      setAvatarUploading(false);
    }
  };

  const deleteUserAvatar = async (): Promise<void> => {
    const uid = await getUserId();
    const { imageBase64: _, ...updated } = profile;
    await dpSave(getProfileKey(uid), updated);
    setProfile(updated);
  };

  return { profile, prefs, stats, saveProfile, savePrefs, reload: load, avatarUploading, uploadAvatar, deleteUserAvatar };
}
