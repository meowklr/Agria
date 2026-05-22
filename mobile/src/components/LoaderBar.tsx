import React, { useEffect, useRef } from 'react'; import { Animated, View } from 'react-native'; import { colors } from '../theme';

export function LoaderBar() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 1200, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-100, 450] });
  const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0.3, 1, 1, 0.3] });
  return <View style={{ height: 2, backgroundColor: colors.border, overflow: 'hidden', borderRadius: 1 }}>
    <Animated.View style={{ width: 80, height: '100%', backgroundColor: colors.primary, borderRadius: 1, opacity, transform: [{ translateX }] }} />
  </View>;
}
