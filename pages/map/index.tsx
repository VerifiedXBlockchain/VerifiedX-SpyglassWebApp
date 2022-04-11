import type { NextPage } from "next";
import Head from "next/head";
import { BlockMapContainer } from "../../src/components/block-map-container";

const MapPage: NextPage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div>
      <Head>
        <title>RBX Explorer</title>
        <meta
          name="description"
          content="ReserveBlock Explorer: Validator Map"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h3 className="text-center">Heat Map</h3>
      <BlockMapContainer />
    </div>
  );
};

export default MapPage;
