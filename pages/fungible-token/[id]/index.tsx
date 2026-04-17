/* eslint-disable @next/next/no-html-link-for-pages */

import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IS_TESTNET, IS_DEVNET } from "../../../src/constants";
import Head from "next/head";
import { FungibleToken, FungibleTokenDetailResponse } from "../../../src/models/fungible-token";
import { FungibleTokenService } from "../../../src/services/fungible-token-service";
import { FungibleTokenDetail } from "../../../src/components/fungible-token-detail";


const FungibleTokenDetailPage: NextPage = () => {

    const { t } = useTranslation(["fungibleToken", "common"]);
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
    const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';

    return <>

        <Head>

            <meta name="description" />
            <title>{`${t("fungibleToken:detail.pageTitle", { name: token.name })}${netTag}`}</title>
            <link rel="icon" href="/favicon.png" />
        </Head>

        <div>
            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <a href="/">{t("common:breadcrumb.home")}</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <a href="/fungible-token">{t("fungibleToken:list.breadcrumbCurrent")}</a>
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'fungibleToken'])),
  },
});

export default FungibleTokenDetailPage;
