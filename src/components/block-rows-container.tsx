import { useEffect, useState } from "react";
import { Block } from "../models/block";
import { BlockService } from "../services/block-service";
import { BlockRowList } from "./blocks-row-list";
import InfiniteScroll from "react-infinite-scroller";
import { BlockList } from "./block-list";
import { isMobile } from "react-device-detect";

export const BlockRowsContainer = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const fetchPage = async (p: number) => {
    const service = new BlockService();
    try {
      const data = await service.list(p);
      if (data.page == 1) {
        setBlocks(data.results);
      } else {
        const results = [];
        for (const result of data.results) {
          const exists = blocks.some((b) => b.height == result.height);
          if (!exists) {
            results.push(result);
          }
        }

        setBlocks([...blocks, ...results]);
      }

      setCanLoadMore(data.numPages > data.page);
    } catch (e) {
      console.log(e);
      setCanLoadMore(false);
    }
  };

  useEffect(() => {
    const poll = () => {
      const service = new BlockService();
      service.list(1).then((data) => {
        const newBlocks = [];
        for (const block of data.results) {
          const exists = blocks.some((b) => b.height == block.height);

          if (!exists) {
            newBlocks.push(block);
          }
        }

        if (newBlocks.length > 0) {
          setBlocks([...newBlocks, ...blocks]);
        }
      });
    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [blocks]);

  return (
    <div className="">
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchPage}
        hasMore={canLoadMore}
        initialLoad={true}
        loader={
          <div
            className="d-flex justify-content-center align-items-center"
            key={0}
          >
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <BlockRowList blocks={blocks} />
      </InfiniteScroll>
    </div>
  );
};
