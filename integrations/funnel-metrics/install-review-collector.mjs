import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.argv[2];
if (!root) throw Error("Supply the directory of the current dashboard-daily-leads source");

function replaceOnce(source, before, after) {
  if (source.split(before).length !== 2) throw Error("Expected a single matching integration point");
  return source.replace(before, after);
}

const growthPath = join(root, "growth", "index.ts");
const pagePath = join(root, "studio_page.ts");
const [growth, page, collector] = await Promise.all([
  readFile(growthPath, "utf8"),
  readFile(pagePath, "utf8"),
  readFile(new URL("./review-events.mjs", import.meta.url), "utf8"),
]);

const report = "export async function fideoraGrowthReport(slug=null){const {data,error}=await db.rpc('fm_fideora_report_v1',{p_slug:slug});if(error)throw error;return data;}";
let nextGrowth = replaceOnce(growth, report, `export async function fideoraGrowthReport(slug=null) {
 const [report, appReviews] = await Promise.all([
  db.rpc('fm_fideora_report_v1',{p_slug:slug}),
  reviewCounts(db),
 ]);
 if(report.error)throw report.error;
 return {...report.data,app_reviews:appReviews};
}`);
nextGrowth = replaceOnce(nextGrowth, "  if(action==='collect'){", "  if(action==='app-review')return await collectReviewEvent(req,db,out);\n  if(action==='collect'){");
nextGrowth = "import {collectReviewEvent,reviewCounts} from './review-events.mjs';\n" + nextGrowth;

const declaration = "export const studioPage = ";
if (!page.startsWith(declaration)) throw Error("Unexpected Email Studio source");
const html = JSON.parse(page.slice(declaration.length).trim().replace(/;$/, ""));
const nextHtml = replaceOnce(
  html,
  '   \'<p class="sub">¹ Aberturas e cliques',
  `   '<p><strong>Avaliações do app nos últimos 30 dias:</strong> '+(r.app_reviews?
      fmt(r.app_reviews.milestones)+' marcos atingidos · '+fmt(r.app_reviews.requests)+' solicitações ao iOS · '+fmt(r.app_reviews.profile_clicks)+' cliques no Perfil':'dados indisponíveis')+'. Total do Fideora, sem atribuição a este funil.</p>'+
   '<p class="sub">Notas e avaliações publicadas ficam no App Store Connect.</p>'+
   '<p class="sub">¹ Aberturas e cliques`,
);

await writeFile(growthPath, nextGrowth);
await writeFile(join(root, "growth", "review-events.mjs"), collector);
await writeFile(pagePath, declaration + JSON.stringify(nextHtml) + ";\n");
