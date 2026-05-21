import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors, fontFamily } from '../theme';

const ITEM_HEIGHT = 42;
const VISIBLE = 5;
const COLUMN_HEIGHT = ITEM_HEIGHT * VISIBLE;

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function pad(n: number) { return n < 10 ? '0' + n : '' + n; }

function WheelColumn({ items, selected, onSelect }: { items: string[]; selected: number; onSelect: (i: number) => void }) {
  const sv = useRef<ScrollView>(null);
  const [sel, setSel] = useState(selected);
  const offsetRef = useRef(selected * ITEM_HEIGHT);

  useEffect(() => {
    setSel(selected);
    offsetRef.current = selected * ITEM_HEIGHT;
    sv.current?.scrollTo({ y: selected * ITEM_HEIGHT, animated: false });
  }, [selected]);

  const handleScroll = useCallback((e: any) => {
    const y = e?.nativeEvent?.contentOffset?.y;
    if (typeof y === 'number') offsetRef.current = y;
  }, []);

  const handleSnap = useCallback(() => {
    const idx = Math.round(offsetRef.current / ITEM_HEIGHT);
    if (idx >= 0 && idx < items.length) {
      setSel(idx);
      sv.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
      onSelect(idx);
    }
  }, [items.length, onSelect]);

  const padTop = (VISIBLE - 1) / 2;
  const padBot = VISIBLE - 1 - padTop;

  return (
    <View style={{ width: 58, height: COLUMN_HEIGHT, overflow: 'hidden' }}>
      <View pointerEvents="none" style={{ position: 'absolute', top: ITEM_HEIGHT * padTop, left: 4, right: 4, height: ITEM_HEIGHT, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.primary, borderRadius: 8 }} />
      <ScrollView
        ref={sv}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate={0.92}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleSnap}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        bounces={false}
        contentOffset={{ x: 0, y: selected * ITEM_HEIGHT }}
      >
        <View style={{ height: ITEM_HEIGHT * padTop }} />
        {items.map((item, i) => (
          <View key={i} style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, color: i === sel ? colors.primary : colors.textMuted, fontFamily: i === sel ? fontFamily.serif : fontFamily.sans, fontWeight: i === sel ? '600' : '400' }}>{item}</Text>
          </View>
        ))}
        <View style={{ height: ITEM_HEIGHT * padBot }} />
      </ScrollView>
    </View>
  );
}

export function DateWheelPicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  const def = value ? value.split('/') : [pad(today.getDate()), pad(today.getMonth() + 1), '' + today.getFullYear()];

  const dayIdx = parseInt(def[0], 10) - 1;
  const monthIdx = parseInt(def[1], 10) - 1;
  const yearIdx = parseInt(def[2], 10) - today.getFullYear() + 5;

  const days = Array.from({ length: 31 }, (_, i) => pad(i + 1));
  const months = MONTHS;
  const years = Array.from({ length: 11 }, (_, i) => '' + (today.getFullYear() - 5 + i));

  const [dI, setDI] = useState(Math.max(0, Math.min(30, dayIdx)));
  const [mI, setMI] = useState(Math.max(0, Math.min(11, monthIdx)));
  const [yI, setYI] = useState(Math.max(0, Math.min(10, yearIdx)));

  useEffect(() => {
    if (!value) return;
    const parts = value.split('/');
    if (parts.length === 3) {
      setDI(Math.max(0, Math.min(30, parseInt(parts[0], 10) - 1)));
      setMI(Math.max(0, Math.min(11, parseInt(parts[1], 10) - 1)));
      const yIdx = years.indexOf(parts[2]);
      setYI(Math.max(0, Math.min(10, yIdx >= 0 ? yIdx : yearIdx)));
    }
  }, [value]);

  const emit = useCallback((dd: number, mm: number, yy: number) => {
    onChange(pad(dd + 1) + '/' + pad(mm + 1) + '/' + years[yy]);
  }, [onChange, years]);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
      <WheelColumn items={days} selected={dI} onSelect={(i) => { setDI(i); emit(i, mI, yI); }} />
      <Text style={{ fontSize: 16, color: colors.textMuted, lineHeight: COLUMN_HEIGHT, fontFamily: fontFamily.sans }}>/</Text>
      <WheelColumn items={months} selected={mI} onSelect={(i) => { setMI(i); emit(dI, i, yI); }} />
      <Text style={{ fontSize: 16, color: colors.textMuted, lineHeight: COLUMN_HEIGHT, fontFamily: fontFamily.sans }}>/</Text>
      <WheelColumn items={years} selected={yI} onSelect={(i) => { setYI(i); emit(dI, mI, i); }} />
    </View>
  );
}
