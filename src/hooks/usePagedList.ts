import { useCallback, useEffect, useRef, useState } from "react";
import { PaginatedResponse } from "../models/paginated-response";

interface Options {
  /** Re-fetch page 1 on this interval and prepend anything new; 0 disables. */
  pollMs?: number;
}

export interface PagedList<T> {
  items: T[];
  loadMore: (page: number) => Promise<void>;
  canLoadMore: boolean;
  /** True once the first page has answered (successfully or not). */
  loaded: boolean;
}

const mergeUnique = <T,>(existing: T[], incoming: T[], keyOf: (item: T) => string | number, prepend: boolean): T[] => {
  const seen = new Set(existing.map(keyOf));
  const fresh = incoming.filter((item) => !seen.has(keyOf(item)));
  if (fresh.length === 0) return existing;
  return prepend ? [...fresh, ...existing] : [...existing, ...fresh];
};

/**
 * Generic infinite-scroll list with optional page-1 polling, for the
 * transaction, validator and domain lists. Blocks use their own hooks
 * because they sort by height and stream from a socket.
 */
export function usePagedList<T>(fetchPage: (page: number) => Promise<PaginatedResponse<T>>, keyOf: (item: T) => string | number, { pollMs = 0 }: Options = {}): PagedList<T> {
  const [items, setItems] = useState<T[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;
  const keyRef = useRef(keyOf);
  keyRef.current = keyOf;

  const loadMore = useCallback(async (page: number) => {
    try {
      const data = await fetchRef.current(page);
      setItems((previous) => mergeUnique(previous, data.results, keyRef.current, false));
      setCanLoadMore(data.numPages > data.page);
    } catch (error) {
      console.error("Page fetch failed", error);
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
        setItems((previous) => mergeUnique(previous, data.results, keyRef.current, true));
      } catch (error) {
        console.error("Poll failed", error);
      }
    }, pollMs);
    return () => clearInterval(id);
  }, [pollMs]);

  return { items, loadMore, canLoadMore, loaded };
}
