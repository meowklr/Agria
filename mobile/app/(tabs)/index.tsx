import React, { useState } from 'react'; import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { colors, radius, fontFamily } from '../../src/theme'; import { Card } from '../../src/components/Card'; import { Badge } from '../../src/components/Badge'; import { Button } from '../../src/components/Button'; import { Input } from '../../src/components/Input'; import { SectionTitle } from '../../src/components/Typography'; import { useWeather, useCitySearch } from '../../src/hooks/useWeather'; import { useChamps } from '../../src/hooks/useChamps'; import * as Haptics from 'expo-haptics';

const forecastIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  sun: 'sunny',
  moon: 'moon',
  'cloud-sun': 'partly-sunny',
  'cloud-moon': 'cloudy-night',
  cloud: 'cloudy',
  'cloud-drizzle': 'rainy',
  'cloud-rain': 'rainy',
  'cloud-bolt': 'thunderstorm',
  snowflake: 'snow',
  smog: 'cloudy',
};

export default function DashboardScreen() {
  const { meteo, previsions, loading: wl, city, setCity, refresh } = useWeather('Paris');
  const { champs } = useChamps();
  const { results, query, setQuery } = useCitySearch();
  const [showSearch, setShowSearch] = useState(false);
  const insets = useSafeAreaInsets();
  const totalHa = champs.reduce((s, c) => s + (parseFloat(c.surface) || 0), 0);
  const cc: Record<string, number> = {}; champs.forEach(c => { const n = c.culture || 'Inconnu'; cc[n] = (cc[n] || 0) + 1; });
  const top = Object.entries(cc).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingTop: (insets.top || 0) + 16 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, marginBottom: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Agria</Text>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}><Ionicons name="search-outline" size={22} color={colors.textSecondary} /></TouchableOpacity>
        <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
      </View>
    </View>

    {showSearch && <View style={{ marginBottom: 16 }}>
      <Input value={query} onChangeText={setQuery} placeholder="Rechercher une ville..." />
      {results.length > 0 && <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginTop: 4, overflow: 'hidden' }}>
        {results.map((r, i) => <TouchableOpacity key={i} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < results.length - 1 ? 1 : 0, borderBottomColor: colors.border }} onPress={() => { setCity(r); setQuery(''); setShowSearch(false); refresh(r); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}><Text style={{ fontSize: 14, color: colors.text }}>{r}</Text></TouchableOpacity>)}
      </View>}
    </View>}

    <View style={{ marginBottom: 24 }}>
      <SectionTitle title="Meteo du jour" />
      {wl && !meteo ? <Card><ActivityIndicator color={colors.primary} /></Card> : meteo ? <Card style={{ backgroundColor: '#f5f6f0' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.primary }}>{meteo.ville}</Text>
          <Ionicons name="partly-sunny" size={40} color={colors.primary} />
        </View>
        <Text style={{ fontSize: 56, fontWeight: '600', color: colors.text, fontFamily: fontFamily.serif }}>{meteo.temp}<Text style={{ fontSize: 22, fontWeight: '400', color: colors.textSecondary }}>°C</Text></Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 12, textTransform: 'capitalize' }}>{meteo.description}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(232,184,75,0.08)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.sm, alignSelf: 'flex-start' }}>
          <Ionicons name="water-outline" size={14} color={colors.primary} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text }}>{meteo.humidity}%</Text>
        </View>
      </Card> : null}
    </View>

    <View style={{ marginBottom: 24 }}>
      <SectionTitle title="Previsions" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
        {previsions.map((p, i) => <Card key={i} style={{ minWidth: 96, minHeight: 150, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, textAlign: 'center' }}>{p.jour}</Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', gap: 8, flex: 1 }}>
            <Ionicons name={forecastIcons[p.icone] || 'partly-sunny'} size={30} color={colors.primary} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, lineHeight: 22 }}>{p.tempMax}°</Text>
              <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '500', marginTop: 2 }}>{p.tempMin}°</Text>
            </View>
          </View>
        </Card>)}
      </ScrollView>
    </View>

    <View style={{ marginBottom: 24 }}>
      <SectionTitle title="Alertes" />
      <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.danger, marginBottom: 10 }}><Badge text="Urgent" variant="danger" /><Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6 }}>[Exemple] Risque de gel prevu cette nuit.</Text></Card>
      <Card style={{ borderLeftWidth: 4, borderLeftColor: colors.accent, marginBottom: 10 }}><Badge text="Attention" variant="warning" /><Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6 }}>[Exemple] Periode seche : irrigation recommandee.</Text></Card>
      <Card style={{ borderLeftWidth: 4, borderLeftColor: '#5a8aa8', marginBottom: 10 }}><Badge text="Info" variant="info" /><Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 6 }}>[Exemple] Conditions favorables traitement fongique.</Text></Card>
    </View>

    <View style={{ marginBottom: 24 }}>
      <SectionTitle title="Mes parcelles" />
      {champs.length === 0 ? <Card><Text style={{ fontSize: 14, color: colors.textMuted, textAlign: 'center' }}>Aucune parcelle.</Text></Card>
        : champs.map(c => <Card key={c.id} style={{ marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>{c.nom}</Text>
            <Badge text={c.stade || 'Inconnu'} variant="info" />
          </View>
          <Text style={{ fontSize: 13, color: colors.textMuted }}>Culture: {c.culture || '?'} | Surface: {c.surface || '0'} ha</Text>
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
  </ScrollView>;
}
