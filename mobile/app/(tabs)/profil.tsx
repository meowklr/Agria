import React, { useEffect, useState } from 'react'; import { View, Text, ScrollView, Switch, TouchableOpacity, Modal, Alert, KeyboardAvoidingView, Platform, LayoutAnimation, UIManager, Image, ActivityIndicator, ActionSheetIOS } from 'react-native'; import { router } from 'expo-router'; import * as Haptics from 'expo-haptics'; import * as ImagePicker from 'expo-image-picker'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { Ionicons } from '@expo/vector-icons'; import { colors, radius, fontFamily } from '../../src/theme'; import { Card } from '../../src/components/Card'; import { Button } from '../../src/components/Button'; import { Input } from '../../src/components/Input'; import { useProfile } from '../../src/hooks/useProfile'; import { logout, changePassword, updateEmail, getSessionEmail, getUserId } from '../../src/services/auth'; import { deleteOwnAccount } from '../../src/services/admin'; import { ScreenFade } from '../../src/components/ScreenFade';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DATA_LEGAL = [
  { icon: 'document-text-outline' as const, label: 'Mentions legales', body: 'Agria SAS au capital de 10 000\nSiege social : 12 rue des Ble, 75001 Paris\nRCS Paris 123 456 789\nDirecteur de publication : Jean Martin\nHebergeur : OVH, 2 rue Kellermann, 59100 Roubaix' },
  { icon: 'shield-checkmark-outline' as const, label: 'CGU', body: 'Conditions Generales d\'Utilisation\n\n1. Objet\nAgria fournit un outil de gestion de parcelles agricoles a titre experimental.\n\n2. Donnees\nLes donnees saisies restent la propriete de l\'utilisateur. Agria s\'engage a ne pas les divulguer.\n\n3. Responsabilite\nCe service est fourni en l\'etat, sans garantie. L\'utilisation des donnees agronomiques est a titre indicatif uniquement.' },
  { icon: 'mail-outline' as const, label: 'Contact', body: 'Email : contact@agria.fr\nTelephone : 01 23 45 67 89\nAdresse : 12 rue des Ble, 75001 Paris\n\nSupport technique : support@agria.fr\nService commercial : commercial@agria.fr' },
];

const DATA_SOCIAL = [
  { icon: 'logo-facebook' as const, label: 'Facebook' },
  { icon: 'logo-twitter' as const, label: 'X' },
  { icon: 'logo-instagram' as const, label: 'Instagram' },
  { icon: 'logo-linkedin' as const, label: 'LinkedIn' },
];

const lbl = (t: string) => <Text style={{fontSize:12,fontWeight:'500',color:colors.textSecondary,marginBottom:6,textTransform:'uppercase',letterSpacing:0.3,fontFamily:fontFamily.sans}}>{t}</Text>;

export default function ProfilScreen() {
  const { profile, prefs, stats, saveProfile, savePrefs, avatarUploading, uploadAvatar, deleteUserAvatar } = useProfile();
  const [prenom, setPrenom] = useState(''); const [nom, setNom] = useState(''); const [tel, setTel] = useState('');
  const [expl, setExpl] = useState(''); const [siret, setSiret] = useState(''); const [typeAgri, setTypeAgri] = useState('');
  const [notifs, setNotifs] = useState(false); const [uniteHa, setUniteHa] = useState(true);
  const [legalModal, setLegalModal] = useState<{ title: string; body: string } | null>(null);
  const [savedOk, setSavedOk] = useState(false);
  const [infosOpen, setInfosOpen] = useState(true);
  const [paramsOpen, setParamsOpen] = useState(false);
  const toggleSection = (setter: (v: boolean) => void, current: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter(!current);
  };
  const showSaved = () => { setSavedOk(true); setTimeout(() => setSavedOk(false), 1800); };

  const pickAndUpload = async (type: 'camera' | 'gallery') => {
    try {
      const permission = type === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission refusee', 'Autorisez l\'acces dans les reglages de votre telephone.');
        return;
      }
      const result = type === 'camera'
        ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 })
        : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });
      if (!result.canceled && result.assets?.[0]?.uri) {
        await uploadAvatar(result.assets[0].uri);
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Impossible de charger la photo.');
    }
  };

  const handleAvatarDelete = async () => {
    try { await deleteUserAvatar(); } catch (e: any) { Alert.alert('Erreur', e.message || 'Impossible de supprimer la photo.'); }
  };

  const handleAvatarPress = () => {
    if (Platform.OS === 'ios') {
      const options = profile.imageBase64
        ? ['Prendre une photo', 'Choisir dans la galerie', 'Supprimer la photo', 'Annuler']
        : ['Prendre une photo', 'Choisir dans la galerie', 'Annuler'];
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: profile.imageBase64 ? 2 : -1,
          tintColor: colors.primary,
        },
        (idx) => {
          if (idx === 0) pickAndUpload('camera');
          else if (idx === 1) pickAndUpload('gallery');
          else if (idx === 2 && profile.imageBase64) handleAvatarDelete();
        },
      );
    } else {
      Alert.alert('Photo de profil', undefined, [
        { text: 'Prendre une photo', onPress: () => pickAndUpload('camera') },
        { text: 'Choisir dans la galerie', onPress: () => pickAndUpload('gallery') },
        ...(profile.imageBase64 ? [{ text: 'Supprimer la photo', style: 'destructive' as const, onPress: () => handleAvatarDelete() }] : []),
        { text: 'Annuler', style: 'cancel' },
      ]);
    }
  };

  const [newEmail, setNewEmail] = useState('');
  const [oldPwd, setOldPwd] = useState(''); const [newPwd, setNewPwd] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => { setPrenom(profile.prenom||''); setNom(profile.nom||''); setTel(profile.telephone||''); setExpl(profile.exploitation||''); setSiret(profile.siret||''); setTypeAgri(profile.typeAgriculture||''); setNotifs(prefs.notifications||false); setUniteHa(prefs.uniteHa!==false); }, [profile, prefs]);

  const initials = ((prenom||'A')[0]+(nom||'A')[0]).toUpperCase();

  const handleSaveProfile = async () => {
    await saveProfile({...profile,prenom,nom,telephone:tel,exploitation:expl,siret,typeAgriculture:typeAgri});
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); showSaved();
  };

  return <ScreenFade><KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
  <ScrollView style={{flex:1,backgroundColor:colors.bg}} contentContainerStyle={{padding:16, paddingTop: (insets.top || 0) + 16, paddingBottom: 100}} showsVerticalScrollIndicator={false}>

    {/* HEADER AVATAR */}
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20, paddingHorizontal: 4 }}>
      <TouchableOpacity onPress={handleAvatarPress} activeOpacity={0.8}>
        <View>
          <View style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: colors.primary, padding: 2 }}>
            {profile.imageBase64 ? (
              <View style={{ flex: 1, borderRadius: 27, overflow: 'hidden', backgroundColor: colors.border }}>
                <Image source={{ uri: profile.imageBase64 }} style={{ width: '100%', height: '100%' }} />
              </View>
            ) : (
              <View style={{ flex: 1, borderRadius: 27, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{initials}</Text>
              </View>
            )}
          </View>
          <View style={{ position: 'absolute', bottom: 2, right: 0, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="camera-outline" size={12} color={colors.primary} />
          </View>
          {avatarUploading && (
            <View style={{ position: 'absolute', top: 2, left: 2, right: 2, bottom: 2, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 28, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator color="#fff" size="small" />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>
          {prenom ? prenom + ' ' + nom : 'Mon profil'}
        </Text>
        {expl ? <Text style={{ fontSize: 13, color: colors.textSecondary, fontFamily: fontFamily.sans, marginTop: 2 }}>{expl}</Text> : null}
      </View>
    </View>

    {/* STATS ROW */}
    <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
      {[
        { value: stats.nbChamps, label: 'Champs', icon: 'map-outline' as const, sub: '' },
        { value: stats.surface + ' ha', label: 'Surface', icon: 'resize-outline' as const, sub: '' },
        { value: stats.topCulture, label: 'Cultures', icon: 'leaf-outline' as const, sub: stats.nbCultures > 1 ? '(' + (stats.nbCultures - 1) + ' autre' + (stats.nbCultures > 2 ? 's' : '') + ')' : '' },
      ].map((s, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, alignItems: 'center', gap: 2 }}>
          <Ionicons name={s.icon} size={18} color={colors.primary} />
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, fontFamily: fontFamily.serif }}>{s.value}</Text>
          <Text style={{ fontSize: 11, color: colors.textMuted, fontFamily: fontFamily.sans }}>{s.label}</Text>
          {s.sub ? <Text style={{ fontSize: 10, color: colors.accent, fontFamily: fontFamily.sans }}>{s.sub}</Text> : null}
        </View>
      ))}
    </View>

    {/* INFORMATIONS PERSONNELLES */}
    <Card style={{ marginBottom: 16 }}>
      <TouchableOpacity onPress={() => toggleSection(setInfosOpen, infosOpen)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: infosOpen ? 14 : 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="person-outline" size={18} color={infosOpen ? colors.primary : colors.textSecondary} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: infosOpen ? colors.primary : colors.text, fontFamily: fontFamily.sans }}>Informations personnelles</Text>
        </View>
        <Ionicons name={infosOpen ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
      </TouchableOpacity>
      {infosOpen && <View style={{ gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 }}>
        {lbl('Prenom')}<Input value={prenom} onChangeText={setPrenom} placeholder="Prenom" />
        {lbl('Nom')}<Input value={nom} onChangeText={setNom} placeholder="Nom" />
        {lbl('Telephone')}<Input value={tel} onChangeText={setTel} placeholder="Optionnel" keyboardType="phone-pad" />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
        {lbl('Nom exploitation')}<Input value={expl} onChangeText={setExpl} placeholder="Nom exploitation" />
        {lbl('SIRET')}<Input value={siret} onChangeText={setSiret} placeholder="14 chiffres" keyboardType="numeric" />
        {lbl('Type agriculture')}<Input value={typeAgri} onChangeText={setTypeAgri} placeholder="Ex: polyculture" />
        <View style={{ height: 4 }} />
        <Button title="Sauvegarder" onPress={handleSaveProfile} />
      </View>}
    </Card>

    {savedOk && <View style={{ marginBottom: 16, backgroundColor: '#EAF3E0', borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ionicons name="checkmark-circle" size={15} color={colors.success} />
      <Text style={{ flex: 1, fontSize: 12, color: colors.success, fontWeight: '500', fontFamily: fontFamily.sans }}>Informations sauvegardees.</Text>
    </View>}

    {/* PARAMETRES */}
    <Card style={{ marginBottom: 16 }}>
      <TouchableOpacity onPress={() => toggleSection(setParamsOpen, paramsOpen)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: paramsOpen ? 14 : 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="settings-outline" size={18} color={paramsOpen ? colors.primary : colors.textSecondary} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: paramsOpen ? colors.primary : colors.text, fontFamily: fontFamily.sans }}>Parametres</Text>
        </View>
        <Ionicons name={paramsOpen ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
      </TouchableOpacity>
      {paramsOpen && <View style={{ gap: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 }}>
        {lbl('Changer email')}<Input value={newEmail} onChangeText={setNewEmail} placeholder={profile.email || 'Nouvel email'} keyboardType="email-address" autoCapitalize="none" />
        <Button title="Mettre a jour l'email" variant="secondary" onPress={async () => { try { const old = await getSessionEmail(); if (!old) throw new Error('Session introuvable.'); await updateEmail(old, newEmail); Alert.alert('OK', 'Email mis a jour.'); setNewEmail(''); } catch(e:any) { Alert.alert('Erreur', e.message); } }} />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
        {lbl('Changer mot de passe')}<Input value={oldPwd} onChangeText={setOldPwd} placeholder="Ancien mot de passe" secureTextEntry /><Input value={newPwd} onChangeText={setNewPwd} placeholder="Nouveau (6+ car.)" secureTextEntry />
        <Button title="Changer le mot de passe" variant="secondary" onPress={async () => { try { const old = await getSessionEmail(); if (!old) throw new Error('Session introuvable.'); await changePassword(old, oldPwd, newPwd); Alert.alert('OK', 'Mot de passe change.'); setOldPwd(''); setNewPwd(''); } catch(e:any) { Alert.alert('Erreur', e.message); } }} />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
        <Button title="Supprimer mon compte" variant="secondary" onPress={() => { Alert.alert('Supprimer le compte', 'Toutes vos donnees seront definitivement perdues.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Tout supprimer', style: 'destructive', onPress: async () => { try { const uid = await getUserId(); await deleteOwnAccount(uid); await logout(); router.replace('/login'); } catch(e:any) { Alert.alert('Erreur', e.message); } } }]); }} style={{ borderColor: colors.danger }} />
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:6}}><Text style={{fontSize:14,fontWeight:'500',color:colors.text,fontFamily:fontFamily.sans}}>Notifications</Text><Switch value={notifs} onValueChange={v => { setNotifs(v); savePrefs({...prefs,notifications:v}); }} trackColor={{false:colors.border,true:colors.primary}} thumbColor={colors.surface} /></View>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:6}}><Text style={{fontSize:14,fontWeight:'500',color:colors.text,fontFamily:fontFamily.sans}}>Unite hectares</Text><Switch value={uniteHa} onValueChange={v => { setUniteHa(v); savePrefs({...prefs,uniteHa:v}); }} trackColor={{false:colors.border,true:colors.primary}} thumbColor={colors.surface} /></View>
      </View>}
    </Card>

    {/* DECONNEXION */}
    <Button title="Se deconnecter" variant="secondary" onPress={async () => { await logout(); router.replace('/login'); }} haptic={false} style={{ marginBottom: 20 }} />

    {/* FOOTER: INFORMATIONS + RESEAUX SOCIAUX */}
    <Card style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textMuted, fontFamily: fontFamily.sans, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Informations</Text>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {DATA_LEGAL.map((item, i) => (
          <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => setLegalModal({ title: item.label, body: item.body })}>
            <Ionicons name={item.icon} size={14} color={colors.primary} />
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontFamily: fontFamily.sans }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>

    <Card>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textMuted, fontFamily: fontFamily.sans, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Reseaux sociaux</Text>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        {DATA_SOCIAL.map((r, i) => (
          <TouchableOpacity key={i} onPress={() => setLegalModal({ title: r.label, body: 'Lien vers ' + r.label + ' (non fonctionnel - maquette).\n\nSuivez-nous pour les actualites Agria.' })}>
            <Ionicons name={r.icon} size={22} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </Card>

    {/* MODAL LEGAL */}
    <Modal visible={!!legalModal} transparent animationType="fade" onRequestClose={() => setLegalModal(null)}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.4)', justifyContent: 'center', alignItems: 'center', padding: 24 }} activeOpacity={1} onPress={() => setLegalModal(null)}>
        <View style={{ backgroundColor: colors.surface, borderRadius: 16, width: '100%', maxHeight: '70%', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif, marginBottom: 12 }}>{legalModal?.title}</Text>
          <ScrollView><Text style={{ fontSize: 14, color: colors.text, lineHeight: 20, fontFamily: fontFamily.sans }}>{legalModal?.body}</Text></ScrollView>
          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'flex-end' }} onPress={() => setLegalModal(null)}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.sans }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>

  </ScrollView></KeyboardAvoidingView></ScreenFade>;
}
