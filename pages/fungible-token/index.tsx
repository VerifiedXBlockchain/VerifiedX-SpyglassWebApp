/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from "next";
import Head from "next/head";
import { IS_TESTNET } from "../../src/constants";
import { FungibleTokenListContainer } from "../../src/components/fungible-token-list-container";

const FungibleTokenPage: NextPage = () => {
    return (
        <div>
            <Head>
                <title>VFX Spyglass{IS_TESTNET ? ' [TESTNET]' : ''}: Fungible Tokens</title>
                <meta name="description" content="VerifiedX Spyglass: VFX Fungible Tokens" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <a href="/">Home</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <a href="/fungible-token">Fungible Tokens</a>
                        </li>
                    </ol>
                </nav>

            </div>
            <FungibleTokenListContainer />


        </div>
    );
};

export default FungibleTokenPage;
