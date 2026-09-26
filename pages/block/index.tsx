import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BlockFeed } from "../../src/components/blocks/block-feed";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { useBlockPages } from "../../src/hooks/useBlockPages";
import { useLocalized } from "../../src/utils/use-localized";

const BlockListPage: NextPage = () => {
  const { t } = useTranslation(["block", "common"]);
  const localized = useLocalized();
  const feed = useBlockPages({ pollMs: 5000 });
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("block:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("block:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("block:list.breadcrumbCurrent") }]} />
        <PageHeader title={t("block:list.heading")} meta={t("block:list.description")} />
        <BlockFeed blocks={feed.blocks} loadMore={feed.loadMore} canLoadMore={feed.canLoadMore} loading={!feed.loaded} />
      </Page>
    </>
  );
};

export default BlockListPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search"])),
  },
});
