export const ENTRY_KINDS = new Set(['verse','note','intention','novena','reading']);
export function normalizeEntries(input) {
 if(!input||typeof input!=='object'||Array.isArray(input))return {};
 const output={};
 for(const [id,entry] of Object.entries(input).slice(0,5000)) {
  if(!/^[a-zA-Z0-9:._-]{1,160}$/.test(id)||!entry||!ENTRY_KINDS.has(entry.kind)||!Number.isFinite(Date.parse(entry.updatedAt)))continue;
  output[id]={id,kind:entry.kind,updatedAt:entry.updatedAt,deleted:!!entry.deleted,payload:entry.payload&&typeof entry.payload==='object'?entry.payload:{}};
 }
 return output;
}
export function mergeEntries(local,remote) {
 const merged={...normalizeEntries(remote)};
 for(const [id,entry] of Object.entries(normalizeEntries(local))) {
  if(!merged[id]||Date.parse(entry.updatedAt)>Date.parse(merged[id].updatedAt))merged[id]=entry;
 }
 return merged;
}
export function searchBible(bible,query,limit=100) {
 const needle=query.trim().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
 if(needle.length<3||!bible)return [];
 const results=[];
 for(const book of bible.books) for(const chapter of book.chapters)for(const verse of chapter.verses){
  if(verse.text.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().includes(needle)) {
   results.push({book:book.book,chapter:chapter.chapter,verse:verse.number,text:verse.text,bookId:book.bookId});
   if(results.length>=limit)return results;
  }
 }
 return results;
}
