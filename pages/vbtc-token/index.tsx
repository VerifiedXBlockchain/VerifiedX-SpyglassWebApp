/* eslint-disable @next/next/no-html-link-for-pages */
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IS_TESTNET, IS_DEVNET } from "../../src/constants";
import { VbtcTokenListContainer } from "../../src/components/vbtc-token-list-container";

const VbtcTokensPage: NextPage = () => {
    const { t } = useTranslation(["vbtcToken", "common"]);
    const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';
    return (
        <div>
            <Head>
                <title>{`${t("vbtcToken:list.pageTitle")}${netTag}`}</title>
                <meta name="description" content={t("vbtcToken:list.metaDescription") as string} />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <a href="/">{t("common:breadcrumb.home")}</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <a href="/vbtc-token">{t("vbtcToken:list.breadcrumbCurrent")}</a>
                        </li>
                    </ol>
                </nav>

            </div>
            <VbtcTokenListContainer />


        </div>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'vbtcToken', 'search'])),
  },
});

export default VbtcTokensPage;
