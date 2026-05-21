import React, { useEffect, useState } from 'react'; import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'; import { Ionicons } from '@expo/vector-icons'; import { colors, radius, fontFamily } from '../../src/theme'; import { Card } from '../../src/components/Card';
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
import { useDiagnostic } from '../../src/hooks/useDiagnostic';
import { useNotifications } from '../../src/hooks/useNotifications';
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

export default function DiagnosticScreen() {
  const { result, history, loading, analyse, reset, loadHistory } = useDiagnostic();
  const [step, setStep] = useState(1); const [culture, setCulture] = useState(''); const [sympts, setSympts] = useState<string[]>([]); const [ville, setVille] = useState('');
  const [email, setEmail] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [errVille, setErrVille] = useState(false);
  const [errCulture, setErrCulture] = useState(false);
  const [errSympts, setErrSympts] = useState(false);
  const insets = useSafeAreaInsets();
  useEffect(() => { 
    loadHistory(); 
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      if (data && data.reportText) {
        Alert.alert("Rapport complet de l'IA", data.reportText as string);
      }
    });
    return () => subscription.remove();
  }, []);
  const { add } = useNotifications();
  const ts = (s: string) => setSympts(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

  const handleSendDetailedDiagnostic = async () => {
    if (!result) return;
    if (!email.trim()) {
      Alert.alert('Email requis', 'Veuillez saisir votre adresse email pour recevoir l\'analyse.');
      return;
    }
    try {
      // Remplacez cette URL par celle de votre webhook Make.com
      const webhookUrl = 'REMOVED_MAKE_WEBHOOK_URL';
      const payload = { culture, symptomes: sympts, ville, email: email.trim(), diagnostic: result.nom, gravite: result.gravite, explication: result.explication, recommandations: result.recommandations, meteo: result.meteo };
      
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Make.com doit absolument comporter un module "Webhook Response" finale retournant le texte !
      const responseText = await res.text();
      const notificationTitle = buildDiagTitle(culture, result.nom);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: "Votre diagnostic détaillé a été généré par l'IA. Appuyez pour le consulter.",
          data: { reportText: responseText },
        },
        trigger: null,
      });

      // Enregistrer aussi dans la cloche interne de l'app
      try { await add(notificationTitle, responseText); } catch (e) { console.warn('Erreur en sauvegardant la notif interne', e); }

      Alert.alert('Envoyé', 'L\'analyse a été effectuée et envoyée avec succès.');
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de récupérer ou d\'envoyer le diagnostic.');
    }
  };

  return <ScrollView style={{ flex: 1, backgroundColor: colors.bg }} contentContainerStyle={{ padding: 16, paddingTop: (insets.top || 0) + 16, paddingBottom: 100 }}>
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
        <Button title="Suivant" onPress={() => { if (!culture) { setErrCulture(true); return; } setStep(2); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }} />
      </View>}

      {step === 2 && <View>
        <SectionTitle title="Quels symptomes ?" />
        <View style={{ gap: 8, marginBottom: 22 }}>
          {SYMPS.map(s => <TouchableOpacity key={s} style={[{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, minHeight: 50, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md }, sympts.includes(s) && { borderColor: colors.primary, backgroundColor: 'rgba(232,184,75,.06)' }]} onPress={() => { ts(s); setErrSympts(false); }}><Ionicons name={sympts.includes(s) ? 'checkbox' : 'square-outline'} size={20} color={sympts.includes(s) ? colors.primary : colors.textMuted} /><Text style={[{ fontSize: 14, color: colors.textSecondary }, sympts.includes(s) && { color: colors.text, fontWeight: '500' }]}>{SL[s]}</Text></TouchableOpacity>)}
        </View>
        {errSympts && <Text style={{ fontSize: 12, color: colors.danger, marginBottom: 10 }}>Veuillez selectionner au moins un symptome.</Text>}
        <Button title="Suivant" onPress={() => { if (sympts.length === 0) { setErrSympts(true); return; } setStep(3); }} /><View style={{ height: 10 }} /><Button title="Retour" variant="secondary" onPress={() => { setStep(1); setErrSympts(false); }} />
      </View>}

      {step === 3 && <View>
        <SectionTitle title="Ou se trouve la parcelle ?" />
        <Input value={ville} onChangeText={t => { setVille(t); setErrVille(false); }} placeholder="Nom de la ville (obligatoire)" />
        {errVille && <Text style={{ fontSize: 12, color: colors.danger, marginTop: 6 }}>Veuillez entrer une ville pour continuer.</Text>}
        <Text style={{ fontSize: 13, color: colors.textMuted, marginVertical: 16 }}>Pour enrichir le diagnostic avec la meteo locale.</Text>
        <Button title="Analyser" onPress={async () => { if (!ville.trim()) { setErrVille(true); return; } Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); await analyse(culture, sympts, ville.trim()); }} />
        <View style={{ height: 10 }} /><Button title="Retour" variant="secondary" onPress={() => setStep(2)} />
      </View>}
    </> : <View>
      <Card style={{ marginBottom: 16 }}>
        <View style={{ marginBottom: 12 }}><Badge text={result.gravite === 'danger' ? 'Urgent' : result.gravite === 'warning' ? 'Attention' : 'Info'} variant={result.gravite} /></View>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 10, fontFamily: fontFamily.serif }}>{buildDiagTitle(culture, result.nom)}</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{result.explication}</Text>
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
        {result.recommandations.map((r, i) => <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}><Ionicons name="checkmark-circle" size={14} color={colors.success} style={{ marginTop: 3 }} /><Text style={{ flex: 1, fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>{r}</Text></View>)}
      </Card>
      <View style={{ marginBottom: 16 }}>
        <Input value={email} onChangeText={setEmail} placeholder="Votre adresse email (obligatoire)" keyboardType="email-address" autoCapitalize="none" />
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 6, marginLeft: 2 }}>Pour recevoir le rapport detaille de l'IA.</Text>
      </View>
      <Button title="Analyse détaillée par mail (IA)" onPress={async () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); await handleSendDetailedDiagnostic(); }} style={{ marginBottom: 12, backgroundColor: '#005b4f' }} />
      <Button title="Nouveau diagnostic" variant="secondary" onPress={() => { reset(); setStep(1); setCulture(''); setSympts([]); setVille(''); setEmail(''); }} />
    </View>}

    {history.length > 0 && <View style={{ marginTop: 32 }}>
      <SectionTitle title="Historique" />
      {history.map((h, i) => <Card key={i} style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setExpanded(expanded === i ? null : i)} activeOpacity={0.7}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Badge text={h.titre || h.nom} variant={h.gravite} /><Ionicons name={expanded === i ? 'chevron-up' : 'chevron-down'} size={14} color={colors.textMuted} /></View>
            <Text style={{ fontSize: 11, color: colors.textMuted }}>{h.date}</Text>
          </View>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>{h.culture} - {h.ville} - {h.symptomes.length} symptomes</Text>
        </TouchableOpacity>
        {expanded === i && <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 }}>Explication</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 12 }}>{h.explication}</Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 }}>Recommandations</Text>
          {h.recommandations.map((r, ri) => <View key={ri} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}><Ionicons name="checkmark-circle" size={12} color={colors.success} style={{ marginTop: 2 }} /><Text style={{ flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>{r}</Text></View>)}
          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 8 }}>Symptomes : {h.symptomes.join(', ')}</Text>
        </View>}
      </Card>)}
    </View>}
  </ScrollView>;
}
