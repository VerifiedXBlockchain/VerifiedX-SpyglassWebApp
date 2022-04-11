import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Transaction } from "../models/transaction";
import { TransactionService } from "../services/transaction-service";
import { TransactionList } from "./transaction-list";

export const TransactionListContainer = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const fetchPage = async (p: number) => {
    const service = new TransactionService();

    try {
      const data = await service.list(p);
      if (data.page == 1) {
        setTransactions(data.results);
      } else {
        const results = [];
        for (const result of data.results) {
          const exists = transactions.some((t) => t.hash == result.hash);
          if (!exists) {
            results.push(result);
          }
        }

        setTransactions([...transactions, ...results]);
      }

      setCanLoadMore(data.numPages > data.page);
    } catch (e) {
      console.log(e);
      setCanLoadMore(false);
    }
  };

  useEffect(() => {
    const poll = () => {
      const service = new TransactionService();
      service.list(1).then((data) => {
        const newTransactions = [];
        for (const transaction of data.results) {
          const exists = transactions.some((t) => t.hash == transaction.hash);
          if (!exists) {
            newTransactions.push(transaction);
          }
        }
        if (newTransactions.length > 0) {
          setTransactions([...newTransactions, ...transactions]);
        }
      });
    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [transactions]);

  return (
    <div>
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
        <TransactionList transactions={transactions} />
      </InfiniteScroll>
    </div>
  );
};
