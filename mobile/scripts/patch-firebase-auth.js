const fs = require('fs');
const path = require('path');

const files = [
  'node_modules/firebase/node_modules/@firebase/auth/package.json',
  'node_modules/@firebase/auth-compat/node_modules/@firebase/auth/package.json',
];

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`[patch-firebase-auth] skipping: ${file} (not found)`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // 1. Replace react-native field with browser build
  content = content.replace(
    /"react-native":\s*"dist\/rn\/index\.js"/,
    '"react-native": "dist/esm2017/index.js"',
  );

  // 2. Remove react-native condition from exports[.]
  content = content.replace(
    /\n\s*"react-native":\s*\{\s*\n\s*"types":\s*"\.\/dist\/rn\/index\.rn\.d\.ts",\s*\n\s*"default":\s*"\.\/dist\/rn\/index\.js"\s*\n\s*\},\n\s*"cordova"/g,
    '\n      "cordova"',
  );

  // 3. Remove react-native condition from exports["./internal"]
  content = content.replace(
    /\n\s*"react-native":\s*\{\s*\n\s*"types":\s*"\.\/dist\/rn\/internal\/index\.d\.ts",\s*\n\s*"default":\s*"\.\/dist\/rn\/internal\.js"\s*\n\s*\},\n\s*"cordova"/g,
    '\n      "cordova"',
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[patch-firebase-auth] patched: ${file}`);
  } else {
    console.log(`[patch-firebase-auth] already patched: ${file}`);
  }
}
