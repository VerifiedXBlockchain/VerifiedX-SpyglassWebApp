import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { BlockRowsContainer } from "../src/components/block-rows-container";
import { Search } from "../src/components/search";
import { isMobile } from "react-device-detect";
import { BlockListContainer } from "../src/components/block-list-container";
import { API_BASE_URL, IS_TESTNET } from "../src/constants";
import { Block } from "../src/models/block";

const Home: NextPage = () => {
    if (typeof window === "undefined") {
        return null;
    }



    return (
        <div>
            <Head>
                <title>VFX Spyglass{IS_TESTNET ? ' [TESTNET]' : ''}</title>
                <meta name="description" content="VerifiedX Spyglass: Home" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            {isMobile ? <BlockListContainer initialBlocks={[]} /> : <BlockRowsContainer initialBlocks={[]} />}
        </div>
    );
};

export default Home;
