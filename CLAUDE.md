# CLAUDE.md

Setup, env vars, tools and client config: `README.md`. Not repeated here.

## Commands

`npm run build` (tsc → `build/`) | `npm test` (vitest) | `npm run typecheck`. Edit `src/*.ts`, never `build/`.
History: sources were recovered from the npm package, see `RECOVERY.md`.

## Layout

- `src/tools/*.ts` — one module per tool group, auto-loaded by `src/registry/`.
- `src/lib/errors.ts` — `jsonResult`/`textResult`/`formatError`: every result goes through here.
- `src/lib/squeeze.ts` — token squeeze (behaviour in README "Token Squeeze").
- `src/lib/field-filter.ts` — per-entity summarizers for list tools.

## Rules for tool changes

- Return via `jsonResult`/`textResult` only; never `JSON.stringify(..., null, 2)` in a tool.
- New list/entity tool: add a summarizer in `field-filter.js`; new noisy key: add to `NOISE_KEYS` in `squeeze.js`.
- Add a vitest test (`src/**/*.test.ts`) for any squeeze change; keep error text one line, no stack traces.
- New env var: document it in the README table only.
