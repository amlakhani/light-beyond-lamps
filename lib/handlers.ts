import { choiceIds, raleighDay } from './day';
import type { SankalpStore } from './store';
const reply = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export function createHandlers(store: () => SankalpStore, now = () => new Date()) {
  return {
    async GET() {
      try { return reply(await store().summary(raleighDay(now()))); }
      catch { return reply({ error: 'Today’s lights are temporarily unavailable.' }, 503); }
    },
    async POST(request: Request) {
      const origin = request.headers.get('origin');
      if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ error: 'Invalid origin.' }, 403);
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply({ error: 'JSON required.' }, 415);
      try {
        // Bound the actual stream, not just the untrusted Content-Length header.
        const reader = request.body?.getReader();
        const chunks: Uint8Array[] = [];
        let size = 0;
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > 1024) { await reader.cancel(); return reply({ error: 'Request too large.' }, 413); }
            chunks.push(value);
          }
        }
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
        let body;
        try { body = JSON.parse(new TextDecoder().decode(bytes)); }
        catch { return reply({ error: 'Invalid JSON.' }, 400); }
        if (!body || !choiceIds.includes(body.choice) || typeof body.token !== 'string' || !UUID.test(body.token)) return reply({ error: 'Invalid Sankalp.' }, 400);
        const db = store();
        const day = raleighDay(now());
        const recordedChoice = await db.record(day, body.token, body.choice);
        return reply({ ...await db.summary(day), recordedChoice });
      } catch { return reply({ error: 'Your light could not be counted yet. Please try again.' }, 503); }
    }
  };
}
