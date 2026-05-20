import React from 'react'; import { TouchableOpacity, Text, ViewStyle } from 'react-native'; import { colors, radius, fontFamily } from '../theme'; import * as Haptics from 'expo-haptics';
interface Props { title: string; onPress: () => void; variant?: 'primary'|'secondary'|'danger'; icon?: string; style?: ViewStyle; haptic?: boolean; }
export function Button({ title, onPress, variant='primary', icon, style, haptic=true }: Props) {
  const bg = variant==='primary'?colors.primary:variant==='danger'?colors.danger:'transparent';
  const tx = variant==='primary'?colors.text:variant==='danger'?'#fff':colors.textSecondary;
  const br = variant==='secondary'?{borderWidth:1.5,borderColor:colors.border}:{};
  return <TouchableOpacity style={[{minHeight:48,borderRadius:radius.md,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,paddingHorizontal:20,backgroundColor:bg},br,style]} onPress={()=>{if(haptic)Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);onPress();}} activeOpacity={0.7}>{icon?<Text style={{fontSize:16,marginRight:4}}>{icon}</Text>:null}<Text style={{fontSize:16,fontWeight:'600',color:tx,fontFamily:fontFamily.sans}}>{title}</Text></TouchableOpacity>;
}
