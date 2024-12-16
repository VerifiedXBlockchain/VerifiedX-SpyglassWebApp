/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from "next";
import Head from "next/head";
import { IS_TESTNET } from "../../src/constants";
import { VbtcTokenListContainer } from "../../src/components/vbtc-token-list-container";

const VbtcTokensPage: NextPage = () => {
    return (
        <div>
            <Head>
                <title>VFX Spyglass{IS_TESTNET ? ' [TESTNET]' : ''}: vBTC Tokens</title>
                <meta name="description" content="VerifiedX Spyglass: VFX vBTC Tokens" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <a href="/">Home</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <a href="/vbtc-token">vBTC Tokens</a>
                        </li>
                    </ol>
                </nav>

            </div>
            <VbtcTokenListContainer />


        </div>
    );
};

export default VbtcTokensPage;
