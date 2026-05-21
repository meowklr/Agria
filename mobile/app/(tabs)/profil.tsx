import React, { useEffect, useState } from 'react'; import { View, Text, ScrollView, Switch, TouchableOpacity, Modal } from 'react-native'; import { router } from 'expo-router'; import * as Haptics from 'expo-haptics'; import { useSafeAreaInsets } from 'react-native-safe-area-context'; import { Ionicons } from '@expo/vector-icons'; import { colors, fontFamily } from '../../src/theme'; import { Card } from '../../src/components/Card'; import { Button } from '../../src/components/Button'; import { Input } from '../../src/components/Input'; import { SectionTitle } from '../../src/components/Typography'; import { useProfile } from '../../src/hooks/useProfile'; import { logout } from '../../src/services/auth';

export default function ProfilScreen() {
  const { profile, prefs, stats, saveProfile, savePrefs } = useProfile();
  const [prenom, setPrenom] = useState(''); const [nom, setNom] = useState(''); const [tel, setTel] = useState(''); const [email, setEmail] = useState('');
  const [expl, setExpl] = useState(''); const [siret, setSiret] = useState(''); const [typeAgri, setTypeAgri] = useState('');
  const [notifs, setNotifs] = useState(false); const [uniteHa, setUniteHa] = useState(true);
  const [legalModal, setLegalModal] = useState<{ title: string; body: string } | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => { setPrenom(profile.prenom||''); setNom(profile.nom||''); setTel(profile.telephone||''); setEmail(profile.email||''); setExpl(profile.exploitation||''); setSiret(profile.siret||''); setTypeAgri(profile.typeAgriculture||''); setNotifs(prefs.notifications||false); setUniteHa(prefs.uniteHa!==false); }, [profile, prefs]);

  const initials = ((prenom||'A')[0]+(nom||'A')[0]).toUpperCase();
  const lbl = (t: string) => <Text style={{fontSize:13,fontWeight:'500',color:colors.textSecondary,marginBottom:6,textTransform:'uppercase',letterSpacing:0.4}}>{t}</Text>;

  return <ScrollView style={{flex:1,backgroundColor:colors.bg, overflow: 'visible'}} contentContainerStyle={{padding:16, paddingTop: (insets.top || 0) + 16, overflow: 'visible'}}>
    <View style={{paddingVertical:8,marginBottom:16}}><Text style={{fontSize:22,fontWeight:'600',color:colors.primary,fontFamily:fontFamily.serif}}>Mon profil</Text></View>

    <Card style={{ position: 'relative', paddingTop: 28, paddingBottom: 18, overflow: 'visible' }}>
      <TouchableOpacity activeOpacity={0.9} style={{ position: 'absolute', top: -28, right: 16, width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 6, zIndex: 60, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, borderWidth: 4, borderColor: colors.surface }} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); /* TODO: ouvrir le picker d'image */ }}>
        <Text style={{ fontSize: 26, fontWeight: '700', color: colors.text }}>{initials}</Text>
      </TouchableOpacity>
      <View style={{ marginRight: 112, paddingLeft: 8 }}>
        <SectionTitle title="Identite" />
        {lbl('Prenom')}
        <Input value={prenom} onChangeText={setPrenom} placeholder="Votre prenom" />
        <View style={{ height: 8 }} />
        {lbl('Nom')}
        <Input value={nom} onChangeText={setNom} placeholder="Votre nom" />
        <View style={{ height: 8 }} />
        {lbl('Email')}
        <Input value={email} onChangeText={setEmail} placeholder="Adresse email" keyboardType="email-address" autoCapitalize="none" />
        <View style={{ height: 8 }} />
        {lbl('Telephone')}
        <Input value={tel} onChangeText={setTel} placeholder="Optionnel" keyboardType="phone-pad" />
        <View style={{ height: 14 }} />
        <Button title="Sauvegarder" onPress={async () => { await saveProfile({prenom,nom,telephone:tel,email,exploitation:expl,siret,typeAgriculture:typeAgri}); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }} style={{ alignSelf: 'stretch' }} />
      </View>
    </Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Mon exploitation" />{lbl('Nom')}<Input value={expl} onChangeText={setExpl} placeholder="Nom exploitation" /><View style={{height:12}} />{lbl('SIRET')}<Input value={siret} onChangeText={setSiret} placeholder="14 chiffres" keyboardType="numeric" /><View style={{height:16}} /><Button title="Sauvegarder" onPress={async () => { await saveProfile({...profile,prenom,nom,telephone:tel,exploitation:expl,siret,typeAgriculture:typeAgri}); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }} /></Card>
    <View style={{height:24}} />

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
    <View style={{height:100}} />
  </ScrollView>;
}
