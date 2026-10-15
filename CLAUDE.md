# CLAUDE.md

Setup, env vars, tools and client config: `README.md`. Not repeated here.

## State of the repo

Rebuilt from npm `@shibainu16/bitbucket-dc-mcp@1.4.0` (see `RECOVERY.md`). No `src/`: edit `build/*.js`
directly until the TypeScript sources are restored. `npm run build`/`lint`/`typecheck` do not work yet.
Test: `node --test test/squeeze.test.mjs` (needs `npm install --omit=dev`).

## Layout

- `build/tools/*.js` — one module per tool group, auto-loaded by `build/registry/`.
- `build/lib/errors.js` — `jsonResult`/`textResult`/`formatError`: every result goes through here.
- `build/lib/squeeze.js` — token squeeze (behaviour in README "Token Squeeze").
- `build/lib/field-filter.js` — per-entity summarizers for list tools.

## Rules for tool changes

- Return via `jsonResult`/`textResult` only; never `JSON.stringify(..., null, 2)` in a tool.
- New list/entity tool: add a summarizer in `field-filter.js`; new noisy key: add to `NOISE_KEYS` in `squeeze.js`.
- Add a test for any squeeze change; keep error text one line, no stack traces.
- New env var: document it in the README table only.
