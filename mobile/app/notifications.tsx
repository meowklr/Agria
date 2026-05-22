import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable, ScrollView } from 'react-native-gesture-handler';
import { colors, radius, fontFamily } from '@/theme';
import { useNotifications } from '@/hooks/useNotifications';
import * as Haptics from 'expo-haptics';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MONTHS = ['janv.', 'fevr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'aout', 'sept.', 'oct.', 'nov.', 'dec.'];

function fmtDate(ts: number): string {
  const d = new Date(ts);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month}, ${h}:${m}`;
}

function NotifItem({ n, onPress, expanded }: { n: any; onPress: () => void; expanded: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => { Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 200, friction: 12 }).start(); };
  const handlePressOut = () => { Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }).start(); };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} activeOpacity={1} style={{
        backgroundColor: n.read ? colors.surface : '#FEF3F0', padding: 16,
        borderWidth: 1, borderColor: expanded ? colors.primary : (n.read ? colors.border : 'rgba(217, 83, 79, 0.2)'),
        borderBottomWidth: expanded ? 0 : 1,
        borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md,
        borderBottomLeftRadius: expanded ? 0 : radius.md, borderBottomRightRadius: expanded ? 0 : radius.md,
        gap: 6,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, flex: 1, fontFamily: fontFamily.sans }}>{n.title}</Text>
          {!n.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }} />}
        </View>
        {!expanded && <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.sans }} numberOfLines={1}>{n.text}</Text>}
        {n.date ? <Text style={{ fontSize: 10, color: colors.textMuted, fontFamily: fontFamily.sans }}>{fmtDate(n.date)}</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const { notifs, markRead, removeNotif, reload } = useNotifications();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ reportTitle?: string; reportText?: string }>();
  const [openedReport, setOpenedReport] = useState<{ title: string; text: string } | null>(null);
  const [openedId, setOpenedId] = useState<string | null>(null);

  useEffect(() => { reload(); }, []);
  useEffect(() => {
    if (params.reportText) {
      setOpenedReport({ title: params.reportTitle || 'Analyse terminee', text: String(params.reportText) });
    }
  }, [params.reportText, params.reportTitle]);

  const handlePress = (n: any) => {
    markRead(n.id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (openedId === n.id) {
      setOpenedId(null); setOpenedReport(null);
    } else {
      setOpenedId(n.id);
      setOpenedReport({ title: n.title, text: n.text });
    }
  };

  const closeDetail = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenedReport(null); setOpenedId(null);
  };

  const handleDelete = (n: any) => {
    if (openedId === n.id) { setOpenedReport(null); setOpenedId(null); }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    removeNotif(n.id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 8, paddingBottom: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginRight: 8 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Notifications</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {notifs.length === 0 ? (
          <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40, fontFamily: fontFamily.sans }}>Aucune notification.</Text>
        ) : (
          <View style={{ gap: 10 }}>
            {notifs.map(n => (
              <Swipeable
                key={n.id}
                renderRightActions={(progress: any) => {
                  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
                  return (
                  <Animated.View style={{ opacity, width: 72 }}>
                    <TouchableOpacity onPress={() => handleDelete(n)} style={{ flex: 1, backgroundColor: colors.danger, justifyContent: 'center', alignItems: 'center', borderRadius: radius.md, marginLeft: 8 }}>
                        <Ionicons name="trash-outline" size={20} color="#fff" />
                      </TouchableOpacity>
                    </Animated.View>
                  );
                }}
                overshootRight={false}
                friction={2}
                rightThreshold={30}
                onSwipeableWillOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              >
                <View>
                  <NotifItem n={n} onPress={() => handlePress(n)} expanded={openedId === n.id} />
                  {openedId === n.id && openedReport && (
                    <View style={{
                      backgroundColor: colors.surface, padding: 16, gap: 10,
                      borderWidth: 1, borderColor: colors.primary, borderTopWidth: 0,
                      borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg,
                    }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.sans, lineHeight: 20, flex: 1 }}>{openedReport.text}</Text>
                        <TouchableOpacity onPress={closeDetail} style={{ paddingLeft: 12, paddingTop: 2 }}>
                          <Ionicons name="close" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </Swipeable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
