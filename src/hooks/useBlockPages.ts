import { useCallback, useEffect, useMemo, useState } from "react";
import { Block } from "../models/block";
import { BlockService } from "../services/block-service";
import { mergeBlocks } from "../utils/blocks";

interface Options {
  /** Extra query params for /blocks/ (e.g. master_node for a validator's blocks). */
  params?: Record<string, string>;
  /** Refresh page 1 on this interval; 0 disables. */
  pollMs?: number;
}

/** Paged block list without the home page's socket: infinite scroll plus an optional page-1 refresh. */
export function useBlockPages({ params = {}, pollMs = 15000 }: Options = {}) {
  const paramsKey = JSON.stringify(params);
  const stableParams = useMemo(() => params, [paramsKey]); // eslint-disable-line react-hooks/exhaustive-deps
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const loadMore = useCallback(
    async (page: number) => {
      try {
        const data = await new BlockService().list(page, stableParams);
        setBlocks((previous) => mergeBlocks(previous, data.results));
        setCanLoadMore(data.numPages > data.page);
      } catch (error) {
        console.error("Block page fetch failed", error);
        setCanLoadMore(false);
      } finally {
        setLoaded(true);
      }
    },
    [stableParams]
  );

  useEffect(() => {
    if (!pollMs) return;
    const id = setInterval(async () => {
      try {
        const data = await new BlockService().list(1, stableParams);
        setBlocks((previous) => mergeBlocks(previous, data.results));
      } catch (error) {
        console.error("Block refresh failed", error);
      }
    }, pollMs);
    return () => clearInterval(id);
  }, [pollMs, stableParams]);

  return { blocks, loadMore, canLoadMore, loaded };
}
