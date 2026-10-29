import { choiceIds } from './day';
export type Query = (text: string, params: unknown[]) => Promise<Record<string, unknown>[]>;
export function createStore(query: Query) {
  return {
    async summary(day: string) {
      const rows = await query('SELECT choice, COUNT(*) AS total FROM sankalps WHERE day = $1 GROUP BY choice', [day]);
      const counts: Record<string, number> = Object.fromEntries(choiceIds.map(id => [id, 0]));
      for (const row of rows) if (choiceIds.includes(String(row.choice))) counts[String(row.choice)] = Number(row.total);
      return { day, timeZone: 'America/New_York', counts, total: Object.values(counts).reduce((a, b) => a + b, 0) };
    },
    async record(day: string, token: string, choice: string) {
      await query('INSERT INTO sankalps (day, token, choice) VALUES ($1, $2, $3) ON CONFLICT (day, token) DO NOTHING', [day, token, choice]);
      const rows = await query('SELECT choice FROM sankalps WHERE day = $1 AND token = $2', [day, token]);
      return String(rows[0].choice);
    }
  };
}
export type SankalpStore = ReturnType<typeof createStore>;
