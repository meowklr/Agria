/* ---------- CONFIG ---------- */

var CONFIG = {
  OPENWEATHER_API_KEY: "REMOVED_OPENWEATHER_KEY",
  OPENWEATHER_BASE_URL: "https://api.openweathermap.org/data/2.5",
  OPENMETEO_BASE_URL: "https://api.open-meteo.com/v1",
  NOMINATIM_BASE_URL: "https://nominatim.openstreetmap.org",
  NOMINATIM_SEARCH_URL: "https://nominatim.openstreetmap.org/search"
};

/* ---------- SUPABASE CONFIG ---------- */

var SUPABASE_CONFIG = {
  URL: "https://vqpxnibyljhoftbhtnjx.supabase.co",
  ANON_KEY: "sb_publishable_W9Nk_fRKHx2Et7mgwy4PGQ_06F0Y_ai",
  ENABLED: true
};

/* ---------- CROP_DATA ---------- */

var CROP_DATA = {
  Ble: { label:"Ble tendre", semis_debut:"10-01", semis_fin:"11-30", duree_cycle_jours:270, recolte_mois:"Juin - Juillet", besoins_eau_mm:{min:350,max:600}, irrigation_recommandee:"Faible a moderee (0 a 3 tours d'eau, 30-60 mm/tour)", besoin_azote_kg_ha:{min:150,max:250}, fractionnement_engrais:"3 apports : tallage (40 kg N), epi 1 cm (80 kg N), gonflement (60-80 kg N)", rendement_moyen_q_ha:{min:50,max:80}, sols_favorables:["Limoneux","Argilo-limoneux","Humifere"], sols_defavorables:["Sableux"], resistance_secheresse:"Faible", duree_vie_ans:1, rotation_minimum_ans:null, annee_premiere_production:null, notes_agronomiques:"Tres sensible au deficit hydrique a la levee et a la montaison. Fractionner l'azote en 3 apports obligatoires." },
  Mais: { label:"Mais", semis_debut:"04-15", semis_fin:"05-31", duree_cycle_jours:150, recolte_mois:"Septembre - Octobre", besoins_eau_mm:{min:600,max:800}, irrigation_recommandee:"Indispensable en Occitanie (6 a 10 tours d'eau)", besoin_azote_kg_ha:{min:200,max:300}, fractionnement_engrais:"2 apports : starter au semis, couverture au stade 8 feuilles", rendement_moyen_q_ha:{min:80,max:130}, sols_favorables:["Limoneux","Argilo-limoneux","Humifere"], sols_defavorables:["Sableux","Calcaire"], resistance_secheresse:"Tres faible", duree_vie_ans:1, rotation_minimum_ans:null, annee_premiere_production:null, notes_agronomiques:"Culture tres exigeante en eau. Sans irrigation, les pertes de rendement peuvent depasser 60%." },
  Tournesol: { label:"Tournesol", semis_debut:"04-01", semis_fin:"05-15", duree_cycle_jours:130, recolte_mois:"Aout - Septembre", besoins_eau_mm:{min:300,max:450}, irrigation_recommandee:"Optionnelle, bonne resistance a la secheresse", besoin_azote_kg_ha:{min:30,max:60}, fractionnement_engrais:"1 seul apport au semis ou en vegetation precoce", rendement_moyen_q_ha:{min:20,max:30}, sols_favorables:["Argileux","Limoneux","Calcaire","Mixte"], sols_defavorables:[], resistance_secheresse:"Bonne", duree_vie_ans:1, rotation_minimum_ans:4, annee_premiere_production:null, notes_agronomiques:"Culture rustique adaptee a l'Occitanie. Rotation minimum 4 ans pour eviter Sclerotinia." },
  Vigne: { label:"Vigne", semis_debut:"03-01", semis_fin:"04-30", duree_cycle_jours:210, recolte_mois:"Septembre - Octobre", besoins_eau_mm:{min:450,max:550}, irrigation_recommandee:"Moderee, contrainte hydrique controlee en maturation", besoin_azote_kg_ha:{min:30,max:60}, fractionnement_engrais:"Azote modere a la floraison. Phosphore et potassium en entretien.", rendement_moyen_q_ha:{min:40,max:80}, sols_favorables:["Calcaire","Argileux","Sableux","Mixte"], sols_defavorables:["Humifere"], resistance_secheresse:"Bonne a partir de 3 ans", duree_vie_ans:40, rotation_minimum_ans:null, annee_premiere_production:3, notes_agronomiques:"Plantation perenne sur 30 a 50 ans. Production a partir de la 3eme annee." },
  Lavande: { label:"Lavande / Lavandin", semis_debut:"03-15", semis_fin:"04-30", duree_cycle_jours:120, recolte_mois:"Juillet - Aout", besoins_eau_mm:{min:150,max:300}, irrigation_recommandee:"Non necessaire en conditions normales", besoin_azote_kg_ha:{min:20,max:50}, fractionnement_engrais:"Azote modere apres taille printaniere uniquement", rendement_moyen_q_ha:{min:15,max:180}, sols_favorables:["Calcaire","Sableux"], sols_defavorables:["Argilo-limoneux","Humifere"], resistance_secheresse:"Excellente", duree_vie_ans:10, rotation_minimum_ans:2, annee_premiere_production:2, notes_agronomiques:"Plantation perenne 10 ans. Sol calcaire et bien draine imperatif." },
  Colza: { label:"Colza", semis_debut:"08-20", semis_fin:"09-10", duree_cycle_jours:300, recolte_mois:"Juin - Juillet", besoins_eau_mm:{min:300,max:450}, irrigation_recommandee:"Faible (0 a 2 tours d'eau)", besoin_azote_kg_ha:{min:150,max:200}, fractionnement_engrais:"2 apports : sortie hiver et montaison. Sensible au soufre.", rendement_moyen_q_ha:{min:30,max:40}, sols_favorables:["Argilo-limoneux","Limoneux","Humifere"], sols_defavorables:["Sableux","Calcaire"], resistance_secheresse:"Faible a l'implantation", duree_vie_ans:1, rotation_minimum_ans:null, annee_premiere_production:null, notes_agronomiques:"Semis en periode seche d'aout-septembre : risque de mauvaise levee." },
  Sorgho: { label:"Sorgho", semis_debut:"05-01", semis_fin:"06-15", duree_cycle_jours:140, recolte_mois:"Septembre - Octobre", besoins_eau_mm:{min:250,max:400}, irrigation_recommandee:"Faible a moderee. Alternative au mais irrigue.", besoin_azote_kg_ha:{min:100,max:150}, fractionnement_engrais:"2 apports : semis et montaison", rendement_moyen_q_ha:{min:50,max:80}, sols_favorables:["Argileux","Limoneux","Calcaire","Mixte"], sols_defavorables:[], resistance_secheresse:"Tres bonne", duree_vie_ans:1, rotation_minimum_ans:null, annee_premiere_production:null, notes_agronomiques:"Excellente alternative au mais dans les zones sans irrigation." }
};

/* ---------- REGIONS ---------- */

var REGIONS = {
  "Auvergne-Rhone-Alpes":      { center: [45.4, 4.6],  bounds: [[44.1,2.5],[46.8,7.2]]   },
  "Bourgogne-Franche-Comte":   { center: [47.1, 4.8],  bounds: [[46.1,2.8],[48.0,7.1]]   },
  "Bretagne":                  { center: [48.1, -2.8], bounds: [[47.2,-5.2],[48.9,-1.0]]  },
  "Centre-Val de Loire":       { center: [47.5, 1.7],  bounds: [[46.4,-0.5],[48.5,3.5]]   },
  "Corse":                     { center: [42.0, 9.1],  bounds: [[41.3,8.5],[43.1,9.7]]    },
  "Grand Est":                 { center: [48.5, 6.5],  bounds: [[47.4,4.8],[49.5,8.3]]    },
  "Hauts-de-France":           { center: [50.2, 2.8],  bounds: [[49.4,1.5],[51.1,4.3]]    },
  "Ile-de-France":             { center: [48.8, 2.4],  bounds: [[48.1,1.4],[49.2,3.6]]    },
  "Normandie":                 { center: [49.1, 0.2],  bounds: [[48.1,-2.1],[50.0,2.1]]   },
  "Nouvelle-Aquitaine":        { center: [44.8, 0.0],  bounds: [[42.7,-2.0],[46.8,3.0]]   },
  "Occitanie":                 { center: [43.9, 2.3],  bounds: [[41.3,-2.0],[46.0,4.5]]   },
  "Pays de la Loire":          { center: [47.5, -0.8], bounds: [[46.5,-2.6],[48.6,1.2]]   },
  "Provence-Alpes-Cote d'Azur":{ center: [43.9, 6.1],  bounds: [[42.9,4.2],[45.1,8.0]]   }
};

/* ---------- FALLBACKS ---------- */

var METEO_FALLBACK = {
  ville: "Paris",
  temp: 17,
  humidity: 65,
  description: "Partiellement nuageux",
  icone: "fa-cloud-sun",
  previsions: [
    { jour: "Lun", tempMax: 18, tempMin: 11, icone: "fa-sun" },
    { jour: "Mar", tempMax: 15, tempMin: 9,  icone: "fa-cloud-rain" },
    { jour: "Mer", tempMax: 20, tempMin: 12, icone: "fa-sun" },
    { jour: "Jeu", tempMax: 16, tempMin: 10, icone: "fa-cloud" },
    { jour: "Ven", tempMax: 19, tempMin: 13, icone: "fa-cloud-sun" }
  ]
};

var OPENMETEO_FALLBACK = {
  precipitations7j: [2.1, 0, 5.4, 0, 0, 1.2, 8.0],
  tempMax: [14, 16, 13, 17, 18, 15, 12],
  tempMin: [7, 8, 6, 9, 10, 7, 5]
};

/* ---------- UTILS ---------- */

function getIconeMeteo(main) {
  var map = {
    Clear: 'fa-sun', Clouds: 'fa-cloud', Rain: 'fa-cloud-rain',
    Drizzle: 'fa-cloud-drizzle', Thunderstorm: 'fa-cloud-bolt',
    Snow: 'fa-snowflake', Mist: 'fa-smog', Fog: 'fa-smog'
  };
  return map[main] || 'fa-cloud-sun';
}

function calculPrecipTotal(precipitations) {
  var total = 0;
  for (var i = 0; i < precipitations.length; i++) { total += precipitations[i]; }
  return Math.round(total * 10) / 10;
}

function calculMoyenne(tableau) {
  var somme = 0;
  for (var i = 0; i < tableau.length; i++) { somme += tableau[i]; }
  return Math.round((somme / tableau.length) * 10) / 10;
}

/* ---------- TOAST NOTIFICATIONS ---------- */

function showToast(message, type) {
  type = type || 'info';
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;bottom:90px;right:16px;z-index:9999;display:flex;flex-direction:column;gap:8px;max-width:340px';
    document.body.appendChild(container);
  }

  var colors = { success: 'var(--success)', error: 'var(--danger)', info: 'var(--info)', warning: 'var(--warning)' };
  var icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info', warning: 'fa-triangle-exclamation' };

  var toast = document.createElement('div');
  toast.style.cssText =
    'background:var(--surface);border-left:4px solid ' + (colors[type] || colors.info) + ';' +
    'border-radius:var(--radius-md);padding:14px 16px;box-shadow:var(--shadow-lg);' +
    'font-size:13px;color:var(--text-primary);display:flex;align-items:flex-start;gap:10px;' +
    'animation:fade-in-up 0.3s var(--ease-spring);transition:opacity 0.25s,transform 0.25s;' +
    'font-family:"Plus Jakarta Sans",sans-serif;pointer-events:auto';

  toast.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + '" style="color:' + (colors[type] || colors.info) + ';font-size:16px;margin-top:1px;flex-shrink:0"></i>' +
    '<span style="flex:1;line-height:1.4">' + message + '</span>';

  container.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 250);
  }, 4000);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function debounce(fn, delay) {
  var timer;
  return function() {
    var ctx = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
  };
}

/* ---------- DATA PROVIDER (SUPABASE + LOCALSTORAGE) ---------- */

var supabaseClient = null;

function getSupabase() {
  if (!SUPABASE_CONFIG.ENABLED) return null;
  if (supabaseClient) return supabaseClient;
  
  // Chercher la bibiliothèque Supabase dans window
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
    return supabaseClient;
  }
  
  // Fallback : créer le client directement si disponible
  if (typeof window.supabase !== 'undefined' && typeof window.supabase === 'object') {
    try {
      supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
      return supabaseClient;
    } catch(e) {
      console.warn('Supabase non chargé correctement', e);
      return null;
    }
  }
  
  return null;
}

function getStorageKey(suffix) {
  return suffix + '_' + getUserId();
}

async function dpLoad(key, fallback) {
  var sb = getSupabase();
  if (sb) {
    try {
      var res = await sb.from('agria_data').select('value').eq('key', key).single();
      if (res.data) return JSON.parse(res.data.value);
    } catch(e) { console.warn('Supabase fallback -> localStorage'); }
  }
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e) { return fallback; }
}

function dpLoadSync(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch(e) { return fallback; }
}

async function dpSave(key, value) {
  var sb = getSupabase();
  var json = JSON.stringify(value);
  localStorage.setItem(key, json);
  if (sb) {
    try {
      await sb.from('agria_data').upsert({ key: key, value: json, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    } catch(e) { console.warn('Supabase sync differee'); }
  }
}

function dpSaveSync(key, value) {
  var json = JSON.stringify(value);
  localStorage.setItem(key, json);
}

function dpRemove(key) {
  localStorage.removeItem(key);
  var sb = getSupabase();
  if (sb) {
    try { sb.from('agria_data').delete().eq('key', key).then(function(){}); } catch(e) {}
  }
}

function dpGetAllKeys(prefix) {
  var keys = [];
  for (var i = 0; i < localStorage.length; i++) {
    var k = localStorage.key(i);
    if (k && k.indexOf(prefix) === 0) keys.push(k);
  }
  return keys;
}

function dpLoadAll(prefix) {
  var keys = dpGetAllKeys(prefix);
  var results = [];
  for (var i = 0; i < keys.length; i++) {
    try { results.push(JSON.parse(localStorage.getItem(keys[i]))); } catch(e) {}
  }
  return results;
}

function getSession() {
  try { return JSON.parse(localStorage.getItem('agria_session')); } catch(e) { return null; }
}

function getUserId() {
  var session = getSession();
  if (!session) {
    session = { userId: generateId(), email: localStorage.getItem('agria_user') || 'invite@agria.fr' };
    localStorage.setItem('agria_session', JSON.stringify(session));
  }
  return session.userId;
}

function getPrefsKey() { return 'agria_prefs_' + getUserId(); }
function getChampsKey() { return 'agria_champs_' + getUserId(); }
function getProfileKey() { return 'agria_user_profile_' + getUserId(); }

/* ---------- EFFETS CINEMATIQUES ---------- */

function initScrollReveal() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  var elements = document.querySelectorAll('.reveal');
  for (var i = 0; i < elements.length; i++) { observer.observe(elements[i]); }

  var sections = document.querySelectorAll('.dashboard-section, .card');
  for (var j = 0; j < sections.length; j++) {
    if (!sections[j].classList.contains('reveal')) { sections[j].classList.add('reveal'); }
    observer.observe(sections[j]);
  }
}

function initParticleEffect() {
  var buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-danger');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', function() { ripple.remove(); });
    });
  }
}

function typewriterEffect(element, text, speed, callback) {
  var i = 0;
  element.textContent = '';
  element.classList.add('typewriter');
  function type() {
    if (i < text.length) { element.textContent += text.charAt(i); i++; setTimeout(type, speed); }
    else { element.classList.remove('typewriter'); if (callback) callback(); }
  }
  type();
}

function scrambleEffect(element, finalText, duration, callback) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  var steps = 12;
  var interval = duration / steps;
  var step = 0;
  element.classList.add('text-scramble');
  function scramble() {
    var scrambled = '';
    for (var i = 0; i < finalText.length; i++) {
      if (finalText[i] === ' ') { scrambled += ' '; }
      else if (i < Math.floor((step / steps) * finalText.length)) { scrambled += finalText[i]; }
      else { scrambled += chars[Math.floor(Math.random() * chars.length)]; }
    }
    element.textContent = scrambled;
    step++;
    if (step <= steps) { setTimeout(scramble, interval); }
    else { element.textContent = finalText; element.classList.remove('text-scramble'); if (callback) callback(); }
  }
  scramble();
}

function transitionPage(url) {
  document.documentElement.style.transition = 'filter 0.2s ease, opacity 0.2s ease';
  document.documentElement.style.filter = 'blur(3px)';
  document.documentElement.style.opacity = '0.6';
  setTimeout(function() { window.location.href = url; }, 200);
}

/* ---------- AMBIANCE ---------- */

function initAmbiance() {
  if (document.querySelector('.ambient-orb')) return;
  var orb1 = document.createElement('div');
  orb1.className = 'ambient-orb ambient-orb-1';
  var orb2 = document.createElement('div');
  orb2.className = 'ambient-orb ambient-orb-2';
  document.body.appendChild(orb1);
  document.body.appendChild(orb2);

  var header = document.querySelector('.page-header');
  if (header) {
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          header.classList.toggle('scrolled', window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* ---------- MODULE AUTH ---------- */

function initLogin() {
  var form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var email = document.getElementById('email').value.trim();
    if (!email) return;
    var userId = generateId();
    localStorage.setItem('agria_session', JSON.stringify({ userId: userId, email: email }));
    localStorage.setItem('agria_user', email);
    transitionPage('dashboard.html');
  });

  var btnRegister = document.getElementById('btnRegister');
  if (btnRegister) {
    btnRegister.addEventListener('click', function() {
      var email = document.getElementById('email').value.trim();
      if (!email) { showToast('Veuillez saisir une adresse email pour creer un compte.', 'error'); return; }
      var userId = generateId();
      localStorage.setItem('agria_session', JSON.stringify({ userId: userId, email: email }));
      localStorage.setItem('agria_user', email);
      transitionPage('dashboard.html');
    });
  }

  var btnDev = document.getElementById('btnDevBypass');
  if (btnDev) {
    btnDev.addEventListener('click', function() {
      var userId = generateId();
      localStorage.setItem('agria_session', JSON.stringify({ userId: userId, email: 'dev@agria.fr' }));
      localStorage.setItem('agria_user', 'dev@agria.fr');
      transitionPage('dashboard.html');
    });
  }
}

function logout() {
  localStorage.removeItem('agria_session');
  localStorage.removeItem('agria_user');
  localStorage.removeItem('agria_ville');
  transitionPage('login.html');
}

function getStoredUser() {
  return localStorage.getItem('agria_user') || 'Utilisateur';
}

/* ---------- MODULE METEO ---------- */

function getDefaultVille() {
  return localStorage.getItem('agria_ville') || 'Paris';
}

function setDefaultVille(ville) { localStorage.setItem('agria_ville', ville); }

function convertirIconeOpenWeather(iconCode) {
  var map = {
    '01d': 'fa-sun', '01n': 'fa-moon', '02d': 'fa-cloud-sun', '02n': 'fa-cloud-moon',
    '03d': 'fa-cloud', '03n': 'fa-cloud', '04d': 'fa-cloud', '04n': 'fa-cloud',
    '09d': 'fa-cloud-drizzle', '09n': 'fa-cloud-drizzle',
    '10d': 'fa-cloud-rain', '10n': 'fa-cloud-rain',
    '11d': 'fa-cloud-bolt', '11n': 'fa-cloud-bolt',
    '13d': 'fa-snowflake', '13n': 'fa-snowflake',
    '50d': 'fa-smog', '50n': 'fa-smog'
  };
  return map[iconCode] || 'fa-cloud-sun';
}

function joursFrancais() { return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']; }

/* Recherche de ville avec autocomplete */

var citySearchTimer = null;
var cityDropdownEl = null;

function initCitySearch(inputEl, onSelect) {
  if (!inputEl) return;

  inputEl.addEventListener('input', function() {
    var query = inputEl.value.trim();
    if (query.length < 2) { hideCityDropdown(); return; }
    clearTimeout(citySearchTimer);
    citySearchTimer = setTimeout(function() { fetchCitySuggestions(query); }, 350);
  });

  inputEl.addEventListener('focus', function() {
    if (inputEl.value.trim().length >= 2) fetchCitySuggestions(inputEl.value.trim());
  });

  inputEl.addEventListener('blur', function() {
    setTimeout(function() { hideCityDropdown(); }, 200);
  });

  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var query = inputEl.value.trim();
      if (query) {
        hideCityDropdown();
        var cleanName = query.replace(/\s+/g, ' ').trim();
        cleanName = cleanName.replace(/\b\w/g, function(c) { return c.toUpperCase(); });
        cleanName = cleanName.replace(/\s-\s?/g, '-');
        cleanName = cleanName.replace(/(\w)-(\w)/g, function(m, a, b) { return a + '-' + b.toUpperCase(); });
        if (onSelect) onSelect(cleanName);
      }
    }
  });

  window._cityOnSelect = onSelect;
}

function fetchCitySuggestions(query) {
  var url = CONFIG.NOMINATIM_SEARCH_URL + '?q=' + encodeURIComponent(query) + ',France&format=json&limit=5';
  fetch(url, { headers: { 'User-Agent': 'AgriIA-App/1.0' } })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (!Array.isArray(data) || data.length === 0) { hideCityDropdown(); return; }
      showCityDropdown(data);
    })
    .catch(function() { hideCityDropdown(); });
}

function showCityDropdown(results) {
  hideCityDropdown();
  var input = document.getElementById('meteoVilleInput');
  if (!input) return;

  var inputRect = input.getBoundingClientRect();

  cityDropdownEl = document.createElement('div');
  cityDropdownEl.className = 'city-search-dropdown';
  cityDropdownEl.style.cssText =
    'position:fixed;left:' + inputRect.left + 'px;top:' + (inputRect.bottom + 4) + 'px;' +
    'width:' + inputRect.width + 'px;' +
    'background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius-md);' +
    'box-shadow:var(--shadow-lg);z-index:999;max-height:220px;overflow-y:auto';
  document.body.appendChild(cityDropdownEl);

  for (var i = 0; i < results.length; i++) {
    var item = document.createElement('div');
    var displayName = results[i].display_name.split(',')[0];
    item.style.cssText =
      'padding:12px 14px;cursor:pointer;font-size:14px;color:var(--text-primary);' +
      'border-bottom:1px solid var(--border-light);transition:background 0.12s var(--ease-smooth);';
    item.textContent = displayName;

    (function(idx, el) {
      el.addEventListener('mousedown', function(e) {
        e.preventDefault();
        var name = results[idx].display_name.split(',')[0];
        input.value = name;
        hideCityDropdown();
        if (window._cityOnSelect) window._cityOnSelect(name);
      });
      el.addEventListener('mouseenter', function() { el.style.background = 'var(--bg-green)'; });
      el.addEventListener('mouseleave', function() { el.style.background = ''; });
    })(i, item);

    cityDropdownEl.appendChild(item);
  }

  function reposition() { hideCityDropdown(); }
  window.addEventListener('scroll', reposition, { once: true });
  window.addEventListener('resize', reposition, { once: true });
}

function hideCityDropdown() {
  if (cityDropdownEl) { cityDropdownEl.remove(); cityDropdownEl = null; }
}

async function fetchMeteoActuelle(ville) {
  try {
    var url = CONFIG.OPENWEATHER_BASE_URL + '/weather?q=' + encodeURIComponent(ville) + '&appid=' + CONFIG.OPENWEATHER_API_KEY + '&units=metric&lang=fr';
    var reponse = await fetch(url);
    if (!reponse.ok) throw new Error('API erreur');
    var data = await reponse.json();
    return { ville: data.name, temp: Math.round(data.main.temp), humidity: data.main.humidity, description: data.weather[0].description, icone: convertirIconeOpenWeather(data.weather[0].icon), main: data.weather[0].main };
  } catch (err) { console.warn('Fallback meteo :', err.message); return METEO_FALLBACK; }
}

async function fetchPrevisions(ville) {
  try {
    var url = CONFIG.OPENWEATHER_BASE_URL + '/forecast?q=' + encodeURIComponent(ville) + '&appid=' + CONFIG.OPENWEATHER_API_KEY + '&units=metric&lang=fr';
    var reponse = await fetch(url);
    if (!reponse.ok) throw new Error('API erreur');
    var data = await reponse.json();
    var jours = joursFrancais();
    var jourMap = {};
    for (var i = 0; i < data.list.length; i++) {
      var item = data.list[i];
      var d = new Date(item.dt_txt);
      var key = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
      if (!jourMap[key]) {
        jourMap[key] = { jour: jours[d.getDay()], tempMax: item.main.temp_max, tempMin: item.main.temp_min, icone: item.weather[0].icon, count: 1 };
      } else {
        if (item.main.temp_max > jourMap[key].tempMax) jourMap[key].tempMax = item.main.temp_max;
        if (item.main.temp_min < jourMap[key].tempMin) jourMap[key].tempMin = item.main.temp_min;
        jourMap[key].count++;
        if (jourMap[key].count === 4) jourMap[key].icone = item.weather[0].icon;
      }
    }
    var result = [];
    var todayKey = new Date().getFullYear() + '-' + ('0' + (new Date().getMonth() + 1)).slice(-2) + '-' + ('0' + new Date().getDate()).slice(-2);
    for (var k in jourMap) {
      if (k !== todayKey) {
        result.push({
          jour: jourMap[k].jour,
          tempMax: Math.round(jourMap[k].tempMax),
          tempMin: Math.round(jourMap[k].tempMin),
          icone: convertirIconeOpenWeather(jourMap[k].icone)
        });
      }
    }
    return result.slice(0, 5);
  } catch (err) { console.warn('Fallback previsions :', err.message); return METEO_FALLBACK.previsions; }
}

function renderMeteo(data) {
  var elVille = document.getElementById('meteoVille');
  var elIcone = document.getElementById('meteoIcone');
  var elTemp = document.getElementById('meteoTemp');
  var elDesc = document.getElementById('meteoDesc');
  var elHumidite = document.getElementById('meteoHumidite');
  if (elVille) elVille.textContent = data.ville;
  if (elIcone) { elIcone.className = 'fa-solid ' + data.icone + ' meteo-icone updated'; setTimeout(function() { elIcone.classList.remove('updated'); }, 500); }
  if (elTemp) elTemp.innerHTML = data.temp + '<small>&deg;C</small>';
  if (elDesc) elDesc.textContent = data.description;
  if (elHumidite) elHumidite.innerHTML = '<i class="fa-solid fa-droplet"></i><span>Humidite : <strong>' + data.humidity + '%</strong></span>';
}

function renderPrevisions(previsions) {
  var container = document.getElementById('previsionsContainer');
  if (!container) return;
  container.innerHTML = '';
  for (var i = 0; i < previsions.length; i++) {
    var p = previsions[i];
    var card = document.createElement('div');
    card.className = 'card card-metric previsions-card reveal reveal-delay-' + (i + 1);
    card.style.animationDelay = (i * 0.08) + 's';
    card.innerHTML = '<span class="previsions-jour">' + p.jour + '</span><i class="fa-solid ' + p.icone + ' previsions-icone"></i><span class="previsions-temp-max">' + p.tempMax + '<small>&deg;</small></span><span class="previsions-temp-min">' + p.tempMin + '<small>&deg;</small></span>';
    container.appendChild(card);
    setTimeout(function(c) {
      c.style.opacity = '1';
      c.style.transform = 'translateY(0)';
      c.style.filter = 'blur(0)';
    }, i * 80, card);
  }
}

function showWeatherSkeleton() {
  var existing = document.getElementById('weatherSkeleton');
  if (existing) return;
  var card = document.querySelector('.meteo-card');
  if (!card) return;
  var skel = document.createElement('div');
  skel.id = 'weatherSkeleton';
  skel.style.cssText = 'position:absolute;inset:0;z-index:5;background:var(--surface);border-radius:inherit;padding:24px;display:flex;flex-direction:column;gap:12px';
  skel.innerHTML =
    '<div class="skeleton skeleton-text" style="width:35%"></div>' +
    '<div class="skeleton skeleton-temp" style="margin-top:4px"></div>' +
    '<div class="skeleton skeleton-text-sm" style="margin-top:4px"></div>' +
    '<div class="skeleton skeleton-text" style="width:65%;margin-top:12px"></div>';
  card.style.position = card.style.position || 'relative';
  card.appendChild(skel);
}

function hideWeatherSkeleton() {
  var skel = document.getElementById('weatherSkeleton');
  if (skel) {
    skel.style.opacity = '0';
    skel.style.transition = 'opacity 0.2s ease';
    setTimeout(function() { if (skel.parentNode) skel.remove(); }, 200);
  }
}

async function chargerMeteo(ville) {
  showWeatherSkeleton();
  var meteo = await fetchMeteoActuelle(ville);
  hideWeatherSkeleton();
  renderMeteo(meteo);
  var previsions = await fetchPrevisions(ville);
  renderPrevisions(previsions);
}

/* ---------- MODULE CARTE ---------- */

async function fetchCoordonnees(ville) {
  try {
    var url = CONFIG.NOMINATIM_BASE_URL + '/search?q=' + encodeURIComponent(ville) + ',France&format=json&limit=1';
    var reponse = await fetch(url, { headers: { 'User-Agent': 'AgriIA-App/1.0' } });
    if (!reponse.ok) throw new Error('API erreur');
    var data = await reponse.json();
    if (data.length === 0) throw new Error('Ville introuvable');
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (err) { console.warn('Fallback coordonnees :', err.message); return { lat: 48.8566, lon: 2.3522 }; }
}

/* ---------- MODULE CHAMPS ---------- */

function loadChamps() {
  return dpLoadSync(getChampsKey(), []);
}

function saveChamps(champs) {
  dpSaveSync(getChampsKey(), champs);
}

function addChamp(champ) {
  champ.id = champ.id || generateId();
  var champs = loadChamps();
  champs.push(champ);
  saveChamps(champs);
  return champ;
}

function updateChamp(id, data) {
  var champs = loadChamps();
  for (var i = 0; i < champs.length; i++) {
    if (champs[i].id === id) { champs[i] = data; break; }
  }
  saveChamps(champs);
}

function deleteChamp(id) {
  var champs = loadChamps();
  champs = champs.filter(function(c) { return c.id !== id; });
  saveChamps(champs);
  return champs;
}

/* ---------- MODULE PREDICTIONS ---------- */

function generatePredictions(field) {
  var crop = CROP_DATA[field.culture];
  if (!crop) return { error: 'Culture inconnue' };

  var area = parseFloat(field.surface) || 1;
  var today = new Date();
  var sowingDate = field.dateSemis ? new Date(field.dateSemis + 'T00:00:00') : null;

  var soilScore, soilText;
  if (crop.sols_favorables.indexOf(field.typeSol) !== -1) { soilScore = 5; soilText = 'Sol tres favorable pour cette culture.'; }
  else if (crop.sols_defavorables.indexOf(field.typeSol) !== -1) { soilScore = 1; soilText = 'Sol defavorable. Rendements reduits attendus.'; }
  else { soilScore = 3; soilText = 'Sol acceptable. Conditions neutres.'; }

  var waterNeedM3 = Math.round(((crop.besoins_eau_mm.min + crop.besoins_eau_mm.max) / 2) * 10 * area);
  var irrigationAlert = false;
  var irrigationMsg = '';
  if ((!field.irrigation || field.irrigation === 'Aucun') && (crop.resistance_secheresse === 'Faible' || crop.resistance_secheresse === 'Tres faible')) {
    irrigationAlert = true;
    irrigationMsg = 'Attention : cette culture necessite une irrigation en Occitanie. Sans apport d\'eau, les pertes de rendement peuvent etre importantes.';
  }

  var azoteTotal = Math.round(((crop.besoin_azote_kg_ha.min + crop.besoin_azote_kg_ha.max) / 2) * area);
  var coutEngrais = Math.round(azoteTotal * 1.20);

  var rendMin = Math.round((crop.rendement_moyen_q_ha.min / 10) * area * 10) / 10;
  var rendMax = Math.round((crop.rendement_moyen_q_ha.max / 10) * area * 10) / 10;
  var uniteRend = (field.culture === 'Lavande') ? 'kg d\'huile essentielle' : (field.culture === 'Vigne' ? 'hl' : 'tonnes');

  var recolteEstimee = '';
  if (sowingDate && crop.duree_cycle_jours) {
    var recolte = new Date(sowingDate);
    recolte.setDate(recolte.getDate() + crop.duree_cycle_jours);
    recolteEstimee = ('0' + recolte.getDate()).slice(-2) + '/' + ('0' + (recolte.getMonth() + 1)).slice(-2) + '/' + recolte.getFullYear();
  } else {
    recolteEstimee = crop.recolte_mois || 'Non calcule';
  }

  var globalRecommandation;
  if (soilScore >= 4 && !irrigationAlert) globalRecommandation = 'Conditions favorables pour cette culture sur ce champ.';
  else if (soilScore >= 3 && !irrigationAlert) globalRecommandation = 'Conditions acceptables. Surveiller l\'irrigation et la fertilisation.';
  else if (soilScore >= 2) globalRecommandation = 'Conditions defavorables. Rendements potentiellement reduits.';
  else globalRecommandation = 'Culture fortement deconseillee sur ce sol.';

  return {
    date_recolte_estimee: recolteEstimee,
    score_sol: { score: soilScore, texte: soilText },
    besoins_eau_total_m3: waterNeedM3,
    alerte_irrigation: { active: irrigationAlert, message: irrigationMsg },
    fertilisation: { azote_total_kg: azoteTotal, fractionnement: crop.fractionnement_engrais, cout_estime_euros: coutEngrais },
    rendement_estime: { min: rendMin, max: rendMax, unite: uniteRend },
    recommandation_globale: globalRecommandation,
    notes: crop.notes_agronomiques,
    resistance_secheresse: crop.resistance_secheresse,
    duree_vie_ans: crop.duree_vie_ans
  };
}

function calculCentroide(coords) {
  var lat = 0, lng = 0;
  for (var i = 0; i < coords.length; i++) { lat += coords[i][0]; lng += coords[i][1]; }
  return { lat: lat / coords.length, lon: lng / coords.length };
}

function checkCollision(newCoords) {
  var nouveauPolygon = L.polygon(newCoords);
  var allKeys = dpGetAllKeys('agria_champs_');

  for (var j = 0; j < allKeys.length; j++) {
    try {
      var champs = dpLoadSync(allKeys[j], []);
      if (!Array.isArray(champs)) continue;
      for (var k = 0; k < champs.length; k++) {
        if (!champs[k].polygonCoords || champs[k].polygonCoords.length < 3) continue;
        var existingPolygon = L.polygon(champs[k].polygonCoords);
        if (nouveauPolygon.getBounds().intersects(existingPolygon.getBounds())) {
          return { collision: true, nom: champs[k].nom || 'Inconnu' };
        }
      }
    } catch(e) {}
  }
  return { collision: false };
}

/* ---------- MODULE DIAGNOSTIC ---------- */

async function fetchOpenMeteo(lat, lon) {
  try {
    var url = CONFIG.OPENMETEO_BASE_URL + '/forecast?latitude=' + lat + '&longitude=' + lon + '&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=Europe/Paris&past_days=7&forecast_days=1';
    var reponse = await fetch(url);
    if (!reponse.ok) throw new Error('API erreur');
    var data = await reponse.json();
    return { precipitations7j: data.daily.precipitation_sum.slice(0, 7), tempMax: data.daily.temperature_2m_max.slice(0, 7), tempMin: data.daily.temperature_2m_min.slice(0, 7) };
  } catch (err) { console.warn('Fallback Open-Meteo :', err.message); return OPENMETEO_FALLBACK; }
}

function genererDiagnostic(culture, symptomes, meteoData) {
  var baseDiagnostics = {
    ble: [{ nom: 'Septoriose', gravite: 'warning', symptomes: ['taches','jaunissement'] },{ nom: 'Rouille jaune', gravite: 'danger', symptomes: ['jaunissement','taches'] },{ nom: 'Fusariose', gravite: 'danger', symptomes: ['fletrissement','pourriture'] }],
    mais: [{ nom: 'Pyrale du mais', gravite: 'warning', symptomes: ['insectes','fletrissement'] },{ nom: 'Charbon du mais', gravite: 'danger', symptomes: ['taches','pourriture'] },{ nom: 'Helminthosporiose', gravite: 'warning', symptomes: ['taches','jaunissement'] }],
    tournesol: [{ nom: 'Mildiou', gravite: 'danger', symptomes: ['jaunissement','fletrissement','croissance'] },{ nom: 'Sclerotinia', gravite: 'danger', symptomes: ['fletrissement','pourriture'] },{ nom: 'Phomopsis', gravite: 'warning', symptomes: ['taches','jaunissement'] }],
    colza: [{ nom: 'Sclerotinia', gravite: 'danger', symptomes: ['fletrissement','pourriture'] },{ nom: 'Phoma', gravite: 'warning', symptomes: ['taches','jaunissement'] },{ nom: 'Altises', gravite: 'info', symptomes: ['insectes','croissance'] }],
    vigne: [{ nom: 'Mildiou', gravite: 'danger', symptomes: ['taches','jaunissement','fletrissement'] },{ nom: 'Oidium', gravite: 'warning', symptomes: ['taches','fletrissement'] },{ nom: 'Botrytis', gravite: 'danger', symptomes: ['pourriture','taches'] }]
  };
  var diagnostics = baseDiagnostics[culture] || baseDiagnostics.ble;
  var meilleurScore = 0, meilleurDiag = diagnostics[0];
  for (var i = 0; i < diagnostics.length; i++) { var score = 0; for (var j = 0; j < symptomes.length; j++) { if (diagnostics[i].symptomes.indexOf(symptomes[j]) !== -1) score++; } if (score > meilleurScore) { meilleurScore = score; meilleurDiag = diagnostics[i]; } }
  var gravite = symptomes.length >= 4 ? 'danger' : meilleurDiag.gravite;
  var explications = {
    'Septoriose': 'La septoriose est une maladie fongique frequente du ble. Elle se manifeste par des taches brunes sur les feuilles et peut reduire le rendement de 20 a 40%.',
    'Rouille jaune': 'La rouille jaune est causee par un champignon qui forme des pustules jaune-orange en stries sur les feuilles. Elle se propage rapidement par temps frais et humide.',
    'Fusariose': 'La fusariose est une maladie grave qui affecte les epis et les tiges.',
    'Pyrale du mais': 'La pyrale est un insecte ravageur dont les larves creusent des galeries dans les tiges et les epis.',
    'Charbon du mais': 'Le charbon provoque des tumeurs sur les epis et les tiges.',
    'Helminthosporiose': 'L\'helminthosporiose provoque des lesions necrotiques sur les feuilles de mais.',
    'Mildiou': 'Le mildiou est un champignon parasite qui provoque des taches jaunes et un feutrage blanc sous les feuilles.',
    'Sclerotinia': 'Le sclerotinia provoque le deperissement des tiges et des capitules.',
    'Phomopsis': 'Le phomopsis entraine des lesions brunes sur les tiges.',
    'Altises': 'Les altises sont de petits coleopteres qui perforent les feuilles.',
    'Oidium': 'L\'oidium se manifeste par un feutrage blanc poudreux sur les feuilles et les grappes.',
    'Botrytis': 'Le botrytis, ou pourriture grise, affecte les grappes de raisin.'
  };
  return { nom: meilleurDiag.nom, gravite: gravite, explication: explications[meilleurDiag.nom] || 'Diagnostic etabli a partir des symptomes observes.', meteo: meteoData, recommandations: genererRecommandations(meilleurDiag.nom) };
}

function genererRecommandations(maladie) {
  var recos = {
    'Septoriose': ['Appliquer un fongicide a base de triazole au stade 2-3 noeuds.','Pratiquer la rotation des cultures pour limiter l\'inoculum.','Surveiller les previsions meteo : intervenir avant une periode humide.'],
    'Rouille jaune': ['Utiliser des varietes resistantes pour le prochain semis.','Appliquer un fongicide des l\'apparition des premieres pustules.','Eviter les semis trop denses qui favorisent l\'humidite.'],
    'Fusariose': ['Appliquer un fongicide specifique a la floraison.','Detruire les residus de recolte infectes.','Respecter une rotation d\'au moins 2 ans sans cereales.'],
    'Pyrale du mais': ['Utiliser un insecticide biologique a base de Bacillus thuringiensis.','Broyer et enfouir les cannes apres recolte.','Installer des trichogrammes, parasitoiides naturels.'],
    'Charbon du mais': ['Retirer et detruire les parties infectees.','Eviter les blessures mecaniques lors des travaux du sol.','Pratiquer une rotation longue (3-4 ans) sans mais.'],
    'Helminthosporiose': ['Appliquer un traitement fongicide preventif.','Choisir des hybrides tolerants.','Assurer une fertilisation equilibree en potassium.'],
    'Mildiou': ['Appliquer un fongicide cuprique en traitement preventif.','Assurer un bon drainage de la parcelle.','Supprimer les feuilles atteintes.'],
    'Sclerotinia': ['Appliquer un fongicide specifique a la floraison.','Eviter l\'irrigation excessive.','Realiser un labour profond pour enfouir les sclerotes.'],
    'Phomopsis': ['Appliquer un fongicide a l\'automne et au printemps.','Utiliser des semences certifiees.','Respecter une rotation d\'au moins 3 ans.'],
    'Altises': ['Realiser un semis precoce pour eviter le pic d\'infestation.','Appliquer un insecticide en cas d\'attaque severe.','Favoriser la presence d\'auxiliaires naturels.'],
    'Oidium': ['Appliquer un fongicide a base de soufre.','Pratiquer l\'effeuillage pour aerer les grappes.','Surveiller l\'apparition des premiers symptomes.'],
    'Botrytis': ['Assurer une bonne aeration du feuillage par la taille.','Appliquer un fongicide anti-botrytis a la nouaison.','Eviter l\'exces de vigueur en limitant la fertilisation azotee.']
  };
  return recos[maladie] || ['Consulter un technicien agricole.','Mettre en place une surveillance renforcee.','Prevoir un traitement adapte selon l\'evolution.'];
}

function renderResultat(diagnostic) {
  var badge = document.getElementById('diagBadge');
  if (badge) {
    var classes = 'badge ', texte = '';
    if (diagnostic.gravite === 'danger') { classes += 'badge-danger'; texte = 'Urgent'; }
    else if (diagnostic.gravite === 'warning') { classes += 'badge-warning'; texte = 'Attention'; }
    else { classes += 'badge-info'; texte = 'Information'; }
    badge.className = classes; badge.textContent = texte;
  }
  var titre = document.getElementById('diagTitre');
  if (titre) scrambleEffect(titre, 'Diagnostic : ' + diagnostic.nom, 800);
  var explication = document.getElementById('diagExplication');
  if (explication) typewriterEffect(explication, diagnostic.explication, 25);
  var meteoGrid = document.getElementById('diagMeteoGrid');
  if (meteoGrid) {
    meteoGrid.innerHTML = '<div class="diagnostic-meteo-item">Precipitations 7 jours<strong>' + calculPrecipTotal(diagnostic.meteo.precipitations7j) + ' mm</strong></div><div class="diagnostic-meteo-item">Temperature max moyenne<strong>' + calculMoyenne(diagnostic.meteo.tempMax) + ' C</strong></div><div class="diagnostic-meteo-item">Temperature min moyenne<strong>' + calculMoyenne(diagnostic.meteo.tempMin) + ' C</strong></div>';
  }
  var recos = document.getElementById('diagRecommandations');
  if (recos) { recos.innerHTML = ''; for (var i = 0; i < diagnostic.recommandations.length; i++) { var li = document.createElement('li'); li.innerHTML = '<i class="fa-solid fa-circle-check"></i>' + diagnostic.recommandations[i]; recos.appendChild(li); } }
}

/* ---------- MODULE MODALE ---------- */

function openSheet(contentHtml) {
  closeSheet();
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modalOverlay';
  overlay.addEventListener('click', closeSheet);

  var sheet = document.createElement('div');
  sheet.className = 'modal-sheet';
  sheet.id = 'modalSheet';
  sheet.innerHTML = '<div class="sheet-handle"></div>' + contentHtml;
  sheet.addEventListener('click', function(e) { e.stopPropagation(); });

  document.body.appendChild(overlay);
  document.body.appendChild(sheet);
}

function closeSheet() {
  var overlay = document.getElementById('modalOverlay');
  var sheet = document.getElementById('modalSheet');
  if (overlay) overlay.remove();
  if (sheet) sheet.remove();
}

function getSheetContent() { return document.getElementById('modalSheet'); }

/* ---------- MODULE PROFIL ---------- */

function loadProfile() {
  return dpLoadSync(getProfileKey(), {});
}

function saveProfile(data) {
  dpSaveSync(getProfileKey(), data);
}

function renderProfileStats() {
  var champs = loadChamps();
  var nb = document.getElementById('statNbChamps');
  var surface = document.getElementById('statSurface');
  var cultures = document.getElementById('statCultures');
  var dernier = document.getElementById('statDernier');
  if (!nb) return;

  nb.textContent = champs.length;
  var totalHa = 0;
  for (var i = 0; i < champs.length; i++) { totalHa += parseFloat(champs[i].surface) || 0; }
  surface.textContent = totalHa.toFixed(1) + ' ha';

  var listeCultures = [];
  for (var j = 0; j < champs.length; j++) { if (champs[j].culture && listeCultures.indexOf(champs[j].culture) === -1) listeCultures.push(champs[j].culture); }
  cultures.textContent = listeCultures.length > 0 ? listeCultures.join(', ') : 'Aucune';

  if (champs.length > 0) {
    var latest = champs[champs.length - 1];
    dernier.textContent = latest.nom + ' (' + latest.dateSemis + ')';
  } else { dernier.textContent = 'Aucun'; }
}

function initProfil() {
  var profile = loadProfile();
  var session = getSession();
  var emailUser = session ? session.email : (localStorage.getItem('agria_user') || '');

  var inputPrenom = document.getElementById('profilPrenom');
  var inputNom = document.getElementById('profilNom');
  var inputEmail = document.getElementById('profilEmail');
  var inputTel = document.getElementById('profilTel');
  if (inputPrenom) inputPrenom.value = profile.prenom || '';
  if (inputNom) inputNom.value = profile.nom || '';
  if (inputEmail) inputEmail.value = emailUser;
  if (inputTel) inputTel.value = profile.telephone || '';

  var avatar = document.getElementById('profilAvatar');
  if (avatar) {
    var p = (profile.prenom || 'A')[0].toUpperCase();
    var n = (profile.nom || 'A')[0].toUpperCase();
    avatar.textContent = p + n;
  }

  var btnSaveId = document.getElementById('btnSaveIdentite');
  if (btnSaveId) {
    btnSaveId.addEventListener('click', function() {
      profile.prenom = inputPrenom ? inputPrenom.value.trim() : '';
      profile.nom = inputNom ? inputNom.value.trim() : '';
      profile.telephone = inputTel ? inputTel.value.trim() : '';
      saveProfile(profile);
      if (avatar) { var pp = (profile.prenom || 'A')[0].toUpperCase(); var nn = (profile.nom || 'A')[0].toUpperCase(); avatar.textContent = pp + nn; }
      showToast('Profil sauvegarde.', 'success');
    });
  }

  var inputExpl = document.getElementById('profilExploitationNom');
  var inputSiret = document.getElementById('profilSiret');
  var selectType = document.getElementById('profilTypeAgri');
  if (inputExpl) inputExpl.value = profile.exploitation || '';
  if (inputSiret) inputSiret.value = profile.siret || '';
  if (selectType) selectType.value = profile.typeAgriculture || '';

  var regionInfo = document.getElementById('profilRegionInfo');
  if (regionInfo) {
    var prefs = JSON.parse(localStorage.getItem(getPrefsKey()) || '{}');
    regionInfo.textContent = 'Derniere region consultee : ' + (prefs.region || 'Occitanie');
  }

  var btnSaveExpl = document.getElementById('btnSaveExploitation');
  if (btnSaveExpl) {
    btnSaveExpl.addEventListener('click', function() {
      profile.exploitation = inputExpl ? inputExpl.value.trim() : '';
      profile.siret = inputSiret ? inputSiret.value.trim() : '';
      profile.typeAgriculture = selectType ? selectType.value : '';
      saveProfile(profile);
      showToast('Exploitation sauvegardee.', 'success');
    });
  }

  renderProfileStats();

  var prefNotif = document.getElementById('prefNotifications');
  var prefUnite = document.getElementById('prefUniteHa');
  var prefVille = document.getElementById('prefVilleMeteo');
  var prefs = JSON.parse(localStorage.getItem(getPrefsKey()) || '{}');
  if (prefNotif) prefNotif.checked = prefs.notifications === true;
  if (prefUnite) prefUnite.checked = prefs.uniteHa !== false;
  if (prefVille) prefVille.value = prefs.villeMeteo || getDefaultVille();

  function savePrefsNow() {
    var p = JSON.parse(localStorage.getItem(getPrefsKey()) || '{}');
    p.notifications = prefNotif ? prefNotif.checked : false;
    p.uniteHa = prefUnite ? prefUnite.checked : true;
    p.villeMeteo = prefVille ? prefVille.value.trim() : 'Paris';
    localStorage.setItem(getPrefsKey(), JSON.stringify(p));
    if (prefVille) setDefaultVille(p.villeMeteo);
  }

  if (prefNotif) prefNotif.addEventListener('change', savePrefsNow);
  if (prefUnite) prefUnite.addEventListener('change', savePrefsNow);
  if (prefVille) prefVille.addEventListener('change', savePrefsNow);

  var btnLogout = document.getElementById('btnLogoutProfil');
  if (btnLogout) btnLogout.addEventListener('click', logout);

  var btnDelete = document.getElementById('btnDeleteAccount');
  var deleteSteps = document.getElementById('deleteSteps');
  if (btnDelete && deleteSteps) {
    btnDelete.addEventListener('click', function() { deleteSteps.classList.toggle('d-none'); });
  }

  var btnDeleteConfirm = document.getElementById('btnDeleteConfirm');
  var deleteInput = document.getElementById('deleteConfirmInput');
  if (btnDeleteConfirm && deleteInput) {
    btnDeleteConfirm.addEventListener('click', function() {
      if (deleteInput.value.trim() === 'SUPPRIMER') {
        var uid = getUserId();
        var toRemove = [];
        for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf(uid) !== -1) toRemove.push(k); }
        for (var r = 0; r < toRemove.length; r++) { localStorage.removeItem(toRemove[r]); }
        localStorage.removeItem('agria_session');
        localStorage.removeItem('agria_user');
        transitionPage('login.html');
      } else { showToast('Veuillez taper SUPPRIMER exactement.', 'error'); }
    });
  }

  var btnChangeMdp = document.getElementById('btnChangeMdp');
  if (btnChangeMdp) {
    btnChangeMdp.addEventListener('click', function() {
      openSheet('<h2 class="sheet-title">Changer le mot de passe</h2>' +
        '<div class="form-group"><label class="form-label">Mot de passe actuel</label><input type="password" class="input-field" id="mdpActuel"></div>' +
        '<div class="form-group"><label class="form-label">Nouveau mot de passe</label><input type="password" class="input-field" id="mdpNouveau"></div>' +
        '<div class="form-group"><label class="form-label">Confirmer le mot de passe</label><input type="password" class="input-field" id="mdpConfirmer"></div>' +
        '<button type="button" class="btn-primary" id="btnSaveMdp"><i class="fa-solid fa-check"></i> Changer le mot de passe</button>' +
        '<button type="button" class="btn-secondary" style="margin-top:12px" onclick="closeSheet()">Annuler</button>');
      setTimeout(function() {
        var btnSave = document.getElementById('btnSaveMdp');
        if (btnSave) {
          btnSave.addEventListener('click', function() {
            var actuel = document.getElementById('mdpActuel').value;
            var nouveau = document.getElementById('mdpNouveau').value;
            var confirmer = document.getElementById('mdpConfirmer').value;
            if (nouveau.length < 8) { showToast('Le mot de passe doit faire au moins 8 caracteres.', 'error'); return; }
            if (nouveau !== confirmer) { showToast('Les mots de passe ne correspondent pas.', 'error'); return; }
            profile.passwordHash = btoa(nouveau);
            saveProfile(profile);
            closeSheet();
            showToast('Mot de passe modifie.', 'success');
          });
        }
      }, 100);
    });
  }
}

/* ---------- RENDER CHAMPS DASHBOARD ---------- */

function renderChampsDashboard() {
  var container = document.getElementById('champsContainer');
  if (!container) return;

  var champs = loadChamps();
  container.innerHTML = '';

  if (champs.length === 0) {
    container.innerHTML =
      '<div class="card champ-empty">' +
      '<p class="champ-empty-text">Vous n\'avez pas encore de champ. Rendez-vous sur la carte pour en creer un.</p>' +
      '<a href="carte.html" class="btn-secondary" style="display:inline-flex;width:auto;padding:0 24px"><i class="fa-solid fa-map"></i> Aller sur la carte</a>' +
      '</div>';
    return;
  }

  for (var i = 0; i < champs.length; i++) {
    var c = champs[i];
    var stadeBadge = '';
    if (c.stade === 'Semis' || c.stade === 'Levee') stadeBadge = 'badge-info';
    else if (c.stade === 'Croissance' || c.stade === 'Recolte') stadeBadge = 'badge-success';
    else if (c.stade === 'Floraison') stadeBadge = 'badge-warning';
    else stadeBadge = 'badge-info';

    var card = document.createElement('div');
    card.className = 'card champ-card reveal reveal-delay-' + (i + 1);
    card.setAttribute('data-champ-id', c.id);
    card.innerHTML =
      '<div class="champ-card-header">' +
      '<span class="champ-card-nom">' + c.nom + '</span>' +
      '<span class="badge ' + stadeBadge + '">' + (c.stade || 'Inconnu') + '</span>' +
      '</div>' +
      '<div class="champ-card-details">' +
      '<div class="champ-card-detail">Culture : <strong>' + (c.culture || 'Non definie') + '</strong></div>' +
      '<div class="champ-card-detail">Type de sol : <strong>' + (c.typeSol || 'Non defini') + '</strong></div>' +
      '<div class="champ-card-detail">Surface : <strong>' + (c.surface || '0') + ' ha</strong></div>' +
      '<div class="champ-card-detail">Date de semis : <strong>' + (c.dateSemis || 'Non definie') + '</strong></div>' +
      '</div>' +
      '<div class="champ-card-actions">' +
      '<button class="champ-btn champ-btn-voir" data-action="voir" data-id="' + c.id + '"><i class="fa-solid fa-eye"></i> Voir</button>' +
      '<button class="champ-btn champ-btn-modifier" data-action="modifier" data-id="' + c.id + '"><i class="fa-solid fa-pen"></i> Modifier</button>' +
      '<button class="champ-btn champ-btn-supprimer" data-action="supprimer" data-id="' + c.id + '"><i class="fa-solid fa-trash"></i> Supprimer</button>' +
      '</div>' +
      '<div class="confirm-delete d-none" data-delete-id="' + c.id + '">Confirmer la suppression ? ' +
      '<span class="confirm-delete-btns">' +
      '<button class="confirm-delete-yes" data-confirm="oui" data-id="' + c.id + '">Oui</button>' +
      '<button class="confirm-delete-no" data-confirm="non" data-id="' + c.id + '">Non</button>' +
      '</span></div>';
    container.appendChild(card);
  }

  initDashboardChampEvents();
}

function initDashboardChampEvents() {
  var btns = document.querySelectorAll('.champ-btn[data-action]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function(e) {
      e.stopPropagation();
      var action = this.getAttribute('data-action');
      var id = this.getAttribute('data-id');
      if (action === 'supprimer') {
        var confirmDiv = document.querySelector('.confirm-delete[data-delete-id="' + id + '"]');
        if (confirmDiv) confirmDiv.classList.toggle('d-none');
      }
      if (action === 'voir') showChampDetail(id);
      if (action === 'modifier') showChampEdit(id);
    });
  }

  var confirmYes = document.querySelectorAll('.confirm-delete-yes');
  for (var j = 0; j < confirmYes.length; j++) {
    confirmYes[j].addEventListener('click', function(e) {
      e.stopPropagation();
      var id = this.getAttribute('data-id');
      deleteChamp(id);
      renderChampsDashboard();
    });
  }

  var confirmNo = document.querySelectorAll('.confirm-delete-no');
  for (var k = 0; k < confirmNo.length; k++) {
    confirmNo[k].addEventListener('click', function(e) {
      e.stopPropagation();
      var id = this.getAttribute('data-id');
      var div = document.querySelector('.confirm-delete[data-delete-id="' + id + '"]');
      if (div) div.classList.add('d-none');
    });
  }
}

function showChampDetail(id) {
  var champs = loadChamps();
  var champ = null;
  for (var i = 0; i < champs.length; i++) { if (champs[i].id === id) { champ = champs[i]; break; } }
  if (!champ) return;

  var content =
    '<h2 class="sheet-title">' + champ.nom + '</h2>' +
    '<div class="form-group"><label class="form-label">Culture</label><p style="font-size:15px;color:var(--text-primary)">' + (champ.culture || 'Non definie') + '</p></div>' +
    '<div class="form-group"><label class="form-label">Type de sol</label><p style="font-size:15px;color:var(--text-primary)">' + (champ.typeSol || 'Non defini') + '</p></div>' +
    '<div class="form-group"><label class="form-label">Stade phenologique</label><p style="font-size:15px;color:var(--text-primary)">' + (champ.stade || 'Non defini') + '</p></div>' +
    '<div class="form-group"><label class="form-label">Surface</label><p style="font-size:15px;color:var(--text-primary)">' + (champ.surface || '0') + ' ha</p></div>' +
    '<div class="form-group"><label class="form-label">Date de semis</label><p style="font-size:15px;color:var(--text-primary)">' + (champ.dateSemis || 'Non definie') + '</p></div>' +
    '<div class="form-group"><label class="form-label">Notes</label><p style="font-size:14px;color:var(--text-secondary)">' + (champ.notes || 'Aucune note') + '</p></div>' +
    (function() {
      var predictions = generatePredictions(champ);
      var predHtml = '';
      if (predictions && !predictions.error) {
        var scoreColor = predictions.score_sol.score >= 4 ? 'var(--success)' : predictions.score_sol.score >= 2 ? 'var(--warning)' : 'var(--danger)';
        predHtml =
          '<div style="background:var(--bg);border-radius:var(--radius-md);padding:14px;margin-top:14px">' +
          '<h3 style="font-size:14px;font-weight:600;color:var(--primary);margin-bottom:10px"><i class="fa-solid fa-chart-line"></i> Predictions agronomiques</h3>' +
          '<div class="pred-item"><span>Date recolte estimee</span><strong>' + predictions.date_recolte_estimee + '</strong></div>' +
          '<div class="pred-item"><span>Score sol</span><strong style="color:' + scoreColor + '">' + predictions.score_sol.score + '/5</strong><small>' + predictions.score_sol.texte + '</small></div>' +
          '<div class="pred-item"><span>Besoins en eau</span><strong>' + predictions.besoins_eau_total_m3.toLocaleString() + ' m3</strong></div>' +
          (predictions.alerte_irrigation.active ? '<div class="pred-item" style="border-left:3px solid var(--danger)"><span>ALERTE</span><strong style="color:var(--danger)">Irrigation requise</strong><small>' + predictions.alerte_irrigation.message + '</small></div>' : '') +
          '<div class="pred-item"><span>Azote total</span><strong>' + predictions.fertilisation.azote_total_kg + ' kg</strong><small>Cout estime : ' + predictions.fertilisation.cout_estime_euros + ' EUR</small></div>' +
          '<div class="pred-item"><span>Rendement estime</span><strong>' + predictions.rendement_estime.min + ' - ' + predictions.rendement_estime.max + ' ' + predictions.rendement_estime.unite + '</strong></div>' +
          '<p style="font-size:13px;color:var(--text-secondary);margin-top:10px;padding:8px;background:#fff;border-radius:8px">' + predictions.recommandation_globale + '</p>' +
          '</div>';
      }
      return predHtml;
    })() +
    '<button type="button" class="btn-secondary" onclick="closeSheet()">Fermer</button>';

  openSheet(content);
}

function showChampEdit(id) {
  var champs = loadChamps();
  var champ = null;
  for (var i = 0; i < champs.length; i++) { if (champs[i].id === id) { champ = champs[i]; break; } }
  if (!champ) return;

  var content =
    '<h2 class="sheet-title">Modifier le champ</h2>' +
    '<div class="form-group"><label class="form-label">Nom du champ</label><input type="text" class="input-field" id="editNom" value="' + (champ.nom || '') + '"></div>' +
    '<div class="form-group"><label class="form-label">Type de sol</label><select class="input-field" id="editTypeSol"><option ' + (champ.typeSol === 'Argileux' ? 'selected' : '') + '>Argileux</option><option ' + (champ.typeSol === 'Limoneux' ? 'selected' : '') + '>Limoneux</option><option ' + (champ.typeSol === 'Sableux' ? 'selected' : '') + '>Sableux</option><option ' + (champ.typeSol === 'Calcaire' ? 'selected' : '') + '>Calcaire</option><option ' + (champ.typeSol === 'Humifere' ? 'selected' : '') + '>Humifere</option></select></div>' +
    '<div class="form-group"><label class="form-label">Culture</label><select class="input-field" id="editCulture"><option ' + (champ.culture === 'Ble' ? 'selected' : '') + '>Ble</option><option ' + (champ.culture === 'Mais' ? 'selected' : '') + '>Mais</option><option ' + (champ.culture === 'Tournesol' ? 'selected' : '') + '>Tournesol</option><option ' + (champ.culture === 'Colza' ? 'selected' : '') + '>Colza</option><option ' + (champ.culture === 'Vigne' ? 'selected' : '') + '>Vigne</option><option ' + (champ.culture === 'Jachere' ? 'selected' : '') + '>Jachere</option></select></div>' +
    '<div class="form-group"><label class="form-label">Stade</label><select class="input-field" id="editStade"><option ' + (champ.stade === 'Semis' ? 'selected' : '') + '>Semis</option><option ' + (champ.stade === 'Levee' ? 'selected' : '') + '>Levee</option><option ' + (champ.stade === 'Croissance' ? 'selected' : '') + '>Croissance</option><option ' + (champ.stade === 'Floraison' ? 'selected' : '') + '>Floraison</option><option ' + (champ.stade === 'Recolte' ? 'selected' : '') + '>Recolte</option></select></div>' +
    '<div class="form-group"><label class="form-label">Surface (ha)</label><input type="number" step="0.1" class="input-field" id="editSurface" value="' + (champ.surface || '0') + '"></div>' +
    '<div class="form-group"><label class="form-label">Date de semis</label><input type="date" class="input-field" id="editDateSemis" value="' + (champ.dateSemis || '') + '"></div>' +
    '<div class="form-group"><label class="form-label">Notes</label><textarea class="input-field" id="editNotes" style="min-height:80px;padding:12px" maxlength="300">' + (champ.notes || '') + '</textarea></div>' +
    '<button type="button" class="btn-primary" id="btnSaveEdit"><i class="fa-solid fa-check"></i> Enregistrer</button>' +
    '<button type="button" class="btn-secondary" style="margin-top:12px" onclick="closeSheet()">Annuler</button>';

  openSheet(content);

  setTimeout(function() {
    var btnSave = document.getElementById('btnSaveEdit');
    if (btnSave) {
      btnSave.addEventListener('click', function() {
        champ.nom = document.getElementById('editNom').value.trim();
        champ.typeSol = document.getElementById('editTypeSol').value;
        champ.culture = document.getElementById('editCulture').value;
        champ.stade = document.getElementById('editStade').value;
        champ.surface = document.getElementById('editSurface').value;
        champ.dateSemis = document.getElementById('editDateSemis').value;
        champ.notes = document.getElementById('editNotes').value;
        updateChamp(id, champ);
        closeSheet();
        renderChampsDashboard();
      });
    }
  }, 100);
}

/* ---------- INIT PAGES ---------- */

function renderDashboardStats() {
  var champs = loadChamps();
  var statsHtml = '';
  var totalHa = 0;
  var cultureCount = {};
  var prochainSemis = null;
  var now = new Date();

  for (var i = 0; i < champs.length; i++) {
    totalHa += parseFloat(champs[i].surface) || 0;
    var c = champs[i].culture || 'Inconnu';
    cultureCount[c] = (cultureCount[c] || 0) + 1;
    if (champs[i].dateSemis) {
      var d = new Date(champs[i].dateSemis + 'T00:00:00');
      if (d > now && (!prochainSemis || d < prochainSemis.date)) {
        prochainSemis = { date: d, nom: champs[i].nom, culture: champs[i].culture };
      }
    }
  }

  var topCulture = '';
  var topCount = 0;
  for (var k in cultureCount) { if (cultureCount[k] > topCount) { topCulture = k; topCount = cultureCount[k]; } }

  statsHtml =
    '<div class="dashboard-stats">' +
    '<div class="stat-card"><span class="stat-card-value">' + champs.length + '</span><span class="stat-card-label">Champs</span></div>' +
    '<div class="stat-card"><span class="stat-card-value">' + totalHa.toFixed(1) + '</span><span class="stat-card-label">Hectares</span></div>' +
    '<div class="stat-card"><span class="stat-card-value">' + (topCulture || '-') + '</span><span class="stat-card-label">Culture dominante</span></div>' +
    '<div class="stat-card"><span class="stat-card-value">' + (prochainSemis ? prochainSemis.nom : '-') + '</span><span class="stat-card-label">Prochain semis</span></div>' +
    '</div>';

  var container = document.getElementById('dashboardStats');
  if (container) container.innerHTML = statsHtml;
}

function initDashboard() {
  var ville = getDefaultVille();
  chargerMeteo(ville);

  var searchInput = document.getElementById('meteoVilleInput');
  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = 'Rechercher une ville...';
    initCitySearch(searchInput, function(selectedVille) {
      setDefaultVille(selectedVille);
      chargerMeteo(selectedVille);
      searchInput.value = selectedVille;
    });
  }

  var searchBtn = document.getElementById('meteoSearchBtn');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      var v = searchInput.value.trim();
      if (v) {
        setDefaultVille(v);
        chargerMeteo(v);
        hideCityDropdown();
      }
    });
  }

  renderChampsDashboard();
  renderDashboardStats();
}

function initCarte() {
  var selectRegion = document.getElementById('select-region');
  var regionSubtitle = document.getElementById('region-subtitle');

  if (selectRegion) {
    var prefs = JSON.parse(localStorage.getItem(getPrefsKey()) || '{}');
    var savedRegion = prefs.region || 'Occitanie';
    if (REGIONS[savedRegion]) selectRegion.value = savedRegion;
    else selectRegion.value = 'Occitanie';

    if (regionSubtitle) regionSubtitle.textContent = selectRegion.value;

    selectRegion.addEventListener('change', function(e) {
      var region = REGIONS[e.target.value];
      if (region && typeof map !== 'undefined' && map) {
        map.flyToBounds(region.bounds, { duration: 0.8 });
        map.setMaxBounds(region.bounds);
        var p = JSON.parse(localStorage.getItem(getPrefsKey()) || '{}');
        p.region = e.target.value;
        localStorage.setItem(getPrefsKey(), JSON.stringify(p));
        if (regionSubtitle) regionSubtitle.textContent = e.target.value;
      }
    });

    if (typeof map !== 'undefined' && map) {
      var initRegion = REGIONS[selectRegion.value];
      if (initRegion) {
        map.setView(initRegion.center, 7);
        map.setMaxBounds(initRegion.bounds);
      }
    }
  }

  var searchBtn = document.getElementById('carteSearchBtn');
  var searchInput = document.getElementById('carteSearchInput');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() { lancerRechercheCarte(); });
    searchInput.addEventListener('keydown', function(e) { if (e.key === 'Enter') lancerRechercheCarte(); });
  }

  async function lancerRechercheCarte() {
    var ville = searchInput.value.trim();
    if (!ville) return;
    var coords = await fetchCoordonnees(ville);
    if (typeof map !== 'undefined' && map) { map.flyTo([coords.lat, coords.lon], 14, { duration: 1.2 }); }
    searchInput.value = '';
  }

  if (typeof map !== 'undefined' && typeof L !== 'undefined') {
    loadAllChampsOnMap();
    refreshMapFieldsList();

    var gridBtn = document.getElementById('toggleGridBtn');
    if (gridBtn) {
      gridBtn.addEventListener('click', function() {
        window._gridVisible = !window._gridVisible;
        if (window._gridVisible) { gridBtn.classList.add('active'); drawHectareGrid(); }
        else { gridBtn.classList.remove('active'); if (window._hectareGrid) window._hectareGrid.clearLayers(); }
      });
    }

    var locateBtn = document.getElementById('locateBtn');
    if (locateBtn) {
      locateBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            if (typeof map !== 'undefined') {
              map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1 });
              L.circleMarker([pos.coords.latitude, pos.coords.longitude], { radius: 12, color: '#606E52', fillColor: '#91A56E', fillOpacity: 0.5, weight: 3 }).addTo(map).bindPopup('Vous etes ici').openPopup();
            }
          }, function() { showToast('Geolocalisation indisponible.', 'warning'); });
        } else { showToast('Geolocalisation non supportee.', 'warning'); }
      });
    }

    var fieldsBtn = document.getElementById('myFieldsBtn');
    if (fieldsBtn) { fieldsBtn.addEventListener('click', function() { toggleMapFieldsList(); }); }

    var drawBtn = document.getElementById('drawPolygonBtn');
    var drawIndicator = document.getElementById('drawIndicator');
    var drawSurfaceEl = document.getElementById('drawSurface');

    if (drawBtn && typeof L.Draw !== 'undefined') {
      var drawControl = new L.Control.Draw({ draw: { polyline: false, rectangle: false, circle: false, circlemarker: false, marker: false } });
      var drawActive = false;

      drawBtn.addEventListener('click', function() {
        if (drawActive) {
          drawActive = false; drawBtn.classList.remove('active');
          if (drawIndicator) drawIndicator.classList.remove('visible');
          return;
        }
        drawActive = true; drawBtn.classList.add('active');
        if (drawIndicator) { drawIndicator.classList.add('visible'); }
        if (drawSurfaceEl) drawSurfaceEl.textContent = '0.00 ha';
        var handler = new L.Draw.Polygon(map, drawControl.options.draw.polygon);
        handler.enable();

        map.on('draw:drawvertex', function() {
          setTimeout(function() {
            var guides = map._container.querySelectorAll('.leaflet-interactive.leaflet-draw-guide');
            var allPoints = [];
            guides.forEach(function(g) {
              var d = g.getAttribute('d');
              if (d) {
                var nums = d.match(/[\d.-]+/g);
                if (nums && nums.length >= 4) {
                  for (var ci = 0; ci < nums.length; ci += 2) allPoints.push([parseFloat(nums[ci+1]), parseFloat(nums[ci])]);
                }
              }
            });
            if (allPoints.length >= 3 && drawSurfaceEl) {
              try { var area = turfArea(allPoints); drawSurfaceEl.textContent = (area / 10000).toFixed(2) + ' ha'; } catch(ex) {}
            }
          }, 100);
        });

        map.on(L.Draw.Event.CREATED, handleDrawCreated);
        map.on(L.Draw.Event.DRAWSTOP, function() { drawActive = false; });
      });

      var handleDrawCreated = function(e) {
        var layer = e.layer;
        var coords = layer.getLatLngs()[0].map(function(ll) { return [ll.lat, ll.lng]; });
        var areaSqM = L.GeometryUtil ? L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]) : turfArea(coords);
        var surfaceHa = (areaSqM / 10000).toFixed(2);

        drawActive = false; drawBtn.classList.remove('active');
        if (drawIndicator) drawIndicator.classList.remove('visible');
        map.addLayer(layer);
        layer.setStyle({ fillColor: '#91A56E', fillOpacity: 0.25, color: '#606E52', weight: 2 });

        var collision = checkCollision(coords);
        var content =
          '<h2 class="sheet-title">Creer un champ</h2>' +
          '<div class="form-group"><label class="form-label">Nom</label><input type="text" class="input-field" id="fieldNom" placeholder="Ex: Parcelle Nord"></div>' +
          '<div class="form-group"><label class="form-label">Type de sol</label><select class="input-field" id="fieldTypeSol"><option>Argileux</option><option>Limoneux</option><option>Sableux</option><option>Calcaire</option><option>Humifere</option></select></div>' +
          '<div class="form-group"><label class="form-label">Culture</label><select class="input-field" id="fieldCulture"><option>Ble</option><option>Mais</option><option>Tournesol</option><option>Colza</option><option>Vigne</option><option>Jachere</option></select></div>' +
          '<div class="form-group"><label class="form-label">Stade</label><select class="input-field" id="fieldStade"><option>Semis</option><option>Levee</option><option>Croissance</option><option>Floraison</option><option>Recolte</option></select></div>' +
          '<div class="form-group"><label class="form-label">Surface (ha)</label><input type="number" step="0.01" class="input-field" id="fieldSurface" value="' + surfaceHa + '"></div>' +
          '<div class="form-group"><label class="form-label">Date de semis</label><input type="date" class="input-field" id="fieldDateSemis"></div>' +
          '<div class="form-group"><label class="form-label">Notes</label><textarea class="input-field" id="fieldNotes" style="min-height:60px;padding:12px" maxlength="300" placeholder="Optionnel"></textarea></div>' +
          '<div class="sheet-error" id="sheetError"></div>' +
          '<button type="button" class="btn-primary" id="btnSaveField"><i class="fa-solid fa-check"></i> Enregistrer</button>' +
          '<button type="button" class="btn-secondary" id="btnCancelField" style="margin-top:14px">Annuler</button>';

        if (collision.collision) {
          content = content.replace('<div class="sheet-error" id="sheetError"></div>', '<div class="sheet-error visible" id="sheetError">Chevauchement avec "' + collision.nom + '" d\'un autre fermier.</div>');
        }

        openSheet(content);
        setTimeout(function() {
          var bs = document.getElementById('btnSaveField');
          var bc = document.getElementById('btnCancelField');
          if (bc) bc.addEventListener('click', function() { map.removeLayer(layer); closeSheet(); });
          if (bs) bs.addEventListener('click', function() {
            if (collision.collision) { showToast('Collision detectee.', 'error'); return; }
            var champ = { id: generateId(), nom: document.getElementById('fieldNom').value.trim() || 'Sans nom', typeSol: document.getElementById('fieldTypeSol').value, culture: document.getElementById('fieldCulture').value, stade: document.getElementById('fieldStade').value, surface: document.getElementById('fieldSurface').value, dateSemis: document.getElementById('fieldDateSemis').value, notes: document.getElementById('fieldNotes').value, polygonCoords: coords };
            addChamp(champ); closeSheet(); refreshMapFieldsList();
            showToast('Champ "' + champ.nom + '" cree.', 'success');
          });
        }, 100);
        map.off(L.Draw.Event.CREATED, handleDrawCreated);
      };
    }

    var focus = JSON.parse(localStorage.getItem('agria_focus_champ') || 'null');
    if (focus && focus.lat) { map.setView([focus.lat, focus.lon], focus.zoom || 13); localStorage.removeItem('agria_focus_champ'); }
  }
}

function turfArea(coords) {
  if (L.GeometryUtil && L.GeometryUtil.geodesicArea) return L.GeometryUtil.geodesicArea(coords);
  var area = 0;
  for (var i = 0; i < coords.length; i++) { var j = (i + 1) % coords.length; area += coords[i][0] * coords[j][1]; area -= coords[j][0] * coords[i][1]; }
  return Math.abs(area) * 6371000 * 6371000 * Math.PI / 180 / 2;
}

function drawHectareGrid() {
  if (!window._hectareGrid) return;
  window._hectareGrid.clearLayers();
  var bounds = map.getBounds();
  var step = 0.01;
  var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();
  for (var lat = Math.floor(sw.lat / step) * step; lat <= ne.lat; lat += step) {
    L.polyline([[lat, sw.lng], [lat, ne.lng]], { color: '#c0cca4', weight: 0.5, opacity: 0.35, interactive: false }).addTo(window._hectareGrid);
  }
  for (var lng = Math.floor(sw.lng / step) * step; lng <= ne.lng; lng += step) {
    L.polyline([[sw.lat, lng], [ne.lat, lng]], { color: '#c0cca4', weight: 0.5, opacity: 0.35, interactive: false }).addTo(window._hectareGrid);
  }
  window._hectareGrid.addTo(map);
}

function refreshMapFieldsList() {
  var badge = document.getElementById('mapFieldsBadge');
  var countEl = document.getElementById('mapFieldsCount');
  var listEl = document.getElementById('mapFieldsList');
  if (!badge || !countEl || !listEl) return;
  var champs = loadChamps();
  countEl.textContent = champs.length;
  if (champs.length > 0) badge.classList.remove('d-none'); else badge.classList.add('d-none');
  listEl.innerHTML = '';
  for (var i = 0; i < champs.length; i++) {
    var c = champs[i];
    var item = document.createElement('div');
    item.className = 'map-fields-list-item';
    item.innerHTML = '<div><strong>' + c.nom + '</strong><span>' + (c.culture || '?') + ' — ' + (c.surface || '0') + ' ha</span></div><i class="fa-solid fa-location-dot"></i>';
    (function(ch) {
      item.addEventListener('click', function() {
        if (ch.polygonCoords && ch.polygonCoords.length > 1) {
          map.fitBounds(L.latLngBounds(ch.polygonCoords.map(function(p) { return [p[0], p[1]]; })), { padding: [40, 40], maxZoom: 16 });
          toggleMapFieldsList();
        }
      });
    })(c);
    listEl.appendChild(item);
  }
}

function toggleMapFieldsList() { var l = document.getElementById('mapFieldsList'); if (l) l.classList.toggle('visible'); }

function loadAllChampsOnMap() {
  if (typeof map === 'undefined') return;
  var allKeys = dpGetAllKeys('agria_champs_');
  var myId = getUserId();

  for (var j = 0; j < allKeys.length; j++) {
    try {
      var champs = dpLoadSync(allKeys[j], []);
      if (!Array.isArray(champs)) continue;
      var isMine = allKeys[j] === getChampsKey();
      for (var c = 0; c < champs.length; c++) {
        if (!champs[c].polygonCoords || champs[c].polygonCoords.length < 3) continue;
        var coords = champs[c].polygonCoords.map(function(pt) { return [pt[0], pt[1]]; });
        var style = isMine ? { fillColor: '#91A56E', fillOpacity: 0.25, color: '#606E52', weight: 2 } : { fillColor: '#c44d4d', fillOpacity: 0.15, color: '#c44d4d', weight: 1, interactive: false };
        var polygon = L.polygon(coords, style).addTo(map);
        if (isMine) {
          var centroid = calculCentroide(champs[c].polygonCoords);
          L.marker([centroid.lat, centroid.lon], { opacity: 0, interactive: false }).addTo(map).bindTooltip(champs[c].nom, { permanent: true, direction: 'center', offset: [0,0] });
          polygon.bindPopup('<strong>' + champs[c].nom + '</strong><br><span style="font-size:12px;color:var(--text-secondary)">' + (champs[c].culture || '?') + ' — ' + (champs[c].surface || '0') + ' ha</span>');
          (function(poly, champCoords) {
            polygon.on('click', function() {
              var bounds = L.latLngBounds(champCoords.map(function(p) { return [p[0], p[1]]; }));
              map.fitBounds(bounds, { padding: [60, 60], maxZoom: 17, animate: true, duration: 0.6 });
            });
          })(polygon, champs[c].polygonCoords);
        }
      }
    } catch(e) {}
  }
}

function initDiagnostic() {
  var etapeCourante = 1, cultureChoisie = null, symptomesChoisis = [];
  changerEtape(1);

  var boutonsSuivant = document.querySelectorAll('.diagnostic-next');
  for (var i = 0; i < boutonsSuivant.length; i++) {
    boutonsSuivant[i].addEventListener('click', function() {
      var next = parseInt(this.getAttribute('data-next'));
      if (etapeCourante === 1) {
        var radio = document.querySelector('input[name="culture"]:checked'); if (!radio) { showToast('Veuillez selectionner une culture.', 'warning'); return; }
        cultureChoisie = radio.value; localStorage.setItem('agria_last_culture', cultureChoisie);
      }
      if (etapeCourante === 2) { var cb = document.querySelectorAll('#etape2 input[type="checkbox"]:checked'); symptomesChoisis = []; for (var j = 0; j < cb.length; j++) symptomesChoisis.push(cb[j].value); }
      changerEtape(next);
    });
  }

  var boutonsRetour = document.querySelectorAll('.diagnostic-prev');
  for (var k = 0; k < boutonsRetour.length; k++) { boutonsRetour[k].addEventListener('click', function() { changerEtape(parseInt(this.getAttribute('data-prev'))); }); }

  var btnAnalyser = document.getElementById('btnAnalyser');
  if (btnAnalyser) {
    btnAnalyser.addEventListener('click', async function() {
      var cb = document.querySelectorAll('#etape2 input[type="checkbox"]:checked'); symptomesChoisis = []; for (var m = 0; m < cb.length; m++) symptomesChoisis.push(cb[m].value);
      var villeInput = document.getElementById('diagnosticVille'); var ville = villeInput ? villeInput.value.trim() : 'Paris'; if (!ville) ville = 'Paris';
      btnAnalyser.disabled = true; btnAnalyser.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyse en cours...';
      try {
        var coords = await fetchCoordonnees(ville); var meteoData = await fetchOpenMeteo(coords.lat, coords.lon);
        var diagnostic = genererDiagnostic(cultureChoisie, symptomesChoisis, meteoData); renderResultat(diagnostic);
        var form = document.getElementById('diagnosticForm'); var resultat = document.getElementById('diagnosticResultat'); var steps = document.getElementById('diagnosticSteps');
        if (form) form.classList.add('d-none'); if (resultat) resultat.classList.remove('d-none'); if (steps) steps.classList.add('d-none');
      } catch (err) { showToast('Erreur lors de l\'analyse : ' + err.message, 'error'); }
      btnAnalyser.disabled = false; btnAnalyser.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Analyser';
    });
  }

  var btnNouveau = document.getElementById('btnNouveauDiagnostic');
  if (btnNouveau) {
    btnNouveau.addEventListener('click', function() {
      var form = document.getElementById('diagnosticForm'); var resultat = document.getElementById('diagnosticResultat'); var steps = document.getElementById('diagnosticSteps');
      if (form) form.classList.remove('d-none'); if (resultat) resultat.classList.add('d-none'); if (steps) steps.classList.remove('d-none');
      var radios = document.querySelectorAll('input[name="culture"]'); for (var n = 0; n < radios.length; n++) radios[n].checked = false;
      var checks = document.querySelectorAll('#etape2 input[type="checkbox"]'); for (var q = 0; q < checks.length; q++) checks[q].checked = false;
      var vi = document.getElementById('diagnosticVille'); if (vi) vi.value = '';
      cultureChoisie = null; symptomesChoisis = []; etapeCourante = 1; changerEtape(1);
    });
  }

  function changerEtape(numero) {
    etapeCourante = numero;
    var etapes = document.querySelectorAll('.diagnostic-etape'); for (var i = 0; i < etapes.length; i++) etapes[i].classList.remove('active');
    var etapeActive = document.getElementById('etape' + numero); if (etapeActive) etapeActive.classList.add('active');
    var steps = document.querySelectorAll('.diagnostic-steps .step');
    for (var j = 0; j < steps.length; j++) { var sn = parseInt(steps[j].getAttribute('data-step')); steps[j].classList.remove('active','completed'); if (sn === numero) steps[j].classList.add('active'); else if (sn < numero) steps[j].classList.add('completed'); }
  }

  var lastCulture = localStorage.getItem('agria_last_culture');
  if (lastCulture) { var radio = document.querySelector('input[name="culture"][value="' + lastCulture + '"]'); if (radio) radio.checked = true; }
}

/* ---------- INIT ---------- */

document.addEventListener('DOMContentLoaded', function() {
  var page = document.body.dataset.page;
  initAmbiance(); initScrollReveal(); initParticleEffect();
  if (page === 'login') initLogin();
  if (page === 'dashboard') initDashboard();
  if (page === 'carte') initCarte();
  if (page === 'diagnostic') initDiagnostic();
  if (page === 'profil') initProfil();
});
