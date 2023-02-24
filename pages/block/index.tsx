/* eslint-disable @next/next/no-html-link-for-pages */
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { BlockListContainer } from "../../src/components/block-list-container";
import { Search } from "../../src/components/search";
import { API_BASE_URL, IS_TESTNET } from "../../src/constants";
import { Block } from "../../src/models/block";

const BlockListPage: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const results: any[] = data.results;
  const blocks: Block[] = results.map(b => new Block(b));


  return (
    <div>
      <Head>
        <title>RBX Explorer{IS_TESTNET ? ' [TESTNET]' : ''}</title>
        <meta name="description" content="ReserveBlock Explorer: Blocks" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/block">Blocks</a>
            </li>
          </ol>
        </nav>
      </div>

      <BlockListContainer initialBlocks={blocks} />
    </div>
  );
};

export default BlockListPage;


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

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
