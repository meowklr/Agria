import React, { useEffect, useRef } from 'react'; import { Animated, View } from 'react-native'; import { colors } from '../theme';

export function LoaderBar() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 2, duration: 600, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const translateX = anim.interpolate({ inputRange: [0, 1, 2], outputRange: [-60, 400, 460] });
  return <View style={{ height: 2, backgroundColor: colors.border, overflow: 'hidden', borderRadius: 1 }}>
    <Animated.View style={{ width: 60, height: '100%', backgroundColor: colors.primary, borderRadius: 1, transform: [{ translateX }] }} />
  </View>;
}
