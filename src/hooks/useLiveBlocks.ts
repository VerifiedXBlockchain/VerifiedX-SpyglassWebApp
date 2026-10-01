import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_HOST } from "../constants";
import { Block } from "../models/block";
import { BlockService } from "../services/block-service";
import { mergeBlocks } from "../utils/blocks";

interface ServerToClientEvents {
  message: (message: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ClientToServerEvents {}

const POLL_INTERVAL_MS = 5000;
/** While streaming, page 1 is still re-fetched this often to correct any block the socket delivered short. */
const RECONCILE_INTERVAL_MS = 20000;

export interface LiveBlocks {
  /** Newest first, de-duplicated by height. */
  blocks: Block[];
  /** Infinite-scroll callback: fetch page `page` and append. */
  loadMore: (page: number) => Promise<void>;
  canLoadMore: boolean;
  /** True once the socket has delivered a block that followed the newest one we had. */
  streaming: boolean;
}

/**
 * Live block feed for the home page: a socket pushes new blocks; a 5-second
 * poll of page 1 covers the gap until the socket proves it is delivering
 * consecutive blocks, then slows to a 20-second reconcile. Older pages load
 * on demand.
 */
export function useLiveBlocks(): LiveBlocks {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const latestHeightRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    latestHeightRef.current = blocks[0]?.height;
  }, [blocks]);

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_HOST);

    socket.onAny((_name, event) => {
      if (!event || event.type !== "new_block") return;
      const block = new Block(event.data);
      const latest = latestHeightRef.current;
      if (latest !== undefined && block.height === latest + 1) {
        setStreaming(true);
      }
      setBlocks((previous) => mergeBlocks(previous, [block]));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const service = new BlockService();
    const poll = async () => {
      try {
        const page = await service.list(1);
        setBlocks((previous) => mergeBlocks(previous, page.results));
      } catch (error) {
        console.error("Block poll failed", error);
      }
    };
    const id = setInterval(poll, streaming ? RECONCILE_INTERVAL_MS : POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [streaming]);

  const loadMore = useCallback(async (page: number) => {
    const service = new BlockService();
    try {
      const data = await service.list(page);
      setBlocks((previous) => mergeBlocks(previous, data.results));
      setCanLoadMore(data.numPages > data.page);
    } catch (error) {
      console.error("Block page fetch failed", error);
      setCanLoadMore(false);
    }
  }, []);

  return { blocks, loadMore, canLoadMore, streaming };
}
