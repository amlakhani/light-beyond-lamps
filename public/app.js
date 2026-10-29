'use strict';
(() => {
const $=id=>document.getElementById(id);
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const choices=[
 {id:'forgive',label:'Forgiving someone',verb:'forgive someone',icon:'<path d="M16 27S4 20 4 12a6 6 0 0 1 12-1 6 6 0 0 1 12 1c0 8-12 15-12 15Z"/><path d="m10 17 4 4 8-8"/>'},
 {id:'serve',label:'Serving food to the needy',verb:'serve food to the needy',icon:'<path d="M3 16h26c-1 8-6 12-13 12S4 24 3 16ZM2 16h28M12 8c-4-4 4-4 0-8m8 9c-4-4 4-4 0-8M11 29h10"/>'},
 {id:'family',label:'Spending time with family',verb:'spend time with family',icon:'<circle cx="9" cy="9" r="4"/><circle cx="23" cy="9" r="4"/><circle cx="16" cy="20" r="3"/><path d="M2 27v-6c0-7 8-8 11-4m17 10v-6c0-7-8-8-11-4M11 30v-3a5 5 0 0 1 10 0v3"/>'},
 {id:'kind',label:'Speaking only kind words',verb:'speak only kind words',icon:'<path d="M5 5h22v18H14l-8 6v-6H3V7a2 2 0 0 1 2-2Z"/><path d="M16 19s-7-4-7-8c0-4 6-4 7-1 1-3 7-3 7 1 0 4-7 8-7 8Z"/>'},
 {id:'volunteer',label:'Volunteering my time',verb:'volunteer my time',icon:'<circle cx="17" cy="12" r="9"/><path d="M17 6v7h5M3 20l6 6h14l6-8M2 26l6 5h17M6 23l-3-6m6 9h9"/>'},
 {id:'gratitude',label:'Practicing daily gratitude',verb:'practice daily gratitude',icon:'<path d="M16 27C7 21 8 13 16 4c8 9 9 17 0 23Zm0 0C4 28 1 20 2 13c7 0 11 5 14 14Zm0 0c12 1 15-7 14-14-7 0-11 5-14 14ZM6 30h20"/>'}
];
const accents={forgive:'#9b5364',serve:'#ad6e2e',family:'#9a652c',kind:'#a15d58',volunteer:'#5c684b',gratitude:'#735979'};
function applyAccent(choice){const accent=accents[choice?.id]||'#995c3b';document.body.style.setProperty('--promise-accent',accent);ExhibitArt.setAccent(accent);document.querySelectorAll('.diya').forEach(el=>el.innerHTML=ExhibitArt.diya());}
let selected=null,submitted=false,saving=false,cardBlob=null,cardURL=null;
try { selected=choices.find(c=>c.id===sessionStorage.getItem('lbl-sankalp-v2'))||null; } catch {}
document.querySelectorAll('.mandala').forEach(el=>el.innerHTML=ExhibitArt.mandala());
document.querySelectorAll('.diya').forEach(el=>el.innerHTML=ExhibitArt.diya());
document.querySelectorAll('.mandala path').forEach((p,i)=>{p.setAttribute('pathLength','1');p.style.setProperty('--draw-delay',(i%24*.022)+'s');});
$('choices').innerHTML=choices.map(c=>`<div class="choice"><input type="radio" id="${c.id}" name="sankalp" value="${c.id}" ${selected?.id===c.id?'checked':''}><label for="${c.id}"><span class="choice-icon" aria-hidden="true"><svg viewBox="0 0 32 34">${c.icon}</svg></span><span class="choice-name">${c.label}</span><span class="check" aria-hidden="true">✓</span></label></div>`).join('');
$('light').disabled=!selected;applyAccent(selected);
$('choices').addEventListener('change',e=>{selected=choices.find(c=>c.id===e.target.value);if(!selected)return;applyAccent(selected);try{sessionStorage.setItem('lbl-sankalp-v2',selected.id);}catch{}$('light').disabled=false;$('selection-hint').textContent='Your Sankalp is ready to become light.';LightJourney.selection(selected.id);});
const show=id=>LightJourney.show(id);
$('begin').addEventListener('click',()=>show('reflection'));
$('light').addEventListener('click',async()=>{if(!selected||submitted||LightJourney.busy)return;submitted=true;document.dispatchEvent(new CustomEvent('sankalp:submitted',{detail:{choice:selected.id}}));const rect=$('light').getBoundingClientRect();const source={x:rect.left+rect.width/2,y:Math.min(innerHeight-20,rect.top+rect.height/2)};$('light').disabled=true;$('commitment-choice').textContent=selected.label.toLowerCase()+'.';$('souvenir-choice').textContent=selected.verb;prepareCard().catch(()=>{});await show('ceremony');await LightJourney.ignite(source);$('ceremony-status').textContent='Your light is shining.';await show('commitment');});
$('join').addEventListener('click',async()=>{if(LightJourney.busy)return;if(!$('community-lights').children.length){for(let r=0;r<5;r++){let count=7+r*2;for(let col=0;col<count;col++){const el=document.createElement('div');el.className='little-diya art-lit';const x=6+col/(count-1)*88,y=17+r*17+Math.cos(col/(count-1)*Math.PI*2)*3;const delay=.35+Math.hypot(x-50,(y-50)*.6)*.025;el.style.cssText=`left:${x}%;top:${y}%;width:${14+r*8}px;--depth-blur:${r<2?(1-r*.55).toFixed(2):0}px;--depth-opacity:${.48+r*.12};--delay:${motion.matches?0:delay.toFixed(2)}s`;el.innerHTML=ExhibitArt.diya({mini:true});$('community-lights').appendChild(el);}}}await show('community');$('community').classList.add('joined');});
$('keepsake').addEventListener('click',()=>show('souvenir'));
for(let i=0;i<14;i++){const p=document.createElement('span');p.className='particle';p.style.cssText=`left:${(i*37+11)%100}%;top:${(i*19+24)%100}%;animation-delay:${-i*.9}s;animation-duration:${10+i%5}s`;$('particles').appendChild(p);}
function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Image unavailable'));img.src=src;});}
const logoPromise=loadImage('baps-logo.png');logoPromise.catch(()=>{});
function escapeXML(s){return s.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));}
function svgData(svg){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
function lineWrap(ctx,txt,maxWidth){const lines=[];let line='';for(const word of txt.split(' ')){const next=line?line+' '+word:word;if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;}
let cardPromise=null;
function prepareCard(){if(cardPromise)return cardPromise;cardPromise=renderCard().catch(e=>{cardPromise=null;throw e;});return cardPromise;}
async function renderCard(){
if(!selected)throw new Error('Please choose a Sankalp first.');
const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Image export unavailable.');
const logo=await logoPromise;if(document.fonts){await Promise.race([Promise.all([document.fonts.load('40px "Exhibit Serif"'),document.fonts.load('italic 48px "Exhibit Serif"')]),new Promise(resolve=>setTimeout(resolve,2000))]);}const bg=ctx.createLinearGradient(0,0,0,1350);bg.addColorStop(0,'#fffaf0');bg.addColorStop(1,'#f4e7cf');ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);
ctx.strokeStyle=accents[selected.id];ctx.lineWidth=2;ctx.strokeRect(35,35,1010,1280);ctx.lineWidth=1;ctx.strokeStyle='#ccb185';ctx.strokeRect(52,52,976,1246);
const mandala=await loadImage(svgData(ExhibitArt.mandala().replace('aria-hidden="true"','style="color:#b48c50"')));ctx.globalAlpha=.22;ctx.drawImage(mandala,-185,-185,450,450);ctx.drawImage(mandala,815,1085,450,450);ctx.drawImage(mandala,245,600,590,590);ctx.globalAlpha=1;
const scale=Math.min(165/logo.width,170/logo.height);ctx.globalCompositeOperation='multiply';ctx.drawImage(logo,540-logo.width*scale/2,82,logo.width*scale,logo.height*scale);ctx.globalCompositeOperation='source-over';
ctx.textAlign='center';ctx.fillStyle='#52172c';ctx.font='27px "Exhibit Serif", Georgia';ctx.fillText('LIGHT BEYOND LAMPS',540,301);
ctx.strokeStyle='#b88e50';ctx.beginPath();ctx.moveTo(427,337);ctx.lineTo(517,337);ctx.moveTo(563,337);ctx.lineTo(653,337);ctx.stroke();ctx.fillStyle='#a77530';ctx.beginPath();ctx.moveTo(540,327);ctx.lineTo(544,334);ctx.lineTo(551,337);ctx.lineTo(544,340);ctx.lineTo(540,347);ctx.lineTo(536,340);ctx.lineTo(529,337);ctx.lineTo(536,334);ctx.closePath();ctx.stroke();
ctx.font='22px Arial';ctx.fillStyle='#8a5a28';ctx.fillText('M Y   D I W A L I   S A N K A L P',540,397);
ctx.font='40px "Exhibit Serif", Georgia';ctx.fillStyle='#52172c';ctx.fillText('This Diwali, I choose to',540,474);
ctx.font='italic 48px "Exhibit Serif", Georgia';ctx.fillStyle=accents[selected.id];const lines=lineWrap(ctx,selected.verb+'.',830);lines.forEach((line,i)=>ctx.fillText(line,540,536+i*59));
const artwork=ExhibitArt.diya().replaceAll('class="flame-group"','opacity="1"');const lamp=await loadImage(svgData(artwork));ctx.drawImage(lamp,250,618,580,464);
ctx.fillStyle='#52172c';ctx.font='43px "Exhibit Serif", Georgia';ctx.fillText('A small Sankalp.',540,1110);ctx.fillText('A brighter tomorrow.',540,1168);
ctx.fillStyle='#8b6638';ctx.font='19px Arial';ctx.fillText('BRIGHTER PEOPLE · BRIGHTER COMMUNITIES',540,1245);
cardBlob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Unable to generate image.')),'image/png'));return cardBlob;
}
$('save').addEventListener('click',async()=>{if(saving||!selected)return;saving=true;$('save').disabled=true;$('save-status').textContent='Preparing your keepsake…';try{const blob=cardBlob||await prepareCard();if(cardURL)URL.revokeObjectURL(cardURL);cardURL=URL.createObjectURL(blob);const a=document.createElement('a');a.href=cardURL;a.download='my-diwali-sankalp.png';document.body.appendChild(a);a.click();a.remove();$('save-status').textContent='Your card is ready. Check Downloads, or touch and hold the image below to save.';$('save-fallback').src=cardURL;$('save-fallback').hidden=false;$('save').classList.add('saved');$('save').innerHTML='<span aria-hidden="true">✓</span> DIYA READY TO SAVE';}catch(e){$('save-status').textContent='Your card could not be saved. Please tap Save My Diya to try again.';}finally{saving=false;$('save').disabled=false;}});
window.addEventListener('pagehide',()=>{if(cardURL)URL.revokeObjectURL(cardURL);});
})();

// Anonymous, shared Raleigh-day totals and desktop-only diya pointer.
(() => {
const $=id=>document.getElementById(id);
const names={forgive:'Forgiving someone',serve:'Serving food to the needy',family:'Spending time with family',kind:'Speaking only kind words',volunteer:'Volunteering my time',gratitude:'Practicing daily gratitude'};
let choice=null,token=null,counted=false,inflight=null,recordedChoice=null;
function dailyToken(){const day=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());const key='lbl-count-'+day;let saved;try{saved=localStorage.getItem(key)}catch{}if(!saved||!/^[0-9a-f-]{36}$/i.test(saved)){saved=crypto.randomUUID();try{localStorage.setItem(key,saved)}catch{}}return saved;}
async function requestCounts(){
 const response=await fetch('/api/sankalps',choice&&!counted?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({choice,token}),signal:AbortSignal.timeout(12000)}:{cache:'no-store',signal:AbortSignal.timeout(12000)});
 if(!response.ok)throw new Error('Counter unavailable');const data=await response.json();if(data.recordedChoice){counted=true;recordedChoice=data.recordedChoice;}render(data);if(!$('totals').hidden)startRaleighRedirect();return data;
}
function update(){if(inflight)return inflight;inflight=requestCounts().catch(()=>{$('count-status').textContent=choice&&!counted?'Your diya is lit. The shared count could not be updated yet; tap below to retry.':'Today’s shared totals are temporarily unavailable. Please try again.';$('retry-count').hidden=false;}).finally(()=>{inflight=null});return inflight;}
function render(data){$('total-count').textContent=data.total.toLocaleString();$('totals-date').textContent=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',month:'long',day:'numeric',year:'numeric'}).format(new Date(data.day+'T12:00:00-04:00'))+' · Raleigh';$('count-status').textContent=recordedChoice&&recordedChoice!==choice?'Your earlier Sankalp today is already included.':counted?'Your Sankalp is part of today’s light.':'Every promise is a little more light.';$('retry-count').hidden=true;$('totals-list').replaceChildren();for(const [id,label] of Object.entries(names)){const row=document.createElement('div');row.className='total-row'+(id===choice?' my-choice':'');const fill=data.total?Math.round(data.counts[id]/data.total*100)+'%':'0%';row.style.setProperty('--fill','0%');requestAnimationFrame(()=>requestAnimationFrame(()=>row.style.setProperty('--fill',fill)));const icon=document.createElement('span');icon.className='total-lamp art-lit';icon.setAttribute('aria-hidden','true');icon.innerHTML=ExhibitArt.diya({mini:true});row.appendChild(icon);row.style.setProperty('--row-delay',Object.keys(names).indexOf(id)*80+'ms');const name=document.createElement('span');name.className='total-label';name.textContent=label;if(id===choice){const own=document.createElement('span');own.className='your-choice';own.textContent='YOUR SANKALP';name.appendChild(own);}const n=document.createElement('strong');n.textContent=data.counts[id].toLocaleString();row.append(name,n);$('totals-list').appendChild(row);}}
document.addEventListener('sankalp:submitted',event=>{if(choice)return;choice=event.detail.choice;token=dailyToken();update();});
let redirectStarted=false;
function startRaleighRedirect(){
 if(redirectStarted)return;
 redirectStarted=true;document.querySelector('.redirect-notice').hidden=false;
 const deadline=Date.now()+15000;
 const ticker=setInterval(()=>{$('redirect-seconds').textContent=String(Math.max(0,Math.ceil((deadline-Date.now())/1000)));},250);
 setTimeout(()=>{clearInterval(ticker);$('redirect-seconds').textContent='0';window.location.assign('https://www.baps.org/raleigh');},15000);
}
$('view-totals').addEventListener('click',async()=>{if(LightJourney.busy)return;await LightJourney.show('totals');await update();});
$('retry-count').addEventListener('click',()=>{ $('count-status').textContent='Gathering today’s lights…';update();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!$('totals').hidden)update();});
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const cursor=document.createElement('div');cursor.className='diya-cursor';cursor.setAttribute('aria-hidden','true');cursor.innerHTML='<div class="diya art-lit">'+ExhibitArt.diya()+'</div>';document.body.appendChild(cursor);
document.addEventListener('pointermove',e=>{if(!fine.matches||e.pointerType==='touch')return;cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';document.body.classList.add('diya-pointer');},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>document.body.classList.remove('diya-pointer'));
document.addEventListener('keydown',()=>document.body.classList.remove('diya-pointer'));fine.addEventListener('change',()=>document.body.classList.remove('diya-pointer'));
})();
