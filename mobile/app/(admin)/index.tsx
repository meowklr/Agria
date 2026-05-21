import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontFamily } from '../../src/theme';
import { loadAllUsers, loadAllChamps, AdminUser, AdminChamp } from '../../src/services/admin';

export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [champs, setChamps] = useState<AdminChamp[]>([]);
  const insets = useSafeAreaInsets();

  const load = async () => {
    const [u, c] = await Promise.all([loadAllUsers(), loadAllChamps()]);
    setUsers(u); setChamps(c);
  };

  useFocusEffect(React.useCallback(() => { load(); }, []));

  const totalHa = champs.reduce((s, c) => s + (parseFloat(c.champ.surface) || 0), 0);
  const cultures: Record<string, number> = {};
  champs.forEach(c => { const n = c.champ.culture || 'Inconnu'; cultures[n] = (cultures[n] || 0) + 1; });
  const topCulture = Object.entries(cultures).sort((a, b) => b[1] - a[1])[0];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: (insets.top || 0) + 4, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#1a1510' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Admin Agria</Text>
        <Text style={{ fontSize: 11, color: 'rgba(168,152,128,0.7)', fontFamily: fontFamily.sans, marginTop: 2 }}>Back-office</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[
            { key: 'users', icon: 'people-outline' as const, value: users.length, label: 'Utilisateurs' },
            { key: 'champs', icon: 'map-outline' as const, value: champs.length, label: 'Parcelles' },
            { key: 'ha', icon: 'analytics-outline' as const, value: totalHa.toFixed(1), label: 'Hectares' },
          ].map(s => (
            <View key={s.key} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
              <Ionicons name={s.icon} size={18} color={colors.primary} style={{ marginBottom: 4 }} />
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{s.value}</Text>
              <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '500', marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.04, fontWeight: '500', marginBottom: 8 }}>Top culture</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{topCulture?.[0] || '-'}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{topCulture?.[1] || 0} parcelles</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 12, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.04, fontWeight: '500', marginBottom: 8 }}>Moy. par utilisateur</Text>
            <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{users.length ? (champs.length / users.length).toFixed(1) : '0'}</Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>parcelles / user</Text>
          </View>
        </View>

        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 10, fontFamily: fontFamily.sans }}>Utilisateurs recents</Text>
        {users.slice(0, 8).map((u, i) => (
          <View key={u.userId} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: i < users.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text, fontFamily: fontFamily.sans }}>{u.profile?.prenom || u.profile?.nom ? `${u.profile.prenom || ''} ${u.profile.nom || ''}`.trim() : u.email}</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, fontFamily: fontFamily.sans }}>{u.email}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, fontFamily: fontFamily.sans }}>{u.nbChamps} parcelles</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>{u.surfaceHa.toFixed(1)} ha</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
