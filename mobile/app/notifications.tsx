import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, fontFamily } from '@/theme';
import { useNotifications } from '@/hooks/useNotifications';
import * as Haptics from 'expo-haptics';

export default function NotificationsScreen() {
  const { notifs, markRead, markAllRead, reload } = useNotifications();
  const insets = useSafeAreaInsets();

  useEffect(() => { reload(); }, []);

  const handlePress = (n: any) => {
    markRead(n.id);
    Alert.alert(n.title, n.text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Notifications</Text>
        {notifs.length > 0 && (
          <TouchableOpacity onPress={markAllRead} style={{ marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm, backgroundColor: 'rgba(232,184,75,0.1)' }}>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600', fontFamily: fontFamily.sans }}>Tout lu</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {notifs.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40, fontFamily: fontFamily.sans }}>Aucune notification.</Text>
        ) : (
          <View style={{ gap: 10 }}>
            {notifs.map(n => (
              <TouchableOpacity key={n.id} onPress={() => handlePress(n)} style={{ backgroundColor: n.read ? colors.surface : '#FEF3F0', padding: 16, borderRadius: radius.md, borderWidth: 1, borderColor: n.read ? colors.border : 'rgba(217, 83, 79, 0.2)', gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, flex: 1, fontFamily: fontFamily.sans }}>{n.title}</Text>
                  {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }} />}
                </View>
                <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.sans }} numberOfLines={1}>{n.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
