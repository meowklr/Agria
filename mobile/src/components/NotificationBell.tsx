import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors } from '../theme';
import { useNotifications } from '../hooks/useNotifications';

export function NotificationBell() {
  const { unreadCount, reload } = useNotifications();

  useEffect(() => {
    const id = setInterval(reload, 5000);
    return () => clearInterval(id);
  }, [reload]);

  return (
    <TouchableOpacity onPress={() => router.push('/notifications')} style={{ position: 'relative', padding: 4 }}>
      <Ionicons name="notifications-outline" size={24} color={colors.textSecondary} />
      {unreadCount > 0 && (
        <View style={{ position: 'absolute', top: 2, right: 2, backgroundColor: colors.danger, width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
