const STORAGE_KEY='fideora_review_helpful_v1';
export function initReviewCarousel(root=document.querySelector('[data-review-carousel]')) {
  if(!root||root.dataset.enhanced==='true')return;
  const cards=[...root.querySelectorAll('[data-review-id]')];
  const track=root.querySelector('.review-track');
  const controls=root.querySelector('.review-controls');
  const dots=[...root.querySelectorAll('[data-review-goto]')];
  const counter=root.querySelector('[data-review-counter]');
  const pause=root.querySelector('[data-review-pause]');
  const windowElement=root.querySelector('.review-window');
  if(cards.length<2||!track||!controls||!pause||!windowElement)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,playing=!reduced.matches,visible=!('IntersectionObserver' in window),hovered=false,focused=false,timer,startX=null;
  let storage,saved={};
  try{storage=window.localStorage;const value=JSON.parse(storage.getItem(STORAGE_KEY)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch{}
  const helpful=Object.fromEntries(cards.map(card=>[card.dataset.reviewId,saved[card.dataset.reviewId]===true]));
  function renderHelpful(button){
    const selected=helpful[button.dataset.helpful]===true;
    button.setAttribute('aria-pressed',String(selected));
    button.querySelector('span').textContent=selected?'Utile per te':'Utile';
  }
  root.querySelectorAll('[data-helpful]').forEach(button=>{
    button.disabled=false;renderHelpful(button);
    button.addEventListener('click',()=>{
      helpful[button.dataset.helpful]=!helpful[button.dataset.helpful];renderHelpful(button);
      try{storage?.setItem(STORAGE_KEY,JSON.stringify(helpful));}catch{}
    });
  });
  function render(){
    track.style.transform=`translateX(-${index*100}%)`;
    cards.forEach((card,i)=>{card.inert=i!==index;card.setAttribute('aria-hidden',String(i!==index));});
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));
    counter.textContent=`${index+1} / ${cards.length}`;
    pause.textContent=playing?'Pausa':'Riprendi';
    pause.setAttribute('aria-label',playing?'Metti in pausa il carosello':'Riprendi il carosello automatico');
    pause.setAttribute('aria-pressed',String(!playing));
    root.dataset.playing=String(playing);
  }
  function schedule(){
    clearInterval(timer);
    if(playing&&visible&&!hovered&&!focused&&!document.hidden){timer=setInterval(()=>go(index+1,false),6000);}
  }
  function go(next,manual=true){
    index=(next+cards.length)%cards.length;
    if(manual)playing=false;
    counter.setAttribute('aria-live',manual?'polite':'off');render();
    if(manual)schedule();
  }
  root.querySelector('[data-review-prev]').addEventListener('click',()=>go(index-1));
  root.querySelector('[data-review-next]').addEventListener('click',()=>go(index+1));
  dots.forEach(dot=>dot.addEventListener('click',()=>go(Number(dot.dataset.reviewGoto))));
  pause.addEventListener('click',()=>{playing=!playing;render();schedule();});
  root.addEventListener('mouseenter',()=>{hovered=true;schedule();});
  root.addEventListener('mouseleave',()=>{hovered=false;schedule();});
  root.addEventListener('focusin',()=>{focused=true;schedule();});
  root.addEventListener('focusout',event=>{if(!root.contains(event.relatedTarget)){focused=false;schedule();}});
  windowElement.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();go(index+1);}
    if(event.key==='ArrowLeft'){event.preventDefault();go(index-1);}
  });
  windowElement.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){startX=event.clientX;clearInterval(timer);}});
  windowElement.addEventListener('pointerup',event=>{
    if(startX===null)return;const delta=event.clientX-startX;startX=null;
    if(Math.abs(delta)>45)go(index+(delta<0?1:-1));else schedule();
  });
  windowElement.addEventListener('pointercancel',()=>{startX=null;schedule();});
  document.addEventListener('visibilitychange',schedule);
  window.addEventListener('pagehide',()=>clearInterval(timer));
  reduced.addEventListener?.('change',event=>{if(event.matches){playing=false;render();schedule();}});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.25);schedule();},{threshold:.25});observer.observe(root);}
  root.dataset.enhanced='true';controls.hidden=false;render();schedule();
}
