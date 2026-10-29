import { getStore } from '../../../lib/db';
import { createHandlers } from '../../../lib/handlers';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 15;
const handlers = createHandlers(getStore);
export const GET = handlers.GET;
export const POST = handlers.POST;
