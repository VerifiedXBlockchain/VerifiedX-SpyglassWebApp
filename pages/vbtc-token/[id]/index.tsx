/* eslint-disable @next/next/no-html-link-for-pages */

import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { VbtcToken } from "../../../src/models/vbtc-token";
import { VbtcTokenService } from "../../../src/services/vbtc-service";
import { IS_TESTNET, IS_DEVNET } from "../../../src/constants";
import Head from "next/head";
import { VbtcTokenDetail } from "../../../src/components/vbtc-token-detail";


const VbtcTokenDetailPage: NextPage = () => {

    const { t } = useTranslation(["vbtcToken", "common"]);
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

    const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';

    return <>

        <Head>

            <meta name="description" />
            <title>{`${t("vbtcToken:detail.pageTitle", { name: token.name })}${netTag}`}</title>
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
                            <a href="/vbtc-token">{t("vbtcToken:list.breadcrumbCurrent")}</a>
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'vbtcToken'])),
  },
});

export default VbtcTokenDetailPage;
