import { useCallback, useEffect, useRef, useState } from "react";
import { PaginatedResponse } from "../../models/paginated-response";

interface PagedList<T> {
  items: T[];
  loadMore: (page: number) => Promise<void>;
  canLoadMore: boolean;
  /** True once the first page has answered (success or failure). */
  loaded: boolean;
}

/**
 * Infinite-scroll list with a periodic refresh of page 1 that prepends items
 * not seen before (lists are newest-first). Replaces the three copy-pasted
 * token list containers; candidate for src/hooks once the lead is happy.
 */
export function usePagedList<T>(fetchPage: (page: number) => Promise<PaginatedResponse<T>>, keyOf: (item: T) => string, pollMs: number = 5000): PagedList<T> {
  const [items, setItems] = useState<T[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const fetchRef = useRef(fetchPage);
  const keyRef = useRef(keyOf);
  fetchRef.current = fetchPage;
  keyRef.current = keyOf;

  const merge = (existing: T[], incoming: T[], prepend: boolean) => {
    const seen = new Set(existing.map((item) => keyRef.current(item)));
    const fresh = incoming.filter((item) => !seen.has(keyRef.current(item)));
    if (fresh.length === 0) return existing;
    return prepend ? [...fresh, ...existing] : [...existing, ...fresh];
  };

  const loadMore = useCallback(async (page: number) => {
    try {
      const data = await fetchRef.current(page);
      setItems((previous) => merge(previous, data.results, false));
      setCanLoadMore(data.numPages > data.page);
    } catch (error) {
      console.error("List page fetch failed", error);
      setCanLoadMore(false);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(async () => {
      try {
        const data = await fetchRef.current(1);
        setItems((previous) => merge(previous, data.results, true));
      } catch (error) {
        console.error("List refresh failed", error);
      }
    }, pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  return { items, loadMore, canLoadMore, loaded };
}
