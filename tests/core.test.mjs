import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {dailyReading,localDateKey,mysteryToday,readings,bookNames,lexicon}from'../src/data/content.js';
import {mergeEntries,normalizeEntries,searchBible}from'../src/utils/study.js';
import {normalizeRosaryProgress,normalizeNovenaProgress}from'../src/utils/storage.js';
const fixture=(updatedAt,payload,deleted=false)=>({id:'note:test',kind:'note',updatedAt,payload,deleted});
test('newer offline edit wins; a deletion tombstone survives older device data',()=>{
 const old={'note:test':fixture('2026-10-19T00:00:00Z',{title:'old'})};
 const removed={'note:test':fixture('2026-10-20T00:00:00Z',{},true)};
 assert.equal(mergeEntries(old,removed)['note:test'].deleted,true);
 assert.equal(mergeEntries(removed,old)['note:test'].deleted,true);
});
test('reject malformed storage entries and invalid timestamps',()=>{
 assert.deepEqual(normalizeEntries(null),{});assert.deepEqual(normalizeEntries({bad:{kind:'admin',updatedAt:'now'}}),{});
});
test('14-day reading cycle is deterministic and uses local calendar days',()=>{
 const date=new Date(2026,9,21,23,59);assert.equal(localDateKey(date),'2026-10-21');assert.equal(dailyReading(date),dailyReading(new Date(2026,9,21,0,1)));
 assert.equal(dailyReading(date),dailyReading(new Date(2026,10,4,12)));
 assert.equal(new Set(Array.from({length:14},(_,i)=>dailyReading(new Date(2026,9,1+i,12)))).size,14);
});
test('rosary mysteries follow weekdays and progress is bounded to the new full sequence',()=>{
 assert.equal(mysteryToday(new Date(2026,9,22,12)),'luminous');assert.equal(mysteryToday(new Date(2026,9,23,12)),'sorrowful');
 assert.deepEqual(normalizeRosaryProgress({today:{joyful:999,invalid:7}}),{today:{joyful:67}});
 assert.deepEqual(normalizeNovenaProgress({novena1:99,bad:7}),{novena1:9});
});
for(const lang of ['it','pt']){
 const bible=JSON.parse(fs.readFileSync(`public/bible/${lang}.json`,'utf8'));
 test(`${lang}: complete edition, ordered chapters and nonempty verses`,()=>{
  assert.equal(bible.books.length,66);assert.equal(bookNames[lang].length,66);
  let count=0;for(const b of bible.books){assert.ok(bookNames[lang][b.bookId-1]);for(const [index,c]of b.chapters.entries()){assert.equal(c.chapter,index+1);assert.ok(c.verses.length>0);for(const v of c.verses){assert.ok(v.text.trim().length);assert.ok(v.number>0);count++;}}}assert.ok(count>31000);
 });
 test(`${lang}: every daily reading and glossary reference exists in the actual corpus`,()=>{
  for(const r of [...readings,...lexicon.flatMap(w=>w.refs.map(([book,chapter,verse])=>({book,chapter,start:verse,end:verse})))]){const book=bible.books.find(b=>b.book===r.book);assert.ok(book,r.book);const chapter=book.chapters.find(c=>c.chapter===r.chapter);assert.ok(chapter);assert.ok(chapter.verses.find(v=>v.number===r.start));assert.ok(chapter.verses.find(v=>v.number===r.end));}
 });
 test(`${lang}: literal full-text search handles punctuation and caps results`,()=>{
  assert.equal(searchBible(bible,'ab').length,0);assert.deepEqual(searchBible(bible,'<script>'),[]);assert.ok(searchBible(bible,lang==='it'?'Dio':'Deus',10).length<=10);assert.ok(searchBible(bible,lang==='it'?'principio':'princípio').length>0);
 });
}
