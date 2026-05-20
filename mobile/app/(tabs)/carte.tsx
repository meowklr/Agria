import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, fontFamily } from '../../src/theme';
import { getUserId } from '../../src/services/auth';
import { loadChamps, addChamp, Champ } from '../../src/services/champs';

const HTML = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>*{margin:0;padding:0}html,body,#map{width:100%;height:100%}.pt{background:0!important;border:0!important;box-shadow:none!important;font-weight:600;font-size:11px;color:#3D2E1F;text-shadow:0 0 6px rgba(255,255,255,.8);pointer-events:none!important}.pt::before{display:none!important}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>
var map=L.map('map',{zoomControl:!1,attributionControl:!1}).setView([46.5,2.3],6);L.control.zoom({position:'bottomright'}).addTo(map);L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:19}).addTo(map);
var drawing=!1,dp=[],dl=null,dm=[],pl={},sl=null,fm=null;
function nt(t,d){window.ReactNativeWebView.postMessage(JSON.stringify({type:t,data:d}))}
function rp(ps,mid){Object.values(pl).forEach(function(l){map.removeLayer(l)});pl={};ps.forEach(function(p){if(!p.data.polygonCoords||p.data.polygonCoords.length<3)return;var im=p.owner===mid;var cs=p.data.polygonCoords.map(function(pt){return[pt[0],pt[1]]});var po=L.polygon(cs,{fillColor:im?'#7A9E5A':'#c4b8a8',fillOpacity:im?.18:.08,color:im?'#3D2E1F':'#b0a090',weight:im?2:1.5,dashArray:im?null:'6 4'}).addTo(map);im?po.bindTooltip(p.data.nom||'Parcelle',{permanent:map.getZoom()>=12,direction:'center',className:'pt'}):po.bindTooltip('Parcelle voisine',{permanent:map.getZoom()>=13,direction:'center',className:'pt',opacity:.6});(function(pa,py){po.on('click',function(e){L.DomEvent.stopPropagation(e);if(drawing)return;if(sl){sl.setStyle({weight:sl.options.isMine?2:1,fillOpacity:sl.options.isMine?.18:.08})}sl=py;py.setStyle({weight:4,fillOpacity:.3,color:'#E8B84B'});if(pa.data.polygonCoords&&pa.data.polygonCoords.length>0){var b=L.latLngBounds(pa.data.polygonCoords.map(function(c){return[c[0],c[1]]}));map.fitBounds(b,{paddingBottomRight:[0,260],paddingTopLeft:[60,60],maxZoom:16,animate:!0,duration:.6})}nt('ps',pa.data)})})(p,po);pl[p.data.id]=po})}
function sd(){if(drawing)return;drawing=!0;dp=[];dm=[];if(fm){map.removeLayer(fm);fm=null}nt('ds')}
function ed(f){if(!drawing)return;drawing=!1;if(dl){map.removeLayer(dl);dl=null}dm.forEach(function(m){map.removeLayer(m)});dm=[];if(fm){map.removeLayer(fm);fm=null}if(f&&dp.length>=3){var cs=dp.map(function(ll){return[ll.lat,ll.lng]});var ha=ca(dp);nt('dc',{coords:cs,surface:ha.toFixed(2)})}dp=[];nt('de')}
map.on('click',function(e){if(drawing){var ll=e.latlng;if(dp.length>=2&&ll.distanceTo(dp[0])<30){ed(!0);return}dp.push(ll);if(dl)map.removeLayer(dl);if(dp.length>=2)dl=L.polyline(dp,{color:'#E8B84B',weight:3,dashArray:'8 6',opacity:.9}).addTo(map);var mk=L.circleMarker(ll,{radius:6,color:'#E8B84B',fillColor:'#FFFDF6',fillOpacity:1,weight:3}).addTo(map);dm.push(mk);if(dp.length===1){if(fm)map.removeLayer(fm);fm=L.circleMarker(dp[0],{radius:12,color:'#D4A853',fillColor:'#E8B84B',fillOpacity:.35,weight:3,dashArray:'4 2'}).addTo(map)}if(dp.length>=3)nt('su',ca(dp).toFixed(2))}});
function ca(lls){var a=0;for(var i=0;i<lls.length;i++){var j=(i+1)%lls.length;a+=lls[i].lng*lls[j].lat;a-=lls[j].lng*lls[i].lat}return Math.abs(a)*6371000*6371000*Math.PI/360/1e4}
function zm(ps,mid){var cs=[];ps.forEach(function(p){if(p.owner===mid&&p.data.polygonCoords)cs=cs.concat(p.data.polygonCoords)});if(cs.length)map.fitBounds(L.latLngBounds(cs.map(function(c){return[c[0],c[1]]})),{padding:[50,50],maxZoom:14})}
function loc(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(p){map.flyTo([p.coords.latitude,p.coords.longitude],15,{duration:1});L.circleMarker([p.coords.latitude,p.coords.longitude],{radius:10,color:'#E8B84B',fillColor:'#D4A853',fillOpacity:.5,weight:3}).addTo(map)})}
window.addEventListener('message',function(e){var m=JSON.parse(e.data);if(m.type==='rp')rp(m.data.ps,m.data.mid);if(m.type==='sd')sd();if(m.type==='ed')ed(!1);if(m.type==='zm')zm(m.data.ps,m.data.mid);if(m.type==='loc')loc()});
</script></body></html>`;

export default function CarteScreen() {
  const wv = useRef<WebView>(null);
  const [ps, setPs] = useState<{ data: Champ; owner: string }[]>([]);
  const [mid, setMid] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [surface, setSurface] = useState('');
  const [sel, setSel] = useState<Champ | null>(null);
  const [so, setSo] = useState(false);
  const [champCount, setChampCount] = useState(0);

  const load = useCallback(async () => {
    const uid = await getUserId(); setMid(uid); const c = await loadChamps(); setPs(c.map(x => ({ data: x, owner: uid }))); setChampCount(c.length);
  }, []);

  useEffect(() => { load(); }, []);

  const pm = useCallback((msg: any) => wv.current?.postMessage(JSON.stringify(msg)), []);

  const hm = useCallback((e: any) => {
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
          const champ: Champ = {
            nom: 'Parcelle ' + n, culture: '', typeSol: '', stade: '', surface: data.surface,
            dateSemis: '', polygonCoords: data.coords, id: '',
          };
          await addChamp(champ);
          const c = await loadChamps(); setPs(c.map(x => ({ data: x, owner: uid }))); setChampCount(c.length);
          pm({ type: 'rp', data: { ps: c.map(x => ({ data: x, owner: uid })), mid: uid } });
        })();
      }
    } catch {}
  }, [champCount]);

  return <View style={{ flex: 1 }}>
    <WebView ref={wv} source={{ html: HTML }} style={{ flex: 1 }} onMessage={hm} javaScriptEnabled domStorageEnabled geolocationEnabled onLoad={() => pm({ type: 'rp', data: { ps, mid } })} />
    <View style={{ position: 'absolute', bottom: 16, alignSelf: 'center', flexDirection: 'row', gap: 10 }}>
      <TouchableOpacity style={[{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,253,246,.94)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border }, drawing && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => { if (drawing) { pm({ type: 'ed' }); } else { pm({ type: 'sd' }); } Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
        <Ionicons name="color-wand-outline" size={20} color={drawing ? colors.text : colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,253,246,.94)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border }} onPress={() => pm({ type: 'zm', data: { ps, mid } })}>
        <Ionicons name="list-outline" size={20} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,253,246,.94)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border }} onPress={() => { pm({ type: 'loc' }); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}>
        <Ionicons name="locate-outline" size={20} color={colors.text} />
      </TouchableOpacity>
    </View>
    {drawing && <View style={{ position: 'absolute', top: '40%', alignSelf: 'center', backgroundColor: colors.text, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 }}><Text style={{ color: colors.surface, fontSize: 14 }}>Cliquez pour tracer</Text>{surface ? <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '600', textAlign: 'center', marginTop: 4, fontFamily: fontFamily.serif }}>{surface} ha</Text> : null}</View>}
    {so && sel && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: '50%' }}>
      <View style={{ width: 40, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 }} />
      <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20 }} onPress={() => setSo(false)}><Ionicons name="close" size={18} color={colors.textMuted} /></TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 4, fontFamily: fontFamily.serif }}>{sel.nom || 'Parcelle'}</Text>
      <Text style={{ fontSize: 13, color: colors.textMuted, marginBottom: 20 }}>{sel.surface || '?'} ha — {sel.culture || '?'}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ fontSize: 14, color: colors.textSecondary }}>Culture</Text><Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{sel.culture || '?'}</Text></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ fontSize: 14, color: colors.textSecondary }}>Type de sol</Text><Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{sel.typeSol || '?'}</Text></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ fontSize: 14, color: colors.textSecondary }}>Stade</Text><Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{sel.stade || '?'}</Text></View>
    </View>}
  </View>;
}
