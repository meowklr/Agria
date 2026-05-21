import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontFamily } from '../../src/theme';
import { loadLogs, listOrphanData, cleanOrphanData, clearLogs, purgeInactiveUsers, AdminLog } from '../../src/services/admin';
import { onAdminRefresh } from '../../src/services/adminRefresh';

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  success: { bg: '#EAF3E0', color: colors.success },
  danger: { bg: '#FEF3F0', color: colors.danger },
  info: { bg: 'rgba(232,184,75,0.08)', color: colors.textSecondary },
};

function ts(n: number) {
  const d = new Date(n);
  return d.toLocaleDateString('fr', { day: '2-digit', month: '2-digit' }) + ' ' +
    d.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' });
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLog[]>([]);

  const load = async () => { setLogs(await loadLogs()); };
  useFocusEffect(React.useCallback(() => { load(); }, []));
  useEffect(() => onAdminRefresh(load), []);

  const handleClean = async () => {
    const orphans = await listOrphanData();
    if (orphans.length === 0) { Alert.alert('Rien a nettoyer', 'Aucune donnee orpheline trouvee.'); return; }
    const preview = orphans.slice(0, 5).map(o => `[${o.type}] ${o.detail}`).join('\n') + (orphans.length > 5 ? `\n... et ${orphans.length - 5} autre(s)` : '');
    Alert.alert(`${orphans.length} donnee(s) orpheline(s)`, preview + '\n\nSupprimer tout ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Tout nettoyer', style: 'destructive', onPress: async () => {
        const r = await cleanOrphanData();
        Alert.alert('Nettoyage termine', r.removed.length + ' element(s) supprime(s).');
        load();
      }},
    ]);
  };

  const handleClearLogs = () => {
    Alert.alert('Vider les logs', 'Supprimer tout l\'historique ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Vider', style: 'destructive', onPress: async () => { await clearLogs(); load(); } },
    ]);
  };

  const handlePurge = () => {
    Alert.alert('Purge comptes inactifs', 'Supprimer tous les comptes sans activite depuis plus de 6 mois ?\nCette action est irreversible.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Purger', style: 'destructive', onPress: async () => {
        const r = await purgeInactiveUsers();
        Alert.alert('Purge terminee', r.count + ' compte(s) inactif(s) supprime(s).');
        load();
      }},
    ]);
  };

  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16 }}>
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
      <TouchableOpacity onPress={handleClean} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: 'rgba(181,83,58,.3)', alignItems: 'center' }}>
        <Ionicons name="flash-outline" size={20} color={colors.danger} style={{ marginBottom: 4 }} />
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.danger, fontFamily: fontFamily.sans }}>Nettoyer BDD</Text>
        <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2, textAlign: 'center' }}>Donnees orphelines</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePurge} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: 'rgba(181,83,58,.3)', alignItems: 'center' }}>
        <Ionicons name="skull-outline" size={20} color={colors.danger} style={{ marginBottom: 4 }} />
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.danger, fontFamily: fontFamily.sans }}>Purger inactifs</Text>
        <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 2, textAlign: 'center' }}>Comptes {'>'}6 mois</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={handleClearLogs} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, padding: 10, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-end' }}>
      <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary, fontFamily: fontFamily.sans }}>Vider logs ({logs.length})</Text>
    </TouchableOpacity>

    {logs.length === 0 ? <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 20 }}>Aucune activite.</Text> : (
      <View style={{ gap: 6 }}>
        {logs.map(l => {
          const s = TYPE_STYLE[l.type] || TYPE_STYLE.info;
          return (
            <View key={l.id} style={{ backgroundColor: s.bg, borderRadius: radius.sm, padding: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: s.color, fontFamily: fontFamily.sans, flex: 1 }}>{l.action}</Text>
                <Text style={{ fontSize: 10, color: colors.textMuted, marginLeft: 8 }}>{ts(l.date)}</Text>
              </View>
              <Text style={{ fontSize: 11, color: s.color, marginTop: 3, opacity: 0.75 }}>{l.detail}</Text>
            </View>
          );
        })}
      </View>
    )}
    <View style={{ height: 100 }} />
  </ScrollView>;
}
