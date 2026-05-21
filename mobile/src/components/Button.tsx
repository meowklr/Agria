import React, { useRef } from 'react'; import { TouchableOpacity, Text, Animated, ViewStyle } from 'react-native'; import { colors, radius, fontFamily } from '../theme'; import * as Haptics from 'expo-haptics';
interface Props { title: string; onPress: () => void; variant?: 'primary'|'secondary'|'danger'; icon?: string; style?: ViewStyle; haptic?: boolean; disabled?: boolean; }
export function Button({ title, onPress, variant='primary', icon, style, haptic=true, disabled }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => { Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, tension: 200, friction: 12 }).start(); };
  const onPressOut = () => { Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 12 }).start(); };
  const bg = variant==='primary'?colors.primary:variant==='danger'?colors.danger:'transparent';
  const tx = variant==='primary'?colors.text:variant==='danger'?'#fff':colors.textSecondary;
  const br = variant==='secondary'?{borderWidth:1.5,borderColor:colors.border}:{};
  return <Animated.View style={{ transform: [{ scale }] }}>
    <TouchableOpacity style={[{minHeight:48,borderRadius:radius.md,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingHorizontal:20,backgroundColor:bg,opacity:disabled?0.5:1},br,style]} onPress={()=>{if(!disabled){if(haptic)Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);onPress();}}} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1} disabled={disabled}>
      {icon?<Text style={{fontSize:16,marginRight:4}}>{icon}</Text>:null}<Text style={{fontSize:16,fontWeight:'600',color:tx,fontFamily:fontFamily.sans}}>{title}</Text>
    </TouchableOpacity>
  </Animated.View>;
}
