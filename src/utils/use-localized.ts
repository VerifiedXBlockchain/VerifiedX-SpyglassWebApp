import { useRouter } from "next/router";

/**
 * Returns a function that prefixes internal paths with the active locale
 * when it differs from the default. Use for raw <a href> nav inside the app:
 *
 *   const localized = useLocalized();
 *   <a href={localized(`/block/${id}`)}>...</a>
 *
 * Pass-through for external URLs (anything starting with http) and for
 * strings that don't begin with "/" so callers can't accidentally double-prefix.
 */
export function useLocalized() {
  const { locale, defaultLocale } = useRouter();
  return (path: string) => {
    if (!path.startsWith("/")) return path;
    if (!locale || locale === defaultLocale) return path;
    return `/${locale}${path}`;
  };
}
