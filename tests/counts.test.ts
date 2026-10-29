import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { createStore } from '../lib/store';
import { createHandlers } from '../lib/handlers';
import { raleighDay, choiceIds } from '../lib/day';

test('Raleigh calendar boundaries including daylight saving changes', () => {
  for (const [instant, expected] of [
    ['2026-10-10T03:59:59Z','2026-10-09'], ['2026-10-10T04:00:00Z','2026-10-10'],
    ['2026-12-10T04:59:59Z','2026-12-09'], ['2026-12-10T05:00:00Z','2026-12-10'],
    ['2026-03-08T07:00:00Z','2026-03-08'], ['2026-11-01T06:00:00Z','2026-11-01']
  ]) assert.equal(raleighDay(new Date(instant)), expected);
});

test('Postgres schema, six choices, retries, validation and daily isolation', async () => {
  const db = new PGlite();
  try {
    const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
    await db.exec(schema);
    const store = createStore(async (text, params) => (await db.query<Record<string, unknown>>(text, params)).rows);
    let instant = new Date('2026-10-29T16:00:00Z');
    const handlers = createHandlers(() => store, () => instant);
    const request = (body: string, headers: Record<string,string> = {}) => new Request('https://exhibit.example/api/sankalps', {
      method: 'POST', headers: {'content-type':'application/json', origin:'https://exhibit.example', ...headers}, body
    });
    const post = (choice: string, token = randomUUID()) => handlers.POST(request(JSON.stringify({choice, token})));
    assert.equal((await (await handlers.GET()).json()).total, 0);
    for (const choice of choiceIds) assert.equal((await post(choice)).status, 200);
    const token = randomUUID();
    await Promise.all(Array.from({ length: 20 }, () => post('family', token)));
    const duplicate = await (await post('kind', token)).json();
    assert.equal(duplicate.total, 7);
    assert.equal(duplicate.recordedChoice, 'family');
    assert.equal(duplicate.counts.family, 2);
    await db.exec(schema); // A repeat setup must preserve existing counts.
    assert.equal((await store.summary('2026-10-29')).total, 7);
    assert.equal((await post('bad')).status, 400);
    assert.equal((await post('family', 'zzzzzzzz-zzzz-4zzz-8zzz-zzzzzzzzzzzz')).status, 400);
    assert.equal((await handlers.POST(request('{'))).status, 400);
    assert.equal((await handlers.POST(request('null'))).status, 400);
    assert.equal((await handlers.POST(request('x'.repeat(1025)))).status, 413);
    assert.equal((await handlers.POST(request('{}', {'content-type':'text/plain'}))).status, 415);
    assert.equal((await handlers.POST(request('{}', {origin:'https://other.example'}))).status, 403);
    instant = new Date('2026-10-30T04:00:00Z');
    assert.equal((await (await handlers.GET()).json()).total, 0);
    assert.equal((await (await post('kind', token)).json()).total, 1);
    assert.equal((await store.summary('2026-10-29')).total, 7);
  } finally { await db.close(); }
});

test('Unavailable database returns honest errors, never fabricated counts', async () => {
  const handlers = createHandlers(() => { throw new Error('not configured'); });
  const response = await handlers.GET();
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await response.json()).total, undefined);
});
