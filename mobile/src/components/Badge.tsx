import React from 'react'; import { View, Text } from 'react-native'; import { colors } from '../theme';
const bgMap: Record<string,string> = { danger:'#f9e8e4', warning:'#f9efe4', success:'#e8f0e2', info:'#e4eef5' };
const clMap: Record<string,string> = { danger:colors.danger, warning:colors.accent, success:colors.success, info:'#5a8aa8' };
export function Badge({ text, variant='info' }: { text: string; variant?: string }) { return <View style={{paddingHorizontal:8,paddingVertical:2,borderRadius:6,alignSelf:'flex-start',backgroundColor:bgMap[variant]||bgMap.info}}><Text style={{fontSize:11,fontWeight:'600',letterSpacing:0.2,color:clMap[variant]||clMap.info}}>{text}</Text></View>; }
