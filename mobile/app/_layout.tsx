import { useEffect, useState } from 'react'; import { Stack, useSegments, useRouter } from 'expo-router'; import { StatusBar } from 'expo-status-bar'; import { View, ActivityIndicator } from 'react-native'; import { SafeAreaProvider } from 'react-native-safe-area-context'; import { useFonts } from 'expo-font'; import { Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces'; import { Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit'; import { colors } from '../src/theme'; import { isLoggedIn } from '../src/services/auth';

function useProtectedRoute() {
  const segments = useSegments(); const router = useRouter(); const [ready, setReady] = useState(false); const [authed, setAuthed] = useState(false);
  useEffect(() => { isLoggedIn().then(ok => { setAuthed(ok); setReady(true); }); }, []);
  useEffect(() => {
    if (!ready) return;
    const onLogin = segments[0] === 'login';
    if (!authed && !onLogin) router.replace('/login');
    if (authed && onLogin) router.replace('/(tabs)');
  }, [authed, ready, segments]);
  return ready;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold,
    Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold,
  });
  const ready = useProtectedRoute();
  if (!fontsLoaded || !ready) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  return <SafeAreaProvider><View style={{ flex: 1, backgroundColor: colors.bg }}><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="login" /><Stack.Screen name="(tabs)" /></Stack></View></SafeAreaProvider>;
}
