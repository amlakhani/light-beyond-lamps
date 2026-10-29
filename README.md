# Light Beyond Lamps — Vercel edition

A separate Next.js copy of the BAPS Diwali exhibition experience. Based on the saved Sites source commit `bd99210f949d5eb256983c3f26e632bb829fc349`.

The original HTML, CSS, JavaScript, BAPS logo, supplied Akshardham PNG, fonts, animations and souvenir export are preserved. This project does not modify the existing Sites deployment.

## Stack

- Next.js App Router running on Vercel's Node.js runtime
- Neon PostgreSQL for shared daily Sankalp totals
- Existing lightweight frontend; no accounts or visitor email collection
- Node.js 24; npm; committed package-lock.json

## Deploy

1. Create a private GitHub repository named `light-beyond-lamps`. Upload the contents of this directory (package.json must be at the repository root).
2. In Vercel's **baps** team, import that repository. Framework: **Next.js**. Build: `npm run build`. Install: `npm ci`. Leave output directory at its framework default.
3. Add a Neon Postgres database through Vercel Marketplace and connect it to the project. Prefer a US East region near the `iad1` Functions region. Use a separate database/branch for previews so testing does not affect exhibition totals.
4. Confirm `DATABASE_URL` is supplied for the intended environment. Do not put its value in GitHub, chat or client-side variables.
5. Before testing counts, run `db/schema.sql` in the connected database's SQL editor. Alternatively, after linking the Vercel CLI and pulling that environment's variables, run `npm run db:migrate`. This creates the table without deleting existing data. It is deliberately not run during builds.
6. Redeploy after configuring environment variables. Test all six promises, duplicate counting, saving the souvenir on iPhone/Android, and the final 15-second redirect.
7. Use the stable production URL or a custom domain for the printed QR code. Branch preview URLs should not be printed.

The site can build before a database is connected. The counts endpoint returns HTTP 503 until DATABASE_URL and the schema are configured; it never substitutes fake or browser-local totals. Production database connectivity and phone saving must be verified after deployment.

## Local commands

```sh
npm ci
npm test
npm run build
```

For local database work, first link the correct Vercel team/project and pull development variables:

```sh
vercel link
vercel env pull .env.local
npm run db:migrate
npm run dev
```

Use a development database. Never commit `.env.local` or `.vercel`.

## Counting behavior

Six fixed choices; all totals use America/New_York calendar days. A unique `(day, token)` database key prevents repeat submissions from incrementing counts. A visitor can submit again on a new day. Midnight requires no cron job: queries select the current day and historical rows remain intact.

The token is a random browser identifier, not an account or a verified person. Separate browsers, private browsing and cleared storage can produce additional counts, matching the original experience. Requests validate the choice, UUID, origin, content type and body size.

## Existing data

This copy does not contain historical records from the Sites/Cloudflare D1 database. The original data remains there. To preserve history, export the `day`, `token`, and `choice` records with authorized database access, validate the tokens as UUIDs, and import them into Postgres before switching visitors. No old data has been deleted or migrated automatically.

## Future edits

Use GitHub as the source of truth for this Vercel edition. Push edits to a branch, check the Vercel preview, then merge into `main` to publish. Edits to the old ChatGPT Sites project will not automatically synchronize to this repository. Keep preview database credentials separate from production.

## Verification

`npm test` exercises the actual PostgreSQL schema and store SQL using embedded PGlite, including six choices, concurrent duplicate requests, day rollover, repeat schema setup, invalid requests, and unavailable-database responses. It is not a live Neon connectivity test.
