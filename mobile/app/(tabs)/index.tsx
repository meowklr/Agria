import React, { useState, useCallback, useRef } from 'react'; import { View, Text, ScrollView, TouchableOpacity, Alert, LayoutAnimation, Platform, UIManager } from 'react-native'; import { router, useFocusEffect } from 'expo-router'; import { Ionicons } from '@expo/vector-icons'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { colors, radius, fontFamily } from '../../src/theme'; import { Card } from '../../src/components/Card'; import { Badge } from '../../src/components/Badge'; import { Input } from '../../src/components/Input'; import { SectionTitle } from '../../src/components/Typography'; import { LoaderBar } from '../../src/components/LoaderBar'; import { useWeather, useCitySearch } from '../../src/hooks/useWeather'; import { useChamps } from '../../src/hooks/useChamps'; import { deleteChamp, Champ } from '../../src/services/champs';
import { useAlerts } from '../../src/hooks/useAlerts';
import { dismissAlert } from '../../src/services/alerts';
import { sendMorningRiskAlert } from '../../src/services/riskAlert';
import { NotificationBell } from '../../src/components/NotificationBell';
import { ScreenFade } from '../../src/components/ScreenFade';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

export default function DashboardScreen() {
  const { meteo, previsions, loading: wl, city, setCity, refresh } = useWeather('Paris');
  const { champs, refresh: reloadChamps } = useChamps();
  const { alerts, loading: alertsLoading, refresh: refreshAlerts } = useAlerts();
  const { results, query, setQuery } = useCitySearch();
  const [refreshingRisk, setRefreshingRisk] = useState(false);
  const [waitingAI, setWaitingAI] = useState(false);
  const [rateLimitMsg, setRateLimitMsg] = useState('');
  const lastRefreshRef = useRef(0);
  const REFRESH_COOLDOWN = 60000;

  const handleRefreshRisk = async () => {
    const now = Date.now();
    if (now - lastRefreshRef.current < REFRESH_COOLDOWN) {
      const remaining = Math.ceil((REFRESH_COOLDOWN - (now - lastRefreshRef.current)) / 1000);
      setRateLimitMsg(`Patientez ${remaining}s avant de rafraichir a nouveau.`);
      setTimeout(() => setRateLimitMsg(''), 3000);
      return;
    }
    lastRefreshRef.current = now;
    setRateLimitMsg('');
    setRefreshingRisk(true);
    setWaitingAI(true);
    try {
      const result = await sendMorningRiskAlert(city, champs);
      await refreshAlerts();
      setTimeout(() => { refreshAlerts(); setWaitingAI(false); }, 15000);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (Notifications) {
        await Notifications.scheduleNotificationAsync({
          content: { title: result.title, body: result.body, data: {} },
          trigger: null,
        });
      }
    } catch (e: any) {
      setWaitingAI(false);
      const msg = (e?.message || '').includes('Session') || (e?.message || '').includes('connecter')
        ? 'Session expiree. Veuillez vous reconnecter.'
        : 'Service d\'alertes momentanement indisponible. Reessayez dans quelques instants.';
      setRateLimitMsg(msg);
      setTimeout(() => setRateLimitMsg(''), 5000);
    } finally {
      setRefreshingRisk(false);
    }
  };
  const [showSearch, setShowSearch] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [expandedParcel, setExpandedParcel] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const totalHa = champs.reduce((s, c) => s + (parseFloat(c.surface) || 0), 0);
  const cc: Record<string, number> = {}; champs.forEach(c => { const n = c.culture || 'Inconnu'; cc[n] = (cc[n] || 0) + 1; });
  const top = Object.entries(cc).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const handleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedParcel(expandedParcel === id ? null : id);
  };

  const handleDelete = (c: Champ) => {
    Alert.alert('Supprimer ' + (c.nom || 'cette parcelle') + ' ?', c.surface + ' ha, ' + (c.culture || '?'), [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteChamp(c.id); reloadChamps(); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } },
    ]);
  };

  useFocusEffect(useCallback(() => { reloadChamps(); refreshAlerts(); }, [reloadChamps, refreshAlerts]));

  return <ScreenFade><ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingTop: (insets.top || 0) + 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Agria</Text>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}><Ionicons name="search-outline" size={20} color={colors.textSecondary} /><Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500', fontFamily: fontFamily.sans }}>Ville</Text></TouchableOpacity>
        <NotificationBell />
      </View>
    </View>

    {showSearch && <View style={{ marginBottom: 16 }}>
      <Input value={query} onChangeText={setQuery} placeholder="Rechercher une ville..." />
      {results.length > 0 && <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginTop: 4, overflow: 'hidden' }}>
        {results.map((r, i) => <TouchableOpacity key={i} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < results.length - 1 ? 1 : 0, borderBottomColor: colors.border }} onPress={() => { setCity(r); setQuery(''); setShowSearch(false); refresh(r); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}><Text style={{ fontSize: 14, color: colors.text, fontFamily: fontFamily.sans }}>{r}</Text></TouchableOpacity>)}
      </View>}
    </View>}

    {wl ? <View style={{ marginBottom: 24 }}><LoaderBar /></View> : null}

    <View style={{ marginBottom: 24 }}>
      <SectionTitle title="Meteo du jour" />
      {wl && !meteo ? <Card><LoaderBar /></Card> : meteo ? <Card style={{ backgroundColor: '#f5f6f0' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary }}>{meteo.ville}</Text>
          <Ionicons name="partly-sunny" size={40} color={colors.primary} />
        </View>
        <Text style={{ fontSize: 56, fontWeight: '600', color: colors.text, fontFamily: fontFamily.serif }}>{meteo.temp}<Text style={{ fontSize: 22, fontWeight: '400', color: colors.textSecondary, fontFamily: fontFamily.sans }}>°C</Text></Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 12, textTransform: 'capitalize', fontFamily: fontFamily.sans }}>{meteo.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(232,184,75,0.08)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm, alignSelf: 'flex-start' }}>
          <Ionicons name="water-outline" size={14} color={colors.primary} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>{meteo.humidity}%</Text>
        </View>
      </Card> : null}
    </View>

    <View style={{ marginBottom: 24 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
        {previsions.map((p, i) => <Card key={i} style={{ minWidth: 82, minHeight: 148, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' }}>{p.jour}</Text>
          <View style={{ alignItems: 'center', gap: 6, flex: 1, justifyContent: 'center' }}>
            <Ionicons name="partly-sunny" size={26} color={colors.primary} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, lineHeight: 22 }}>{p.tempMax}°</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '500', marginTop: 2 }}>{p.tempMin}°</Text>
            </View>
          </View>
        </Card>)}
      </ScrollView>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: showAlerts ? 16 : 24 }}>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setShowAlerts(!showAlerts); }} activeOpacity={1}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, letterSpacing: -0.2, fontFamily: fontFamily.serif }}>Alertes</Text>
        <Ionicons name={showAlerts ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
      </TouchableOpacity>
      {showAlerts && (
        <TouchableOpacity onPress={handleRefreshRisk} disabled={refreshingRisk} style={{ marginLeft: 'auto', padding: 4, opacity: refreshingRisk ? 0.5 : 1 }}>
          <Ionicons name="refresh-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
    {showAlerts && <View style={{ marginBottom: 24, gap: 10 }}>

      {rateLimitMsg ? <Card style={{ backgroundColor: '#FDF4E8', borderColor: colors.accent }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Ionicons name="time-outline" size={16} color={colors.accent} /><Text style={{ fontSize: 13, color: colors.accent, fontWeight: '500', flex: 1, fontFamily: fontFamily.sans }}>{rateLimitMsg}</Text></View></Card> : null}

      {waitingAI ? (
        <Card><View style={{ alignItems: 'center', paddingVertical: 12 }}><LoaderBar /><Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 8, fontFamily: fontFamily.sans }}>Actualisations des alertes en cours...</Text></View></Card>
      ) : (() => {
        const filtered = alerts.filter(a => !a.city || a.city.toLowerCase() === city.toLowerCase());
        if (filtered.length === 0) {
          return <Card><Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>Aucune alerte pour {city}. Appuyez sur le bouton refresh pour en generer une.</Text></Card>;
        }
        return filtered.map((alert) => {
          const levelStyle = alert.level === 'danger' ? { backgroundColor: '#FEF3F0', title: colors.danger, body: '#8B4A3A' }
            : alert.level === 'warning' ? { backgroundColor: '#FDF4E8', title: colors.accent, body: '#8B5E3A' }
            : { backgroundColor: '#EEF5FA', title: '#5a8aa8', body: '#4A6A7A' };
          return <View key={alert.id} style={{ backgroundColor: levelStyle.backgroundColor, borderRadius: radius.lg, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: levelStyle.title, marginBottom: 3, fontFamily: fontFamily.sans, flex: 1 }}>{alert.title}</Text>
              <TouchableOpacity onPress={async () => { await dismissAlert(alert.id); refreshAlerts(); }} style={{ padding: 2, marginLeft: 8 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={14} color={levelStyle.title} style={{ opacity: 0.4 }} />
              </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 13, color: levelStyle.body, lineHeight: 18, fontFamily: fontFamily.sans }}>{alert.body}</Text>
            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 8, fontFamily: fontFamily.sans }}>{new Date(alert.date).toLocaleString()}</Text>
          </View>;
        });
      })()}
    </View>}

    <View style={{ marginBottom: 24 }}>
      <SectionTitle title="Mes parcelles" />
      {champs.length === 0 ? <Card><Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>Aucune parcelle.</Text></Card>
        : champs.map(c => <Card key={c.id} style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={() => handleExpand(c.id)} activeOpacity={0.7}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>{c.nom}</Text>
                <Ionicons name={expandedParcel === c.id ? 'chevron-up' : 'chevron-down'} size={13} color={colors.textMuted} />
              </View>
              <Badge text={c.stade || c.culture || 'Inconnu'} variant="info" />
            </View>
            <Text style={{ fontSize: 12, color: colors.textMuted }}>{c.surface || '0'} ha {c.culture ? ' - ' + c.culture : ''} {c.typeSol ? ' - ' + c.typeSol : ''}</Text>
          </TouchableOpacity>
          {expandedParcel === c.id && <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
              <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm }}><Text style={{ fontSize: 11, color: colors.textSecondary }}>Culture <Text style={{ fontWeight: '600', color: colors.text }}>{c.culture || '-'}</Text></Text></View>
              <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm }}><Text style={{ fontSize: 11, color: colors.textSecondary }}>Sol <Text style={{ fontWeight: '600', color: colors.text }}>{c.typeSol || '-'}</Text></Text></View>
              <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm }}><Text style={{ fontSize: 11, color: colors.textSecondary }}>Stade <Text style={{ fontWeight: '600', color: colors.text }}>{c.stade || '-'}</Text></Text></View>
              <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.sm }}><Text style={{ fontSize: 11, color: colors.textSecondary }}>Semis <Text style={{ fontWeight: '600', color: colors.text }}>{c.dateSemis || '-'}</Text></Text></View>
            </View>
            {c.notes ? <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 12, lineHeight: 17 }}>{c.notes}</Text> : null}
          </View>}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: expandedParcel === c.id ? 0 : 10 }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.sm, backgroundColor: colors.bg }} onPress={() => { router.push({ pathname: '/(tabs)/carte', params: { parcelId: c.id } }); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
              <Ionicons name="map-outline" size={14} color={colors.primary} /><Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.sans }}>Voir</Text>
            </TouchableOpacity>
            {expandedParcel === c.id &&
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.sm, backgroundColor: colors.bg }} onPress={() => handleDelete(c)}>
              <Ionicons name="trash-outline" size={14} color={colors.danger} /><Text style={{ fontSize: 12, fontWeight: '600', color: colors.danger, fontFamily: fontFamily.sans }}>Suppr.</Text>
            </TouchableOpacity>
            }
          </View>
        </Card>)}
    </View>

    <View style={{ flexDirection: 'row', gap: 10 }}>
      <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>{champs.length}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500', marginTop: 2 }}>Champs</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>{totalHa.toFixed(1)}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500', marginTop: 2 }}>Hectares</Text>
      </View>
      <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>{top}</Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500', marginTop: 2 }}>Culture n1</Text>
      </View>
    </View>
    <View style={{ height: 100 }} />
  </ScrollView></ScreenFade>;
}
