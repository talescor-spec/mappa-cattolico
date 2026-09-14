import fs from 'node:fs';

const appPath = 'src/App.jsx';
const stylesPath = 'src/styles.css';
let app = fs.readFileSync(appPath, 'utf8');
let styles = fs.readFileSync(stylesPath, 'utf8');

const importNeedle = "import LanguageSelector from './components/LanguageSelector';";
const importReplacement = `${importNeedle}\nimport AccountPanel from './components/AccountPanel';`;
if (!app.includes("./components/AccountPanel")) {
  if (!app.includes(importNeedle)) throw new Error('App.jsx import anchor not found');
  app = app.replace(importNeedle, importReplacement);
}

const profileNeedle = `      <section className="settings-card">\n        <div><span>{t('language')}</span><LanguageSelector /></div>\n        <div><span>{t('version')}</span></div>\n      </section>`;
const profileReplacement = `${profileNeedle}\n      <AccountPanel />`;
if (!app.includes('<AccountPanel />')) {
  if (!app.includes(profileNeedle)) throw new Error('App.jsx profile anchor not found');
  app = app.replace(profileNeedle, profileReplacement);
}

const cssMarker = '/* FIDEORA_AUTH_UI */';
if (!styles.includes(cssMarker)) {
  styles += `\n\n${cssMarker}\n.account-card{margin-top:12px;background:#fff;border:1px solid var(--line);border-radius:24px;padding:18px;box-shadow:0 8px 24px rgba(0,0,0,.025)}\n.account-heading{display:flex;gap:12px;align-items:flex-start;margin-bottom:16px}.account-icon{width:38px;height:38px;border-radius:13px;background:var(--gold-soft);color:#786743;display:grid;place-items:center;flex:0 0 auto}.account-heading h3{font-family:'Playfair Display',serif;font-size:19px;font-weight:500;margin:1px 0 4px}.account-heading p{margin:0;color:var(--muted);font-size:11px;line-height:1.45}.account-login label{display:block;color:var(--muted);font-size:10px;margin:0 0 7px}.account-email-row{height:50px;border:1px solid var(--line);border-radius:15px;display:flex;align-items:center;background:#faf9f6;margin-bottom:10px;overflow:hidden}.account-email-row>span{width:42px;display:grid;place-items:center;color:#999}.account-email-row input{height:100%;flex:1;border:0;background:transparent;outline:none;padding:0 12px 0 0;color:var(--ink);min-width:0}.account-message{font-size:10px;line-height:1.5;color:var(--muted);margin:10px 2px 0}.account-message.error{color:#9d4747}.account-connected{border-top:1px solid var(--line)}.account-status-row{padding:15px 0;display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.account-status-row>div span{display:block;font-size:10px;color:var(--muted);margin-bottom:3px}.account-status-row>div strong{font-size:12px;font-weight:600;word-break:break-all}.cloud-state{display:flex;align-items:center;gap:5px;font-size:9px;font-weight:700;color:#557565;background:#edf3ef;border-radius:99px;padding:6px 8px;white-space:nowrap}.cloud-state.syncing{color:#806d43;background:#f5f0e4}.cloud-state.error{color:#984747;background:#f8eaea}.account-action{width:100%;min-height:48px;border:0;border-top:1px solid var(--line);background:transparent;display:flex;align-items:center;gap:9px;color:var(--ink);font-size:11px;font-weight:600;padding:0 2px;cursor:pointer;text-align:left}.account-action.danger{color:#a24a4a}.account-delete-box{margin-top:14px;border:1px solid #ecd3cf;background:#fff8f7;border-radius:18px;padding:15px}.delete-mark{width:34px;height:34px;border-radius:11px;background:#f7e5e2;color:#a24a4a;display:grid;place-items:center;margin-bottom:10px}.account-delete-box h4{font-family:'Playfair Display',serif;font-size:17px;font-weight:500;margin:0 0 6px;color:#612e2e}.account-delete-box p{font-size:10px;line-height:1.55;color:#795c5c;margin:0}.delete-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}.button.danger-button{background:#8f3f3f;color:white}.account-trust{margin-top:12px;padding-top:11px;border-top:1px solid var(--line);display:flex;align-items:center;gap:6px;color:#5b7668;font-size:9px;font-weight:700}\n`;
}

fs.writeFileSync(appPath, app);
fs.writeFileSync(stylesPath, styles);
console.log('Fideora auth UI patch applied.');
