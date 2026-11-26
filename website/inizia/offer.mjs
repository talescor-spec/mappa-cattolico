export const offer = Object.freeze({intro:1,renewal:19.9,currency:'EUR',months:1,route:'/inizia/',checkout:'https://pay.hotmart.com/X108495940M?off=t8i2l9ha',campaign:'fideora_eur1_don_luca_v1'});
export function checkoutURL(incoming='https://fideora.app/inizia/',position='hero') {
 const source=new URL(incoming),target=new URL(offer.checkout);
 target.searchParams.set('utm_source','don_luca');target.searchParams.set('utm_medium','landing');target.searchParams.set('utm_campaign',offer.campaign);target.searchParams.set('utm_content',position);
 for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','src','sck','fbclid','gclid','ttclid']) {
  const value=source.searchParams.get(key);if(value&&value.length<=200&&!/[@<>\x00-\x1f\x7f]|%40/i.test(value))target.searchParams.set(key,value);
 }
 return target.href;
}
