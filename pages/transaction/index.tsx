/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from "next";
import Head from "next/head";
import { Search } from "../../src/components/search";
import { TransactionListContainer } from "../../src/components/transaction-list-container";
import { IS_TESTNET } from "../../src/constants";

const TransactionListPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>VFX Spyglass: Transactions{IS_TESTNET ? ' [TESTNET]' : ''}</title>
        <meta name="description" content="VerifiedX Spyglass Transactions" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/transaction">Transactions</a>
            </li>
          </ol>
        </nav>
        <TransactionListContainer />
      </div>
    </div>
  );
};

export default TransactionListPage;
