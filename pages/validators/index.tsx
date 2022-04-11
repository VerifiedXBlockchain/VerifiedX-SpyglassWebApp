import type { NextPage } from "next";
import Head from "next/head";
import { isMobile } from "react-device-detect";
import { ValidatorListContainer } from "../../src/components/validator-list-container";

const ValidatorPoolPage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>RBX Explorer: Validator Pool</title>
        <meta name="description" content="ReserveBlock Explorer: Home" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <ValidatorListContainer />
    </div>
  );
};

export default ValidatorPoolPage;
