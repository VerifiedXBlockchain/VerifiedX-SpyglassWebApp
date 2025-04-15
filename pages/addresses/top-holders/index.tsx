/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import Head from "next/head";
import { IS_TESTNET } from "../../../src/constants";
import { TopHoldersList } from "../../../src/components/top-holders-list";


const TopHoldersPage: NextPage = () => {

    return (
        <div>
            <Head>
                <title>VFX Spyglass{IS_TESTNET ? ' [TESTNET]' : ''}: Top Holders</title>
                <meta name="description" content="VerifiedX Spyglass: VFX Domains" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <a href="/">Home</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <a href="/addresses/top-holders">Top Holders</a>
                        </li>
                    </ol>
                </nav>

            </div>

            <TopHoldersList />

        </div>
    );
};

export default TopHoldersPage;