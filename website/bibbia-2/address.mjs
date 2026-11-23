export const countryCodes='AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');
const clean=(value,min,max)=>{
 const text=typeof value==='string'?value.trim().replace(/\s+/g,' '):'';
 if(text.length<min||text.length>max||/[<>\x00-\x1f\x7f]/.test(text))throw Error('invalid_address');
 return text;
};
export function normalizeAddress(value={}){
 const country=clean(value.country,2,2).toUpperCase();
 if(!countryCodes.includes(country))throw Error('invalid_address');
 const postal_code=clean(value.postal_code,0,16).toUpperCase();
 if(country==='IT'?!/^\d{5}$/.test(postal_code):postal_code&&!/^[\p{L}\p{N} -]{2,16}$/u.test(postal_code))throw Error('invalid_postal_code');
 return {street:clean(value.street,2,160),number:clean(value.number,1,16),complement:clean(value.complement||'',0,100),postal_code,city:clean(value.city,2,100),state:clean(value.state,2,100),country};
}
