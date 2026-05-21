import { useEffect, useState } from 'react'; import { Redirect } from 'expo-router'; import { View, ActivityIndicator } from 'react-native'; import { checkSessionValid } from '../src/services/auth'; import { colors } from '../src/theme';

export default function Index() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  useEffect(() => { checkSessionValid().then(setAuthed); }, []);
  if (authed === null) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  if (authed) return <Redirect href="/(tabs)" />;
  return <Redirect href="/login" />;
}
