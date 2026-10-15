# Recovery note

The original GitHub repo was removed. This repo was rebuilt from the published npm package
`@shibainu16/bitbucket-dc-mcp@1.4.0`. The TypeScript sources were not in the package (source maps carry no
`sourcesContent`), so `build/` here is the compiled output and the only source of truth until the `.ts`
sources are restored from a local copy. `npm run build` / tests need `src/` and will not work yet.
