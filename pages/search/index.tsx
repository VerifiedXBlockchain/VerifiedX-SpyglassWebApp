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
import { Address } from "../../src/models/address";
import { Block } from "../../src/models/block";
import { Transaction } from "../../src/models/transaction";
import { AddressService } from "../../src/services/address-service";
import { BlockService } from "../../src/services/block-service";
import { TransactionService } from "../../src/services/transaction-service";

const SHOW_BALANCE = false;

const SearchPage: NextPage = () => {
  const router = useRouter();

  const { q } = router.query;
  const [page, setPage] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [twoColumns, setTwoColumns] = useState<boolean>(false);
  const [address, setAddress] = useState<Address | undefined>(undefined);

  const [blockNotFound, setBlockNotFound] = useState(false);

  useEffect(() => {
    const blockService = new BlockService();
    const transactionService = new TransactionService();

    const trimmedQ = `${q}`.trim();
    const isNumber = /^\d+$/.test(trimmedQ);

    setBlockNotFound(false);

    if (isNumber) {
      blockService
        .retrieve(trimmedQ)
        .then((b) => {
          router.push(`/block/${b.height}`);
        })
        .catch((e) => {
          console.log(e);
          setBlockNotFound(true);
        });
      return;
    }

    if (trimmedQ.length == 34 && trimmedQ[0].toUpperCase() == "R") {
      // blockService.search(trimmedQ, page).then((data) => {
      //   setBlocks(data.results);
      // });

      const addressService = new AddressService();
      addressService.retrieve(trimmedQ).then((data) => {
        setAddress(data);
      });
      // return;
    }

    const queryBlocksAndTransaction = async () => {
      const b = await blockService.search(trimmedQ, page);

      const t = await transactionService.search(trimmedQ, page);
      setTwoColumns(b.results.length > 0 && t.results.length > 0);
      setBlocks(b.results);
      setTransactions(t.results);
    };

    queryBlocksAndTransaction();
    // blockService.search(trimmedQ, page).then((data) => {
    //   setBlocks(data.results);

    // });

    // const transactionService = new TransactionService();

    // transactionService.search(trimmedQ, page).then((data) => {
    //   setTransactions(data.results);

    // });
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

        <pre className="text-center">Results for {q}</pre>

        {SHOW_BALANCE && address ? (
          <div className="alert bg-success text-center">
            Balance: {address.balance} RBX
          </div>
        ) : null}

        <hr />
        {blockNotFound ? (
          <div className="alert alert-danger">Block {q} Not Found.</div>
        ) : null}
        <div className="row">
          {blocks.length > 0 ? (
            <div className={`${twoColumns ? "col-6" : "col-12"}`}>
              <h4 className="text-start">Blocks</h4>
              {blocks.length < 1 ? (
                <div className="text-center">
                  <div className="badge bg-warning">No Blocks Found</div>
                </div>
              ) : null}

              <div className="row">
                {blocks.map((b) => (
                  <div
                    className={`${twoColumns ? "col-12" : "col-4"} p-2`}
                    key={b.height}
                  >
                    <BlockCard block={b}></BlockCard>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {transactions.length > 0 ? (
            <div className={`${twoColumns ? "col-6" : "col-12"}`}>
              <h4 className="text-start">Transactions</h4>
              {transactions.length < 1 ? (
                <div className="text-center">
                  <div className="badge bg-warning">No Transactions Found</div>
                </div>
              ) : null}
              <div className="row">
                {transactions.map((t) => (
                  <div
                    className={`${twoColumns ? "col-12" : "col-4"} p-2`}
                    key={t.hash}
                  >
                    <TransactionCard transaction={t}></TransactionCard>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
