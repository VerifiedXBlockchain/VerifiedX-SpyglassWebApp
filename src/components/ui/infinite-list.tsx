import { ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Skeleton } from "./skeleton";
import styles from "./infinite-list.module.scss";

interface Props {
  children: ReactNode;
  loadMore: (page: number) => void;
  hasMore: boolean;
}

/** Window-scroll pagination wrapper with the design system's loader. */
export const InfiniteList = ({ children, loadMore, hasMore }: Props) => (
  <InfiniteScroll
    pageStart={0}
    loadMore={loadMore}
    hasMore={hasMore}
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
