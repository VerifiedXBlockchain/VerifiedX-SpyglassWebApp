/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from "next";
import Head from "next/head";
import { BlockListContainer } from "../../src/components/block-list-container";
import { NftListContainer } from "../../src/components/nft-list-container";
import { Search } from "../../src/components/search";
import { IS_TESTNET } from "../../src/constants";

const NftListPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>RBX Explorer{IS_TESTNET ? ' [TESTNET]' : ''}</title>
        <meta name="description" content="ReserveBlock Explorer: NFTs" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/nfts">NFTs</a>
            </li>
          </ol>
        </nav>

      </div>
      <NftListContainer />


    </div>
  );
};

export default NftListPage;
