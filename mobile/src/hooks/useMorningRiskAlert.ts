import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { useProfile } from './useProfile';
import { Champ } from '../services/champs';
import { sendMorningRiskAlert } from '../services/riskAlert';

const LAST_DAILY_ALERT_KEY = 'agria_last_daily_risk_alert_date';

export function useMorningRiskAlert(champs: Champ[]) {
  const { prefs } = useProfile();

  useEffect(() => {
    async function scheduleDailyAlert() {
      const notificationsEnabled = prefs.notifications !== false;
      if (!notificationsEnabled) return;

      const today = new Date().toISOString().slice(0, 10);
      const lastSent = await AsyncStorage.getItem(LAST_DAILY_ALERT_KEY);
      if (lastSent === today) return;

      const permission = await Notifications.requestPermissionsAsync();
      if (!(permission.granted || permission.status === 'granted')) return;

      const city = prefs.villeMeteo || 'Paris';
      try {
        const alert = await sendMorningRiskAlert(city, champs);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: alert.title,
            body: alert.body,
            data: { source: 'dailyRiskAlert' },
          },
          trigger: null,
        });
        await AsyncStorage.setItem(LAST_DAILY_ALERT_KEY, today);
      } catch (error) {
        console.warn('Erreur en envoyant l’alerte météo quotidienne', error);
      }
    }

    scheduleDailyAlert();
  }, [prefs.notifications, prefs.villeMeteo, JSON.stringify(champs)]);
}
