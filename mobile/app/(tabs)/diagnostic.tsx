import React, { useEffect, useState, useRef } from 'react'; import { View, Text, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Animated } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { Swipeable } from 'react-native-gesture-handler'; import { colors, radius, fontFamily } from '../../src/theme'; import { Card } from '../../src/components/Card';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
}); import { Badge } from '../../src/components/Badge'; import { Button } from '../../src/components/Button'; import { Input } from '../../src/components/Input'; import { SectionTitle } from '../../src/components/Typography'; import { LoaderBar } from '../../src/components/LoaderBar'; import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenFade } from '../../src/components/ScreenFade';
import { useDiagnostic } from '../../src/hooks/useDiagnostic';
import { useNotifications } from '../../src/hooks/useNotifications';
import { searchCities } from '../../src/services/weather';
import * as Haptics from 'expo-haptics';

const CULTURES = ['ble','mais','tournesol','colza','vigne'];
const CL: Record<string,string> = { ble:'Ble', mais:'Mais', tournesol:'Tournesol', colza:'Colza', vigne:'Vigne' };
const CI: Record<string,keyof typeof Ionicons.glyphMap> = { ble:'leaf', mais:'leaf', tournesol:'sunny', colza:'leaf', vigne:'wine' };
const SYMPS = ['jaunissement','taches','fletrissement','insectes','croissance','pourriture'];
const SL: Record<string,string> = { jaunissement:'Jaunissement', taches:'Taches brunes', fletrissement:'Fletrissement', insectes:"Presence d'insectes", croissance:'Croissance ralentie', pourriture:'Pourriture' };

function labelCulture(culture: string) {
  const map: Record<string, string> = { ble: 'Blé', mais: 'Maïs', tournesol: 'Tournesol', colza: 'Colza', vigne: 'Vigne' };
  return map[culture] || culture || 'Culture';
}

function buildDiagTitle(culture: string, nom: string) {
  return `Analyse ${labelCulture(culture)} - ${nom}`;
}

function s(v: any): string { return typeof v === 'string' ? v : String(v ?? ''); }

export default function DiagnosticScreen() {
  const { result, history, loading, analyse, reset, removeFromHistory, loadHistory } = useDiagnostic();
  const [step, setStep] = useState(1); const [culture, setCulture] = useState(''); const [sympts, setSympts] = useState<string[]>([]); const [ville, setVille] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [errVille, setErrVille] = useState(false);
  const [errCulture, setErrCulture] = useState(false);
  const [errSympts, setErrSympts] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingDetailed, setSendingDetailed] = useState(false);
  const [errEmail, setErrEmail] = useState<string | null>(null);
  const [sendStatus, setSendStatus] = useState<'success' | 'error' | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusOpacity = useRef(new Animated.Value(0)).current;
  const emailErrOpacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  useEffect(() => { 
    loadHistory(); 
  }, []);
  const { add } = useNotifications();
  const ts = (s: string) => setSympts(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleCityChange = (t: string) => {
    setVille(t); setErrVille(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (t.trim().length < 2) { setCitySuggestions([]); setShowSuggestions(false); return; }
    debounceRef.current = setTimeout(async () => {
      const results = await searchCities(t.trim());
      if (results.length > 0) { setCitySuggestions(results); setShowSuggestions(true); }
      else { setShowSuggestions(false); }
    }, 300);
  };

  const selectCity = (city: string) => { setVille(city); setShowSuggestions(false); setCitySuggestions([]); };

  const handleDeleteHistory = (h: any, i: number) => {
    if (expanded === i) setExpanded(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeFromHistory(h.createdAt);
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const handleSendDetailedDiagnostic = async () => {
    if (!result) return;
    setErrEmail(null); setSendStatus(null);
    if (!email.trim()) { setErrEmail('Veuillez saisir votre adresse email.'); emailErrOpacity.setValue(0); Animated.timing(emailErrOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start(); return; }
    if (!isValidEmail(email)) { setErrEmail('Adresse email invalide.'); emailErrOpacity.setValue(0); Animated.timing(emailErrOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start(); return; }
    setSendingDetailed(true);
    try {
      const webhookUrl = 'REMOVED_MAKE_WEBHOOK_URL';
      const payload = { culture, symptomes: sympts, ville, email: email.trim(), diagnostic: result.nom, gravite: result.gravite, explication: result.explication, recommandations: result.recommandations, meteo: result.meteo };
      
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      const notificationTitle = buildDiagTitle(culture, result.nom);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: "Votre diagnostic détaillé a été généré par l'IA. Appuyez pour le consulter.",
          data: { reportTitle: notificationTitle, reportText: responseText },
        },
        trigger: null,
      });

      try { await add(notificationTitle, responseText); } catch (e) { console.warn('Erreur en sauvegardant la notif interne', e); }

      setSendStatus('success');
      statusOpacity.setValue(0);
      Animated.timing(statusOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(statusOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setSendStatus(null));
      }, 3000);
    } catch (e) {
      console.error(e);
      setSendStatus('error');
      statusOpacity.setValue(0);
      Animated.timing(statusOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(statusOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setSendStatus(null));
      }, 3000);
    } finally {
      setSendingDetailed(false);
    }
  };

  return <ScreenFade><ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingTop: (insets.top || 0) + 16, paddingBottom: 100 }}>
    <View style={{ paddingVertical: 8, marginBottom: 16 }}><Text style={{ fontSize: 22, fontWeight: '600', color: colors.primary, fontFamily: fontFamily.serif }}>Diagnostic</Text></View>
    {loading && <View style={{ marginBottom: 16 }}><LoaderBar /></View>}

    {!result ? <>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 24 }}>
        {[1,2,3].map((s, i) => <React.Fragment key={s}><View style={[{ width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface }, s <= step && { backgroundColor: colors.primary, borderColor: colors.primary }]}><Text style={[{ fontSize: 14, fontWeight: '600', color: colors.textMuted }, s <= step && { color: colors.text }]}>{s}</Text></View>{i < 2 && <View style={[{ width: 44, height: 2, backgroundColor: colors.border }, s <= step && { backgroundColor: colors.primary }]} />}</React.Fragment>)}
      </View>

      {step === 1 && <View>
        <SectionTitle title="Quelle est votre culture ?" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 22 }}>
          {CULTURES.map(c => <TouchableOpacity key={c} style={[{ width: '46%', padding: 20, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', gap: 8 }, culture === c && { borderColor: colors.primary, borderWidth: 2, backgroundColor: 'rgba(232,184,75,.06)' }]} onPress={() => { setCulture(c); setErrCulture(false); }}><Ionicons name={CI[c]} size={24} color={culture === c ? colors.primary : colors.primaryHover} /><Text style={[{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }, culture === c && { color: colors.text, fontWeight: '600' }]}>{CL[c]}</Text></TouchableOpacity>)}
        </View>
        {errCulture && <Text style={{ fontSize: 12, color: colors.danger, marginBottom: 10 }}>Veuillez selectionner une culture.</Text>}
        <Button title="Suivant" onPress={() => { if (!culture) { setErrCulture(true); return; } LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setStep(2); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} />
      </View>}

      {step === 2 && <View>
        <SectionTitle title="Quels symptomes ?" />
        <View style={{ gap: 8, marginBottom: 22 }}>
          {SYMPS.map(s => <TouchableOpacity key={s} style={[{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, minHeight: 50, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md }, sympts.includes(s) && { borderColor: colors.primary, backgroundColor: 'rgba(232,184,75,.06)' }]} onPress={() => { ts(s); setErrSympts(false); }}><Ionicons name={sympts.includes(s) ? 'checkbox' : 'square-outline'} size={20} color={sympts.includes(s) ? colors.primary : colors.textMuted} /><Text style={[{ fontSize: 14, color: colors.textSecondary }, sympts.includes(s) && { color: colors.text, fontWeight: '500' }]}>{SL[s]}</Text></TouchableOpacity>)}
        </View>
        {errSympts && <Text style={{ fontSize: 12, color: colors.danger, marginBottom: 10 }}>Veuillez selectionner au moins un symptome.</Text>}
        <Button title="Suivant" onPress={() => { if (sympts.length === 0) { setErrSympts(true); return; } LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setStep(3); }} /><View style={{ height: 10 }} /><Button title="Retour" variant="secondary" onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setStep(1); setErrSympts(false); }} />
      </View>}

      {step === 3 && <View>
        <SectionTitle title="Ou se trouve la parcelle ?" />
        <View>
          <Input value={ville} onChangeText={handleCityChange} placeholder="Nom de la ville (obligatoire)" />
          {showSuggestions && citySuggestions.length > 0 && (
            <View style={{ backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, borderTopWidth: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: -1, overflow: 'hidden' }}>
              {citySuggestions.map((city, i) => (
                <TouchableOpacity key={i} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < citySuggestions.length - 1 ? 1 : 0, borderBottomColor: colors.border }} onPress={() => selectCity(city)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="location-outline" size={14} color={colors.primary} />
                    <Text style={{ fontSize: 14, color: colors.text, fontFamily: fontFamily.sans }}>{city}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {errVille && <Text style={{ fontSize: 12, color: colors.danger, marginTop: 6 }}>Veuillez entrer une ville pour continuer.</Text>}
        <Text style={{ fontSize: 13, color: colors.textMuted, marginVertical: 16 }}>Pour enrichir le diagnostic avec la meteo locale.</Text>
        <Button title="Analyser" onPress={async () => { if (!ville.trim()) { setErrVille(true); return; } Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); await analyse(culture, sympts, ville.trim()); }} />
        <View style={{ height: 10 }} /><Button title="Retour" variant="secondary" onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setStep(2); }} />
      </View>}
    </> : <View>
      <Card style={{ marginBottom: 16 }}>
        <View style={{ marginBottom: 12 }}><Badge text={result.gravite === 'danger' ? 'Urgent' : result.gravite === 'warning' ? 'Attention' : 'Info'} variant={result.gravite} /></View>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 10, fontFamily: fontFamily.serif }}>{buildDiagTitle(s(culture), s(result.nom))}</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{s(result.explication)}</Text>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle title="Meteo locale" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, padding: 14, backgroundColor: colors.bg, borderRadius: radius.md, alignItems: 'center' }}><Text style={{ fontSize: 12, color: colors.textSecondary }}>Precip. 7j</Text><Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 }}>{result.meteo.precipitations7j.reduce((a,b)=>a+b,0).toFixed(1)} mm</Text></View>
          <View style={{ flex: 1, padding: 14, backgroundColor: colors.bg, borderRadius: radius.md, alignItems: 'center' }}><Text style={{ fontSize: 12, color: colors.textSecondary }}>T max</Text><Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 }}>{(result.meteo.tempMax.reduce((a,b)=>a+b,0)/7).toFixed(1)}°C</Text></View>
          <View style={{ flex: 1, padding: 14, backgroundColor: colors.bg, borderRadius: radius.md, alignItems: 'center' }}><Text style={{ fontSize: 12, color: colors.textSecondary }}>T min</Text><Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 4 }}>{(result.meteo.tempMin.reduce((a,b)=>a+b,0)/7).toFixed(1)}°C</Text></View>
        </View>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle title="Recommandations" />
        {(Array.isArray(result.recommandations) ? result.recommandations : []).map((r: string, i: number) => <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Ionicons name="checkmark-circle" size={14} color={colors.success} style={{ marginTop: 3 }} /><Text style={{ flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>{s(r)}</Text></View>)}
      </Card>
      <View style={{ marginBottom: 16 }}>
        <Input value={email} onChangeText={t => { setEmail(t); setErrEmail(null); setSendStatus(null); }} placeholder="Votre adresse email (obligatoire)" keyboardType="email-address" autoCapitalize="none" />
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 6, marginLeft: 2 }}>Pour recevoir le rapport detaille de l'IA.</Text>
        {errEmail && <Animated.View style={{ marginTop: 8, backgroundColor: '#FEF3F0', borderRadius: 10, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 6, opacity: emailErrOpacity }}><Ionicons name="alert-circle" size={14} color={colors.danger} /><Text style={{ fontSize: 12, color: colors.danger, fontWeight: '500', fontFamily: fontFamily.sans }}>{errEmail}</Text></Animated.View>}
      </View>
      <View style={{ marginBottom: 12 }}>
        {sendStatus === 'success' && <Animated.View style={{ marginBottom: 10, backgroundColor: '#EAF3E0', borderRadius: 10, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 6, opacity: statusOpacity }}><Ionicons name="checkmark-circle" size={14} color={colors.success} /><Text style={{ fontSize: 12, color: colors.success, fontWeight: '500', fontFamily: fontFamily.sans }}>L'analyse a été effectuée et envoyée avec succès.</Text></Animated.View>}
        {sendStatus === 'error' && <Animated.View style={{ marginBottom: 10, backgroundColor: '#FEF3F0', borderRadius: 10, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 6, opacity: statusOpacity }}><Ionicons name="alert-circle" size={14} color={colors.danger} /><Text style={{ fontSize: 12, color: colors.danger, fontWeight: '500', fontFamily: fontFamily.sans }}>Impossible d'envoyer le diagnostic. Réesayez.</Text></Animated.View>}
        {sendingDetailed && <View style={{ marginBottom: 10 }}><LoaderBar /></View>}
        <Button title={sendingDetailed ? "Analyse en cours..." : "Analyse detaillee par mail (IA)"} onPress={async () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); await handleSendDetailedDiagnostic(); }} style={{ backgroundColor: colors.accent }} disabled={sendingDetailed} />
      </View>
      <Button title="Nouveau diagnostic" variant="secondary" onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); reset(); setStep(1); setCulture(''); setSympts([]); setVille(''); setEmail(''); }} />
    </View>}

    {history.length > 0 && <View style={{ marginTop: 32 }}>
      <SectionTitle title="Historique" />
      {history.map((h, i) => <View key={i} style={{ marginBottom: 10 }}>
        <Swipeable
        renderRightActions={(progress: any) => {
          const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
          return (
            <Animated.View style={{ opacity, width: 72 }}>
              <TouchableOpacity onPress={() => handleDeleteHistory(h, i)} style={{ flex: 1, backgroundColor: colors.danger, justifyContent: 'center', alignItems: 'center', borderRadius: radius.md, marginLeft: 8 }}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        overshootRight={false}
        friction={2}
        rightThreshold={30}
        onSwipeableWillOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
      ><Card>
        <TouchableOpacity onPress={() => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setExpanded(expanded === i ? null : i); }} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Badge text={s(h.titre || h.nom || 'Diagnostic')} variant={s(h.gravite) || 'info'} /><Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} /></View>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{s(h.date)}</Text>
          </View>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>{s(h.culture)} - {s(h.ville)} - {Array.isArray(h.symptomes) ? h.symptomes.length : 0} symptomes</Text>
        </TouchableOpacity>
        {expanded === i && <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 }}>Explication</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 12 }}>{s(h.explication)}</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 }}>Recommandations</Text>
          {(Array.isArray(h.recommandations) ? h.recommandations : []).map((r: string, ri: number) => <View key={ri} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}><Ionicons name="checkmark-circle" size={12} color={colors.success} style={{ marginTop: 2 }} /><Text style={{ flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>{s(r)}</Text></View>)}
          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 8 }}>Symptomes : {Array.isArray(h.symptomes) ? h.symptomes.map((x: any) => s(x)).join(', ') : ''}</Text>
        </View>}
      </Card></Swipeable></View>)}
    </View>}
  </ScrollView></ScreenFade>;
}
