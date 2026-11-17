import test from 'node:test';
import assert from 'node:assert/strict';
import {detectDevice,appOffer,campaignToken,sessionContext} from '../website/mappa-della-bibbia/social-core.mjs';
import {purchaseURL} from '../website/mappa-della-bibbia/offer.mjs';
import {checkoutContactURL} from '../website/mappa-della-bibbia/order-core.mjs';
import {collectEvent,captureContact} from '../integrations/funnel-metrics/fideora-social/core.mjs';
import {resumeToken,verifyResume,createSocialLifecycle} from '../integrations/funnel-metrics/fideora-social/lifecycle.mjs';
const session='f4a11692-458e-48b4-b235-f4582c364633';
const event={id:session,session_id:session,event_name:'page_view',platform:'ios',attribution:{utm_source:'instagram',email:'private@example.com',access_token:'secret'}};
test('iPhone, desktop-mode iPad, Android and desktop choose a compatible editable route',()=>{
 assert.equal(detectDevice({userAgent:'Mozilla iPhone'}),'ios');
 assert.equal(detectDevice({userAgent:'Mozilla',platform:'MacIntel',maxTouchPoints:5}),'ios');
 assert.equal(detectDevice({userAgent:'Mozilla Android 15'}),'android');
 assert.equal(detectDevice({userAgent:'Mozilla',platform:'MacIntel',maxTouchPoints:0}),'desktop');
 assert.equal(appOffer('ios'),'apple');assert.equal(appOffer('android'),'android');
 const android=new URL(checkoutContactURL(purchaseURL('android'),'android',{name:'Giulia Rossi',email:'user@example.com'},{utm_source:'instagram'}));
 assert.equal(android.host,'pay.hotmart.com');assert.equal(android.searchParams.get('off'),'e792z6va');assert.equal(android.searchParams.get('showOnlyTrial'),'1');
 const apple=new URL(checkoutContactURL(purchaseURL('apple'),'apple',{}, {utm_source:'instagram',utm_medium:'organic_dm'}));
 assert.equal(apple.searchParams.get('pt'),'129505215');assert.equal(apple.searchParams.get('ct'),campaignToken('instagram','organic_dm'));assert.equal(apple.searchParams.has('email'),false);
});
test('a returning session preserves channel attribution without persisting recipient URL parameters',()=>{
 let value;const storage={getItem:()=>value,setItem:(_,v)=>value=v};
 const first=sessionContext(storage,new URLSearchParams('utm_source=tiktok&utm_medium=organic_dm&email=private@example.com&resume=secret'),'https://www.tiktok.com/',()=>session);
 const second=sessionContext(storage,new URLSearchParams(''),'',()=>assert.fail('should reuse session'));
 assert.equal(first.id,second.id);assert.equal(second.attribution.utm_source,'tiktok');
 assert.equal(second.attribution.email,undefined);assert.equal(second.attribution.resume,undefined);
});
test('public website events cannot manufacture captures, subscriptions, revenue or recipient identity',()=>{
 const e=collectEvent(event);assert.equal(e.attribution.email,undefined);assert.equal(e.attribution.access_token,undefined);
 for(const event_name of ['capture_success','subscription_started','purchase_confirmed','trial_started'])assert.throws(()=>collectEvent({...event,event_name}));
 assert.throws(()=>collectEvent({...event,session_id:'invalid'}));
 const c=captureContact({name:'Giulia Rossi',email:'USER@example.com',offer:'android',session_id:session,platform:'android',followup_requested:true,marketing_consent:false,funnel:'tnt-fr'});
 assert.equal(c.offer,'android');assert.equal(c.email,'user@example.com');assert.equal(c.marketing_consent,true);assert.equal(c.funnel,undefined);
 assert.equal(captureContact({...c,name:c.name,followup_requested:false}).marketing_consent,false);
});
test('recovery tokens are signed, scoped to a journey and expire without carrying an email',async()=>{
 const token=await resumeToken(session,'unit-test-secret',1000000000000);
 assert.equal(await verifyResume(token,'unit-test-secret',1000000000000),session);
 assert.equal(await verifyResume(token,'different-key',1000000000000),null);
 assert.equal(await verifyResume(token,'unit-test-secret',1000000000000+31*86400000),null);
 assert.equal(await verifyResume(token+'changed','unit-test-secret',1000000000000),null);
 assert.equal(token.includes('@'),false);
});
const fakeDB=(converted,journey,identities=[])=>({rpc:async()=>({data:converted}),from(table){const q={select(){return this;},eq(){return this;},order(){return this;},limit(){return this;},maybeSingle(){return this;},then(resolve){return Promise.resolve({data:table==='fm_social_journeys_v1'?journey:identities}).then(resolve);}};return q;}});
test('confirmed activation suppresses recovery and anonymous Apple customers do not receive later sale reminders',async()=>{
 const e={email:'user@example.com'},s={funnel_id:42},m={step:2,delivery_policy:{revision:'fideora_social_20261117_v1'}};
 const secret=async()=> 'unit-key';
 assert.deepEqual(await createSocialLifecycle({db:fakeDB(true),secret}).prepare(e,s,m),{eligible:false,reason:'purchase_or_activation_confirmed'});
 const journey={id:session,offer:'ios',funnel_id:42};
 assert.deepEqual(await createSocialLifecycle({db:fakeDB(false,journey),secret}).prepare(e,s,m),{eligible:false,reason:'apple_identity_unavailable'});
 const first=await createSocialLifecycle({db:fakeDB(false,journey),secret}).prepare(e,s,{...m,step:1});
 assert.equal(first.eligible,true);const url=new URL(first.ctaURL);assert.equal(url.searchParams.has('email'),false);assert.equal(url.searchParams.has('resume'),true);
});
