/* eslint-disable @next/next/no-html-link-for-pages */

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IS_TESTNET } from "../../../src/constants";
import Head from "next/head";
import { FungibleToken, FungibleTokenDetailResponse } from "../../../src/models/fungible-token";
import { FungibleTokenService } from "../../../src/services/fungible-token-service";
import { FungibleTokenDetail } from "../../../src/components/fungible-token-detail";


const FungibleTokenDetailPage: NextPage = () => {


    const { id } = useRouter().query;

    const [tokenDetails, setTokenDetails] = useState<FungibleTokenDetailResponse | undefined>(undefined);

    useEffect(() => {
        if (!id) return;

        const service = new FungibleTokenService();

        service.retrieve(id.toString()).then((data) => {
            console.log(data);
            setTokenDetails(data);
        });
    }, [id]);

    if (!tokenDetails) return <></>;

    const token = tokenDetails.token;

    return <>

        <Head>

            <meta name="description" />
            <title>{`VFX Explorer: Fungible Token: ${token.name}`}{IS_TESTNET ? ' [TESTNET]' : ''}</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <div>
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <a href="/">Home</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <a href="/fungible-token">Fungible Tokens</a>
                        </li>

                        <li className="breadcrumb-item active" aria-current="page">
                            <a href={`/fungible-token/${id}`}>{token.name}</a>
                        </li>

                    </ol>
                </nav>
            </div>

            <FungibleTokenDetail token={token} holders={tokenDetails.holders} />
        </div>


    </>;
}

export default FungibleTokenDetailPage;
