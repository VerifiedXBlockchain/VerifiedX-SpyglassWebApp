import type { NextPage } from "next";
import Head from "next/head";
import { isMobile } from "react-device-detect";
import { ValidatorListContainer } from "../../src/components/validator-list-container";
import { ValidatorRowsContainer } from "../../src/components/validator-rows-container";
import { IS_TESTNET } from "../../src/constants";

const ValidatorPoolPage: NextPage = () => {
    if (typeof window === "undefined") {
        return null;
    }

    return (
        <div>
            <Head>
                <title>VFX Explorer: Validator Pool{IS_TESTNET ? ' [TESTNET]' : ''}</title>
                <meta name="description" content="ReserveBlock Explorer: Home" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            {isMobile ? <ValidatorListContainer /> : <ValidatorRowsContainer />}
        </div>
    );
};


export default ValidatorPoolPage;
