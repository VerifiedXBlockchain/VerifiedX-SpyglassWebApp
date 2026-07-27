/* eslint-disable @next/next/no-html-link-for-pages */
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BlockListContainer } from "../../src/components/block-list-container";
import { Search } from "../../src/components/search";
import { API_BASE_URL, IS_TESTNET, IS_DEVNET } from "../../src/constants";
import { Block } from "../../src/models/block";

const BlockListPage: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const { t } = useTranslation(["block", "common"]);

  const results: any[] = data.results;
  const blocks: Block[] = results.map(b => new Block(b));

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';

  return (
    <div>
      <Head>
        <title>{`${t("block:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("block:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href="/">{t("common:breadcrumb.home")}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/block">{t("block:list.breadcrumbCurrent")}</a>
            </li>
          </ol>
        </nav>
      </div>

      <BlockListContainer initialBlocks={blocks} />
    </div>
  );
};

export default BlockListPage;


export const getServerSideProps: GetServerSideProps = async ({ req, res, locale }) => {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=30, stale-while-revalidate=59'
  )

  const url = `${API_BASE_URL}/blocks/?page=1`;
  const result = await fetch(url)
  const data: any[] = await result.json()


  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['block', 'common', 'search'])),
      data: data
    },
  }
}
