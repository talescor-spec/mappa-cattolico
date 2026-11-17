import test from 'node:test';
import assert from 'node:assert/strict';
import {hotmartAttributionCode, loadUtmifyUTMs, UTMIFY_UTMS_SCRIPT} from '../website/mappa-della-bibbia/utmify.mjs';
import {checkoutContactURL} from '../website/mappa-della-bibbia/order-core.mjs';
import {sessionContext} from '../website/mappa-della-bibbia/social-core.mjs';

const contact={name:'Giulia Rossi',email:'giulia+libro@example.com'};
const attribution={utm_source:'FB',utm_campaign:'Studio |120001',utm_medium:'Italia |120002',utm_content:'Carta di Paolo |120003',utm_term:'Instagram_Reels'};
test('Hotmart receives UTMify positional xcod without changing offer, trial or encoded contact',()=>{
 const url=new URL(checkoutContactURL('https://pay.hotmart.com/X108495940M?off=e792z6va&showOnlyTrial=1','android',contact,attribution));
 assert.equal(url.searchParams.get('xcod'),'FBhQwK21wXxRStudio |120001hQwK21wXxRItalia |120002hQwK21wXxRCarta di Paolo |120003hQwK21wXxRInstagram_Reels');
 assert.equal(url.searchParams.get('utm_content'),attribution.utm_content);
 assert.equal(url.searchParams.get('off'),'e792z6va');assert.equal(url.searchParams.get('showOnlyTrial'),'1');
 assert.equal(url.searchParams.get('name'),contact.name);assert.equal(url.searchParams.get('email'),contact.email);
});
test('organic source and empty slots stay truthful; existing xcod is preserved and personal values are rejected',()=>{
 assert.equal(hotmartAttributionCode({utm_source:'instagram'}),'instagramhQwK21wXxRhQwK21wXxRhQwK21wXxRhQwK21wXxR');
 assert.equal(hotmartAttributionCode({xcod:'original-code',utm_source:'direct'}),'original-code');
 assert.equal(hotmartAttributionCode({xcod:'private@example.com',utm_source:'tiktok',utm_campaign:'private%40example.com'}),'tiktokhQwK21wXxRhQwK21wXxRhQwK21wXxRhQwK21wXxR');
 assert.equal(hotmartAttributionCode({}),'');
 const stored={getItem:()=>null,setItem(){}};
 const session=sessionContext(stored,new URLSearchParams('xcod=original-code&utm_source=FB'),'');
 assert.equal(session.attribution.xcod,'original-code');
 const url=new URL(checkoutContactURL('https://pay.hotmart.com/X108495940M?off=e792z6va','android',contact,session.attribution));
 assert.equal(url.searchParams.get('xcod'),'original-code');
});
test('Hotmart-specific xcod never changes Mundpay sck or leaks a contact to Apple',()=>{
 const tracking={...attribution,xcod:'existing-hotmart-code',sck:'existing-book-code'};
 const book=new URL(checkoutContactURL('https://checkout.mundpay.com/checkout?ref=','book',contact,tracking));
 assert.equal(book.searchParams.get('sck'),'existing-book-code');assert.equal(book.searchParams.has('xcod'),false);
 const apple=new URL(checkoutContactURL('https://apps.apple.com/it/app/fideora/id6825337165','apple',contact,tracking));
 assert.equal(apple.searchParams.has('xcod'),false);assert.equal(apple.searchParams.has('email'),false);assert.equal(apple.searchParams.has('name'),false);
 assert.equal(apple.searchParams.get('pt'),'129505215');
});
function context(search='',nav={},preference=null){
 const scripts=[];const win={location:new URL('https://fideora.app/mappa-della-bibbia/'+search),history:{replaceState(_s,_t,url){win.location=new URL(url);}}};
 const root={dataset:{}};const doc={documentElement:root,querySelector:()=>scripts[0]||null,createElement:()=>({attributes:{},setAttribute(k,v){this.attributes[k]=v;}}),head:{append:s=>scripts.push(s)}};
 return {win,doc,nav,storage:{getItem:()=>JSON.stringify(preference)},scripts,root};
}
test('UTMify attribution script loads once after personal URL data is removed, and never loads an optimization pixel',()=>{
 const c=context('?name=Giulia&email=private%40example.com&resume=signed-secret&utm_source=FB');
 assert.equal(loadUtmifyUTMs(c),true);assert.equal(loadUtmifyUTMs(c),true);assert.equal(c.scripts.length,1);
 assert.equal(c.win.location.search,'?utm_source=FB');assert.equal(c.scripts[0].src,UTMIFY_UTMS_SCRIPT);
 assert.equal(c.scripts[0].attributes['data-utmify-prevent-xcod-sck'],'');assert.equal(c.scripts[0].attributes['data-utmify-prevent-subids'],'');
 c.scripts[0].onload();assert.equal(c.root.dataset.utmifyStatus,'loaded');
});
test('privacy preferences, QA and foreign origins suppress the third party; vendor failure never blocks checkout',()=>{
 for(const c of [context('?fm_test=1'),context('',{doNotTrack:'1'}),context('',{globalPrivacyControl:true}),context('',{}, {meta:false})]){
  assert.equal(loadUtmifyUTMs(c),false);assert.equal(c.scripts.length,0);
 }
 const foreign=context();foreign.win.location=new URL('https://preview.example/mappa-della-bibbia/');assert.equal(loadUtmifyUTMs(foreign),false);
 const blocked=context();blocked.doc.head.append=()=>{throw Error('blocked');};assert.equal(loadUtmifyUTMs(blocked),false);
 assert.equal(new URL(checkoutContactURL('https://pay.hotmart.com/X108495940M?off=e792z6va','android',contact,attribution)).searchParams.get('off'),'e792z6va');
});
