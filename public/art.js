'use strict';
window.ExhibitArt = (() => {
let serial=0;
function mandala(){let petals='';for(let i=0;i<24;i++){petals+=`<g transform="rotate(${i*15} 300 300)"><path d="M300 94Q267 48 300 10Q333 48 300 94Z"/><path d="M300 110Q245 83 250 35Q289 46 300 110Z"/><path d="M300 113L300 185"/><circle cx="300" cy="102" r="2" fill="currentColor"/></g>`;}for(let i=0;i<12;i++)petals+=`<path transform="rotate(${i*30} 300 300)" d="M300 216Q259 176 300 134Q341 176 300 216Z"/>`;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none" stroke="currentColor" stroke-width=".8" aria-hidden="true">${petals}<circle cx="300" cy="300" r="210"/><circle cx="300" cy="300" r="204"/><circle cx="300" cy="300" r="118"/><circle cx="300" cy="300" r="114"/><circle cx="300" cy="300" r="287" stroke-dasharray="1 9" stroke-linecap="round"/></svg>`;}
let accent='#995c3b';
function setAccent(color){if(/^#[0-9a-f]{6}$/i.test(color))accent=color;}
function diya({mini=false}={}){
 const id='j'+serial++;
 let engraving='';
 if(!mini)for(let i=0;i<17;i++){
  const x=86+i*13.4,y=214+Math.sin(i/16*Math.PI)*25;
  engraving+=`<g transform="translate(${x} ${y})"><path d="M0 0Q7 13 13 0M3 2Q7 8 10 2"/><path d="M6.5 8q-5 5 0 9q5-4 0-9Z"/><circle cx="6.5" cy="20" r="1" fill="#dfb971" stroke="none"/></g>`;
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" aria-hidden="true">
 <defs>
 <linearGradient id="${id}clay" x1="0%" y1="0%" x2="20%" y2="100%"><stop offset="0%" stop-color="#d69458"/><stop offset="24%" stop-color="#ab592f"/><stop offset="58%" stop-color="#77332a"/><stop offset="100%" stop-color="#321121"/></linearGradient>
 <linearGradient id="${id}metal" x1="0%" y1="10%" x2="100%" y2="75%"><stop offset="0%" stop-color="#8b582e"/><stop offset="20%" stop-color="#efd392"/><stop offset="42%" stop-color="#b48140"/><stop offset="65%" stop-color="#f5dc9e"/><stop offset="86%" stop-color="#a16e34"/><stop offset="100%" stop-color="#d1a360"/></linearGradient>
 <linearGradient id="${id}oil" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#46261b"/><stop offset="45%" stop-color="#845022"/><stop offset="80%" stop-color="#a5712d"/><stop offset="100%" stop-color="#b98739"/></linearGradient>
 <radialGradient id="${id}glow"><stop offset="0%" stop-color="#ffe5a7" stop-opacity=".56"/><stop offset="38%" stop-color="#ffd56b" stop-opacity=".13"/><stop offset="100%" stop-color="#ffd56b" stop-opacity="0"/></radialGradient>
 <linearGradient id="${id}flame" x1="20%" y1="100%" x2="60%" y2="0%"><stop offset="0%" stop-color="#d87822"/><stop offset="30%" stop-color="#ffb72e"/><stop offset="70%" stop-color="#ffe999"/><stop offset="100%" stop-color="#fffae1"/></linearGradient>
 <linearGradient id="${id}reflect" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe9ad" stop-opacity=".75"/><stop offset="100%" stop-color="#ffdb78" stop-opacity="0"/></linearGradient>
 </defs>
 <ellipse cx="200" cy="281" rx="135" ry="16" fill="#28111a" opacity=".04"/><ellipse cx="200" cy="279" rx="110" ry="10" fill="#28111a" opacity=".06"/><ellipse cx="200" cy="277" rx="75" ry="5" fill="#28111a" opacity=".08"/>
 <g class="flame-group"><circle cx="201" cy="138" r="111" fill="url(#${id}glow)"/></g>
 <path d="M69 191C78 236 125 269 194 272C266 275 321 239 334 190Z" fill="url(#${id}clay)" stroke="#9b663b" stroke-width=".6"/>
 <path d="M82 211Q198 303 321 209" fill="none" stroke="#e0ab61" stroke-width="1" opacity=".6"/>
 <path d="M94 227Q202 298 308 226" fill="none" stroke="#381822" stroke-width="1.5" opacity=".65"/>
 <g stroke="#edc782" stroke-width=".7" fill="none" opacity=".76">${engraving}</g>
 <path d="M161 265Q200 276 239 265" fill="none" stroke="#cf9854" stroke-width="2" opacity=".8"/>
 <path d="M64 191a136 37 0 1 0 272 0a136 37 0 1 0 -272 0" fill="url(#${id}metal)"/>
 <ellipse cx="200" cy="188" rx="127" ry="29" fill="#56301f"/>
 <path d="M78 187a122 25 0 1 0 244 0a122 25 0 1 0 -244 0" fill="url(#${id}oil)"/>
 <path d="M78 190Q200 239 326 191M92 207Q200 243 309 207" fill="none" stroke="#ffdf9c" stroke-width="1" opacity=".8"/>
 <path d="M82 179Q184 143 306 177" fill="none" stroke="#f6d6a1" stroke-width="1.2" opacity=".45"/>
 ${!mini?`<path d="M89 174Q190 149 292 172" fill="none" stroke="#452520" stroke-width=".75"/><g fill="#ffe6b0" opacity=".65">${Array.from({length:25},(_,i)=>`<circle cx="${84+i*9.65}" cy="${194+Math.sin(i/24*Math.PI)*28}" r=".8"/>`).join('')}</g><path d="M195 232q5-5 10 0v12q-5 5-10 0Z" fill="${accent}" stroke="#e9c783" stroke-width=".8"/><circle cx="200" cy="238" r="1.2" fill="#ffe6b5"/>`:''}
 <g class="flame-group"><path d="M186 189a16 7 0 1 0 32 0a16 7 0 1 0 -32 0" fill="url(#${id}reflect)"/><path d="M200 174Q185 194 202 207Q216 194 200 174Z" fill="url(#${id}reflect)" opacity=".55"/></g>
 <path d="M200 190Q195 179 201 165" fill="none" stroke="#4a3021" stroke-width="4.6" stroke-linecap="round"/><path d="M199 184Q197 177 201 166" fill="none" stroke="#ead4a0" stroke-width="2.6" stroke-linecap="round"/>
 <g class="flame-group"><g class="flame-core"><path d="M201 170C179 163 181 145 190 124C198 105 212 91 205 66C229 96 221 120 220 132C219 150 214 164 201 170Z" fill="url(#${id}flame)"/><path d="M201 168C187 157 196 142 204 123C210 142 216 157 201 168Z" fill="#fff2bb"/><path d="M201 167Q196 155 204 145Q209 159 201 167" fill="#fffdf0"/><path d="M199 170Q199 166 202 163" stroke="#c1d7e1" stroke-width="1.5" fill="none" opacity=".8"/></g></g>
 </svg>`;
}
return {mandala,diya,setAccent};
})();
