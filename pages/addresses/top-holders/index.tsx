/* eslint-disable @next/next/no-html-link-for-pages */
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IS_TESTNET, IS_DEVNET } from "../../../src/constants";
import { TopHoldersList } from "../../../src/components/top-holders-list";


const TopHoldersPage: NextPage = () => {
    const { t } = useTranslation(["search", "common"]);
    const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';

    return (
        <div>
            <Head>
                <title>{`${t("search:topHolders.pageTitle")}${netTag}`}</title>
                <meta name="description" content={t("search:topHolders.metaDescription") as string} />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <div className="container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb align-items-center">
                        <li className="breadcrumb-item">
                            <a href="/">{t("common:breadcrumb.home")}</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            <a href="/addresses/top-holders">{t("search:topHolders.breadcrumbCurrent")}</a>
                        </li>
                    </ol>
                </nav>

            </div>

            <TopHoldersList />

        </div>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'search'])),
  },
});

export default TopHoldersPage;
