import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { BlockRowsContainer } from "../src/components/block-rows-container";
import { Search } from "../src/components/search";
import { isMobile } from "react-device-detect";
import { BlockListContainer } from "../src/components/block-list-container";
import { API_BASE_URL, IS_TESTNET } from "../src/constants";
import { Block } from "../src/models/block";

const Home: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (typeof window === "undefined") {
    return null;
  }

  const results: any[] = data.results;
  const blocks: Block[] = results.map(b => new Block(b));

  return (
    <div>
      <Head>
        <title>RBX Explorer{IS_TESTNET ? ' [TESTNET]' : ''}</title>
        <meta name="description" content="ReserveBlock Explorer: Home" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="p-2">

        <div className="alert alert-warning">
          <p className="mb-0">Due to an infrastructure issue, we are currently experiencing technical difficulties. Follow the status <a href="https://status.heroku.com/incidents/2524" className="alert-link">here</a>.</p>
        </div>
      </div>

      {isMobile ? <BlockListContainer initialBlocks={blocks} /> : <BlockRowsContainer initialBlocks={blocks} />}
    </div>
  );
};

export default Home;


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {
      data: {
        results: []
      }
    }
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=30, stale-while-revalidate=59'
  )

  const url = `${API_BASE_URL}/blocks/?page=1`;
  const result = await fetch(url)
  const data: any[] = await result.json()


  return {
    props: {
      data: data
    },
  }
}