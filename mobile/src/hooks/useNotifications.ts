import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppNotif = {
  id: string;
  title: string;
  text: string;
  read: boolean;
  date: number;
};

const KEY = 'agria_app_notifs';

export function useNotifications() {
  const [notifs, setNotifs] = useState<AppNotif[]>([]);

  const load = async () => {
    try {
      const data = await AsyncStorage.getItem(KEY);
      if (data) setNotifs(JSON.parse(data));
    } catch(e) {}
  };

  useEffect(() => { load(); }, []);

  const add = async (title: string, text: string) => {
    const fresh = await AsyncStorage.getItem(KEY);
    const parsed = fresh ? JSON.parse(fresh) : [];
    const n = { id: Date.now().toString(36) + Math.random().toString(36).slice(2), title, text, read: false, date: Date.now() };
    const updated = [n, ...parsed];
    setNotifs(updated);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  const markRead = async (id: string) => {
    const fresh = await AsyncStorage.getItem(KEY);
    const parsed: AppNotif[] = fresh ? JSON.parse(fresh) : [];
    const updated = parsed.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  const markAllRead = async () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  const removeNotif = async (id: string) => {
    const fresh = await AsyncStorage.getItem(KEY);
    const parsed: AppNotif[] = fresh ? JSON.parse(fresh) : [];
    const updated = parsed.filter(n => n.id !== id);
    setNotifs(updated);
    await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  return { notifs, unreadCount: notifs.filter(n => !n.read).length, add, markRead, markAllRead, removeNotif, reload: load };
}
