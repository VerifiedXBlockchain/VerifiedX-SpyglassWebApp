import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FungibleTokenList } from "../../src/components/fungible-token-list";
import { PagedFeed } from "../../src/components/tokens/paged-feed";
import { usePagedList } from "../../src/components/tokens/use-paged-list";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { FungibleToken } from "../../src/models/fungible-token";
import { FungibleTokenService } from "../../src/services/fungible-token-service";
import { useLocalized } from "../../src/utils/use-localized";

const FungibleTokenPage: NextPage = () => {
  const { t } = useTranslation(["fungibleToken", "common"]);
  const localized = useLocalized();
  const fetchPage = useCallback((page: number) => new FungibleTokenService().list(page), []);
  const { items, loadMore, canLoadMore, loaded } = usePagedList<FungibleToken>(fetchPage, (token) => token.sc_identifier);
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("fungibleToken:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("fungibleToken:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("fungibleToken:list.breadcrumbCurrent") }]} />
        <PageHeader title={t("fungibleToken:list.breadcrumbCurrent")} />
        <PagedFeed loadMore={loadMore} canLoadMore={canLoadMore}>
          <FungibleTokenList tokens={items} loading={!loaded} />
        </PagedFeed>
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "fungibleToken", "search"])),
  },
});

export default FungibleTokenPage;
