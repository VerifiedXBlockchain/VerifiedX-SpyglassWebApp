import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { InfiniteList } from "../../src/components/ui/infinite-list";
import { usePagedList } from "../../src/hooks/usePagedList";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { VbtcTokenList } from "../../src/components/vbtc-token-list";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { VbtcToken } from "../../src/models/vbtc-token";
import { VbtcTokenService } from "../../src/services/vbtc-service";
import { useLocalized } from "../../src/utils/use-localized";
import { VaultHeights } from "../../src/utils/vbtc-vault";

const VbtcTokensPage: NextPage = () => {
  const { t } = useTranslation(["vbtcToken", "common"]);
  const localized = useLocalized();
  const fetchPage = useCallback((page: number) => new VbtcTokenService().list(page), []);
  const { items, loadMore, canLoadMore, loaded } = usePagedList<VbtcToken>(fetchPage, (token) => token.sc_identifier, { pollMs: 5000 });
  const [heights, setHeights] = useState<VaultHeights | null>(null);
  // Without the heights the list shows no vault badges.
  useEffect(() => {
    let cancelled = false;
    new VbtcTokenService()
      .heights()
      .then((data) => {
        if (!cancelled) setHeights(data);
      })
      .catch((error) => console.error("vBTC heights lookup failed", error));
    return () => {
      cancelled = true;
    };
  }, []);
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("vbtcToken:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("vbtcToken:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("vbtcToken:list.breadcrumbCurrent") }]} />
        <PageHeader title={t("vbtcToken:list.breadcrumbCurrent")} />
        <InfiniteList loadMore={loadMore} hasMore={canLoadMore}>
          <VbtcTokenList tokens={items} loading={!loaded} heights={heights} />
        </InfiniteList>
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "search", "vbtcToken"])),
  },
});

export default VbtcTokensPage;
