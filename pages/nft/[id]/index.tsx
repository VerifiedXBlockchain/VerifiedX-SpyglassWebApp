import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const NftDetailPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query;

  return (
    <>
      <Head>
        <title>RBX Explorer</title>
        <meta name="description" />
        <title>{`ReserveBlock Explorer: NFT ${id}`}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="text-center p-5">{id}</div>
      <div className="text-center p-5">NFT Details Activating Soon.</div>
    </>
  );
};

export default NftDetailPage;
