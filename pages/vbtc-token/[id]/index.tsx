import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { VbtcToken } from "../../../src/models/vbtc-token";
import { VbtcTokenService } from "../../../src/services/vbtc-service";
import { IS_TESTNET } from "../../../src/constants";
import Head from "next/head";
import { VbtcTokenDetail } from "../../../src/components/vbtc-token-detail";


const VbtcTokenDetailPage: NextPage = () => {


    const { id } = useRouter().query;

    const [token, setToken] = useState<VbtcToken | undefined>(undefined);

    useEffect(() => {
        if (!id) return;

        const service = new VbtcTokenService();

        service.retrieve(id.toString()).then((data) => {
            console.log(data);
            setToken(data);
        });
    }, [id]);

    if (!token) return <></>;

    return <>

        <Head>

            <meta name="description" />
            <title>{`VFX Explorer: vBTC Token: ${token.name}`}{IS_TESTNET ? ' [TESTNET]' : ''}</title>
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
                            <a href="/vbtc-token">vBTC Tokens</a>
                        </li>

                        <li className="breadcrumb-item active" aria-current="page">
                            <a href={`/vbtc-token/${id}`}>{token.name}</a>
                        </li>

                    </ol>
                </nav>
            </div>

            <VbtcTokenDetail token={token} />
        </div>


    </>;
}

export default VbtcTokenDetailPage;
