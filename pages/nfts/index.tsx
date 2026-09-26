import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NftGrid } from "../../src/components/tokens/nft-grid";
import { PagedFeed } from "../../src/components/tokens/paged-feed";
import { usePagedList } from "../../src/components/tokens/use-paged-list";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { Nft } from "../../src/models/nft";
import { NftService } from "../../src/services/nft-service";
import { useLocalized } from "../../src/utils/use-localized";

const NftListPage: NextPage = () => {
  const { t } = useTranslation(["nft", "common"]);
  const localized = useLocalized();
  const fetchPage = useCallback((page: number) => new NftService().list(page), []);
  const { items, loadMore, canLoadMore, loaded } = usePagedList<Nft>(fetchPage, (nft) => nft.identifier);
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("nft:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("nft:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("nft:list.breadcrumbCurrent") }]} />
        <PageHeader title={t("nft:list.breadcrumbCurrent")} />
        <PagedFeed loadMore={loadMore} canLoadMore={canLoadMore}>
          <NftGrid nfts={items} loading={!loaded} />
        </PagedFeed>
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "nft", "search"])),
  },
});

export default NftListPage;
