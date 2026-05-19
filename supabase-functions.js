// ============================================
// FONCTIONS SUPABASE - TABLES SPECIALISEES
// (profiles/parcelles/mesures/alertes)
// Les fonctions generiques dpLoad/dpSave dans
// script.js utilisent la table agria_data.
// ============================================

// ===== PROFILES =====

async function sbLoadProfile(userId) {
  var sb = getSupabase();
  if (!sb) return null;
  try {
    var { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  } catch(e) { console.error('Erreur chargement profil:', e); return null; }
}

async function sbSaveProfile(userId, profileData) {
  var sb = getSupabase();
  if (!sb) return false;
  try {
    var { error } = await sb.from('profiles').upsert({
      id: userId, nom: profileData.nom, prenom: profileData.prenom,
      telephone: profileData.telephone, created_at: new Date()
    });
    if (error) throw error; return true;
  } catch(e) { console.error('Erreur sauvegarde profil:', e); return false; }
}

// ===== PARCELLES (table dediee, alternative a agria_data) =====

async function sbSaveParcelle(userId, parcelleData) {
  var sb = getSupabase();
  if (!sb) return false;
  try {
    var { data, error } = await sb.from('parcelles').insert({
      user_id: userId, nom: parcelleData.nom, surface: parcelleData.surface,
      culture: parcelleData.culture, type_sol: parcelleData.typeSol,
      stade: parcelleData.stade, date_semis: parcelleData.dateSemis,
      polygon_coords: JSON.stringify(parcelleData.polygonCoords),
      notes: parcelleData.notes || '', created_at: new Date()
    }).select();
    if (error) throw error; return data[0];
  } catch(e) { console.error('Erreur creation parcelle:', e); return false; }
}

async function sbUpdateParcelle(parcelleId, parcelleData) {
  var sb = getSupabase();
  if (!sb) return false;
  try {
    var updateData = {
      nom: parcelleData.nom, surface: parcelleData.surface,
      culture: parcelleData.culture, type_sol: parcelleData.typeSol,
      stade: parcelleData.stade, date_semis: parcelleData.dateSemis,
      notes: parcelleData.notes || ''
    };
    if (parcelleData.polygonCoords) updateData.polygon_coords = JSON.stringify(parcelleData.polygonCoords);
    var { error } = await sb.from('parcelles').update(updateData).eq('id', parcelleId);
    if (error) throw error; return true;
  } catch(e) { console.error('Erreur mise a jour parcelle:', e); return false; }
}

async function sbDeleteParcelle(parcelleId) {
  var sb = getSupabase();
  if (!sb) return false;
  try {
    var { error } = await sb.from('parcelles').delete().eq('id', parcelleId);
    if (error) throw error; return true;
  } catch(e) { console.error('Erreur suppression parcelle:', e); return false; }
}

// ===== MESURES =====

async function loadMesures(parcelleId, limit) {
  var sb = getSupabase();
  if (!sb) return [];
  
  limit = limit || 100;
  
  try {
    var query = sb.from('mesures').select('*').eq('parcelle_id', parcelleId).order('date_mesure', { ascending: false }).limit(limit);
    var { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.error('Erreur chargement mesures:', e);
    return [];
  }
}

async function loadMesuresRecentes(parcelleId, jours) {
  var sb = getSupabase();
  if (!sb) return [];
  
  jours = jours || 7;
  var dateDebut = new Date();
  dateDebut.setDate(dateDebut.getDate() - jours);
  
  try {
    var { data, error } = await sb.from('mesures')
      .select('*')
      .eq('parcelle_id', parcelleId)
      .gte('date_mesure', dateDebut.toISOString())
      .order('date_mesure', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.error('Erreur chargement mesures récentes:', e);
    return [];
  }
}

async function saveMesure(parcelleId, mesureData) {
  var sb = getSupabase();
  if (!sb) return false;
  
  try {
    var { error } = await sb.from('mesures').insert({
      parcelle_id: parcelleId,
      temperature: mesureData.temperature,
      humidite_sol: mesureData.humidite_sol,
      pluviometrie_7j: mesureData.pluviometrie_7j,
      evapotranspiration: mesureData.evapotranspiration,
      date_mesure: mesureData.date_mesure || new Date().toISOString(),
      timestamp: new Date(),
      source: mesureData.source || 'manual'
    });
    
    if (error) throw error;
    return true;
  } catch(e) {
    console.error('Erreur sauvegarde mesure:', e);
    return false;
  }
}

// ===== ALERTES =====

async function loadAlertes(parcelleId) {
  var sb = getSupabase();
  if (!sb) return [];
  
  try {
    var { data, error } = await sb.from('alertes').select('*').eq('parcelle_id', parcelleId).order('date_alerte', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.error('Erreur chargement alertes:', e);
    return [];
  }
}

async function loadAlertesNonLues(parcelleId) {
  var sb = getSupabase();
  if (!sb) return [];
  
  try {
    var { data, error } = await sb.from('alertes')
      .select('*')
      .eq('parcelle_id', parcelleId)
      .eq('est_lue', false)
      .order('date_alerte', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch(e) {
    console.error('Erreur chargement alertes non lues:', e);
    return [];
  }
}

async function createAlerte(parcelleId, alerteData) {
  var sb = getSupabase();
  if (!sb) return false;
  
  try {
    var { error } = await sb.from('alertes').insert({
      parcelle_id: parcelleId,
      niveau: alerteData.niveau, // 'info', 'warning', 'danger'
      message: alerteData.message,
      score_risque: alerteData.score_risque || 0,
      date_alerte: new Date(),
      est_lue: false
    });
    
    if (error) throw error;
    return true;
  } catch(e) {
    console.error('Erreur création alerte:', e);
    return false;
  }
}

async function markAlerteAsRead(alerteId) {
  var sb = getSupabase();
  if (!sb) return false;
  
  try {
    var { error } = await sb.from('alertes').update({ est_lue: true }).eq('id', alerteId);
    if (error) throw error;
    return true;
  } catch(e) {
    console.error('Erreur marquage alerte:', e);
    return false;
  }
}

async function deleteAlerte(alerteId) {
  var sb = getSupabase();
  if (!sb) return false;
  
  try {
    var { error } = await sb.from('alertes').delete().eq('id', alerteId);
    if (error) throw error;
    return true;
  } catch(e) {
    console.error('Erreur suppression alerte:', e);
    return false;
  }
}

// ===== STATISTIQUES =====

async function getMesureStats(parcelleId, jours) {
  var sb = getSupabase();
  if (!sb) return null;
  
  jours = jours || 30;
  var mesures = await loadMesuresRecentes(parcelleId, jours);
  
  if (mesures.length === 0) return null;
  
  var stats = {
    temperature: {
      min: Number.MAX_VALUE,
      max: -Number.MAX_VALUE,
      moyenne: 0
    },
    humidite_sol: {
      min: Number.MAX_VALUE,
      max: -Number.MAX_VALUE,
      moyenne: 0
    },
    pluviometrie_total: 0,
    evapotranspiration_moyenne: 0
  };
  
  var tempSum = 0, humSum = 0, evaSum = 0;
  
  for (var i = 0; i < mesures.length; i++) {
    var m = mesures[i];
    
    // Température
    if (m.temperature !== null) {
      stats.temperature.min = Math.min(stats.temperature.min, m.temperature);
      stats.temperature.max = Math.max(stats.temperature.max, m.temperature);
      tempSum += m.temperature;
    }
    
    // Humidité
    if (m.humidite_sol !== null) {
      stats.humidite_sol.min = Math.min(stats.humidite_sol.min, m.humidite_sol);
      stats.humidite_sol.max = Math.max(stats.humidite_sol.max, m.humidite_sol);
      humSum += m.humidite_sol;
    }
    
    // Précipitations
    if (m.pluviometrie_7j !== null) {
      stats.pluviometrie_total += m.pluviometrie_7j;
    }
    
    // Évapotranspiration
    if (m.evapotranspiration !== null) {
      evaSum += m.evapotranspiration;
    }
  }
  
  stats.temperature.moyenne = Math.round((tempSum / mesures.length) * 10) / 10;
  stats.humidite_sol.moyenne = Math.round((humSum / mesures.length) * 10) / 10;
  stats.evapotranspiration_moyenne = Math.round((evaSum / mesures.length) * 10) / 10;
  
  return stats;
}

// ===== BATCH OPERATIONS =====

async function loadAllUserData(userId) {
  var profile = await sbLoadProfile(userId);
  var parcellesData = await sb.from('parcelles').select('*').eq('user_id', userId);
  var parcelles = (parcellesData.data || []).map(function(p) {
    p.polygonCoords = typeof p.polygon_coords === 'string' ? JSON.parse(p.polygon_coords) : (p.polygon_coords || null);
    return p;
  });
  
  var data = { profile: profile, parcelles: [] };
  for (var i = 0; i < parcelles.length; i++) {
    var p = parcelles[i];
    var mesures = await loadMesuresRecentes(p.id, 7);
    var alertes = await loadAlertes(p.id);
    var stats = await getMesureStats(p.id, 30);
    data.parcelles.push({ ...p, mesures: mesures, alertes: alertes, stats: stats });
  }
  return data;
}
