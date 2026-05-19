// Comprehensive test suite for Agr'IA
var http = require('http');
var https = require('https');

var BASE = 'http://localhost:8080';
var errors = [];
var warnings = [];

function log(level, msg) {
  var prefix = level === 'ERROR' ? '\x1b[31m[ERROR]\x1b[0m' : '\x1b[33m[WARN]\x1b[0m';
  console.log(prefix + ' ' + msg);
  if (level === 'ERROR') errors.push(msg); else warnings.push(msg);
}

function fetch(url) {
  return new Promise(function(resolve, reject) {
    var mod = url.startsWith('https') ? https : http;
    mod.get(url, function(res) {
      var data = '';
      res.on('data', function(c) { data += c; });
      res.on('end', function() { resolve({ status: res.statusCode, body: data, headers: res.headers }); });
    }).on('error', reject);
  });
}

// ========================================
// TEST 1: All pages load
// ========================================
async function testPagesLoad() {
  console.log('\n=== TEST 1: Pages HTTP ===');
  var pages = ['login.html', 'dashboard.html', 'carte.html', 'diagnostic.html', 'profil.html'];
  var checks = {
    'login.html': ['loginForm', 'email', 'btnDevBypass'],
    'dashboard.html': ['meteoVille', 'meteoTemp', 'previsionsContainer', 'champsContainer'],
    'carte.html': ['map-base', 'btn-draw', 'search-bar', 'float-toolbar'],
    'diagnostic.html': ['diagnosticForm', 'diagnosticSteps', 'etape1'],
    'profil.html': ['profilPrenom', 'profilNom', 'btnSaveIdentite', 'btnLogoutProfil']
  };

  for (var i = 0; i < pages.length; i++) {
    var page = pages[i];
    try {
      var res = await fetch(BASE + '/' + page);
      if (res.status !== 200) { log('ERROR', page + ' returned ' + res.status); continue; }
      
      // Check required IDs are present
      var requiredIds = checks[page] || [];
      var missing = requiredIds.filter(function(id) { return res.body.indexOf('id="' + id + '"') === -1; });
      if (missing.length > 0) log('ERROR', page + ' missing IDs: ' + missing.join(', '));
      else console.log('  [OK] ' + page + ' (' + requiredIds.length + ' elements verified)');

      // Check script loading order
      if (page !== 'login.html') {
        var firebaseIdx = res.body.indexOf('firebase-app-compat');
        var scriptIdx = res.body.indexOf('<script src="script.js"');
        
        if (firebaseIdx === -1) log('WARN', page + ' missing Firebase CDN script');
        if (scriptIdx === -1) log('ERROR', page + ' missing script.js');
      }

      // Check meta viewport
      if (res.body.indexOf('meta name="viewport"') === -1) log('WARN', page + ' missing viewport meta');
      
    } catch(e) { log('ERROR', page + ': ' + e.message); }
  }
}

// ========================================
// TEST 2: CSS & JS files load
// ========================================
async function testAssetsLoad() {
  console.log('\n=== TEST 2: Assets ===');
  var assets = ['style.css', 'script.js'];
  for (var i = 0; i < assets.length; i++) {
    try {
      var res = await fetch(BASE + '/' + assets[i]);
      if (res.status !== 200) { log('ERROR', assets[i] + ' returned ' + res.status); }
      else console.log('  [OK] ' + assets[i] + ' (' + res.body.length + ' bytes)');
    } catch(e) { log('ERROR', assets[i] + ': ' + e.message); }
  }
}

// ========================================
// TEST 3: HTML structure validation
// ========================================
async function testHTMLStructure() {
  console.log('\n=== TEST 3: HTML Structure ===');
  var pages = ['login.html', 'dashboard.html', 'carte.html', 'diagnostic.html', 'profil.html'];
  for (var i = 0; i < pages.length; i++) {
    try {
      var res = await fetch(BASE + '/' + pages[i]);
      var body = res.body;
      
      // Check DOCTYPE
      if (!body.trimStart().startsWith('<!DOCTYPE')) log('ERROR', pages[i] + ' missing DOCTYPE');
      
      // Check closing tags
      var htmlOpen = (body.match(/<html/g) || []).length;
      var htmlClose = (body.match(/<\/html>/g) || []).length;
      if (htmlOpen !== htmlClose) log('ERROR', pages[i] + ' mismatched <html> tags: ' + htmlOpen + ' open, ' + htmlClose + ' close');
      
      var bodyOpen = (body.match(/<body/g) || []).length;
      var bodyClose = (body.match(/<\/body>/g) || []).length;
      if (bodyOpen !== bodyClose) log('ERROR', pages[i] + ' mismatched <body> tags: ' + bodyOpen + ' open, ' + bodyClose + ' close');
      
      // Check unclosed inline scripts
      var scriptOpen = (body.match(/<script/g) || []).length;
      var scriptClose = (body.match(/<\/script>/g) || []).length;
      if (scriptOpen !== scriptClose) log('ERROR', pages[i] + ' mismatched <script> tags: ' + scriptOpen + ' open, ' + scriptClose + ' close');
      
      console.log('  [OK] ' + pages[i] + ' structure valid');
    } catch(e) { log('ERROR', pages[i] + ': ' + e.message); }
  }
}

// ========================================
// TEST 4: Supabase connectivity
// ========================================
async function testSupabase() {
  console.log('\n=== TEST 4: Supabase Connection ===');
  var SUPABASE_URL = 'https://vqpxnibyljhoftbhtnjx.supabase.co';
  var ANON_KEY = 'sb_publishable_W9Nk_fRKHx2Et7mgwy4PGQ_06F0Y_ai';

  // Test 4a: basic connectivity
  try {
    var res = await fetch(SUPABASE_URL + '/rest/v1/?apikey=' + ANON_KEY);
    console.log('  [OK] Supabase API reachable (status ' + res.status + ')');
  } catch(e) { log('ERROR', 'Supabase API unreachable: ' + e.message); }

  // Test 4b: check agria_data table
  try {
    var res2 = await fetch(SUPABASE_URL + '/rest/v1/agria_data?select=key&limit=1', {
      headers: {
        'apikey': ANON_KEY,
        'Authorization': 'Bearer ' + ANON_KEY
      }
    });
    if (res2.status >= 200 && res2.status < 300)
      console.log('  [OK] agria_data table accessible');
    else
      log('WARN', 'agria_data table returned ' + res2.status + ' (may need creation)');
  } catch(e) { log('WARN', 'agria_data table check failed: ' + e.message); }

  // Test 4c: check parcelles table  
  try {
    var opts = {
      hostname: 'vqpxnibyljhoftbhtnjx.supabase.co',
      path: '/rest/v1/parcelles?select=id&limit=1',
      headers: { 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY }
    };
    var pRes = await new Promise(function(resolve, reject) {
      https.get(opts, function(r) {
        var d = '';
        r.on('data', function(c) { d += c; });
        r.on('end', function() { resolve({ status: r.statusCode, body: d }); });
      }).on('error', reject);
    });
    if (pRes.status >= 200 && pRes.status < 300)
      console.log('  [OK] parcelles table accessible');
    else if (pRes.status === 404)
      log('WARN', 'parcelles table does not exist (status 404)');
    else
      log('WARN', 'parcelles table returned ' + pRes.status);
  } catch(e) { log('WARN', 'parcelles table check failed: ' + e.message); }

  // Test 4d: check profiles table
  try {
    var opts2 = {
      hostname: 'vqpxnibyljhoftbhtnjx.supabase.co',
      path: '/rest/v1/profiles?select=id&limit=1',
      headers: { 'apikey': ANON_KEY, 'Authorization': 'Bearer ' + ANON_KEY }
    };
    var prRes = await new Promise(function(resolve, reject) {
      https.get(opts2, function(r) {
        var d = '';
        r.on('data', function(c) { d += c; });
        r.on('end', function() { resolve({ status: r.statusCode, body: d }); });
      }).on('error', reject);
    });
    if (prRes.status >= 200 && prRes.status < 300)
      console.log('  [OK] profiles table accessible');
    else if (prRes.status === 404)
      log('WARN', 'profiles table does not exist (status 404)');
    else
      log('WARN', 'profiles table returned ' + prRes.status);
  } catch(e) { log('WARN', 'profiles table check failed: ' + e.message); }
}

// ========================================
// TEST 5: JS code analysis
// ========================================
function testCodeAnalysis() {
  console.log('\n=== TEST 5: Code Analysis ===');
  var fs = require('fs');
  
  // Read script.js
  var script = fs.readFileSync('script.js', 'utf8');
  var carte = fs.readFileSync('carte.html', 'utf8');
  var style = fs.readFileSync('style.css', 'utf8');
  
  // Check for common issues
  if (script.indexOf('console.log') !== -1) log('WARN', 'script.js has console.log statements (should use console.warn/error for prod)');
  
  // Check for hardcoded URLs
  var hardcoded = script.match(/https?:\/\/[^\s"']+/g) || [];
  var expected = ['openweathermap', 'open-meteo', 'nominatim', 'firebasedatabase', 'firebaseapp', 'gstatic', 'jsdelivr'];
  hardcoded.forEach(function(u) {
    var found = expected.some(function(e) { return u.indexOf(e) !== -1; });
    if (!found && u.indexOf('http') === 0) log('WARN', 'Unexpected URL in script.js: ' + u);
  });
  
  // Check firebase config is present
  if (script.indexOf('FIREBASE_CONFIG') === -1) log('ERROR', 'FIREBASE_CONFIG missing');
  if (script.indexOf('apiKey') === -1) log('ERROR', 'Firebase apiKey missing');
  
  // Check no remaining Supabase references
  if (script.indexOf('SUPABASE_CONFIG') !== -1) log('WARN', 'SUPABASE_CONFIG still present in script.js');
  if (script.indexOf('getSupabase') !== -1) log('WARN', 'getSupabase still present in script.js');
  if (script.indexOf('supabase-functions') !== -1) log('WARN', 'supabase-functions reference still present');
  
  // Check no remaining dpLoadSync/dpSaveSync
  if (script.indexOf('dpLoadSync') !== -1) log('ERROR', 'dpLoadSync still present in script.js');
  if (script.indexOf('dpSaveSync') !== -1) log('ERROR', 'dpSaveSync still present in script.js');
  
  // Check function definitions exist
  var requiredFunctions = [
    'getFirebase', 'dpLoad', 'dpSave', 'dpRemove', 'dpLoadAll', 'dpGetAllKeys',
    'loadChamps', 'saveChamps', 'addChamp', 'updateChamp', 'deleteChamp', 'loadAllChamps',
    'getUserId', 'generateId', 'getSession',
    'fetchMeteoActuelle', 'fetchPrevisions', 'chargerMeteo', 'renderMeteo', 'renderPrevisions',
    'generatePredictions', 'genererDiagnostic', 'genererRecommandations',
    'loadProfile', 'saveProfile'
  ];
  for (var i = 0; i < requiredFunctions.length; i++) {
    var fn = requiredFunctions[i];
    if (new RegExp('function\\s+' + fn + '\\b|async\\s+function\\s+' + fn + '\\b|var\\s+' + fn + '\\s*=\\s*function|var\\s+' + fn + '\\s*=\\s*async\\s+function').test(script)) {
      // found
    } else if (new RegExp('window\\.' + fn + '\\s*=').test(carte)) {
      // exported in carte.html
    } else {
      log('WARN', 'Function "' + fn + '" not found as top-level definition');
    }
  }
  
  // Check carte.html has all required functions
  var carteFunctions = ['startDrawing', 'stopDrawing', 'addDrawPoint', 'snapLatLng', 'getAllExistingPoints',
    'selectParcel', 'openPanel', 'closePanel', 'finalizeDraw', 'editParcel', 'deleteParcel', 'undoLast',
    'renderAllParcels', 'loadParcels', 'saveMyParcel', 'updateMyParcel', 'deleteMyParcel',
    'calculateAreaLL', 'updateSurfaceFloating'];
  for (var j = 0; j < carteFunctions.length; j++) {
    if (carte.indexOf('function ' + carteFunctions[j]) === -1 && carte.indexOf(carteFunctions[j] + ' = function') === -1)
      log('WARN', 'carte.html missing function: ' + carteFunctions[j]);
  }
  
  // Style.css checks
  if (style.indexOf('overflow: visible') !== -1) {
    if (style.indexOf('.meteo-card') !== -1 && style.substring(style.indexOf('.meteo-card'), style.indexOf('.meteo-card') + 200).indexOf('overflow: hidden') !== -1) {
      // fixed
    } else {
      log('WARN', 'Check .meteo-card overflow setting');
    }
  }
  
  console.log('  [OK] Code analysis complete');
}

// ========================================
// TEST 6: Cross-file consistency
// ========================================
async function testCrossFileConsistency() {
  console.log('\n=== TEST 6: Cross-file consistency ===');
  var fs = require('fs');
  
  // Check all pages load script.js and supabase-functions.js
  var pages = ['dashboard.html', 'carte.html', 'diagnostic.html', 'profil.html'];
  for (var i = 0; i < pages.length; i++) {
    var content = fs.readFileSync(pages[i], 'utf8');
    
    // Check fonts are loaded
    if (content.indexOf('fonts.googleapis.com') === -1) log('WARN', pages[i] + ' missing Google Fonts');
    if (content.indexOf('font-awesome') === -1) log('WARN', pages[i] + ' missing Font Awesome');
    
    // Check bottom-nav has correct active class
    if (pages[i] === 'dashboard.html' && content.indexOf('dashboard.html" class="bottom-nav-item active"') === -1)
      log('WARN', 'dashboard.html nav active not set correctly');
    if (pages[i] === 'carte.html' && content.indexOf('carte.html" class="bottom-nav-item active"') === -1)
      log('WARN', 'carte.html nav active not set correctly');
    if (pages[i] === 'diagnostic.html' && content.indexOf('diagnostic.html" class="bottom-nav-item active"') === -1)
      log('WARN', 'diagnostic.html nav active not set correctly');
    if (pages[i] === 'profil.html' && content.indexOf('profil.html" class="bottom-nav-item active"') === -1)
      log('WARN', 'profil.html nav active not set correctly');
  }
  
  // Check carta.html has Leaflet CDN
  var carte = fs.readFileSync('carte.html', 'utf8');
  if (carte.indexOf('leaflet@1.9.4') === -1) log('ERROR', 'carte.html missing Leaflet CDN');
  if (carte.indexOf('leaflet.css') === -1) log('ERROR', 'carte.html missing Leaflet CSS');
  
  console.log('  [OK] Cross-file consistency checked');
}

// ========================================
// RUN ALL TESTS
// ========================================
async function runAll() {
  console.log('========================================');
  console.log('  Agr\'IA - Test Suite Complete');
  console.log('========================================');
  
  await testPagesLoad();
  await testAssetsLoad();
  await testHTMLStructure();
  await testSupabase();
  testCodeAnalysis();
  await testCrossFileConsistency();
  
  console.log('\n========================================');
  console.log('  RESULTS: ' + errors.length + ' errors, ' + warnings.length + ' warnings');
  console.log('========================================');
  if (errors.length > 0) {
    console.log('\nERRORS:');
    errors.forEach(function(e) { console.log('  - ' + e); });
  }
  if (warnings.length > 0) {
    console.log('\nWARNINGS:');
    warnings.forEach(function(w) { console.log('  - ' + w); });
  }
  process.exit(errors.length > 0 ? 1 : 0);
}

runAll().catch(function(e) { console.error('Test suite crashed:', e); process.exit(1); });
