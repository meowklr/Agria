import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors, fontFamily } from '../src/theme';
import { Button } from '../src/components/Button';
import { Input } from '../src/components/Input';
import { login, register } from '../src/services/auth';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { Alert.alert('Champs requis', 'Veuillez remplir l\'email et le mot de passe.'); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Connexion echouee.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) { Alert.alert('Champs requis', 'Veuillez remplir l\'email et le mot de passe.'); return; }
    if (password.trim().length < 4) { Alert.alert('Mot de passe', 'Minimum 4 caracteres.'); return; }
    setLoading(true);
    try {
      await register(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Inscription echouee.');
    } finally {
      setLoading(false);
    }
  };

  const handleDev = async () => {
    setLoading(true);
    try {
      try { await register('dev@agria.fr', 'admin'); } catch {}
      await login('dev@agria.fr', 'admin');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(admin)');
    } catch (e: any) {
      Alert.alert('Erreur', e.message || 'Acces developpeur echoue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 40, fontWeight: '700', color: colors.primary, textAlign: 'center', marginBottom: 8, fontFamily: fontFamily.serif }}>Agria</Text>
        <Text style={{ fontSize: 15, color: colors.textMuted, textAlign: 'center', marginBottom: 40 }}>L'agriculture intelligente</Text>
        <View style={{ gap: 16 }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4, fontFamily: fontFamily.sans }}>Adresse email</Text>
            <Input value={email} onChangeText={setEmail} placeholder="votre@email.com" keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4, fontFamily: fontFamily.sans }}>Mot de passe</Text>
            <Input value={password} onChangeText={setPassword} placeholder="Mot de passe" secureTextEntry />
          </View>
          <Button title={loading ? 'Chargement...' : 'Se connecter'} onPress={handleLogin} disabled={loading} />
          <Button title="Creer un compte" variant="secondary" onPress={handleRegister} disabled={loading} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text style={{ fontSize: 13, color: colors.textMuted, fontFamily: fontFamily.sans }}>ou</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>
        <Button title="Acces developpeur" variant="secondary" onPress={handleDev} haptic={false} disabled={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
