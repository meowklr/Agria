import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontFamily } from '../../src/theme';
import { loadAllUsers, deleteUserData, AdminUser } from '../../src/services/admin';
import * as Haptics from 'expo-haptics';

export default function AdminUtilisateurs() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const insets = useSafeAreaInsets();

  const load = async () => { setUsers(await loadAllUsers()); };
  useFocusEffect(React.useCallback(() => { load(); }, []));

  const handleDelete = (u: AdminUser) => {
    Alert.alert('Supprimer', `Supprimer toutes les donnees de ${u.email} ?\n${u.nbChamps} parcelles, ${u.surfaceHa.toFixed(1)} ha`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteUserData(u.userId); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); load(); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: (insets.top || 0) + 4, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: '#1a1510' }}>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Utilisateurs</Text>
        <Text style={{ fontSize: 11, color: 'rgba(168,152,128,0.7)', fontFamily: fontFamily.sans, marginTop: 2 }}>{users.length} comptes</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {users.length === 0 ? <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>Aucun utilisateur.</Text> : (
          <View style={{ gap: 10 }}>
            {users.map(u => (
              <View key={u.userId} style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>
                      {u.profile?.prenom || u.profile?.nom ? `${u.profile.prenom || ''} ${u.profile.nom || ''}`.trim() : u.email}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.textMuted, fontFamily: fontFamily.sans, marginTop: 1 }}>{u.email}</Text>
                    {u.profile?.exploitation ? <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{u.profile.exploitation}</Text> : null}
                  </View>
                  <TouchableOpacity onPress={() => handleDelete(u)} style={{ padding: 6 }}>
                    <Ionicons name="trash-outline" size={18} color={colors.danger} />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{u.nbChamps}</Text>
                    <Text style={{ fontSize: 10, color: colors.textMuted }}>parcelles</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{u.surfaceHa.toFixed(1)}</Text>
                    <Text style={{ fontSize: 10, color: colors.textMuted }}>hectares</Text>
                  </View>
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
