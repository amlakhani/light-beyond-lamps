import exhibit from '../lib/exhibit';
export function GET(){return new Response(exhibit,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}});}
