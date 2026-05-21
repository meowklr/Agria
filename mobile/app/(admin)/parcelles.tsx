import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fontFamily } from '../../src/theme';
import { loadAllChamps, loadAllUsers, deleteAdminChamp, updateAdminChamp, createAdminChamp, AdminChamp, AdminUser } from '../../src/services/admin';
import { Badge } from '../../src/components/Badge';
import { DropDown } from '../../src/components/DropDown';
import { onAdminRefresh } from '../../src/services/adminRefresh';
import * as Haptics from 'expo-haptics';

const CULTURES = [
  { label: 'Ble', value: 'ble' }, { label: 'Mais', value: 'mais' }, { label: 'Tournesol', value: 'tournesol' },
  { label: 'Colza', value: 'colza' }, { label: 'Vigne', value: 'vigne' }, { label: 'Orge', value: 'orge' },
];
const SOLS = [
  { label: 'Argileux', value: 'argileux' }, { label: 'Limoneux', value: 'limoneux' }, { label: 'Sableux', value: 'sableux' },
  { label: 'Calcaire', value: 'calcaire' },
];

export default function AdminParcelles() {
  const [champs, setChamps] = useState<AdminChamp[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'nom' | 'surface' | 'email'>('nom');
  const [compact, setCompact] = useState(false);
  const { userId } = useLocalSearchParams<{ userId?: string }>();

  const [editModal, setEditModal] = useState<AdminChamp | null>(null);
  const [editNom, setEditNom] = useState('');
  const [editCulture, setEditCulture] = useState('');
  const [editSol, setEditSol] = useState('');
  const [editSurface, setEditSurface] = useState('');

  const [createModal, setCreateModal] = useState(false);
  const [createNom, setCreateNom] = useState('');
  const [createCulture, setCreateCulture] = useState('');
  const [createSol, setCreateSol] = useState('');
  const [createSurface, setCreateSurface] = useState('');
  const [createUser, setCreateUser] = useState('');

  const load = async () => {
    const [c, u] = await Promise.all([loadAllChamps(), loadAllUsers()]);
    setChamps(c); setUsers(u);
  };
  useFocusEffect(React.useCallback(() => { load(); }, []));
  useEffect(() => onAdminRefresh(load), []);

  const filtered = userId ? champs.filter(c => c.userId === userId) : champs;
  const q = search.toLowerCase();
  const searched = search.length > 0
    ? filtered.filter(c => (c.champ.nom || '').toLowerCase().includes(q) || (c.champ.culture || '').toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    : filtered;
  const sorted = [...searched].sort((a, b) => {
    if (sortBy === 'nom') return (a.champ.nom || '').localeCompare(b.champ.nom || '');
    if (sortBy === 'surface') return (parseFloat(b.champ.surface) || 0) - (parseFloat(a.champ.surface) || 0);
    return a.email.localeCompare(b.email);
  });

  const handleDelete = (c: AdminChamp) => {
    Alert.alert('Supprimer', `"${c.champ.nom}" de ${c.email} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteAdminChamp(c.userId, c.champ.id); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); load(); } },
    ]);
  };

  const openEdit = (c: AdminChamp) => {
    setEditModal(c); setEditNom(c.champ.nom || ''); setEditCulture(c.champ.culture || ''); setEditSol(c.champ.typeSol || ''); setEditSurface(c.champ.surface || '');
  };

  const handleEditSave = async () => {
    if (!editModal) return;
    await updateAdminChamp(editModal.userId, editModal.champ.id, { nom: editNom, culture: editCulture, typeSol: editSol, surface: editSurface });
    setEditModal(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    load();
  };

  const handleCreate = async () => {
    if (!createUser || !createNom) { Alert.alert('Champs requis', 'Nom et utilisateur obligatoires.'); return; }
    const u = users.find(u => u.userId === createUser || u.email === createUser);
    if (!u) { Alert.alert('Utilisateur introuvable', 'Verifiez l\'email ou l\'ID.'); return; }
    await createAdminChamp(u.userId, { id: '', nom: createNom, culture: createCulture, typeSol: createSol, surface: createSurface || '0', stade: '', dateSemis: '' });
    setCreateModal(false); setCreateNom(''); setCreateCulture(''); setCreateSol(''); setCreateSurface(''); setCreateUser('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    load();
  };

  return <View style={{ flex: 1, backgroundColor: colors.bg }}>
    <View style={{ paddingHorizontal: 14, paddingTop: 12, gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 10, gap: 6 }}>
        <Ionicons name="search-outline" size={14} color={colors.textMuted} />
        <TextInput style={{ flex: 1, height: 38, fontSize: 13, color: colors.text, fontFamily: fontFamily.sans }} value={search} onChangeText={setSearch} placeholder="Rechercher par nom, culture, email..." placeholderTextColor={colors.textMuted} />
        {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><Ionicons name="close-circle" size={14} color={colors.textMuted} /></TouchableOpacity>}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {(['nom', 'surface', 'email'] as const).map(k => (
            <TouchableOpacity key={k} onPress={() => setSortBy(k)} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: sortBy === k ? colors.primary : 'transparent' }}>
              <Text style={{ fontSize: 10, fontWeight: '600', color: sortBy === k ? colors.text : colors.textMuted, fontFamily: fontFamily.sans }}>{k}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setCompact(!compact)} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: compact ? 'rgba(232,184,75,0.1)' : 'transparent' }}>
            <Ionicons name="list-outline" size={14} color={compact ? colors.primary : colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCreateModal(true)} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(232,184,75,0.1)' }}>
            <Ionicons name="add-circle-outline" size={14} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <ScrollView contentContainerStyle={{ padding: 14 }}>
      {userId && <View style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(232,184,75,0.06)', borderRadius: radius.sm }}>
        <Ionicons name="funnel-outline" size={12} color={colors.primary} />
        <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '500', fontFamily: fontFamily.sans }}>Filtre utilisateur actif</Text>
      </View>}
      {sorted.length === 0 ? <Text style={{ textAlign: 'center', color: colors.textMuted, marginTop: 40 }}>Aucune parcelle.</Text> : (
        <View style={{ gap: compact ? 4 : 10 }}>
          {sorted.map(c => compact ? (
            <View key={c.champ.id + c.userId} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, paddingHorizontal: 10, backgroundColor: colors.surface, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }} numberOfLines={1}>{c.champ.nom || '?'}</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted }}>{c.champ.surface} ha</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                <TouchableOpacity onPress={() => openEdit(c)} style={{ padding: 4 }}><Ionicons name="create-outline" size={15} color={colors.textSecondary} /></TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(c)} style={{ padding: 4 }}><Ionicons name="trash-outline" size={15} color={colors.danger} /></TouchableOpacity>
              </View>
            </View>
          ) : (
            <View key={c.champ.id + c.userId} style={{ backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>{c.champ.nom || 'Parcelle'}</Text>
                  <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{c.email}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <TouchableOpacity onPress={() => openEdit(c)} style={{ padding: 6 }}><Ionicons name="create-outline" size={17} color={colors.textSecondary} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(c)} style={{ padding: 6 }}><Ionicons name="trash-outline" size={17} color={colors.danger} /></TouchableOpacity>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <Badge text={c.champ.surface + ' ha'} variant="info" />
                {c.champ.culture ? <Badge text={c.champ.culture} variant="info" /> : null}
                {c.champ.stade ? <Badge text={c.champ.stade} variant="info" /> : null}
                {c.champ.typeSol ? <Badge text={c.champ.typeSol} variant="info" /> : null}
              </View>
            </View>
          ))}
        </View>
      )}
      <View style={{ height: 100 }} />
    </ScrollView>

    {/* EDIT MODAL */}
    <Modal visible={!!editModal} transparent animationType="fade" onRequestClose={() => setEditModal(null)}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.4)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={() => setEditModal(null)}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, width: '100%', padding: 20, gap: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Editer parcelle</Text>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Nom</Text><TextInput style={fieldStyle} value={editNom} onChangeText={setEditNom} /></View>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Culture</Text><DropDown value={editCulture} options={CULTURES} onChange={setEditCulture} placeholder="Choisir" /></View>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Type de sol</Text><DropDown value={editSol} options={SOLS} onChange={setEditSol} placeholder="Choisir" /></View>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Surface (ha)</Text><TextInput style={fieldStyle} value={editSurface} onChangeText={setEditSurface} keyboardType="numeric" /></View>
          <TouchableOpacity onPress={handleEditSave} style={{ backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>Enregistrer</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>

    {/* CREATE MODAL */}
    <Modal visible={createModal} transparent animationType="fade" onRequestClose={() => setCreateModal(false)}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.4)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={() => setCreateModal(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}} style={{ backgroundColor: colors.surface, borderRadius: radius.lg, width: '100%', padding: 20, gap: 14 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Creer parcelle</Text>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Utilisateur (email ou ID)</Text><TextInput style={fieldStyle} value={createUser} onChangeText={setCreateUser} placeholder="email@exemple.fr" placeholderTextColor={colors.textMuted} /></View>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Nom parcelle</Text><TextInput style={fieldStyle} value={createNom} onChangeText={setCreateNom} /></View>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Culture</Text><DropDown value={createCulture} options={CULTURES} onChange={setCreateCulture} placeholder="Choisir" /></View>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Type de sol</Text><DropDown value={createSol} options={SOLS} onChange={setCreateSol} placeholder="Choisir" /></View>
          <View><Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>Surface (ha)</Text><TextInput style={fieldStyle} value={createSurface} onChangeText={setCreateSurface} keyboardType="numeric" /></View>
          <TouchableOpacity onPress={handleCreate} style={{ backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>Creer</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  </View>;
}

const fieldStyle = { minHeight: 42, paddingHorizontal: 12, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, backgroundColor: colors.surface, color: colors.text, fontSize: 14, fontFamily: 'Outfit' as const };
