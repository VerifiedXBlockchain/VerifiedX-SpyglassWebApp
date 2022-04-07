/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BlockCard } from "../../src/components/block-card";
import { BlockList } from "../../src/components/block-list";
import { Search } from "../../src/components/search";
import { TransactionCard } from "../../src/components/transaction-card";
import { TransactionList } from "../../src/components/transaction-list";
import { Block } from "../../src/models/block";
import { Transaction } from "../../src/models/transaction";
import { BlockService } from "../../src/services/block-service";
import { TransactionService } from "../../src/services/transaction-service";

const SearchPage: NextPage = () => {
  const router = useRouter();

  const { q } = router.query;
  const [page, setPage] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const blockService = new BlockService();

    blockService.search(`${q}`, page).then((data) => {
      setBlocks(data.results);
    });

    const transactionService = new TransactionService();

    transactionService.search(`${q}`, page).then((data) => {
      setTransactions(data.results);
    });
  }, [q, page]);

  if (!q) {
    return <></>;
  }

  return (
    <div>
      <Head>
        <title>RBX Explorer</title>
        <meta
          name="description"
          content="ReserveBlock Explorer: Search Results"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb align-items-center">
          <li className="breadcrumb-item">
            <a href="/">Home</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <a href="/search">Search</a>
          </li>
        </ol>
      </nav>

      <div className="container mt-3">
        {/* <Search initialValue={q.toString()} /> */}
        <div className="py-2"></div>

        <h6>Results for {q}:</h6>
        <div className="row">
          <div className="col-12 col-md-6">
            <h4 className="text-center">Blocks</h4>
            {blocks.length < 1 ? (
              <div className="text-center">
                <div className="badge bg-warning">No Blocks Found</div>
              </div>
            ) : null}
            {blocks.map((b) => (
              <div className="pb-2" key={b.height}>
                <BlockCard block={b}></BlockCard>
              </div>
            ))}
          </div>

          <div className="col-12 col-md-6">
            <h4 className="text-center">Transactions</h4>
            {transactions.length < 1 ? (
              <div className="text-center">
                <div className="badge bg-warning">No Transactions Found</div>
              </div>
            ) : null}

            {transactions.map((t) => (
              <div className="pb-2" key={t.hash}>
                <TransactionCard transaction={t}></TransactionCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
