import React, { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { useFocusEffect } from 'expo-router';

export function ScreenFade({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      opacity.setValue(0.85);
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true, tension: 120, friction: 14 }).start();
      return () => {};
    }, [])
  );

  return <Animated.View style={{ flex: 1, opacity }}>{children}</Animated.View>;
}
