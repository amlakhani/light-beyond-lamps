import { createHash, timingSafeEqual } from 'node:crypto';
export function displayAuthorized(request: Request, expected = process.env.DISPLAY_TOKEN_HASH) {
  if (!expected || !/^[a-f0-9]{64}$/.test(expected)) return false;
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '') || new URL(request.url).searchParams.get('key') || '';
  if (token.length < 32 || token.length > 256) return false;
  return timingSafeEqual(createHash('sha256').update(token).digest(), Buffer.from(expected, 'hex'));
}
export const privateHeaders = {'Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow, noarchive'};
