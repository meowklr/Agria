import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontFamily } from '../../src/theme';
import { loadAllChamps, deleteAdminChamp, AdminChamp } from '../../src/services/admin';
import { Badge } from '../../src/components/Badge';
import * as Haptics from 'expo-haptics';

export default function AdminParcelles() {
  const [champs, setChamps] = useState<AdminChamp[]>([]);
  const insets = useSafeAreaInsets();

  const load = async () => { setChamps(await loadAllChamps()); };
  useFocusEffect(React.useCallback(() => { load(); }, []));

  const handleDelete = (c: AdminChamp) => {
    Alert.alert('Supprimer', `"${c.champ.nom || 'Parcelle'}" de ${c.email} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteAdminChamp(c.userId, c.champ.id); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); load(); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: (insets.top || 0) + 4, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#1a1510' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Parcelles</Text>
        <Text style={{ fontSize: 11, color: 'rgba(168,152,128,0.7)', fontFamily: fontFamily.sans, marginTop: 2 }}>{champs.length} parcelles au total</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {champs.length === 0 ? <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>Aucune parcelle.</Text> : (
          <View style={{ gap: 10 }}>
            {champs.map(c => (
              <View key={c.champ.id + c.userId} style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>{c.champ.nom || 'Parcelle'}</Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted, fontFamily: fontFamily.sans, marginTop: 1 }}>{c.email}</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(c)} style={{ padding: 6 }}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  <Badge text={c.champ.surface + ' ha'} variant="info" />
                  {c.champ.culture ? <Badge text={c.champ.culture} variant="info" /> : null}
                  {c.champ.stade ? <Badge text={c.champ.stade} variant="info" /> : null}
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
