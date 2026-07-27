# Phase 4B Verification — VerifiedX-SpyglassWebApp Integration

**Phase:** 4B — Language switcher, hreflang, locale-aware formatting
**Repo:** VerifiedX-SpyglassWebApp
**Branch:** `feat/i18n-es` @ commit `41143b8`
**Base:** `8c83168` (previous Phase 2B review commit)
**Verifier:** reviewer agent
**Date:** 2026-04-17

## Verdict: **PASS WITH WARNINGS**

The switcher works, hreflang + canonical are emitted correctly,
locale-aware number/date formatting is wired into the three biggest
table components, and persistence is handled by next-i18next's
built-in `NEXT_LOCALE` cookie convention (no custom plumbing needed).
The pre-existing `nav.github: "Github"` casing bug from Phase 1B is
**finally fixed** in this commit. Two warnings: (1) the
`LanguageSwitcher` component has hardcoded English strings
(`aria-label="Language"`, `LOCALE_LABELS = {en: "EN", es: "ES"}`)
that won't translate for Spanish-locale users; and (2) `<html lang>`
is not dynamically updated per-locale (needs a `_document.tsx` change
or `next/head` injection to be SEO-correct). Neither blocks
functionality but both should be addressed before final ship.

---

## Checklist

### 1. `LanguageSwitcher.tsx` — switcher UI + a11y
**PASS WITH WARNINGS.**
- **Renders only when ≥2 locales** (`if (!locales || locales.length <
  2) return null;`) — defensive, safe with single-locale builds.
- **Click handler**:
  - Sets `NEXT_LOCALE` cookie (1-year max-age, root path,
    `samesite=lax`) — this is the canonical next-i18next persistence
    cookie name; reading it on subsequent SSR requests is automatic.
    No custom auto-detect script needed.
  - Calls `router.push(asPath, asPath, { locale: next })` — Next.js
    handles the route rewrite, preserves query, and triggers a
    re-render with the new locale's translations.
  - Returns early if user clicks the active locale (no-op).
- **A11y attributes**:
  - `role="group"` ✓
  - `aria-label="Language"` — **hardcoded EN string** (Warning 1)
  - `aria-current={loc === active ? "true" : undefined}` ✓ (only set
    on active button)
- **Visible labels**: `LOCALE_LABELS = { en: "EN", es: "ES" }` —
  hardcoded constants. These don't need translation (they're language
  *codes*), so this is OK for the visible text — but combined with
  the hardcoded `aria-label`, the switcher itself is the only piece
  of the UI that doesn't speak Spanish.
- **Visual styling**: Bootstrap-classed buttons separated by `/`
  characters; active state has `text-white fw-bold`, inactive has
  `text-muted`. Compact, fits the existing nav.

### 2. Switcher placement in `_app.tsx`
**PASS.** Two placements:
- **Desktop** (line 213): inside `<div className="d-none d-lg-flex
  align-items-center gap-2">` → renders `<LanguageSwitcher />` next
  to `<Search />`. Hidden on small screens via Bootstrap `d-none
  d-lg-flex`.
- **Mobile** (line 234): inside `<div className=" d-block
  d-lg-none">` → renders `<LanguageSwitcher />` alongside `<Search />`
  in the same flex container. Visible only on small screens via
  `d-block d-lg-none`.
The two placements are mutually exclusive by viewport, no
double-render.

### 3. Persistence — `NEXT_LOCALE` cookie
**PASS.** The switcher's click handler sets a `NEXT_LOCALE` cookie,
which is the **next-i18next convention** that Next.js's locale router
reads automatically on subsequent requests. No custom auto-detect
script is needed because:
- Next.js's built-in i18n routing reads `Accept-Language` on first
  visit (when no cookie is present), matches against
  `i18n.locales`, and 308-redirects to the matched locale.
- After the user picks a locale via the switcher, the
  `NEXT_LOCALE` cookie overrides `Accept-Language` for all
  subsequent requests.
This is the **standard next-i18next pattern** and is correct.

The cookie has `samesite=lax` (good — works for top-level
navigation), `max-age=31536000` (1 year — matches Website 4A), and
`path=/` (root scope — applies to all routes).

### 4. Auto-detect — handled by Next.js, no custom script
**PASS.** Next.js's built-in routing reads `Accept-Language` on
first visit (per the i18n docs) and rewrites to the matched locale
without a custom `<script>`. Once the user clicks the switcher, the
`NEXT_LOCALE` cookie wins. Loop-safe because the cookie short-circuits
header sniffing on subsequent requests.

### 5. hreflang + canonical in `<Head>`
**PASS.** Per-page (rendered from `_app.tsx`):
- **Canonical**: `<link rel="canonical" href={`${SITE_ORIGIN}${canonicalPath || "/"}`} />`
  - `canonicalPath` correctly prefixes `/<locale>` for non-default
    locales (Spanish gets `/es/...`), uses bare path for default
    (English at root)
  - `asPath === "/" ? "" : asPath` strips the leading slash for the
    root case so `/es/` ends up as `/es` + `""` = `/es` — wait, then
    canonical is `https://spyglass.verifiedx.io/es` not `/es/` for
    the Spanish home. Functionally the same (Next.js redirects), but
    worth noting for the SEO-strict reviewer.
- **`hreflang` alternates**: one per locale + `x-default`:
  - `<link rel="alternate" hrefLang="en" href="..." />`
  - `<link rel="alternate" hrefLang="es" href="..." />`
  - `<link rel="alternate" hrefLang="x-default" href="..." />` (uses
    bare `hreflangPath`, which is the default-locale URL — matches
    Google's recommendation: `x-default` should be the
    most-broadly-applicable version)

`SITE_ORIGIN` is defined in `src/constants.ts` with an env-var
override (`NEXT_PUBLIC_SITE_ORIGIN`) and a sensible production
default (`https://spyglass.verifiedx.io`). Good.

### 6. `<html lang>` — NOT dynamically updated per-locale
**WARNING 2.** Searched the diff and `_app.tsx` for any `<html
lang={...}>` change. None found. Next.js sets `<html lang>` from
`next.config.js`'s `i18n.defaultLocale` by default (so all pages get
`<html lang="en">`), and per-page `lang` requires a custom
`pages/_document.tsx` that reads `__NEXT_DATA__.locale`.

This is **SEO-suboptimal** — Spanish-locale pages will be served
with `<html lang="en">`, which:
- May confuse screen readers (English voice on Spanish content)
- May confuse search engines (mismatch between `<html lang>` and
  `hreflang="es"` alternate)

Not a functional bug (the site works), but worth a follow-up commit
to add `pages/_document.tsx` (or modify the existing one) to set
`<Html lang={(this.props as any).__NEXT_DATA__.locale}>` or use
`useRouter()` in a custom doc.

### 7. Locale-aware formatting wiring
**PASS (scoped).** Three components updated to pass `router.locale`
to `Intl` formatters:
- `block-row.tsx`: `block.height.toLocaleString(router.locale)` —
  block heights now use locale-correct thousands separators (`1,234`
  for en, `1.234` for es).
- `fungible-token-list.tsx`: `token.created_at.toLocaleDateString(
  router.locale)` — token list dates respect locale.
- `vbtc-token-list.tsx`: same date pattern.

The wiring is correct: `router.locale` is `'en'` or `'es'` (matches
BCP 47 / Intl input). Spec note: `Intl.NumberFormat('es', ...)` and
`Intl.DateTimeFormat('es', ...)` produce neutral LatAm formatting by
default — no region-locked Mexico/Argentina output. Matches the
glossary's "neutral LatAm" target.

**Scope flag**: only 3 components are wired. There are likely many
more `toLocaleString` / `toLocaleDateString` call sites across the
explorer (transaction detail, validator detail, search results,
metrics page). The commit message and TaskList ("Wire locale-aware
formatters" task #40 marked completed; "Verify build + runtime
switcher" task #41 in-progress) suggest this was an intentional
narrow scope ("the three biggest table components"). Phase 4B
executor's runtime verification (task #41) should confirm the
remaining surfaces don't show jarring mismatches (e.g., Spanish UI
with `1,234,567 VFX` instead of `1.234.567 VFX`).

### 8. Pre-existing `nav.github: "Github"` casing — FIXED
**PASS.** Both `public/locales/en/common.json` and
`public/locales/es/common.json` now show
`"github": "GitHub"` (uppercase H). The bug flagged in Phase 1B and
again in Phase 2B is finally addressed in this phase. ✓

### 9. Build green
**TRUSTED.** Diff is small, additive, and the only structural
changes are:
- New `LanguageSwitcher` component (40 lines, self-contained)
- `_app.tsx` adds switcher placements, hreflang `<Head>` block,
  imports
- Three table components add `useRouter` import + `router.locale`
  arg to `toLocaleString` / `toLocaleDateString`
- `constants.ts` exports `SITE_ORIGIN` with env-var override

No new npm dependencies. Task #41 is in-progress for the executor's
manual runtime check.

---

## Findings

### WARNING 1 — Switcher's a11y label is hardcoded English
`<div ... aria-label="Language">` should be `aria-label={t('nav.switcher_aria')}`
(or equivalent), with the new key added to both `en/common.json`
("Language" / "Select language") and `es/common.json` ("Idioma" /
"Seleccionar idioma"). Currently a Spanish-locale screen-reader user
hears "Language" announced when focusing the switcher group, while
the rest of the UI is in Spanish.

**Fix**: in `language-switcher.tsx`:
```tsx
import { useTranslation } from "next-i18next";
// ...
const { t } = useTranslation("common");
<div role="group" aria-label={t("nav.switcherAria")}>
```
And add `nav.switcherAria` to both locale files. Same pattern Website
4A used (`nav.switcher_aria`).

The visible "EN" / "ES" labels in `LOCALE_LABELS` don't need to be
translated (they're language codes, not English words) — so that
constant is fine as-is.

### WARNING 2 — `<html lang>` not dynamic per-locale
See Checklist #6. Spanish pages serve with `<html lang="en">`. Fix
requires editing or creating `pages/_document.tsx`:

```tsx
import { Html, Head, Main, NextScript, DocumentProps } from "next/document";

export default function Document(props: DocumentProps) {
  return (
    <Html lang={props.__NEXT_DATA__.locale ?? "en"}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

Two-line follow-up commit. Not a blocker for runtime functionality.

### INFO 1 — Canonical URL has trailing slash inconsistency
`canonicalPath` for the home page evaluates to `""` (because
`hreflangPath = asPath === "/" ? "" : asPath` and the canonical
prefix logic only adds `/${locale}` for non-default locales, so for
en home the canonical is `https://spyglass.verifiedx.io/`, but for
es home it's `https://spyglass.verifiedx.io/es` (no trailing slash).
Next.js will 308 redirect `/es` → `/es/` (or vice versa, depending
on `trailingSlash` config), so functionally correct, but if
`next.config.js` has `trailingSlash: true` set, the canonical should
match. Minor — not introduced by 4B (the pattern would apply to any
canonical), just flagging for SEO polish.

### INFO 2 — Locale-aware formatting scope is narrow (3 components)
Per Checklist #7. Recommend the executor's task #41 manual pass
specifically check transaction detail amounts, validator detail
metrics, and search-results VFX balances on `/es/` to identify
remaining `toLocaleString` / `toLocaleDateString` calls that aren't
yet locale-aware. Anything found can be a small follow-up commit —
the pattern (`router.locale` arg) is now established.

### INFO 3 — Switcher uses `/` as separator
The visual `EN / ES` rendering with `<span className="text-muted
px-1">/</span>` between buttons is a stylistic choice. On narrow
mobile, this is fine because there are only 2 locales (one
separator). When fr/it/de/zh/ja get added (Wave 2/3), the row will
have 4–6 buttons and the slashes may look cluttered. Consider a
dropdown for >2 locales as a future ergonomic improvement.

### INFO 4 — `NEXT_LOCALE` cookie is one-character spec quirk
Next.js's docs document the cookie as `NEXT_LOCALE` (uppercase).
Confirmed in the code: `document.cookie = "NEXT_LOCALE=..."`. ✓
Don't change to lowercase — Next.js's middleware reads the
case-sensitive name.

---

## Glossary-Promotion Recommendations

Phase 4B doesn't add many new translatable strings (the new visible
strings are "EN", "ES", "Language" — and only the latter is a real
candidate). One overlap with Phase 4C:

### Suggest promoting (already recommended in 4C)
1. **Language → Idioma** — appears in GUI 4C's
   `settingsLanguageSection: "Idioma"`. Once the switcher's
   `aria-label` is properly translated (per Warning 1), this term
   will land in Spyglass `common.json` too. Cross-repo canonical.

### Pattern note (already noted in 4A)
- Two-letter locale codes (`EN`, `ES`, `FR`, `DE`, `ZH`, `JA`) used as
  visible labels in compact switchers should never be translated —
  they are universally understood as ISO 639-1 codes and shorter than
  any localized alternative.

---

## Files Reviewed
- `pages/_app.tsx` (+27 lines: switcher placements, useRouter,
  canonical/hreflang Head, SITE_ORIGIN import)
- `public/locales/en/common.json` (1-line GitHub casing fix)
- `public/locales/es/common.json` (1-line GitHub casing fix)
- `src/components/language-switcher.tsx` (new; 40 lines)
- `src/components/block-row.tsx` (1-line `toLocaleString` locale arg)
- `src/components/fungible-token-list.tsx` (1-line `toLocaleDateString`
  locale arg)
- `src/components/vbtc-token-list.tsx` (1-line `toLocaleDateString`
  locale arg)
- `src/constants.ts` (1-line `SITE_ORIGIN` export)

## Not Reviewed (Out of Phase 4B Scope)
- Live runtime behavior (executor task #41 in-progress)
- Other `toLocaleString` / `toLocaleDateString` call sites not yet
  wired (deferred follow-up)
- Sitemap generation (no sitemap config visible in this commit; if
  the project lacks a sitemap, that's pre-existing — not 4B-introduced)

---

## Recommendation
**Proceed.** Phase 4B is functional and the GitHub casing fix
unblocks the Phase 2B carry-over. Two follow-ups before Wave 1 ship:

1. **Translate the switcher's `aria-label`** (WARNING 1) — small
   commit: add `nav.switcherAria` to `common.json` (en + es), call
   `useTranslation` in `LanguageSwitcher`.
2. **Add `pages/_document.tsx`** (WARNING 2) — set `<Html lang={...
   __NEXT_DATA__.locale ...}>` so Spanish pages serve with `<html
   lang="es">` for SEO + accessibility.

Both are non-blocking; the switcher already navigates correctly and
hreflang is emitted. These are polish items.

For the cross-repo glossary update batch:
- Promote **Language → Idioma** (cross-repo: GUI 4C uses it; Spyglass
  4B will use it after WARNING 1 fix).
