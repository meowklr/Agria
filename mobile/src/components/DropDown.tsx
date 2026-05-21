import React, { useState, useRef, useEffect } from 'react'; import { View, Text, TouchableOpacity, Modal, FlatList, Animated } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { colors, radius, fontFamily } from '../theme';

interface DropDownProps { value: string; options: { label: string; value: string }[]; onChange: (v: string) => void; placeholder: string; }
export function DropDown({ value, options, onChange, placeholder }: DropDownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 160, friction: 14 }).start();
    } else {
      anim.setValue(0);
    }
  }, [open]);

  return <View>
    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, paddingVertical: 10 }} onPress={() => setOpen(true)}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: value ? colors.text : colors.textMuted, fontFamily: fontFamily.sans }}>{selected ? selected.label : placeholder}</Text>
      <Ionicons name="chevron-down" size={12} color={colors.textMuted} />
    </TouchableOpacity>
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.3)', justifyContent: 'center', alignItems: 'center' }} activeOpacity={1} onPress={() => setOpen(false)}>
        <Animated.View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, width: '72%', maxHeight: '50%', overflow: 'hidden', transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }], opacity: anim }}>
          <FlatList data={options} keyExtractor={o => o.value} renderItem={({ item }) => <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.border }} onPress={() => { onChange(item.value); setOpen(false); }}><Text style={{ fontSize: 16, color: value === item.value ? colors.primary : colors.text, fontWeight: value === item.value ? '600' : '400', fontFamily: fontFamily.sans }}>{item.label}</Text></TouchableOpacity>} />
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  </View>;
}
