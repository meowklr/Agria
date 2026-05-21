import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router'; import { StatusBar } from 'expo-status-bar'; import { View, ActivityIndicator } from 'react-native'; import { SafeAreaProvider } from 'react-native-safe-area-context'; import { GestureHandlerRootView } from 'react-native-gesture-handler'; import { useFonts } from 'expo-font'; import { Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces'; import { Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit'; import { colors } from '../src/theme';
import * as Notifications from 'expo-notifications';
import { setupDailyRiskBackgroundTask } from '../src/services/dailyRisk';

function NotificationRouter() {
  useEffect(() => {
    setupDailyRiskBackgroundTask().catch(error => {
      console.warn('Impossible d’enregistrer la tâche de fond Agria', error);
    });

    Notifications.getLastNotificationResponseAsync().then(response => {
      const data = response?.notification.request.content.data as any;
      if (data && data.reportText) {
        router.push({ pathname: '/notifications', params: { reportTitle: data.reportTitle || 'Analyse terminée', reportText: String(data.reportText) } });
      }
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      if (data && data.reportText) {
        router.push({ pathname: '/notifications', params: { reportTitle: data.reportTitle || 'Analyse terminée', reportText: String(data.reportText) } });
      }
    });

    return () => subscription.remove();
  }, []);

  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold,
    Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold,
  });
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><View style={{ flex: 1, backgroundColor: colors.bg }}><StatusBar style="dark" /><NotificationRouter /><Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}><Stack.Screen name="index" /><Stack.Screen name="login" /><Stack.Screen name="notifications" /><Stack.Screen name="(admin)" /><Stack.Screen name="(tabs)" /></Stack></View></SafeAreaProvider></GestureHandlerRootView>;
}
