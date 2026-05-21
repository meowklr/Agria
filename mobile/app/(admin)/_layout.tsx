import { Tabs } from 'expo-router'; import { View } from 'react-native'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { colors } from '../../src/theme'; import { Ionicons } from '@expo/vector-icons';

function TabIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons name={name} size={22} color={color} />;
}

export default function AdminLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: 'rgba(61,46,31,0.94)', borderTopColor: 'rgba(235,227,211,0.15)', borderTopWidth: 1, height: 60 + (insets.bottom || 8), paddingBottom: insets.bottom || 8, paddingTop: 6 },
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: 'rgba(168,152,128,0.6)',
      tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Vue ensemble', tabBarIcon: ({ color }) => <TabIcon name="grid-outline" color={color} /> }} />
      <Tabs.Screen name="parcelles" options={{ title: 'Parcelles', tabBarIcon: ({ color }) => <TabIcon name="map-outline" color={color} /> }} />
      <Tabs.Screen name="utilisateurs" options={{ title: 'Utilisateurs', tabBarIcon: ({ color }) => <TabIcon name="people-outline" color={color} /> }} />
    </Tabs>
  );
}
