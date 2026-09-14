import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pass = [];
const warn = [];
const fail = [];

const exists = (p) => fs.existsSync(path.join(root, p));
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

function check(condition, ok, bad, severity = 'fail') {
  if (condition) pass.push(ok);
  else (severity === 'warn' ? warn : fail).push(bad);
}

function walk(dir, acc = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return acc;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, acc);
    else acc.push(rel);
  }
  return acc;
}

const pkg = JSON.parse(read('package.json'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };

check(Boolean(deps['@capacitor/core'] && deps['@capacitor/ios']), 'Capacitor iOS dependencies present', 'Capacitor iOS dependencies missing');
check(Boolean(deps['@revenuecat/purchases-capacitor']), 'RevenueCat Capacitor SDK present', 'RevenueCat Capacitor SDK missing');
check(Boolean(deps['@supabase/supabase-js']), 'Supabase client SDK present', 'Supabase client SDK missing');
check(pkg.scripts?.['appstore:preflight'] === 'node scripts/appstore-preflight.mjs', 'App Store preflight script registered', 'package.json is missing appstore:preflight script');

check(exists('capacitor.config.js'), 'Capacitor config present', 'capacitor.config.js missing');
if (exists('capacitor.config.js')) {
  const cap = read('capacitor.config.js');
  check(/appName:\s*['"]Fideora['"]/.test(cap), 'Native app name is Fideora', 'Capacitor appName is not Fideora');
  check(/appId:\s*['"][A-Za-z0-9.-]+['"]/.test(cap), 'Bundle identifier is defined', 'Capacitor appId is missing');
  if (/appId:\s*['"]com\.fideora\.app['"]/.test(cap)) warn.push('Bundle ID is still the provisional `com.fideora.app`; confirm it before App Store Connect registration.');
}

check(exists('src/services/purchases.js'), 'Purchases service present', 'src/services/purchases.js missing');
if (exists('src/services/purchases.js')) {
  const purchases = read('src/services/purchases.js');
  check(/restorePurchases/.test(purchases), 'Restore Purchases implementation present', 'Restore Purchases implementation missing');
  check(/ENTITLEMENT_ID/.test(purchases) && /premium/.test(purchases), 'Premium entitlement is explicit', 'Premium entitlement mapping is missing or unclear');
  check(/isIOSNative/.test(purchases), 'RevenueCat is gated to native iOS', 'RevenueCat native-platform gate is missing');
  check(/syncPurchasesUser/.test(purchases) && /Purchases\.logIn/.test(purchases), 'RevenueCat supports stable authenticated appUserID', 'RevenueCat authenticated identity binding is missing');
  check(/clearPurchasesUser/.test(purchases) && /Purchases\.logOut/.test(purchases), 'RevenueCat identity logout path present', 'RevenueCat identity logout path missing');
}

check(exists('src/contexts/AuthContext.jsx'), 'Fideora Auth context present', 'Fideora Auth context missing');
if (exists('src/contexts/AuthContext.jsx')) {
  const auth = read('src/contexts/AuthContext.jsx');
  check(/signInWithOtp/.test(auth), 'Passwordless sign-in path present', 'Magic-link/OTP auth path missing');
  check(/fideora_profiles/.test(auth) && /fideora_progress/.test(auth), 'Cloud profile/progress sync present', 'Fideora cloud data sync missing');
  check(/fideora_delete_own_account/.test(auth), 'In-app account deletion path present', 'In-app account deletion path missing');
  check(/syncPurchasesUser\(nextUser\.id\)/.test(auth), 'Supabase UUID is mapped to RevenueCat identity', 'Canonical Supabase user ID is not visibly mapped to RevenueCat');
}

check(exists('src/components/AccountPanel.jsx'), 'Account management UI present', 'Account management UI missing');
if (exists('src/components/AccountPanel.jsx')) {
  const account = read('src/components/AccountPanel.jsx');
  check(/Delete|Excluir|Elimina|Supprimer|Eliminar|löschen/i.test(account), 'Account deletion UI copy present', 'Account deletion UI copy missing');
  check(/Apple/.test(account) && /subscription|assinatura|abbonamento|abonnement|suscripción|Abonnement/i.test(account), 'Deletion warns about Apple subscription management', 'Account deletion does not clearly warn about active Apple subscriptions');
}

const migrationFiles = exists('supabase/migrations') ? walk('supabase/migrations') : [];
check(migrationFiles.some((f) => f.includes('create_fideora_auth_profile_progress')), 'Fideora Auth/RLS migration is versioned', 'Fideora Auth/RLS migration missing from repository');
check(migrationFiles.some((f) => f.includes('add_fideora_delete_own_account_rpc')), 'Account deletion migration is versioned', 'Account deletion migration missing from repository');
check(migrationFiles.some((f) => f.includes('minimize_fideora_authenticated_table_grants')), 'Least-privilege grants migration is versioned', 'Fideora least-privilege grants migration missing');

if (exists('vercel.json')) {
  const vercel = read('vercel.json');
  check(/https:\/\/kgyqpedwgilotlwyhmnb\.supabase\.co/.test(vercel), 'Supabase origin is allow-listed in CSP', 'Supabase origin missing from CSP connect-src');
}

check(exists('SECURITY.md'), 'Security baseline present', 'SECURITY.md missing');
check(exists('docs/APP_STORE_REVIEW_GATE.md'), 'App Store review gate present', 'docs/APP_STORE_REVIEW_GATE.md missing');
check(exists('.github/skills/apple-appstore-reviewer/SKILL.md'), 'App Store reviewer skill present', 'App Store reviewer skill missing');

const scanFiles = ['src', '.env.example', 'capacitor.config.js']
  .flatMap((p) => (exists(p) && fs.statSync(path.join(root, p)).isDirectory() ? walk(p) : exists(p) ? [p] : []))
  .filter((p) => /\.(js|jsx|ts|tsx|json|env|example)$/.test(p) || p.endsWith('.env.example'));

const forbiddenClientPatterns = [
  ['Supabase service-role key reference in client-scanned files', /SUPABASE_SERVICE_ROLE_KEY\s*=\s*[^\s#]+/],
  ['RevenueCat secret API key reference in client-scanned files', /REVENUECAT_SECRET_API_KEY\s*=\s*[^\s#]+/],
  ['Apple private key reference in client-scanned files', /APPLE_PRIVATE_KEY\s*=\s*[^\s#]+/],
  ['Suspicious VITE secret/private variable', /VITE_[A-Z0-9_]*(SECRET|PRIVATE|SERVICE_ROLE)[A-Z0-9_]*\s*=\s*[^\s#]+/],
];

for (const file of scanFiles) {
  const text = read(file);
  for (const [label, pattern] of forbiddenClientPatterns) {
    if (pattern.test(text)) fail.push(`${label}: ${file}`);
  }
  if (/dangerouslySetInnerHTML/.test(text)) warn.push(`Review HTML injection surface: ${file} uses dangerouslySetInnerHTML.`);
}

if (exists('src/lib/supabase.js')) {
  const supabaseClient = read('src/lib/supabase.js');
  if (/persistSession:\s*true/.test(supabaseClient)) {
    warn.push('Native auth storage review remains open: Supabase session persistence is enabled; confirm Keychain/secure-storage strategy before TestFlight.');
  }
}

if (exists('ios')) {
  const nativeFiles = walk('ios');
  const infoPlists = nativeFiles.filter((f) => f.endsWith('Info.plist'));
  const entitlements = nativeFiles.filter((f) => f.endsWith('.entitlements'));
  const privacyManifests = nativeFiles.filter((f) => f.endsWith('PrivacyInfo.xcprivacy'));
  const projectFiles = nativeFiles.filter((f) => f.endsWith('project.pbxproj'));
  const storeKitFiles = nativeFiles.filter((f) => f.endsWith('.storekit'));

  check(infoPlists.length > 0, 'Native Info.plist found', 'iOS target exists but no Info.plist was found');
  check(entitlements.length > 0, 'Native entitlements file found', 'No app entitlements file found yet', 'warn');
  check(privacyManifests.length > 0, 'Privacy manifest found', 'No app PrivacyInfo.xcprivacy found yet; verify whether the app target needs one', 'warn');
  check(storeKitFiles.length > 0, 'StoreKit test configuration found', 'No .storekit test configuration found yet', 'warn');

  if (projectFiles.length) {
    const pbx = projectFiles.map(read).join('\n');
    check(/InAppPurchase|com\.apple\.InAppPurchase/.test(pbx), 'In-App Purchase capability appears in Xcode project', 'In-App Purchase capability is not detectable in the Xcode project yet', 'warn');
  }
} else {
  warn.push('Pre-iOS stage: `ios/` target is not committed yet. Native plist/entitlement/privacy checks remain unverified.');
}

console.log('\nFideora App Store preflight');
console.log('============================');
for (const item of pass) console.log(`PASS  ${item}`);
for (const item of warn) console.log(`WARN  ${item}`);
for (const item of fail) console.log(`FAIL  ${item}`);
console.log(`\nSummary: ${pass.length} pass, ${warn.length} warning(s), ${fail.length} failure(s).`);

if (fail.length) process.exit(1);
