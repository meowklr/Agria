// Exemple d'utilisation de Supabase dans Agr'IA

// ============================================
// 1. EXEMPLE : Sauvegarder les données du profil
// ============================================

async function saveUserProfile(userId, userData) {
  await dpSave(`user_${userId}_profile`, {
    nom: userData.nom,
    prenom: userData.prenom,
    email: userData.email,
    region: userData.region,
    sauvegardeDate: new Date()
  });
  
  showToast('Profil sauvegardé avec succès', 'success');
}


// ============================================
// 2. EXEMPLE : Charger les données du profil
// ============================================

async function loadUserProfile(userId) {
  var profile = await dpLoad(
    `user_${userId}_profile`,
    { nom: 'Non défini', prenom: '', email: '', region: 'France' }
  );
  
  return profile;
}


// ============================================
// 3. EXEMPLE : Sauvegarder les parcelles
// ============================================

async function saveParcelle(userId, parcelleId, parcelleData) {
  await dpSave(`user_${userId}_parcelle_${parcelleId}`, {
    nom: parcelleData.nom,
    culture: parcelleData.culture,
    surface: parcelleData.surface,
    coordonnees: parcelleData.coordonnees,
    donneesSol: parcelleData.donneesSol,
    historique: parcelleData.historique || []
  });
  
  console.log('Parcelle sauvegardée dans Supabase');
}


// ============================================
// 4. EXEMPLE : Charger toutes les parcelles
// ============================================

async function loadUserParcelles(userId) {
  var allData = await dpGetAll(`user_${userId}_parcelle_`);
  return allData;
}


// ============================================
// 5. EXEMPLE : Sauvegarder les diagnostics
// ============================================

async function saveDiagnostic(userId, parcelleId, diagnostic) {
  var key = `user_${userId}_diagnostic_${parcelleId}_${generateId()}`;
  
  await dpSave(key, {
    date: new Date().toISOString(),
    parcelle: parcelleId,
    ndr: diagnostic.ndr,
    sante: diagnostic.sante,
    stress: diagnostic.stress,
    recommandations: diagnostic.recommandations
  });
}


// ============================================
// 6. EXEMPLE : Charger les paramètres utilisateur
// ============================================

async function loadUserSettings(userId) {
  var settings = await dpLoad(
    `user_${userId}_settings`,
    {
      theme: 'light',
      notifications: true,
      autosauvegarde: true
    }
  );
  
  return settings;
}


// ============================================
// 7. INITIALISER SUPABASE AU DÉMARRAGE
// ============================================

// À ajouter dans le code de chargement initial (ex: dans login.html après succès)
async function initializeSupabaseUser(userId) {
  console.log('Initialisation Supabase pour utilisateur:', userId);
  
  // Test de la connexion
  var sb = getSupabase();
  if (sb) {
    console.log('✓ Supabase connecté');
    
    // Charger les données de l'utilisateur
    var profile = await loadUserProfile(userId);
    console.log('Profil utilisateur chargé:', profile);
    
    // Charger les paramètres
    var settings = await loadUserSettings(userId);
    console.log('Paramètres chargés:', settings);
  } else {
    console.log('⚠ Supabase désactivé, utilisation localStorage uniquement');
  }
}


// ============================================
// 8. SYNCHRONISER AVEC SUPABASE
// ============================================

// Fonction pour synchroniser toutes les données modifiées
async function syncAllDataToSupabase(userId) {
  console.log('Synchronisation avec Supabase en cours...');
  
  // Récupérer toutes les clés localStorage
  var allKeys = Object.keys(localStorage);
  
  for (var i = 0; i < allKeys.length; i++) {
    var key = allKeys[i];
    if (key.startsWith(userId)) {
      var value = localStorage.getItem(key);
      
      // Sauvegarder dans Supabase
      await dpSave(key, JSON.parse(value));
    }
  }
  
  showToast('Synchronisation terminée', 'success');
}


// ============================================
// 9. AUTHENTIFICATION AVEC SUPABASE
// ============================================

async function loginWithSupabase(email, password) {
  var sb = getSupabase();
  if (!sb) {
    showToast('Supabase non configuré', 'error');
    return false;
  }
  
  try {
    var response = await sb.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (response.data.user) {
      console.log('Utilisateur connecté:', response.data.user.id);
      return response.data.user;
    }
  } catch(error) {
    console.error('Erreur d\'authentification:', error.message);
    showToast('Erreur de connexion: ' + error.message, 'error');
    return false;
  }
}


async function signupWithSupabase(email, password) {
  var sb = getSupabase();
  if (!sb) {
    showToast('Supabase non configuré', 'error');
    return false;
  }
  
  try {
    var response = await sb.auth.signUp({
      email: email,
      password: password
    });
    
    if (response.data.user) {
      console.log('Utilisateur inscrit:', response.data.user.id);
      showToast('Inscription réussie! Vérifiez votre email.', 'success');
      return response.data.user;
    }
  } catch(error) {
    console.error('Erreur d\'inscription:', error.message);
    showToast('Erreur d\'inscription: ' + error.message, 'error');
    return false;
  }
}


async function logoutSupabase() {
  var sb = getSupabase();
  if (sb) {
    await sb.auth.signOut();
    console.log('Utilisateur déconnecté');
  }
}


// ============================================
// BONUS : Importer/Exporter les données
// ============================================

function exportUserData(userId) {
  var allData = {};
  var allKeys = Object.keys(localStorage);
  
  for (var i = 0; i < allKeys.length; i++) {
    var key = allKeys[i];
    if (key.startsWith(userId)) {
      allData[key] = JSON.parse(localStorage.getItem(key));
    }
  }
  
  // Télécharger en JSON
  var json = JSON.stringify(allData, null, 2);
  var blob = new Blob([json], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'agria-backup-' + new Date().toISOString() + '.json';
  a.click();
  URL.revokeObjectURL(url);
}
