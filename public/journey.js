'use strict';
window.LightJourney=(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const anchors={welcome:'.hero-diya',reflection:'.reflection-light',ceremony:'#ceremony-diya',commitment:'.commitment-art>.diya',community:'.joining-diya',souvenir:'.souvenir-art>.diya',totals:'.totals-diya'};
 let busy=false;
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function stage(id){return document.getElementById(id)}
 function lamp(id){return stage(id)?.querySelector(anchors[id])}
 function animate(el,frames,options){if(!el.animate)return Promise.resolve();return el.animate(frames,options).finished.catch(()=>{});}
 function activate(id){document.querySelectorAll('.screen').forEach(s=>{s.hidden=s.id!==id;s.classList.toggle('active',s.id===id)});const dark=stage(id).classList.contains('dark');document.body.classList.toggle('is-dark',dark);document.body.dataset.scene=id;document.querySelector('meta[name="theme-color"]').content=dark?'#300c1c':'#f9f3e7';window.scrollTo({top:0,behavior:'instant'});stage(id).querySelector('h1,h2')?.focus({preventScroll:true});}
 async function show(id){
 if(busy)return false;
 const current=document.querySelector('.screen.active');if(current?.id===id)return true;
 busy=true;let floating=null,target=null;
 try{
 const origin=lamp(current?.id),rect=origin?.getBoundingClientRect();
 if(!reduced.matches&&rect?.width){floating=document.createElement('div');floating.className='journey-diya diya '+(origin.classList.contains('art-lit')||current.classList.contains('lit')?'art-lit':'');floating.innerHTML=ExhibitArt.diya();floating.setAttribute('aria-hidden','true');Object.assign(floating.style,{left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px'});document.body.appendChild(floating);}
 activate(id);target=lamp(id);
 if(floating&&target){const end=target.getBoundingClientRect();target.style.visibility='hidden';const sx=end.width/rect.width,sy=end.height/rect.height;const dx=end.left-rect.left,dy=end.top-rect.top;
 await animate(floating,[{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.5}px,${dy*.5-18}px) scale(${(1+sx)/2},${(1+sy)/2})`,offset:.5},{transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})`}],{duration:850,easing:'cubic-bezier(.22,.7,.18,1)',fill:'forwards'});
 }else if(floating){await animate(floating,[{opacity:1},{opacity:0,transform:'scale(.7)'}],{duration:350});}
 }finally{if(target)target.style.visibility='';floating?.remove();busy=false;document.dispatchEvent(new CustomEvent('journey:entered',{detail:{id}}));}
 return true;
 }
 async function ignite(source){
 if(reduced.matches){stage('ceremony').classList.add('lit');await wait(350);return;}
 const rect=lamp('ceremony').getBoundingClientRect();const x=rect.left+rect.width*.5,y=rect.top+rect.height*.52;
 const from=source||{x:x-100,y:y+130};const spark=document.createElement('div');spark.className='journey-spark';spark.setAttribute('aria-hidden','true');document.body.appendChild(spark);
 await animate(spark,[{transform:`translate(${from.x}px,${from.y}px) scale(.4)`,opacity:0},{transform:`translate(${from.x}px,${from.y}px) scale(1)`,opacity:1,offset:.08},{transform:`translate(${x+65}px,${y+45}px) scale(1)`,opacity:1,offset:.65},{transform:`translate(${x}px,${y}px) scale(.4)`,opacity:1}],{duration:1100,easing:'cubic-bezier(.3,.55,.3,1)',fill:'forwards'});
 stage('ceremony').classList.add('lit');spark.remove();await wait(1350);
 }
 function selection(id){if(reduced.matches)return;const input=document.getElementById(id),label=input?.nextElementSibling;if(!label)return;
 label.querySelector('.selection-ripple')?.remove();const ripple=document.createElement('span');ripple.className='selection-ripple';label.appendChild(ripple);setTimeout(()=>ripple.remove(),850);
 const a=label.getBoundingClientRect(),b=document.getElementById('light').getBoundingClientRect();const dot=document.createElement('span');dot.className='selection-trace';document.body.appendChild(dot);
 animate(dot,[{transform:`translate(${a.left+a.width/2}px,${a.bottom-10}px)`,opacity:0},{opacity:1,offset:.2},{transform:`translate(${b.left+b.width/2}px,${b.top+15}px)`,opacity:0}],{duration:650,easing:'cubic-bezier(.25,.5,.4,1)'}).finally(()=>dot.remove());
 }
 const fine=matchMedia('(hover:hover) and (pointer:fine)');let raf=0;
 document.getElementById('welcome').addEventListener('pointermove',e=>{if(reduced.matches||!fine.matches||raf)return;raf=requestAnimationFrame(()=>{const art=document.querySelector('.hero-art');art.style.setProperty('--parallax-x',((e.clientX/innerWidth-.5)*10)+'px');art.style.setProperty('--parallax-y',((e.clientY/innerHeight-.5)*8)+'px');raf=0;});},{passive:true});
 document.getElementById('welcome').addEventListener('pointerleave',()=>{const art=document.querySelector('.hero-art');art.style.setProperty('--parallax-x','0px');art.style.setProperty('--parallax-y','0px');});
 return {show,ignite,selection,get busy(){return busy},reduced};
})();
