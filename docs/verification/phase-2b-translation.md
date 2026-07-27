# Phase 2B Verification — VerifiedX-SpyglassWebApp Spanish Translation

**Phase:** 2B — Spanish translation across 11 namespaces (308 keys)
**Repo:** VerifiedX-SpyglassWebApp
**Branch:** `feat/i18n-es` @ commit `a2686f5`
**Base:** `72c35e5` (previous Phase 1B review commit)
**Verifier:** reviewer agent
**Date:** 2026-04-17

## Verdict: **PASS**

Every objective is met. All 11 namespaces have **exactly matching key
sets** (308/308 keys on both sides, 0 missing, 0 extra, 0 token
mismatches). Every migrated page loads its required namespaces via
`serverSideTranslations`. Core glossary terms are consistently
applied (Block→Bloque, Transaction→Transacción, Fee→Comisión,
Address→Dirección, Amount→Monto, Wallet→Billetera where needed,
Validator→Validador, Search→Buscar). No Spain-specific constructs,
no "usted", no missing diacritics. Only non-blocker is the
pre-existing `nav.github` casing bug carried unchanged from 1B.

---

## Checklist

### 1. Key completeness across 11 namespaces
**PASS.** Structural flat-diff per namespace:

| Namespace | en keys | es keys | Missing in es | Extra in es |
|-----------|---------|---------|---------------|-------------|
| block | 58 | 58 | 0 | 0 |
| common | 53 | 53 | 0 | 0 |
| domains | 7 | 7 | 0 | 0 |
| faucet | 30 | 30 | 0 | 0 |
| fungibleToken | 20 | 20 | 0 | 0 |
| metrics | 17 | 17 | 0 | 0 |
| nft | 25 | 25 | 0 | 0 |
| search | 24 | 24 | 0 | 0 |
| transaction | 39 | 39 | 0 | 0 |
| validator | 21 | 21 | 0 | 0 |
| vbtcToken | 14 | 14 | 0 | 0 |
| **TOTAL** | **308** | **308** | **0** | **0** |

### 2. Interpolation tokens preserved byte-for-byte
**PASS.** All 26 keys containing `{{var}}` i18next tokens have
identical token sets on both sides. Sample:
- `block.detail.pageTitle`: `{{height}}` preserved in `"Bloque {{height}}"`
- `block.row.txsCount_{one,other}`: `{{count}}` preserved in both plural forms
- `faucet.info.{available,min,max,sender,hash}`: `{{amount}}`, `{{address}}`, `{{hash}}` preserved
- `nft.card.minted`: `{{date}}` preserved in `"Emitido: {{date}}"`
- `search.page.{balance,lockedBalance,totalBalance,totalTransactions,totalBlocks,vfxDomain}`: `{{amount}}`, `{{count}}`, `{{domain}}` all preserved
- `validator.list.totalActive`: `{{count}}` preserved

**Special note on i18next plural keys:** `block.row.txsCount_one` /
`_other` both present in en and es with `{{count}}` on each side.
Spanish only requires `one/other` (same as English) so suffix-based
plural routing works without adjustment. ✓

### 3. Page-level `serverSideTranslations` coverage
**PASS.** All 20 pages that call `t()` load their namespaces in
`getServerSideProps`:

| Page | Namespaces loaded |
|------|-------------------|
| `pages/_app.tsx` | (uses `common` via page props — correct pattern) |
| `pages/index.tsx` | `common, search` |
| `pages/addresses/top-holders/index.tsx` | `common, search` |
| `pages/block/[id]/index.tsx` | `common, block, transaction, search` |
| `pages/block/index.tsx` | `common, block, search` |
| `pages/domains/index.tsx` | `common, domains, search` |
| `pages/faucet/index.tsx` | `common, faucet, search` |
| `pages/fungible-token/[id]/index.tsx` | `common, fungibleToken, search` |
| `pages/fungible-token/index.tsx` | `common, fungibleToken, search` |
| `pages/map/index.tsx` | `common, search` |
| `pages/metrics/index.tsx` | `common, metrics, search` |
| `pages/nfts/[id]/index.tsx` | `common, nft, transaction, search` |
| `pages/nfts/index.tsx` | `common, nft, search` |
| `pages/search/index.tsx` | `common, search` |
| `pages/transaction/[hash]/index.tsx` | `common, transaction, search` |
| `pages/transaction/index.tsx` | `common, transaction, search` |
| `pages/validators/[address]/index.tsx` | `common, validator, block, search` |
| `pages/validators/index.tsx` | `common, validator, search` |
| `pages/validators/search/index.tsx` | `common, validator, search` |
| `pages/vbtc-token/[id]/index.tsx` | `common, vbtcToken, search` |
| `pages/vbtc-token/index.tsx` | `common, vbtcToken, search` |

Every page includes `common` (for the always-present `_app.tsx`
wrapper + navigation) and `search` (for the search widget that also
lives in the common layout). Detail pages correctly include their
feature namespace plus any cross-referenced namespace (e.g.
`validators/[address]` includes `block` because it renders the
validator's crafted-blocks list).

### 4. Glossary compliance — core terms
**PASS.** Programmatic verification per file:
- **Block → Bloque**: 7 uses in `block.json` + many cross-file; **0
  "Cuadra" / "Bloqueo"** (would be a hard FAIL).
- **Transaction → Transacción**: 22 uses total across namespaces
  (block/4, common/1, domains/1, faucet/1, metrics/1, nft/3, search/2,
  transaction/7, vbtcToken in card text); **0 "Transaccion" without
  accent**.
- **Fee → Comisión**: 7 uses (block/3, common/1, metrics/1, transaction/2);
  **0 "Tarifa", 0 "Comision" without accent**.
- **Address → Dirección**: consistent across all files; proper acute.
- **Amount → Monto**: `transaction.card.amount: "Monto:"`,
  `transaction.detail.fields.amount: "Monto"`, `faucet` references all
  use `Monto`. Glossary-compliant.
- **Wallet → Billetera**: not heavily used in this explorer context
  (it's a block explorer, not a wallet UI); zero occurrences of
  "Cartera". Where wallet appears conceptually
  (common.nav, search card), English "Wallet" is not shown either —
  clean.
- **Validator → Validador / Validadores**: consistent throughout
  `validator.json`.
- **Search → Buscar** (verb/action), **Buscador**/**Resultados** for
  nouns: glossary-aligned.
- **From → De / To → Para**: used as labels
  (`transaction.card.from: "De:"`, `transaction.card.to: "Para:"`) —
  glossary-compliant.
- **Signature → Firma**: `transaction.detail.fields.signature: "Firma"` —
  ✓.

### 5. Glossary compliance — newly promoted Phase 2A terms
**PASS (with usage notes).**
- **Mint → Emitir / Emitido / Emisor / Emitible**: 8 occurrences
  (nft.card.minted: "Emitido", nft.card.mintTx: "Tx de emisión",
  NFT detail minterAddress: "Dirección del emisor", etc.).
  Consistent with Phase 2A's `vbtc_mint: "Emitir vBTC"` — the
  2-repo threshold is now clearly met.
- **Mainnet** (kept English): 3 occurrences — untouched as
  industry term. ✓
- **Ecosistema**: 2 occurrences (faucet.returnCoinsDevnet/Testnet
  body copy). ✓
- **Rendimiento / Colateralización / Autocustodial / Autocustodia**:
  not used in Spyglass 2B (these are marketing/product-product
  concepts, not explorer-surface terms). Not a gap — simply out of
  scope for this feature.

### 6. Tone + register ("tú" informal)
**PASS.**
- **Zero "usted" / "ustedes"** anywhere in the 11 Spanish files.
- **Zero Spain-isms** (no "vosotros", "sois", "tío", "guay", "móvil",
  "ordenador").
- Imperatives in interactive copy use tú form:
  - `faucet.returnCoins*`: "Por favor, **devuelve** los fondos...
    cuando ya no los **necesites**" — second-person singular
  - `faucet.returnCoins*` continues: "Al devolver... **contribuyes**..."
    — second-person singular
  - `transaction.detail.pendingBody: "Esta transacción aún no se ha
    reflejado en la cadena. **Espera un momento**."` — tú imperative
- Third-person descriptive copy (field labels, metrics) correctly
  uses no pronoun — naturally neutral.

### 7. Diacritics
**PASS.** Programmatic sweep for `direccion|transaccion|
configuracion|comision|informacion|documentacion|politica|creacion|
emision|conexion|verificacion|recuperacion|validacion` without
accents turned up **zero matches** across all 11 Spanish files.
Every target word carries its proper acute.

### 8. Brand names untouched
**PASS.**
- VFX, VerifiedX, Spyglass, vBTC, NFT, BTC, GitHub (see INFO 1),
  Discord, X, Token (where kept English), Hash (kept English —
  `transaction.detail.fields.hash: "Hash"`), CLI, Faucet (kept
  English — industry standard), Callback (kept English — dev term)
- Page titles preserved: `"VFX Spyglass: Bloque {{height}}"` —
  the `VFX Spyglass` brand prefix is intact.

### 9. Length sanity (>50% longer flag)
**PASS WITH INFO.** 26 keys exceed the threshold, but every one is
either:
(a) a short label where the base is small (4–8 chars), making any
    natural Spanish word inflate the percentage — not a real UI risk;
(b) a documented pending-term translation that was already
    length-validated during 2A promotion planning.

Highest-impact flags:
| Key | EN | ES | Notes |
|---|---|---|---|
| `common.field.owner` | "Owner" (5) | "Propietario" (11) | +120% — short label, table column. Used in 5 places. |
| `block.detail.fields.chainRefId` | "Chain Ref ID" (12) | "ID de referencia de cadena" (26) | +117% — detail page, single-line label. Fits. |
| `block.row.craftTime` | "Craft Time" (10) | "Tiempo de creación" (18) | +80% — block-row column header. Verify column width on smallest viewport. |
| `nft.detail.fields.ownerAddress` | "Owner Address:" (14) | "Dirección del propietario:" (26) | +86% — detail grid label. Fits. |
| `search.topHolders.breadcrumbCurrent` | "Top Holders" (11) | "Principales holders" (19) | +73% — breadcrumb. Fits. |

Recommend Phase 4B integration testing pays attention to table
column widths for `Owner` and `Craft Time` headers on narrow
viewports. Not a 2B blocker.

### 10. Pre-existing `nav.github` casing bug — status
**NOT FIXED.** Both `en/common.json` and `es/common.json` still have
`nav.github: "Github"` (lowercase `h`). The 1B report flagged this as
a pre-existing issue, not introduced by 1B. 2B also does not fix it —
which is fine because 2B is scoped as *translation*, not copy
correction. **Recommend a standalone one-line commit** to fix both
locales to the canonical brand spelling "GitHub" before Phase 4B ships.

---

## Findings

### WARNING 1 — `transaction.detail.nft.ownerAddress` source-side oddity
`en.transaction.json:detail.nft.ownerAddress: "ownerAddress:"`
(lowercase, camelCase source retained). The Spanish correctly
normalizes this to `"Dirección del propietario:"` (proper label).
Similarly: `minterName: "minterName:"` (en) → `"Nombre del emisor:"`
(es), `primaryAssetName`, `primaryAssetSize`.

This is a **benign translation improvement** — the English side
appears to be a raw field-name echo (likely copy-pasted from the API
response) and the Spanish normalizes it to human-readable labels.
Flag is for future-you: if anyone tries to "fix" the English to
match the Spanish (proper "Owner Address:"), that would be welcome
but is out of 2B scope.

### WARNING 2 — `faucet.returnCoins*` length
`faucet.returnCoinsDevnet` / `returnCoinsTestnet` are long paragraph
strings; Spanish versions run 240+ chars and preserve the `{{address}}`
token correctly. Delta is under 20% (well under flag threshold) but
flagging that faucet page layout should be screenshot-diffed in Phase
4B to confirm the paragraph blocks render without awkward wrapping.

### INFO 1 — `nav.github: "Github"` still wrong
As above — not a 2B failure, but worth fixing before the final ship
gate. Single commit, both locales, one character change each.

### INFO 2 — Pool kept in English
`validator.list.pageTitle: "VFX Spyglass: Pool de validadores"` keeps
"Pool" as an English loanword — matches the pending-terms declaration
and is standard LatAm crypto usage. Good call; documented in
pending-terms.md line 41.

### INFO 3 — "Holders" kept in English
`search.topHolders.breadcrumbCurrent: "Principales holders"` matches
the pending-terms declaration. Consistent with industry usage and
glossary's "keep industry terms in English" rule. Note for cross-repo
consistency: Website's Phase 2A used "poseedores de Bitcoin" in one
marketing context (`home.vbtc_body`). These are not actually in
conflict — they refer to different concepts ("top holders of an NFT
collection" vs. "Bitcoin holders as an audience category") — but
worth flagging to the Phase 4A human marketing reviewer.

### INFO 4 — `Tx` abbreviation kept
`transaction.detail.fields.txType: "Tipo de tx"`, `Tx de emisión`,
`Tx de quema` — "Tx" is kept as an abbreviation. Matches pending-terms
line 65. Good for column widths and matches glossary's practice of
keeping recognized abbreviations (hash, NFT, CLI) in English.

---

## Glossary-Promotion Recommendations

Phase 2A already promoted the core cross-repo terms (Emitir,
Autocustodial, Ecosistema, Mainnet, Rendimiento, Colateralización).
From 2B specifically, recommending the following new promotions —
these are explorer-domain canonical and will reappear in any future
explorer or analytics tooling:

### Strong promotes (canonical domain vocabulary)
1. **Owner → Propietario** — 5 uses in Spyglass alone (common,
   fungibleToken×2, nft.card, vbtcToken). Standard LatAm crypto
   translation.
2. **Burn / Burnable / Burned → Quemar / Quemable / Quemada(s)** — 4
   uses; pairs naturally with the just-promoted "Mint → Emitir"
   family. Should be promoted together as the standard token lifecycle
   verbs.
3. **Pool → Pool** (kept English) — confirm it's explicitly added to
   the "keep in English" list alongside "token", "staking", "hash",
   "mint", "burn" — Phase 2B uses it idiomatically as `Pool de
   validadores`, `Pool activo de validadores`.
4. **Holders → Holders** (kept English) — same rationale; already
   respected by both 2A ("poseedores" for marketing body)
   and 2B ("Principales holders" for UI column). Glossary should
   clarify the distinction: "holder" as a *UI collection/column* term
   stays English; "holder" as a *marketing narrative subject* can be
   translated if context demands.
5. **Craft Time → Tiempo de creación** / **Crafted → Creado** — unique
   Spyglass vocabulary but will reappear on any explorer surface
   (validator dashboards, analytics, SDK docs).

### Weaker / watch
- Block-specific field names (`Merkle Root → Raíz Merkle`, `State
  Root → Raíz de estado`, `Previous Hash → Hash previo`): Spyglass-only
  for now; promote if any wallet surface ever renders these.

---

## Files Reviewed
- `public/locales/en/*.json` (11 files, 308 keys)
- `public/locales/es/*.json` (11 files, 308 keys, all matching)
- `pages/_app.tsx` (confirmed uses `common` namespace via wrapper)
- All 20 migrated pages (confirmed `serverSideTranslations` coverage)
- `pending-terms.md` Phase 2B section (56 entries; all consistent with
  usage)

## Not Reviewed (Out of Phase 2B Scope)
- Dev-server render verification (trusted per executor's build report)
- Browser-level language detection (Phase 4B scope)
- `/faucet` page pagination of the long body strings (Phase 4B
  screenshot diff)

---

## Recommendation
**Proceed to Phase 3B (review & QA).** The translation is complete,
structurally sound, glossary-compliant, and consistent with pending-
terms declarations.

Before Phase 4B:
1. Fold the 5 Strong-promote entries (Propietario, Quemar/Quemable,
   Pool, Holders, Tiempo de creación) into `glossary-en-es.md`.
2. Fix `nav.github: "Github"` → `"GitHub"` in both locales
   (standalone commit, 2-char change).
3. Screenshot-diff the `Owner` / `Craft Time` columns and the
   `/faucet` body paragraphs on narrow viewports.
