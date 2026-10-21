import fs from 'node:fs';
// Evidence is supplied only after tests actually run; absence must fail closed.
const file='docs/apple-release-evidence.json';
if(!fs.existsSync(file)){console.error('BLOCKED: signed archive, physical iPhone checks and App Store Connect configuration are not verified. See docs/V1-RELEASE.md.');process.exit(1);}
const evidence=JSON.parse(fs.readFileSync(file,'utf8'));
const required=['signedArchive','physicalIPhone','nativeAuthRoundTrip','nativeDeletionRoundTrip','appStoreMetadata','privacyDisclosure','appStoreScreenshots','bundleIdRegistered'];
const missing=required.filter(key=>evidence[key]?.status!=='passed'||!evidence[key]?.reference);
if(missing.length){console.error('BLOCKED: '+missing.join(', '));process.exit(1);}
console.log('All required release evidence is recorded. Check evidence references before submitting to Apple.');
