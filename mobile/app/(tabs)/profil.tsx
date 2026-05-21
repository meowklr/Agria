import React, { useEffect, useState, useRef } from 'react'; import { View, Text, ScrollView, Switch, TouchableOpacity, Modal, Alert, Animated, LayoutAnimation, Platform, UIManager } from 'react-native'; import { router } from 'expo-router'; import * as Haptics from 'expo-haptics'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { Ionicons } from '@expo/vector-icons'; import { colors, radius, fontFamily } from '../../src/theme'; import { Card } from '../../src/components/Card'; import { Button } from '../../src/components/Button'; import { Input } from '../../src/components/Input'; import { SectionTitle } from '../../src/components/Typography'; import { useProfile } from '../../src/hooks/useProfile'; import { logout, changePassword, updateEmail, getSessionEmail, getUserId } from '../../src/services/auth'; import { deleteOwnAccount } from '../../src/services/admin'; import { ScreenFade } from '../../src/components/ScreenFade';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProfilScreen() {
  const { profile, prefs, stats, saveProfile, savePrefs } = useProfile();
  const [prenom, setPrenom] = useState(''); const [nom, setNom] = useState(''); const [tel, setTel] = useState('');
  const [expl, setExpl] = useState(''); const [siret, setSiret] = useState(''); const [typeAgri, setTypeAgri] = useState('');
  const [notifs, setNotifs] = useState(false); const [uniteHa, setUniteHa] = useState(true);
  const [legalModal, setLegalModal] = useState<{ title: string; body: string } | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [oldPwd, setOldPwd] = useState(''); const [newPwd, setNewPwd] = useState('');
  const [section, setSection] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => { setPrenom(profile.prenom||''); setNom(profile.nom||''); setTel(profile.telephone||''); setExpl(profile.exploitation||''); setSiret(profile.siret||''); setTypeAgri(profile.typeAgriculture||''); setNotifs(prefs.notifications||false); setUniteHa(prefs.uniteHa!==false); }, [profile, prefs]);

  const toggle = (s: string) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setSection(section === s ? null : s); };

  const initials = ((prenom||'A')[0]+(nom||'A')[0]).toUpperCase();
  const lbl = (t: string) => <Text style={{fontSize:12,fontWeight:'500',color:colors.textSecondary,marginBottom:6,textTransform:'uppercase',letterSpacing:0.3,fontFamily:fontFamily.sans}}>{t}</Text>;

  return <ScreenFade><ScrollView style={{flex:1,backgroundColor:colors.bg}} contentContainerStyle={{padding:16, paddingTop: (insets.top || 0) + 16, paddingBottom: 100}}>
    <View style={{paddingVertical:8,marginBottom:16}}><Text style={{fontSize:22,fontWeight:'600',color:colors.primary,fontFamily:fontFamily.serif}}>Mon profil</Text></View>

    {/* DROPDOWN SECTIONS */}
    <View style={{ gap: 8, marginBottom: 20 }}>
      {[
        { key: 'identite', icon: 'person-outline' as const, label: 'Identite', content: () => <View style={{gap:10}}>
          {lbl('Prenom')}<Input value={prenom} onChangeText={setPrenom} placeholder="Prenom" />
          {lbl('Nom')}<Input value={nom} onChangeText={setNom} placeholder="Nom" />
          {lbl('Telephone')}<Input value={tel} onChangeText={setTel} placeholder="Optionnel" keyboardType="phone-pad" />
          <Button title="Sauvegarder" onPress={async () => { await saveProfile({prenom,nom,telephone:tel}); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }} />
        </View> },
        { key: 'exploitation', icon: 'home-outline' as const, label: 'Exploitation', content: () => <View style={{gap:10}}>
          {lbl('Nom exploitation')}<Input value={expl} onChangeText={setExpl} placeholder="Nom exploitation" />
          {lbl('SIRET')}<Input value={siret} onChangeText={setSiret} placeholder="14 chiffres" keyboardType="numeric" />
          {lbl('Type agriculture')}<Input value={typeAgri} onChangeText={setTypeAgri} placeholder="Ex: polyculture" />
          <Button title="Sauvegarder" onPress={async () => { await saveProfile({...profile,prenom,nom,telephone:tel,exploitation:expl,siret,typeAgriculture:typeAgri}); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }} />
        </View> },
        { key: 'parametres', icon: 'settings-outline' as const, label: 'Parametres', content: () => <View style={{gap:10}}>
          {lbl('Changer email')}<Input value={newEmail} onChangeText={setNewEmail} placeholder={profile.email || 'Nouvel email'} keyboardType="email-address" autoCapitalize="none" />
          <Button title="Mettre a jour l'email" variant="secondary" onPress={async () => { try { const old = await getSessionEmail(); if (!old) throw new Error('Session introuvable.'); await updateEmail(old, newEmail); Alert.alert('OK', 'Email mis a jour.'); setNewEmail(''); } catch(e:any) { Alert.alert('Erreur', e.message); } }} />
          <View style={{height:1,backgroundColor:colors.border}} />
          {lbl('Changer mot de passe')}<Input value={oldPwd} onChangeText={setOldPwd} placeholder="Ancien mot de passe" secureTextEntry /><Input value={newPwd} onChangeText={setNewPwd} placeholder="Nouveau (4+ car.)" secureTextEntry />
          <Button title="Changer le mot de passe" variant="secondary" onPress={async () => { try { const old = await getSessionEmail(); if (!old) throw new Error('Session introuvable.'); await changePassword(old, oldPwd, newPwd); Alert.alert('OK', 'Mot de passe change.'); setOldPwd(''); setNewPwd(''); } catch(e:any) { Alert.alert('Erreur', e.message); } }} />
          <View style={{height:1,backgroundColor:colors.border}} />
          <Button title="Supprimer mon compte" variant="secondary" onPress={() => { Alert.alert('Supprimer le compte', 'Toutes vos donnees seront definitivement perdues.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Tout supprimer', style: 'destructive', onPress: async () => { try { const uid = await getUserId(); await deleteOwnAccount(uid); await logout(); router.replace('/login'); } catch(e:any) { Alert.alert('Erreur', e.message); } } }]); }} style={{ borderColor: colors.danger }} />
        </View> },
      ].map(item => (
        <View key={item.key} style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          <TouchableOpacity onPress={() => toggle(item.key)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 }} activeOpacity={0.7}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name={item.icon} size={18} color={section === item.key ? colors.primary : colors.textSecondary} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: section === item.key ? colors.primary : colors.text, fontFamily: fontFamily.sans }}>{item.label}</Text>
            </View>
            <Ionicons name={section === item.key ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} />
          </TouchableOpacity>
          {section === item.key && <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: 'rgba(253,248,238,0.5)' }}>{item.content()}</View>}
        </View>
      ))}
    </View>

    <Card><SectionTitle title="Statistiques" />
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.border}}><Text style={{fontSize:12,color:colors.textMuted}}>Champs</Text><Text style={{fontSize:18,fontWeight:'700',color:colors.text,fontFamily:fontFamily.serif}}>{stats.nbChamps}</Text></View>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.border}}><Text style={{fontSize:12,color:colors.textMuted}}>Surface totale</Text><Text style={{fontSize:18,fontWeight:'700',color:colors.text,fontFamily:fontFamily.serif}}>{stats.surface} ha</Text></View>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:14}}><Text style={{fontSize:12,color:colors.textMuted}}>Cultures</Text><Text style={{fontSize:14,color:colors.text}}>{stats.cultures}</Text></View>
    </Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Preferences" />
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:colors.border}}><Text style={{fontSize:14,fontWeight:'500',color:colors.text}}>Notifications</Text><Switch value={notifs} onValueChange={v => { setNotifs(v); savePrefs({...prefs,notifications:v}); }} trackColor={{true:colors.success}} /></View>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12}}><Text style={{fontSize:14,fontWeight:'500',color:colors.text}}>Unite hectares</Text><Switch value={uniteHa} onValueChange={v => { setUniteHa(v); savePrefs({...prefs,uniteHa:v}); }} trackColor={{true:colors.success}} /></View>
    </Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Securite" /><Button title="Se deconnecter" variant="secondary" onPress={async () => { await logout(); router.replace('/login'); }} haptic={false} /></Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Informations" />
      {[
        { icon: 'document-text-outline' as const, label: 'Mentions legales', body: 'Agria SAS au capital de 10 000\nSiege social : 12 rue des Ble, 75001 Paris\nRCS Paris 123 456 789\nDirecteur de publication : Jean Martin\nHebergeur : OVH, 2 rue Kellermann, 59100 Roubaix' },
        { icon: 'shield-checkmark-outline' as const, label: 'CGU', body: 'Conditions Generales d\'Utilisation\n\n1. Objet\nAgria fournit un outil de gestion de parcelles agricoles a titre experimental.\n\n2. Donnees\nLes donnees saisies restent la propriete de l\'utilisateur. Agria s\'engage a ne pas les divulguer.\n\n3. Responsabilite\nCe service est fourni en l\'etat, sans garantie. L\'utilisation des donnees agronomiques est a titre indicatif uniquement.' },
        { icon: 'mail-outline' as const, label: 'Contact', body: 'Email : contact@agria.fr\nTelephone : 01 23 45 67 89\nAdresse : 12 rue des Ble, 75001 Paris\n\nSupport technique : support@agria.fr\nService commercial : commercial@agria.fr' },
      ].map((item, i) => (
        <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderBottomColor: colors.border }} onPress={() => setLegalModal({ title: item.label, body: item.body })}>
          <Ionicons name={item.icon} size={16} color={colors.primary} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text, fontFamily: fontFamily.sans }}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Reseaux sociaux" />
      <View style={{ flexDirection: 'row', gap: 16, paddingVertical: 8 }}>
        {[
          { icon: 'logo-facebook' as const, label: 'Facebook' },
          { icon: 'logo-twitter' as const, label: 'X' },
          { icon: 'logo-instagram' as const, label: 'Instagram' },
          { icon: 'logo-linkedin' as const, label: 'LinkedIn' },
        ].map((r, i) => (
          <TouchableOpacity key={i} style={{ alignItems: 'center', gap: 4 }} onPress={() => setLegalModal({ title: r.label, body: 'Lien vers ' + r.label + ' (non fonctionnel - maquette).\n\nSuivez-nous pour les actualites Agria.' })}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name={r.icon} size={18} color={colors.text} />
            </View>
            <Text style={{ fontSize: 10, color: colors.textMuted, fontFamily: fontFamily.sans }}>{r.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>

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
  </ScrollView></ScreenFade>;
}
