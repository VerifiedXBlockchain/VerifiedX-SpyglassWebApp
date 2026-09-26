# vfx-explorer-app (Spyglass)

Public VerifiedX block explorer: `spyglass.verifiedx.io`. Next 12 (pages router), React 17, TypeScript, SCSS. Data comes from the `vfx-explorer` Django API (`API_BASE_URL` in `src/constants.ts`, env-switched for mainnet/testnet/devnet). Deployed on Vercel; the `main`, `testnet` and `devnet` branches map to the three networks.

## Run

- Node 18 (`.nvmrc`): `source ~/.nvm/nvm.sh && nvm use`
- **Dev port 3170**: `npm run dev` → http://localhost:3170 (never 3000)
- `npm test` (Jest + Testing Library), `npm run typecheck`, `npm run lint`

## Conventions

- **Design system** lives in `src/styles/tokens.scss` (CSS variables) and `src/components/ui/*` (SCSS modules). Use `var(--…)` tokens, never raw hex, in new styles. Breakpoints: `@use "../../styles/breakpoints" as bp;` (`bp.$tablet` 768, `bp.$desktop` 1200), mobile-first.
- Bootstrap is legacy and being removed page by page. Do not add new Bootstrap classes.
- Internal links are raw `<a href>` wrapped with `useLocalized()` so the `/es` prefix survives; cross-page moves are full loads on purpose. Route through `navigateTo()` for programmatic navigation.
- i18n: every new string goes in **both** `public/locales/en/*.json` and `public/locales/es/*.json`; the namespace list per page is passed to `serverSideTranslations`.
- Tests sit next to components in `__tests__/`; router and translation mocks are in `src/test-utils/mocks.ts`.
