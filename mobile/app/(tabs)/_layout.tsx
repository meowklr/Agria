import { Tabs } from 'expo-router'; import { Platform, View } from 'react-native'; import { colors } from '../../src/theme'; import { Ionicons } from '@expo/vector-icons';

function TabIcon({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) {
  return <View style={{ alignItems: 'center', justifyContent: 'center' }}>{focused && <View style={{ position: 'absolute', top: -6, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary }} />}<Ionicons name={name} size={22} color={color} /></View>;
}
export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: 'rgba(253,248,238,0.92)', borderTopColor: colors.border, borderTopWidth: 1, height: 64, paddingBottom: Platform.OS === 'ios' ? 20 : 8, paddingTop: 8 }, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textMuted, tabBarLabelStyle: { fontSize: 10, fontWeight: '500' } }}>
    <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: ({color,focused})=><TabIcon name="home-outline" color={color} focused={focused} /> }} />
    <Tabs.Screen name="carte" options={{ title: 'Carte', tabBarIcon: ({color,focused})=><TabIcon name="map-outline" color={color} focused={focused} /> }} />
    <Tabs.Screen name="diagnostic" options={{ title: 'Diagnostic', tabBarIcon: ({color,focused})=><TabIcon name="search-outline" color={color} focused={focused} /> }} />
    <Tabs.Screen name="profil" options={{ title: 'Profil', tabBarIcon: ({color,focused})=><TabIcon name="person-outline" color={color} focused={focused} /> }} />
  </Tabs>;
}
