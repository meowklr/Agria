import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontFamily } from '../../src/theme';
import { loadAllUsers, deleteUserData, AdminUser } from '../../src/services/admin';
import * as Haptics from 'expo-haptics';

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = async () => { setUsers(await loadAllUsers()); };
  useFocusEffect(React.useCallback(() => { load(); }, []));

  const q = search.toLowerCase();
  const filtered = search.length > 0 ? users.filter(u => u.email.toLowerCase().includes(q) || (u.profile?.prenom || '').toLowerCase().includes(q) || (u.profile?.nom || '').toLowerCase().includes(q) || (u.profile?.exploitation || '').toLowerCase().includes(q)) : users;

  const handleDelete = (u: AdminUser) => {
    Alert.alert('Supprimer', `Supprimer definitivement ${u.email} ?\n${u.nbChamps} parcelles, ${u.surfaceHa.toFixed(1)} ha seront perdues.`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Tout supprimer', style: 'destructive', onPress: async () => { await deleteUserData(u.userId); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); load(); } },
    ]);
  };

  return <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <View style={{ paddingHorizontal: 14, paddingTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, gap: 6 }}>
        <Ionicons name="search-outline" size={14} color={colors.textMuted} />
        <TextInput style={{ flex: 1, height: 38, fontSize: 13, color: colors.text, fontFamily: fontFamily.sans }} value={search} onChangeText={setSearch} placeholder="Rechercher par email, nom, exploitation..." placeholderTextColor={colors.textMuted} />
        {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={14} color={colors.textMuted} /></TouchableOpacity>}
      </View>
    </View>
    <ScrollView contentContainerStyle={{ padding: 14 }}>
      {filtered.length === 0 ? <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>Aucun utilisateur.</Text> : (
        <View style={{ gap: 10 }}>
          {filtered.map(u => (
            <View key={u.userId} style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
              <TouchableOpacity onPress={() => setExpanded(expanded === u.userId ? null : u.userId)} style={{ padding: 14 }} activeOpacity={0.7}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>
                        {u.profile?.prenom || u.profile?.nom ? `${u.profile.prenom || ''} ${u.profile.nom || ''}`.trim() : u.email}
                      </Text>
                      <Ionicons name={expanded === u.userId ? 'chevron-up' : 'chevron-down'} size={13} color={colors.textMuted} />
                    </View>
                    <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{u.email}</Text>
                    {u.profile?.exploitation ? <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 3 }}>{u.profile.exploitation}</Text> : null}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(u)} style={{ padding: 6 }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: 20, marginTop: 10 }}>
                  <View><Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{u.nbChamps}</Text><Text style={{ fontSize: 10, color: colors.textMuted }}>parcelles</Text></View>
                  <View><Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{u.surfaceHa.toFixed(1)}</Text><Text style={{ fontSize: 10, color: colors.textMuted }}>hectares</Text></View>
                </View>
              </TouchableOpacity>
              {expanded === u.userId && (
                <View style={{ borderTopWidth: 1, borderTopColor: colors.border, padding: 14, backgroundColor: 'rgba(253,248,238,0.6)' }}>
                  {u.profile?.prenom && <View style={s.row}><Text style={s.lbl}>Prenom</Text><Text style={s.val}>{u.profile.prenom}</Text></View>}
                  {u.profile?.nom && <View style={s.row}><Text style={s.lbl}>Nom</Text><Text style={s.val}>{u.profile.nom}</Text></View>}
                  {u.profile?.telephone && <View style={s.row}><Text style={s.lbl}>Telephone</Text><Text style={s.val}>{u.profile.telephone}</Text></View>}
                  {u.profile?.siret && <View style={s.row}><Text style={s.lbl}>SIRET</Text><Text style={s.val}>{u.profile.siret}</Text></View>}
                  {u.profile?.typeAgriculture && <View style={s.row}><Text style={s.lbl}>Type agri.</Text><Text style={s.val}>{u.profile.typeAgriculture}</Text></View>}
                  <View style={s.row}><Text style={s.lbl}>ID</Text><Text style={[s.val, { fontSize: 10 }]}>{u.userId}</Text></View>
                  <TouchableOpacity style={s.btn} onPress={() => router.push({ pathname: '/(admin)/parcelles', params: { userId: u.userId } })}>
                    <Ionicons name="map-outline" size={14} color={colors.text} />
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>Voir ses parcelles</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 100 }} />
    </ScrollView>
  </View>;
}

const s = {
  row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, paddingVertical: 5 },
  lbl: { fontSize: 12, color: '#A89880', fontFamily: 'Outfit' } as const,
  val: { fontSize: 12, fontWeight: '500' as const, color: '#3D2E1F', fontFamily: 'Outfit' } as const,
  btn: { marginTop: 12, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radius.sm as number, backgroundColor: colors.primary, alignSelf: 'flex-start' as const },
};
