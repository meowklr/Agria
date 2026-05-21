import { Tabs } from 'expo-router'; import { View, Text, TouchableOpacity } from 'react-native'; import { router } from 'expo-router'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { colors } from '../../src/theme'; import { Ionicons } from '@expo/vector-icons';
import { triggerAdminRefresh } from '../../src/services/adminRefresh';

function TabIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: string }) {
  return <Ionicons name={name} size={22} color={color} />;
}

export default function AdminLayout() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: '#1a1510' }}>
      <View style={{ paddingTop: (insets.top || 0) + 4, paddingHorizontal: 12, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity onPress={() => router.replace('/login')} style={{ padding: 6 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="log-out-outline" size={20} color="rgba(168,152,128,0.6)" />
          </TouchableOpacity>
          <Text style={{ fontSize: 17, fontWeight: '600', color: colors.primary, fontFamily: 'Fraunces', letterSpacing: -0.3 }}>Back-office</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <TouchableOpacity onPress={triggerAdminRefresh} style={{ padding: 6 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="refresh-outline" size={20} color="rgba(168,152,128,0.6)" />
          </TouchableOpacity>
          <Text style={{ fontSize: 10, color: 'rgba(168,152,128,0.4)' }}>Admin</Text>
        </View>
      </View>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#2a2318', borderTopColor: 'rgba(235,227,211,0.1)', borderTopWidth: 1, height: 56 + (insets.bottom || 8), paddingBottom: insets.bottom || 8, paddingTop: 4 },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(168,152,128,0.45)',
        tabBarLabelStyle: { fontSize: 9, fontWeight: '500' },
      }}>
        <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <TabIcon name="grid-outline" color={color} /> }} />
        <Tabs.Screen name="parcelles" options={{ title: 'Parcelles', tabBarIcon: ({ color }) => <TabIcon name="map-outline" color={color} /> }} />
        <Tabs.Screen name="utilisateurs" options={{ title: 'Utilisateurs', tabBarIcon: ({ color }) => <TabIcon name="people-outline" color={color} /> }} />
        <Tabs.Screen name="logs" options={{ title: 'Logs', tabBarIcon: ({ color }) => <TabIcon name="document-text-outline" color={color} /> }} />
      </Tabs>
    </View>
  );
}
