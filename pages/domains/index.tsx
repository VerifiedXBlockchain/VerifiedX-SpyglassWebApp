/* eslint-disable @next/next/no-html-link-for-pages */
import type { NextPage } from "next";
import Head from "next/head";
import { AdnrListContainer } from "../../src/components/adnr-list.container";
import { IS_TESTNET } from "../../src/constants";

const AdnrListPage: NextPage = () => {
    return (
        <div>
            <Head>
                <title>VFX Spyglass{IS_TESTNET ? ' [TESTNET]' : ''}: Domains</title>
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
                            <a href="/domains">Domains</a>
                        </li>
                    </ol>
                </nav>

            </div>
            <AdnrListContainer />


        </div>
    );
};

export default AdnrListPage;
