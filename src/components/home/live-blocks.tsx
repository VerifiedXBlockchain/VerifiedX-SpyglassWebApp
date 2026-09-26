import InfiniteScroll from "react-infinite-scroller";
import { TABLET_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { useNow } from "../../hooks/useNow";
import { Block } from "../../models/block";
import { Skeleton } from "../ui/skeleton";
import { BlockListCompact } from "./block-list-compact";
import { BlockTable } from "./block-table";
import styles from "./live-blocks.module.scss";

interface Props {
  blocks: Block[];
  loadMore: (page: number) => void;
  canLoadMore: boolean;
}

/** Infinite-scrolling block feed; table from tablet width, compact rows on phones. */
export const LiveBlocks = ({ blocks, loadMore, canLoadMore }: Props) => {
  const isTablet = useMediaQuery(TABLET_QUERY);
  const now = useNow(1000);
  const loading = blocks.length === 0;

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={canLoadMore}
      initialLoad
      loader={
        <div key="loader" className={styles.loader}>
          <Skeleton width={160} height={12} />
        </div>
      }
    >
      {isTablet === undefined ? (
        <Skeleton className={styles.placeholder} />
      ) : isTablet ? (
        <BlockTable blocks={blocks} loading={loading} now={now} />
      ) : (
        <BlockListCompact blocks={blocks} loading={loading} now={now} />
      )}
    </InfiniteScroll>
  );
};
