/**
 * Full-page navigation. The app deliberately uses hard navigations for
 * cross-page moves (pages bail out of SSR and refetch on load), and routing
 * through one function keeps that mockable in tests.
 */
export function navigateTo(href: string) {
  window.location.href = href;
}
