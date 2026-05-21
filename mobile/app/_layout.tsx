import { Stack } from 'expo-router'; import { StatusBar } from 'expo-status-bar'; import { View, ActivityIndicator } from 'react-native'; import { SafeAreaProvider } from 'react-native-safe-area-context'; import { GestureHandlerRootView } from 'react-native-gesture-handler'; import { useFonts } from 'expo-font'; import { Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces'; import { Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit'; import { colors } from '../src/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_700Bold,
    Outfit_300Light, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold,
  });
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><View style={{ flex: 1, backgroundColor: colors.bg }}><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}><Stack.Screen name="index" /><Stack.Screen name="login" /><Stack.Screen name="notifications" /><Stack.Screen name="(tabs)" /></Stack></View></SafeAreaProvider></GestureHandlerRootView>;
}
