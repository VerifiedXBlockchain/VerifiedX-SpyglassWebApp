import InfiniteScroll from "react-infinite-scroller";
import { TABLET_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { useNow } from "../../hooks/useNow";
import { Block } from "../../models/block";
import { Skeleton } from "../ui/skeleton";
import { BlockListCompact } from "./block-list-compact";
import { BlockTable } from "./block-table";
import styles from "./block-feed.module.scss";

interface Props {
  blocks: Block[];
  loadMore: (page: number) => void;
  canLoadMore: boolean;
  /** Defaults to "no blocks yet"; pass false once the first page has answered so an empty list can show `emptyLabel`. */
  loading?: boolean;
  emptyLabel?: string;
}

/** Infinite-scrolling block feed (home, validator pages, block list); table from tablet width, compact rows on phones. */
export const BlockFeed = ({ blocks, loadMore, canLoadMore, loading: loadingProp, emptyLabel }: Props) => {
  const isTablet = useMediaQuery(TABLET_QUERY);
  const now = useNow(1000);
  const loading = loadingProp ?? blocks.length === 0;

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
        <BlockTable blocks={blocks} loading={loading} now={now} emptyLabel={emptyLabel} />
      ) : (
        <BlockListCompact blocks={blocks} loading={loading} now={now} emptyLabel={emptyLabel} />
      )}
    </InfiniteScroll>
  );
};
