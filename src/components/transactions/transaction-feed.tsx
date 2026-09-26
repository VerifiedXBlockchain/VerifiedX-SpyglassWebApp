import { usePagedList } from "../../hooks/usePagedList";
import { Transaction } from "../../models/transaction";
import { TransactionService } from "../../services/transaction-service";
import { InfiniteList } from "../ui/infinite-list";
import { TransactionList } from "./transaction-list";

const POLL_MS = 5000;

/** Network-wide transaction list: newest first, polls for new ones, pages on scroll. */
export const TransactionFeed = () => {
  const { items, loadMore, canLoadMore, loaded } = usePagedList<Transaction>((page) => new TransactionService().list(page), (tx) => tx.hash, { pollMs: POLL_MS });
  return (
    <InfiniteList loadMore={loadMore} hasMore={canLoadMore}>
      <TransactionList transactions={items} loading={!loaded} />
    </InfiniteList>
  );
};
