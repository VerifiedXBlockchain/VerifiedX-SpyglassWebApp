/* eslint-disable @next/next/no-html-link-for-pages */
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TestnetFaucetForm from "../../src/components/testnet-faucet-form";
import { useEffect, useState } from "react";
import { TestnetFaucetInfo } from "../../src/models/testnet-faucet-info";
import { FaucetService } from "../../src/services/faucet-service";
import { IS_TESTNET, IS_DEVNET } from "../../src/constants";


const faucetService = new FaucetService();


const FaucetPage: NextPage = () => {
    const { t } = useTranslation(["faucet", "common"]);

    const [info, setInfo] = useState<TestnetFaucetInfo | null>(null);


    useEffect(() => {
        faucetService.info().then((data) => {
            setInfo(data);
        })
    }, [])

    const title = IS_DEVNET ? t("faucet:pageTitleDevnet") : IS_TESTNET ? t("faucet:pageTitleTestnet") : t("faucet:pageTitleMainnet");

    return (
        <div>
            <div className="container">
                <h3 className="mt-3 text-center">{title}</h3>
                <div className="py-1"></div>


                {info && <TestnetFaucetForm info={info} />}

            </div>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'faucet', 'search'])),
  },
});

export default FaucetPage;
