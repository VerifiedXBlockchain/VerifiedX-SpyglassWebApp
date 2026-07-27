// Module-scoped mirror of the router locale so non-React code (model getters)
// can format dates/numbers for the active locale. Set from _app.tsx on every
// render; always returns a concrete locale so server and client render the
// same string (bare toLocaleDateString() picks the host's locale, which both
// ignores /es and can mismatch between SSR and hydration).
let activeLocale = "en";

export function setActiveLocale(locale: string | undefined) {
  activeLocale = locale || "en";
}

export function getActiveLocale(): string {
  return activeLocale;
}
