import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { listenAuth } from '../src/services/auth';
import { dpLoad, dpRemove, getAuthInstance, scheduleFirebaseInit } from '../src/services/firebase';
import { signOut } from 'firebase/auth';
import { colors } from '../src/theme';
import { User } from 'firebase/auth';

export default function Index() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    scheduleFirebaseInit();
    const unsub = listenAuth(async (u) => {
      if (u) {
        const forced = await dpLoad<string>('agria_force_logout_' + u.uid, '');
        if (forced === 'true') {
          await dpRemove('agria_force_logout_' + u.uid);
          await signOut(getAuthInstance());
          setUser(null);
          return;
        }
      }
      setUser(u);
    });
    return () => unsub();
  }, []);

  if (user === undefined) return <View style={{ flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator color={colors.primary} /></View>;
  if (user) return <Redirect href="/(tabs)" />;
  return <Redirect href="/login" />;
}
