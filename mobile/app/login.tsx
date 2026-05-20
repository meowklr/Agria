import React, { useState } from 'react'; import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'; import { router } from 'expo-router'; import { colors } from '../src/theme'; import { Button } from '../src/components/Button'; import { Input } from '../src/components/Input'; import { login } from '../src/services/auth'; import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const go = async (e: string) => { if (!e.trim()) return; await login(e.trim()); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.replace('/(tabs)'); };
  return <KeyboardAvoidingView style={{flex:1,backgroundColor:colors.bg}} behavior={Platform.OS==='ios'?'padding':'height'}>
    <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',paddingHorizontal:24}}>
      <Text style={{fontSize:40,fontWeight:'700',color:colors.primary,textAlign:'center',marginBottom:8}}>Agria</Text>
      <Text style={{fontSize:15,color:colors.textMuted,textAlign:'center',marginBottom:40}}>L'agriculture intelligente</Text>
      <View style={{gap:16}}>
        <View><Text style={{fontSize:13,fontWeight:'500',color:colors.textSecondary,marginBottom:6,textTransform:'uppercase',letterSpacing:0.4}}>Adresse email</Text><Input value={email} onChangeText={setEmail} placeholder="votre@email.com" keyboardType="email-address" /></View>
        <View><Text style={{fontSize:13,fontWeight:'500',color:colors.textSecondary,marginBottom:6,textTransform:'uppercase',letterSpacing:0.4}}>Mot de passe</Text><Input value={password} onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry /></View>
        <Button title="Se connecter" onPress={() => go(email)} />
        <Button title="Creer un compte" variant="secondary" onPress={() => go(email)} />
      </View>
      <View style={{flexDirection:'row',alignItems:'center',gap:12,marginVertical:16}}><View style={{flex:1,height:1,backgroundColor:colors.border}} /><Text style={{fontSize:13,color:colors.textMuted}}>ou</Text><View style={{flex:1,height:1,backgroundColor:colors.border}} /></View>
      <Button title="Acces developpeur" variant="secondary" onPress={async () => { await login('dev@agria.fr'); router.replace('/(tabs)'); }} haptic={false} />
    </ScrollView>
  </KeyboardAvoidingView>;
}
