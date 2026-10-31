import { displayAuthorized, privateHeaders } from '../../../lib/display-auth';
import { getStore } from '../../../lib/db';
import { raleighDay } from '../../../lib/day';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
 if (!displayAuthorized(request)) return Response.json({error:'Display access required.'},{status:401,headers:privateHeaders});
 try { return Response.json(await getStore().summary(raleighDay()),{headers:privateHeaders}); }
 catch { return Response.json({error:'Connection interrupted.'},{status:503,headers:privateHeaders}); }
}
