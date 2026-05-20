import React, { useEffect, useState } from 'react'; import { View, Text, ScrollView, Switch } from 'react-native'; import { router } from 'expo-router'; import * as Haptics from 'expo-haptics'; import { colors } from '../../src/theme'; import { Card } from '../../src/components/Card'; import { Button } from '../../src/components/Button'; import { Input } from '../../src/components/Input'; import { SectionTitle } from '../../src/components/Typography'; import { useProfile } from '../../src/hooks/useProfile'; import { logout } from '../../src/services/auth';

export default function ProfilScreen() {
  const { profile, prefs, stats, saveProfile, savePrefs } = useProfile();
  const [prenom, setPrenom] = useState(''); const [nom, setNom] = useState(''); const [tel, setTel] = useState('');
  const [expl, setExpl] = useState(''); const [siret, setSiret] = useState(''); const [typeAgri, setTypeAgri] = useState('');
  const [notifs, setNotifs] = useState(false); const [uniteHa, setUniteHa] = useState(true);

  useEffect(() => { setPrenom(profile.prenom||''); setNom(profile.nom||''); setTel(profile.telephone||''); setExpl(profile.exploitation||''); setSiret(profile.siret||''); setTypeAgri(profile.typeAgriculture||''); setNotifs(prefs.notifications||false); setUniteHa(prefs.uniteHa!==false); }, [profile, prefs]);

  const initials = ((prenom||'A')[0]+(nom||'A')[0]).toUpperCase();
  const lbl = (t: string) => <Text style={{fontSize:13,fontWeight:'500',color:colors.textSecondary,marginBottom:6,textTransform:'uppercase',letterSpacing:0.4}}>{t}</Text>;

  return <ScrollView style={{flex:1,backgroundColor:colors.bg}} contentContainerStyle={{padding:16}}>
    <View style={{paddingVertical:8,marginBottom:16}}><Text style={{fontSize:22,fontWeight:'600',color:colors.primary}}>Mon profil</Text></View>

    <Card style={{flexDirection:'row',alignItems:'flex-start',gap:20}}>
      <View style={{width:72,height:72,borderRadius:36,backgroundColor:colors.primary,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:26,fontWeight:'600',color:colors.text}}>{initials}</Text></View>
      <View style={{flex:1}}><SectionTitle title="Identite" />{lbl('Prenom')}<Input value={prenom} onChangeText={setPrenom} placeholder="Prenom" /><View style={{height:12}} />{lbl('Nom')}<Input value={nom} onChangeText={setNom} placeholder="Nom" /><View style={{height:12}} />{lbl('Telephone')}<Input value={tel} onChangeText={setTel} placeholder="Optionnel" keyboardType="phone-pad" /><View style={{height:16}} /><Button title="Sauvegarder" onPress={async () => { await saveProfile({prenom,nom,telephone:tel}); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }} /></View>
    </Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Mon exploitation" />{lbl('Nom')}<Input value={expl} onChangeText={setExpl} placeholder="Nom exploitation" /><View style={{height:12}} />{lbl('SIRET')}<Input value={siret} onChangeText={setSiret} placeholder="14 chiffres" keyboardType="numeric" /><View style={{height:16}} /><Button title="Sauvegarder" onPress={async () => { await saveProfile({...profile,prenom,nom,telephone:tel,exploitation:expl,siret,typeAgriculture:typeAgri}); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); }} /></Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Statistiques" />
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.border}}><Text style={{fontSize:12,color:colors.textMuted}}>Champs</Text><Text style={{fontSize:18,fontWeight:'700',color:colors.text}}>{stats.nbChamps}</Text></View>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderBottomColor:colors.border}}><Text style={{fontSize:12,color:colors.textMuted}}>Surface totale</Text><Text style={{fontSize:18,fontWeight:'700',color:colors.text}}>{stats.surface} ha</Text></View>
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:14}}><Text style={{fontSize:12,color:colors.textMuted}}>Cultures</Text><Text style={{fontSize:14,color:colors.text}}>{stats.cultures}</Text></View>
    </Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Preferences" />
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderBottomColor:colors.border}}><Text style={{fontSize:14,fontWeight:'500',color:colors.text}}>Notifications</Text><Switch value={notifs} onValueChange={v => { setNotifs(v); savePrefs({...prefs,notifications:v}); }} trackColor={{true:colors.success}} /></View>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12}}><Text style={{fontSize:14,fontWeight:'500',color:colors.text}}>Unite hectares</Text><Switch value={uniteHa} onValueChange={v => { setUniteHa(v); savePrefs({...prefs,uniteHa:v}); }} trackColor={{true:colors.success}} /></View>
    </Card>
    <View style={{height:24}} />

    <Card><SectionTitle title="Securite" /><Button title="Se deconnecter" variant="secondary" onPress={async () => { await logout(); router.replace('/login'); }} haptic={false} /></Card>
    <View style={{height:100}} />
  </ScrollView>;
}
