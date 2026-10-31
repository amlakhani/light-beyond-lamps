import { displayAuthorized, privateHeaders } from '../../lib/display-auth';
import display from '../../lib/display';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
 if (!displayAuthorized(request)) return new Response('This display requires its private access link.',{status:401,headers:privateHeaders});
 return new Response(display,{headers:{...privateHeaders,'Content-Type':'text/html; charset=utf-8'}});
}
