# Phase 1B Verification — VerifiedX-SpyglassWebApp i18n Framework

**Phase:** 1B — next-i18next framework setup (React 17 / Next 12.1.1)
**Repo:** VerifiedX-SpyglassWebApp
**Branch:** `feat/i18n-es` @ commit `5db7bf5`
**Base:** `testnet`
**Verifier:** reviewer agent
**Date:** 2026-04-17

## Verdict: **PASS**

All Phase 1B objectives are met. Dependency versions are correctly
pinned to the Next-12-compatible line, both locale JSONs exist with
matching keys, the `_app.tsx` wrapper and `serverSideTranslations` are
in place, and the single intentional POC translation
(`nav.blocks: "Bloques"`) is glossary-compliant. No findings that
block Phase 2B.

---

## Checklist

### 1. Dependency versions — Next-12 / React-17 compatible
**PASS.** Versions are exactly what this stack requires:
- `next-i18next@^13.3.0` — the final 13.x line; 14+ drops Next 12 support
- `i18next@^22.5.1` — peer range for next-i18next 13.x
- `react-i18next@^12.3.1` — peer range for next-i18next 13.x

Confirmed against the SpyglassWebApp `package.json` constraints
(`next: 12.1.1`, `react: 17.0.2`, `react-dom: 17.0.2`). If the
executor had picked `next-i18next@14+`, this would have been a FAIL.

### 2. `next.config.js` i18n block
**PASS.**
```js
const { i18n } = require('./next-i18next.config');
const nextConfig = {
  reactStrictMode: true,
  i18n,
};
```
Correctly imports from the single source of truth — avoids drift
between `next.config.js` and `next-i18next.config.js`.

### 3. `next-i18next.config.js` exists and is shaped correctly
**PASS.**
```js
module.exports = {
  i18n: { defaultLocale: 'en', locales: ['en', 'es'] },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
```
`reloadOnPrerender` guarded to dev is the recommended production
configuration — no accidental cache invalidation in prod.

### 4. `_app.tsx` wrapped with `appWithTranslation`
**PASS.**
- `import { appWithTranslation, useTranslation } from "next-i18next"`
- `import nextI18NextConfig from "../next-i18next.config"`
- `export default appWithTranslation(MyApp, nextI18NextConfig);`
- Inside `MyApp`: `const { t } = useTranslation("common");`
- Two POC call sites migrated:
  - maintenance branch: `{t("maintenance.message")}`
  - header nav: `{t("nav.blocks")}`

### 5. `pages/index.tsx` has `serverSideTranslations`
**PASS.**
```ts
export const getServerSideProps: GetServerSideProps = async ({ req, res, locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      data: { results: [] },
    },
  };
};
```
Correctly pulls `locale` from the Next request context, falls back to
`'en'`, and loads only the `common` namespace (matches the single
JSON file scaffolded).

### 6. Locale JSONs: both exist, keys match
**PASS.** Compared `public/locales/en/common.json` vs.
`public/locales/es/common.json`:
- Both files have the same 3 top-level sections: `brand`, `nav`,
  `maintenance`
- Both have identical key sets — 3 brand keys, 17 nav keys, 1
  maintenance key = 21 keys each
- No orphan or missing keys on either side

### 7. Phase 1B POC translation — `nav.blocks: "Bloques"`
**PASS, glossary-compliant.**
- Glossary entry: `Block → Bloque` (singular), so plural `Blocks →
  Bloques` follows Spanish pluralization rules (`-e` stem adds `-s`).
- Not "Cuadras", not "Bloqueos" — correctly chose the crypto/explorer
  sense of "block" (a blockchain block), matching glossary note
  "Block → Bloque".

### 8. Rest of `es/common.json` is English pass-through
**PASS.** Every other value in `es/common.json` is an exact copy of
the English source — `"transactions": "Transactions"`, `"validators":
"Validators"`, etc. This is the specified Phase 1B behaviour (POC
marker only). Phase 2B has a clean canvas.

### 9. Interpolation token preservation
**N/A this phase.** No interpolation tokens (`{var}`, `{{count}}`)
appear in this phase's strings. Phase 2B will need to validate tokens
when longer strings land — reviewer should flag any Phase 2B string
where Spanish drops, renames, or malforms a token.

### 10. Brand names untouched
**PASS.**
- `brand.spyglass: "Spyglass"` — same in both locales, correct per
  glossary.
- `brand.testnetSuffix: "TESTNET"` / `devnetSuffix: "DEVNET"` — stable
  environment labels, correctly left untouched.
- `nav.verifiedXSite: "VerifiedX.io"`, `nav.vbtc: "vBTC"`,
  `nav.btcSpyglass: "BTC Spyglass"`, `nav.x: "X"`, `nav.discord:
  "Discord"`, `nav.github: "Github"` — all brand/product names,
  correctly untranslated.

### 11. Spain-specific constructs
**N/A this phase.** Only one Spanish word exists ("Bloques") — no
"vosotros"/"tío"/etc. possible.

### 12. Length sanity
**PASS (trivially).** "Blocks" (6 chars) → "Bloques" (7 chars) — 17%
longer, well under the 50% flag threshold. No UI overflow concern.

---

## Findings

### INFO 1 — `github` casing
The key is `nav.github` but the value is `"Github"` (lowercase `h`). The
canonical brand capitalization is `GitHub`. Not in scope for Phase 1B
(this key was already in-codebase pre-i18n), but Phase 2B or a follow-up
copy pass should fix. Glossary lists brand names as immutable — the
current value violates the *correct* spelling of the brand, not the
translation rule.

### INFO 2 — Namespace strategy
The setup uses a single `common` namespace. For a small explorer UI
this is fine, but when Phase 2B lands the full string set (transaction
detail pages, search, errors), consider splitting into namespaces like
`common`, `tx`, `search`, `errors` so that `serverSideTranslations`
only loads what each page needs. Not a Phase 1B blocker — flagging for
Phase 2B planning.

### INFO 3 — `useTranslation` is only imported, header uses it
`_app.tsx` pulls in `useTranslation` and calls `t("nav.blocks")` and
`t("maintenance.message")`. That is the specified POC footprint. Phase
2B will expand the call sites broadly; no issue here.

---

## Files Reviewed
- `next.config.js` (+4 lines)
- `next-i18next.config.js` (new; 8 lines)
- `package.json` (+3 deps)
- `pages/_app.tsx` (wrapping + 2 POC call sites)
- `pages/index.tsx` (+serverSideTranslations)
- `public/locales/en/common.json` (new; 29 lines; 21 keys)
- `public/locales/es/common.json` (new; 29 lines; 21 keys; 1 real translation)

## Not Reviewed (Out of Phase 1B Scope)
- `package-lock.json` / `yarn.lock` churn (trusted)
- Build/dev-server verification (trusted per executor's report)
- Other pages (`pages/tx/[id].tsx`, `pages/block/[height].tsx`, etc.)
  have not been i18n-migrated yet — this is correct for Phase 1B
  (POC scope only).

---

## Recommendation
Proceed to Phase 2B. Treat the namespace split (INFO 2) as a Phase
2B planning decision before translating strings. The framework is
solid; Phase 2B can focus purely on translation quality.
