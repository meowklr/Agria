import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontFamily } from '../../src/theme';
import { useNotifications } from '../../src/hooks/useNotifications';
import * as Haptics from 'expo-haptics';

export default function NotificationsScreen() {
  const { notifs, markRead, markAllRead, reload } = useNotifications();

  useEffect(() => { reload(); }, []);

  const handlePress = (n: any) => {
    markRead(n.id);
    Alert.alert(n.title, n.text);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ title: 'Notifications', headerBackTitle: 'Retour', headerTintColor: colors.primary }} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {notifs.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>Aucune notification.</Text>
        ) : (
          <View style={{ gap: 10 }}>
            <TouchableOpacity onPress={markAllRead} style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>Tout marquer comme lu</Text>
            </TouchableOpacity>
            {notifs.map(n => (
              <TouchableOpacity key={n.id} onPress={() => handlePress(n)} style={{ backgroundColor: n.read ? colors.surface : '#FEF3F0', padding: 16, borderRadius: radius.md, borderWidth: 1, borderColor: n.read ? colors.border : 'rgba(217, 83, 79, 0.2)', gap: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, flex: 1 }}>{n.title}</Text>
                  {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }} />}
                </View>
                <Text style={{ fontSize: 13, color: colors.textSecondary }} numberOfLines={1}>{n.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}