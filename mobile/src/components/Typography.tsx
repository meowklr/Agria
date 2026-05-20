import React from 'react'; import { Text } from 'react-native'; import { colors } from '../theme';
export function SectionTitle({ title }: { title: string }) { return <Text style={{fontSize:18,fontWeight:'600',color:colors.text,marginBottom:14,letterSpacing:-0.2}}>{title}</Text>; }
export function FormLabel({ label }: { label: string }) { return <Text style={{fontSize:13,fontWeight:'500',color:colors.textSecondary,marginBottom:6,textTransform:'uppercase',letterSpacing:0.4}}>{label}</Text>; }
