import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { loadChamps } from './champs';
import { getPrefsKey, getUserId } from './auth';
import { dpLoad, dpSave } from './firebase';
import { sendMorningRiskAlert } from './riskAlert';

export const DAILY_RISK_FETCH_TASK = 'AGRIA_DAILY_RISK_FETCH';
export const LAST_DAILY_ALERT_KEY = 'agria_last_daily_risk_alert_date';

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function getPrefs(): Promise<any> {
  try {
    const uid = await getUserId();
    return await dpLoad(getPrefsKey(uid), {});
  } catch {
    return {};
  }
}

async function getChamps() {
  try {
    return await loadChamps();
  } catch {
    return [];
  }
}

export async function hasAlreadySentToday(date = new Date()): Promise<boolean> {
  try {
    const last = await dpLoad<string>(LAST_DAILY_ALERT_KEY, '');
    return last === formatDateKey(date);
  } catch {
    return false;
  }
}

export async function markSentToday(date = new Date()): Promise<void> {
  try {
    await dpSave(LAST_DAILY_ALERT_KEY, formatDateKey(date));
  } catch {
    // ignore
  }
}

export async function shouldSendDailyRiskAlert(date = new Date()): Promise<boolean> {
  if (date.getHours() < 8) return false;
  return !(await hasAlreadySentToday(date));
}

export async function triggerDailyRiskAlert(): Promise<void> {
  if (!(await shouldSendDailyRiskAlert())) return;

  const prefs = await getPrefs();
  const city = prefs.villeMeteo || 'Paris';
  const champs = await getChamps();

  const alert = await sendMorningRiskAlert(city, champs);
  await markSentToday();

  const permission = await Notifications.getPermissionsAsync();
  if (permission.granted || permission.status === 'granted') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: alert.title,
        body: alert.body,
        data: { source: 'dailyRiskAlert' },
      },
      trigger: null,
    });
  }
}

TaskManager.defineTask(DAILY_RISK_FETCH_TASK, async () => {
  const now = new Date();
  if (!(await shouldSendDailyRiskAlert(now))) {
    return BackgroundFetch.BackgroundFetchResult.NoData;
  }

  try {
    await triggerDailyRiskAlert();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.warn('Erreur de fetch de fond Agria', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function setupDailyRiskBackgroundTask(): Promise<void> {
  if (Platform.OS === 'web') return;

  const status = await BackgroundFetch.getStatusAsync();
  if (status === BackgroundFetch.BackgroundFetchStatus.Available) {
    const registered = await TaskManager.isTaskRegisteredAsync(DAILY_RISK_FETCH_TASK);
    if (!registered) {
      await BackgroundFetch.registerTaskAsync(DAILY_RISK_FETCH_TASK, {
        minimumInterval: 3600,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  }
}
