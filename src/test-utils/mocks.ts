// Shared jest mocks for Next router and next-i18next. Call the helpers at the
// top of a test file (jest.mock is hoisted, so pass factories inline).

export interface RouterOverrides {
  pathname?: string;
  asPath?: string;
  locale?: string;
  query?: Record<string, string>;
}

export const mockRouter = (overrides: RouterOverrides = {}) => ({
  pathname: overrides.pathname ?? "/",
  asPath: overrides.asPath ?? overrides.pathname ?? "/",
  route: overrides.pathname ?? "/",
  query: overrides.query ?? {},
  locale: overrides.locale ?? "en",
  locales: ["en", "es"],
  defaultLocale: "en",
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  events: { on: jest.fn(), off: jest.fn(), emit: jest.fn() },
});

/**
 * Identity translator: returns the key with its namespace prefix stripped, so
 * assertions read `nav.blocks` instead of `common:nav.blocks`.
 */
export const identityT = (key: string) => key.replace(/^[a-zA-Z]+:/, "");
