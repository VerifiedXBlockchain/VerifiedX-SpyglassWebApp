import { ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Skeleton } from "../ui/skeleton";
import styles from "./paged-feed.module.scss";

interface Props {
  loadMore: (page: number) => void;
  canLoadMore: boolean;
  children: ReactNode;
}

/** Infinite scroll shell with the design system's loader; pairs with usePagedList. */
export const PagedFeed = ({ loadMore, canLoadMore, children }: Props) => (
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
    {children}
  </InfiniteScroll>
);
