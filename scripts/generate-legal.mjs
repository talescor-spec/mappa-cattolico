import fs from "node:fs";
const copy = JSON.parse(fs.readFileSync("src/data/legal.json", "utf8"));
const escape = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
for (const kind of ["privacy", "terms", "support"]) {
  const sections = Object.entries(copy)
    .map(
      ([lang, value]) =>
        `<section lang="${lang}" id="${lang}"><h1>${escape(value[kind].title)}</h1>${value[kind].sections.map(([h, p]) => `<h2>${escape(h)}</h2><p>${escape(p)}</p>`).join("")}</section>`,
    )
    .join("");
  fs.writeFileSync(
    `public/${kind}.html`,
    `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fideora · ${kind}</title><link rel="icon" href="/icon.svg"><style>body{max-width:760px;margin:auto;padding:25px;color:#364a36;font:16px/1.8 -apple-system,BlinkMacSystemFont,sans-serif;background:white}h1,h2{font-family:Georgia,serif;font-weight:400;line-height:1.3}h1{font-size:32px}h2{font-size:22px;margin-top:35px}a{color:#3d6638}nav{display:flex;gap:20px;border-bottom:1px solid #dfe5d8;padding:12px 0 20px}section{scroll-margin-top:20px}section+section{border-top:1px solid #dfe5d8;margin-top:50px;padding-top:30px}footer{margin-top:45px;border-top:1px solid #dfe5d8;padding-top:25px;font-size:13px}</style><script src="/legal.js" defer></script></head><body><nav><a href="/">Fideora</a><a href="?lang=it">Italiano</a><a href="?lang=pt">Português</a></nav>${sections}<footer><a href="https://github.com/talescor-spec/mappa-cattolico/issues">Supporto ufficiale / Suporte oficial ↗</a><p>Fideora · 1.0.0 · 21/10/2026</p><a href="/privacy.html">Privacy</a> · <a href="/terms.html">Termini / Termos</a> · <a href="/support.html">Supporto / Suporte</a></footer></body></html>`,
  );
}
