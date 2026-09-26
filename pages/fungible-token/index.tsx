import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FungibleTokenList } from "../../src/components/fungible-token-list";
import { InfiniteList } from "../../src/components/ui/infinite-list";
import { usePagedList } from "../../src/hooks/usePagedList";
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
  const { items, loadMore, canLoadMore, loaded } = usePagedList<FungibleToken>(fetchPage, (token) => token.sc_identifier, { pollMs: 5000 });
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
        <InfiniteList loadMore={loadMore} hasMore={canLoadMore}>
          <FungibleTokenList tokens={items} loading={!loaded} />
        </InfiniteList>
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
