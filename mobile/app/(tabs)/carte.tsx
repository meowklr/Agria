import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated, PanResponder, Keyboard } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, radius, fontFamily } from '../../src/theme';
import { DropDown } from '../../src/components/DropDown';
import { DateWheelPicker } from '../../src/components/DateWheelPicker';
import { ScreenFade } from '../../src/components/ScreenFade';
import { getUserId } from '../../src/services/auth';
import { loadChamps, addChamp, updateChamp, deleteChamp, Champ } from '../../src/services/champs';

const CULTURES = [
  { label: 'Ble', value: 'ble' }, { label: 'Mais', value: 'mais' }, { label: 'Tournesol', value: 'tournesol' },
  { label: 'Colza', value: 'colza' }, { label: 'Vigne', value: 'vigne' }, { label: 'Orge', value: 'orge' },
  { label: 'Soja', value: 'soja' }, { label: 'Betterave', value: 'betterave' },
];
const SOLS = [
  { label: 'Argileux', value: 'argileux' }, { label: 'Limoneux', value: 'limoneux' }, { label: 'Sableux', value: 'sableux' },
  { label: 'Calcaire', value: 'calcaire' }, { label: 'Argilo-calcaire', value: 'argilo_calcaire' },
];
const STADES = [
  { label: 'Semis', value: 'semis' }, { label: 'Levee', value: 'levee' }, { label: 'Croissance', value: 'croissance' },
  { label: 'Floraison', value: 'floraison' }, { label: 'Maturation', value: 'maturation' }, { label: 'Recolte', value: 'recolte' },
];

const HTML = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>*{margin:0;padding:0}html,body,#map{width:100%;height:100%}.pt{background:rgba(61,46,31,.82)!important;border:1px solid rgba(255,253,246,.25)!important;box-shadow:none!important;font-weight:600;font-size:10px;color:#FFFDF6;padding:3px 9px!important;border-radius:12px!important;text-shadow:none!important;white-space:nowrap}.pt::before{display:none!important}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>
var map=L.map('map',{zoomControl:!1,attributionControl:!1}).setView([46.5,2.3],6);L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19}).addTo(map);
var drawing=!1,dp=[],dl=null,dm=[],pl={},sl=null,fm=null;
function nt(t,d){window.ReactNativeWebView.postMessage(JSON.stringify({type:t,data:d}))}
function gep(){var pts=[];Object.values(pl).forEach(function(po){var c=po.getLatLngs();(Array.isArray(c[0])?c[0]:c).forEach(function(ll){pts.push(ll)})});return pts}
function snp(ll){var c=gep();if(dp.length>0)c.push(dp[0]);var md=15,mr=ll;for(var i=0;i<c.length;i++){var d=ll.distanceTo(c[i]);if(d<md){md=d;mr=c[i]}}return mr}
function rp(ps,mid){Object.values(pl).forEach(function(l){map.removeLayer(l)});pl={};ps.forEach(function(p){if(!p.data.polygonCoords||p.data.polygonCoords.length<3)return;var im=p.owner===mid;var cs=p.data.polygonCoords.map(function(pt){return[pt[0],pt[1]]});var po=L.polygon(cs,{fillColor:im?'#7A9E5A':'#c4b8a8',fillOpacity:im?.18:.08,color:im?'#3D2E1F':'#b0a090',weight:im?2:1.5,dashArray:im?null:'6 4'}).addTo(map);if(im){po.bindTooltip(p.data.nom||'Parcelle',{className:'pt',permanent:!0,direction:'center',offset:[0,0],interactive:!0});setTimeout(function(){var tip=po.getTooltip();if(tip){var el=tip.getElement();if(el){el.addEventListener('click',function(ev){L.DomEvent.stopPropagation(ev);if(drawing)return;if(sl){sl.setStyle({weight:sl.options.isMine?2:1,fillOpacity:sl.options.isMine?.18:.08})}sl=po;po.setStyle({weight:4,fillOpacity:.3,color:'#E8B84B'});map.fitBounds(L.latLngBounds(cs),{padding:[60,60],maxZoom:16,animate:!0,duration:.5});nt('ps',p.data)})}}},0)}po.on('click',function(e){L.DomEvent.stopPropagation(e);if(drawing)return;if(sl){sl.setStyle({weight:sl.options.isMine?2:1,fillOpacity:sl.options.isMine?.18:.08})}sl=po;po.setStyle({weight:4,fillOpacity:.3,color:'#E8B84B'});map.fitBounds(L.latLngBounds(cs),{padding:[60,60],maxZoom:16,animate:!0,duration:.5});nt('ps',p.data)});pl[p.data.id]=po})}
function sd(){if(drawing)return;drawing=!0;dp=[];dm=[];if(fm){map.removeLayer(fm);fm=null}nt('ds')}
function ed(f){if(!drawing)return;drawing=!1;if(dl){map.removeLayer(dl);dl=null}dm.forEach(function(m){map.removeLayer(m)});dm=[];if(fm){map.removeLayer(fm);fm=null}if(f&&dp.length>=3){var cs=dp.map(function(ll){return[ll.lat,ll.lng]});var ha=ca(dp);nt('dc',{coords:cs,surface:ha.toFixed(2)})}dp=[];nt('de')}
map.on('click',function(e){if(drawing){var ll=snp(e.latlng);if(dp.length>=2&&ll.distanceTo(dp[0])<30){ed(!0);return}dp.push(ll);if(dl)map.removeLayer(dl);if(dp.length>=2)dl=L.polyline(dp,{color:'#E8B84B',weight:3,dashArray:'8 6',opacity:.9}).addTo(map);var mk=L.circleMarker(ll,{radius:6,color:'#E8B84B',fillColor:'#FFFDF6',fillOpacity:1,weight:3}).addTo(map);dm.push(mk);if(dp.length===1){if(fm)map.removeLayer(fm);fm=L.circleMarker(dp[0],{radius:12,color:'#D4A853',fillColor:'#E8B84B',fillOpacity:.35,weight:3,dashArray:'4 2'}).addTo(map)}if(dp.length>=3)nt('su',ca(dp).toFixed(2))}});
function ca(lls){var a=0;for(var i=0;i<lls.length;i++){var j=(i+1)%lls.length;a+=lls[i].lng*lls[j].lat;a-=lls[j].lng*lls[i].lat;return Math.abs(a)*6371000*6371000*Math.PI/360/1e4}return 0}
function zm(ps,mid){var cs=[];ps.forEach(function(p){if(p.owner===mid&&p.data.polygonCoords)cs=cs.concat(p.data.polygonCoords)});if(cs.length)map.fitBounds(L.latLngBounds(cs.map(function(c){return[c[0],c[1]]})),{padding:[50,50],maxZoom:14})}
function gz(d){if(!d||!d.polygonCoords||d.polygonCoords.length<3)return;map.fitBounds(L.latLngBounds(d.polygonCoords.map(function(c){return[c[0],c[1]]})),{padding:[60,80],maxZoom:16,animate:!0,duration:.8});var pid=d.id;if(pl[pid]){if(sl)sl.setStyle({weight:sl.options.isMine?2:1,fillOpacity:sl.options.isMine?.18:.08});sl=pl[pid];pl[pid].setStyle({weight:4,fillOpacity:.3,color:'#E8B84B'});nt('ps',d)}}
function loc(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(p){map.flyTo([p.coords.latitude,p.coords.longitude],15,{duration:1});L.circleMarker([p.coords.latitude,p.coords.longitude],{radius:10,color:'#E8B84B',fillColor:'#D4A853',fillOpacity:.5,weight:3}).addTo(map)})}
window.addEventListener('message',function(e){var m=JSON.parse(e.data);if(m.type==='rp')rp(m.data.ps,m.data.mid);if(m.type==='sd')sd();if(m.type==='ed')ed(!1);if(m.type==='zm')zm(m.data.ps,m.data.mid);if(m.type==='gz')gz(m.data);if(m.type==='loc')loc()});
</script></body></html>`;

export default function CarteScreen() {
  const insets = useSafeAreaInsets();
  const wv = useRef<WebView>(null);
  const { parcelId } = useLocalSearchParams<{ parcelId?: string }>();
  const [ps, setPs] = useState<{ data: Champ; owner: string }[]>([]);
  const [mid, setMid] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [surface, setSurface] = useState('');
  const [sel, setSel] = useState<Champ | null>(null);
  const [so, setSo] = useState(false);
  const [champCount, setChampCount] = useState(0);
  const [searchQ, setSearchQ] = useState('');
  const [searchRes, setSearchRes] = useState<Champ[]>([]);
  const keyboardVisibleRef = useRef(false);
  const panelSaveRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', () => { keyboardVisibleRef.current = true; });
    const s2 = Keyboard.addListener('keyboardDidHide', () => { keyboardVisibleRef.current = false; });
    return () => { s1.remove(); s2.remove(); };
  }, []);

  const panelAnim = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4 && Math.abs(g.dy) > Math.abs(g.dx),
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) panelAnim.setValue(g.dy);
    },
    onPanResponderRelease: (_, g) => {
      if (keyboardVisibleRef.current && (g.dy > 40 || g.vy > 0.3)) {
        Keyboard.dismiss();
        if (panelSaveRef.current) panelSaveRef.current();
        Animated.spring(panelAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 14 }).start();
        return;
      }
      if (g.dy > 80 || g.vy > 0.5) {
        Animated.timing(panelAnim, { toValue: 600, duration: 180, useNativeDriver: true }).start(() => { setSo(false); panelAnim.setValue(0); });
      } else {
        Animated.spring(panelAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 14 }).start();
      }
    },
  })).current;

  const load = useCallback(async () => {
    const uid = await getUserId(); setMid(uid); const c = await loadChamps(); setPs(c.map(x => ({ data: x, owner: uid }))); setChampCount(c.length);
  }, []);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (parcelId && ps.length > 0) {
      const p = ps.find(x => x.data.id === parcelId);
      if (p) { pm({ type: 'gz', data: p.data }); }
    }
  }, [parcelId, ps]);

  useEffect(() => {
    if (searchQ.length < 1) { setSearchRes([]); return; }
    const q = searchQ.toLowerCase();
    setSearchRes(ps.filter(p => (p.data.nom || '').toLowerCase().includes(q) || (p.data.culture || '').toLowerCase().includes(q)).map(p => p.data).slice(0, 6));
  }, [searchQ, ps]);

  const pm = useCallback((msg: any) => wv.current?.postMessage(JSON.stringify(msg)), []);

  const reloadAndSync = useCallback(async () => {
    const uid = await getUserId();
    setMid(uid);
    const c = await loadChamps();
    const updated = c.map(x => ({ data: x, owner: uid }));
    setPs(updated);
    setChampCount(c.length);
    pm({ type: 'rp', data: { ps: updated, mid: uid } });
  }, [pm]);

  const hm = useCallback((e: WebViewMessageEvent) => {
    try { const { type, data } = JSON.parse(e.nativeEvent.data);
      if (type === 'ps') { setSel(data); setSo(true); }
      if (type === 'ds') setDrawing(true);
      if (type === 'de') setDrawing(false);
      if (type === 'su') setSurface(data);
      if (type === 'dc') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setDrawing(false);
        (async () => {
          const uid = await getUserId();
          const n = champCount + 1;
          const champ: Champ = { nom: 'Parcelle ' + n, culture: '', typeSol: '', stade: '', surface: data.surface, dateSemis: '', notes: '', polygonCoords: data.coords, id: '' };
          const saved = await addChamp(champ);
          setChampCount(n); setSel(saved); setSo(true);
          const c = await loadChamps(); setPs(c.map(x => ({ data: x, owner: uid })));
          pm({ type: 'rp', data: { ps: c.map(x => ({ data: x, owner: uid })), mid: uid } });
        })();
      }
    } catch {}
  }, [champCount]);

  const Btn = ({ icon, label, onPress, active }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; active?: boolean }) => (
    <TouchableOpacity style={[{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 22, backgroundColor: 'rgba(255,253,246,.92)', borderWidth: 1.5, borderColor: colors.border }, active && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={onPress}>
      <Ionicons name={icon} size={16} color={active ? colors.text : colors.text} />
      <Text style={{ fontSize: 11, fontWeight: '600', color: active ? colors.text : colors.textSecondary, fontFamily: fontFamily.sans }}>{label}</Text>
    </TouchableOpacity>
  );

  const searchTop = (insets.top || 0) + 54;

  return <ScreenFade><View style={{ flex: 1 }}>
    <WebView ref={wv} source={{ html: HTML }} style={{ flex: 1 }} onMessage={hm} javaScriptEnabled domStorageEnabled geolocationEnabled onLoad={() => pm({ type: 'rp', data: { ps, mid } })} />
    <View style={{ position: 'absolute', top: searchTop, left: 12, right: 12, gap: 8 }}>
      <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,253,246,.94)', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
        <Ionicons name="search-outline" size={15} color={colors.textMuted} />
        <TextInput style={{ flex: 1, height: 40, fontSize: 14, color: colors.text, fontFamily: fontFamily.sans }} value={searchQ} onChangeText={setSearchQ} placeholder="Chercher parcelle..." placeholderTextColor={colors.textMuted} />
        {searchQ.length > 0 && <TouchableOpacity onPress={() => setSearchQ('')}><Ionicons name="close-circle" size={15} color={colors.textMuted} /></TouchableOpacity>}
      </View>
      {searchRes.length > 0 && <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
        {searchRes.map((c, i) => <TouchableOpacity key={c.id} style={{ paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: i < searchRes.length - 1 ? 1 : 0, borderBottomColor: colors.border }} onPress={() => { setSearchQ(''); setSearchRes([]); pm({ type: 'gz', data: c }); }}><Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>{c.nom}</Text><Text style={{ fontSize: 11, color: colors.textMuted }}>{c.surface || '?'} ha{c.culture ? ' - ' + c.culture : ''}</Text></TouchableOpacity>)}
      </View>}
    </View>
    <View style={{ position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 8 }}>
      <Btn icon="color-wand-outline" label="Dessiner" onPress={() => { if (drawing) { pm({ type: 'ed' }); } else { pm({ type: 'sd' }); } Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} active={drawing} />
      <Btn icon="list-outline" label="Parcelles" onPress={() => pm({ type: 'zm', data: { ps, mid } })} />
      <Btn icon="locate-outline" label="Localiser" onPress={() => { pm({ type: 'loc' }); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} />
    </View>
    {drawing && <View style={{ position: 'absolute', top: insets.top + 120, alignSelf: 'center', backgroundColor: colors.surface, paddingHorizontal: 24, paddingVertical: 14, borderRadius: radius.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.border, shadowColor: '#3D2E1F', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 }}><Text style={{ color: colors.textSecondary, fontSize: 13, fontFamily: fontFamily.sans }}>Cliquez sur la carte pour tracer</Text>{surface ? <Text style={{ color: colors.primary, fontSize: 20, fontWeight: '600', textAlign: 'center', marginTop: 4, fontFamily: fontFamily.serif }}>{surface} ha</Text> : null}<TouchableOpacity onPress={() => { pm({ type: 'ed' }); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} style={{ marginTop: surface ? 8 : 6, paddingHorizontal: 14, paddingVertical: 5, borderRadius: radius.sm, borderWidth: 1, borderColor: 'rgba(181,83,58,.4)' }}><Text style={{ color: colors.danger, fontSize: 11, fontWeight: '600', fontFamily: fontFamily.sans }}>Annuler</Text></TouchableOpacity></View>}
    {so && sel && <ParcelPanel sel={sel} panelAnim={panelAnim} panHandlers={panResponder.panHandlers} onClose={() => setSo(false)} onSaved={reloadAndSync} onDeleted={async () => { await deleteChamp(sel.id); setSo(false); reloadAndSync(); }} saveRef={panelSaveRef} />}
  </View></ScreenFade>;
}

function ParcelPanel({ sel, panelAnim, panHandlers, onClose, onSaved, onDeleted, saveRef }: { sel: Champ; panelAnim: Animated.Value; panHandlers: any; onClose: () => void; onSaved: () => void; onDeleted: () => void; saveRef: React.MutableRefObject<(() => Promise<void>) | null> }) {
  const [nom, setNom] = useState(sel.nom || '');
  const [culture, setCulture] = useState(sel.culture || '');
  const [typeSol, setTypeSol] = useState(sel.typeSol || '');
  const [stade, setStade] = useState(sel.stade || '');
  const [dateSemis, setDateSemis] = useState(sel.dateSemis || '');
  const [notes, setNotes] = useState(sel.notes || '');
  const [saving, setSaving] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [savedOk, setSavedOk] = useState(false);
  const enterAnim = useRef(new Animated.Value(600)).current;
  useEffect(() => { setNom(sel.nom || ''); setCulture(sel.culture || ''); setTypeSol(sel.typeSol || ''); setStade(sel.stade || ''); setDateSemis(sel.dateSemis || ''); setNotes(sel.notes || ''); Animated.spring(enterAnim, { toValue: 0, useNativeDriver: true, tension: 120, friction: 14 }).start(); }, [sel.id]);
  const save = async () => {
    if (dateSemis) {
      const parts = dateSemis.split('/');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        if (d > new Date()) { setDateError(true); return; }
      }
    }
    setSaving(true);
    await updateChamp(sel.id, { ...sel, nom, culture, typeSol, stade, dateSemis, notes });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(false); setSavedOk(true); setTimeout(() => setSavedOk(false), 1800); onSaved();
  };
  useEffect(() => { saveRef.current = save; }, [save]);
  const animateClose = () => {
    Animated.timing(enterAnim, { toValue: 600, duration: 180, useNativeDriver: true }).start(() => onClose());
  };
  return <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '64%', transform: [{ translateY: Animated.add(panelAnim, enterAnim) }] }}>
    <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 12 }} {...panHandlers}>
      <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2 }} />
    </View>
    <TouchableOpacity style={{ position: 'absolute', top: 8, right: 12, padding: 12 }} onPress={animateClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}><Ionicons name="close" size={18} color={colors.textMuted} /></TouchableOpacity>
    <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
      <TextInput style={{ fontSize: 20, fontWeight: '600', color: colors.text, fontFamily: fontFamily.serif, marginBottom: 2 }} value={nom} onChangeText={setNom} placeholder="Nom de la parcelle" placeholderTextColor={colors.textMuted} />
      <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>{sel.surface || '?'} ha</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ fontSize: 14, color: colors.textSecondary }}>Culture</Text><DropDown value={culture} options={CULTURES} onChange={setCulture} placeholder="Choisir" /></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ fontSize: 14, color: colors.textSecondary }}>Type de sol</Text><DropDown value={typeSol} options={SOLS} onChange={setTypeSol} placeholder="Choisir" /></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ fontSize: 14, color: colors.textSecondary }}>Stade</Text><DropDown value={stade} options={STADES} onChange={setStade} placeholder="Choisir" /></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 14, color: colors.textSecondary }}>Date semis</Text>
        <DateWheelPicker value={dateSemis} onChange={(d) => { setDateSemis(d); setDateError(false); }} />
      </View>
      <View style={{ marginTop: 14 }}>
        <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 6 }}>Notes (optionnel)</Text>
        <TextInput style={{ minHeight: 60, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, color: colors.text, fontSize: 14, textAlignVertical: 'top', fontFamily: fontFamily.sans }} value={notes} onChangeText={setNotes} placeholder="Notes sur la parcelle..." placeholderTextColor={colors.textMuted} multiline />
      </View>
      {dateError && <View style={{ marginTop: 12, backgroundColor: '#FEF3F0', borderRadius: radius.sm, padding: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Ionicons name="alert-circle" size={15} color={colors.danger} style={{ marginTop: 1 }} />
        <Text style={{ flex: 1, fontSize: 12, color: colors.danger, fontWeight: '500', fontFamily: fontFamily.sans }}>La date de semis ne peut pas etre dans le futur.</Text>
        <TouchableOpacity onPress={() => setDateError(false)}><Ionicons name="close" size={14} color={colors.danger} /></TouchableOpacity>
      </View>}
      {savedOk && <View style={{ marginTop: 12, backgroundColor: '#EAF3E0', borderRadius: radius.sm, padding: 10, flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <Ionicons name="checkmark-circle" size={15} color={colors.success} style={{ marginTop: 1 }} />
        <Text style={{ flex: 1, fontSize: 12, color: colors.success, fontWeight: '500', fontFamily: fontFamily.sans }}>Parcelle sauvegardee.</Text>
      </View>}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        <TouchableOpacity onPress={save} disabled={saving} style={{ flex: 1, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' }}><Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, fontFamily: fontFamily.sans }}>{saving ? '...' : 'Sauvegarder'}</Text></TouchableOpacity>
        <TouchableOpacity onPress={onDeleted} style={{ backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' }}><Ionicons name="trash-outline" size={18} color={colors.danger} /></TouchableOpacity>
      </View>
    </ScrollView>
  </Animated.View>;
}
