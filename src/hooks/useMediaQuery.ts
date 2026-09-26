import { useEffect, useState } from "react";

// Keep in sync with src/styles/_breakpoints.scss.
export const TABLET_QUERY = "(min-width: 768px)";
export const DESKTOP_QUERY = "(min-width: 1280px)";

/**
 * Viewport-based breakpoint. Returns `undefined` until mounted so server and
 * first client render agree; callers show a skeleton for that frame instead
 * of guessing from the user agent.
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    if (typeof list.addEventListener === "function") {
      list.addEventListener("change", update);
      return () => list.removeEventListener("change", update);
    }
    // Safari < 14
    list.addListener(update);
    return () => list.removeListener(update);
  }, [query]);

  return matches;
}
