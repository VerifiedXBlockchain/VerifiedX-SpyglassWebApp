import type { NextPage } from "next";
import Head from "next/head";
import { BlockRowsContainer } from "../src/components/block-rows-container";
import { Search } from "../src/components/search";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>RBX Explorer</title>
        <meta name="description" content="ReserveBlock Explorer: Home" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <BlockRowsContainer />
    </div>
  );
};

export default Home;
