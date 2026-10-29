export const choiceIds = ['forgive','serve','family','kind','volunteer','gratitude'];
export function raleighDay(now = new Date()) {
 const parts = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const get = (key:string) => parts.find(p=>p.type===key)!.value;
 return `${get('year')}-${get('month')}-${get('day')}`;
}
