import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, fontFamily } from '@/theme';
import { useNotifications } from '@/hooks/useNotifications';

function NotifItem({ n, onPress }: { n: any; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => { Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 200, friction: 12 }).start(); };
  const handlePressOut = () => { Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }).start(); };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={{ backgroundColor: n.read ? colors.surface : '#FEF3F0', padding: 16, borderRadius: radius.md, borderWidth: 1, borderColor: n.read ? colors.border : 'rgba(217, 83, 79, 0.2)', gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, flex: 1, fontFamily: fontFamily.sans }}>{n.title}</Text>
          {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }} />}
        </View>
        <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.sans }} numberOfLines={1}>{n.text}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const { notifs, markRead, markAllRead, reload } = useNotifications();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ reportTitle?: string; reportText?: string }>();
  const [openedReport, setOpenedReport] = useState<{ title: string; text: string } | null>(null);
  const reportAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => { reload(); }, []);
  useEffect(() => {
    if (params.reportText) {
      setOpenedReport({ title: params.reportTitle || 'Analyse terminee', text: String(params.reportText) });
    }
  }, [params.reportText, params.reportTitle]);

  useEffect(() => {
    if (openedReport) {
      reportAnim.setValue(0);
      Animated.spring(reportAnim, { toValue: 1, useNativeDriver: true, tension: 160, friction: 14 }).start();
    }
  }, [openedReport?.title]);

  const handlePress = (n: any) => {
    markRead(n.id);
    setOpenedReport({ title: n.title, text: n.text });
  };

  const reportPreview = useMemo(() => {
    if (!openedReport) return '';
    return openedReport.text.length > 260 ? openedReport.text.slice(0, 260) + '...' : openedReport.text;
  }, [openedReport]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Notifications</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {openedReport && (
          <Animated.View style={{ marginBottom: 16, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 10, transform: [{ scale: reportAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }], opacity: reportAnim }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, flex: 1, fontFamily: fontFamily.sans }}>{openedReport.title}</Text>
              <TouchableOpacity onPress={() => setOpenedReport(null)} style={{ paddingLeft: 12 }}>
                <Ionicons name="close" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.sans, lineHeight: 20 }}>{openedReport.text}</Text>
          </Animated.View>
        )}
        {notifs.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40, fontFamily: fontFamily.sans }}>Aucune notification.</Text>
        ) : (
          <View style={{ gap: 10 }}>
            {notifs.map(n => (
              <NotifItem key={n.id} n={n} onPress={() => handlePress(n)} />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
