import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import InfiniteScroll from "react-infinite-scroller";
import { AddressSummary } from "../../src/components/search/address-summary";
import { BlockResults } from "../../src/components/search/block-results";
import { SearchForm } from "../../src/components/search/search-form";
import { ResultTab } from "../../src/components/search/search-type";
import { Tabs } from "../../src/components/search/tabs";
import { useSearch } from "../../src/components/search/use-search";
import { TransactionList } from "../../src/components/transactions/transaction-list";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Card } from "../../src/components/ui/card";
import { SearchIcon } from "../../src/components/ui/icons";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { Pill } from "../../src/components/ui/pill";
import { Skeleton } from "../../src/components/ui/skeleton";
import { CenteredState } from "../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { truncateMiddle } from "../../src/utils/formatting";
import { useLocalized } from "../../src/utils/use-localized";
import styles from "../../src/components/search/search-page.module.scss";

const SearchPage: NextPage = () => {
  const { t } = useTranslation(["search", "common"]);
  const router = useRouter();
  const { locale } = router;
  const localized = useLocalized();
  const q = Array.isArray(router.query.q) ? router.query.q[0] : router.query.q;
  const { state, switchTab, loadMore } = useSearch(q);

  const setQuery = (value: string) => {
    router.push({ pathname: router.pathname, query: value ? { q: value } : {} }, undefined, { shallow: true });
  };

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";
  const active = state[state.tab];
  const listLoading = state.loading && active.items.length === 0;
  const typeLabel = state.type ? t(`search:page.types.${state.type}`) : "";

  return (
    <>
      <Head>
        <title>{`${t("search:page.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("search:page.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("search:page.breadcrumbCurrent") }]} />

        <div className={styles.form}>
          <SearchForm value={state.query} onSubmit={setQuery} onClear={() => setQuery("")} />
        </div>

        {!router.isReady ? null : !state.query ? (
          // Static page: the query string is only known once the router is ready, so hold the empty state until then.
          <Card>
            <CenteredState title={t("search:page.emptyTitle")} body={t("search:page.emptyBody")}>
              <SearchIcon size={28} />
            </CenteredState>
          </Card>
        ) : state.type === "adnr" ? (
          <Card>
            {state.domainNotFound ? (
              <CenteredState title={t("search:page.domainNotFound", { domain: state.query })} body={t("search:page.emptyBody")} />
            ) : (
              <Skeleton height={80} />
            )}
          </Card>
        ) : (
          <>
            <PageHeader
              title={
                state.type === "address" ? (
                  t("search:page.types.address")
                ) : (
                  <>
                    {t("search:page.resultsFor")} <span className={styles.queryValue}>{truncateMiddle(state.query, 10)}</span>
                  </>
                )
              }
              badges={state.type && state.type !== "address" ? <Pill size="md">{typeLabel}</Pill> : null}
            />

            {state.type === "address" ? (
              <div className={styles.summary}>
                <AddressSummary value={state.query} address={state.address} />
              </div>
            ) : null}

            <div className={styles.resultsBar}>
              <Tabs<ResultTab>
                aria-label={t("search:page.tabsAria") as string}
                active={state.tab}
                onChange={switchTab}
                tabs={[
                  { id: "transactions", label: t("search:page.tabs.transactions"), count: state.transactions.count },
                  { id: "blocks", label: t("search:page.tabs.blocks"), count: state.blocks.count },
                ]}
              />
              {active.count !== undefined ? (
                <span className={styles.total}>
                  {state.tab === "transactions" ? t("search:page.totalTransactions", { count: active.count }) : t("search:page.totalBlocks", { count: active.count })}
                </span>
              ) : null}
            </div>

            <InfiniteScroll
              key={`${state.query}-${state.tab}`}
              pageStart={1}
              initialLoad={false}
              loadMore={loadMore}
              hasMore={active.hasMore && !state.loading}
              loader={
                <div key="loader" className={styles.loader}>
                  <Skeleton width={160} height={12} />
                </div>
              }
            >
              {state.tab === "transactions" ? (
                <TransactionList transactions={state.transactions.items} loading={listLoading} emptyLabel={t("search:page.noTransactions", { query: state.query }) as string} />
              ) : (
                <BlockResults blocks={state.blocks.items} loading={listLoading} emptyLabel={t("search:page.noBlocks", { query: state.query }) as string} />
              )}
            </InfiniteScroll>
          </>
        )}
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search", "transaction"])),
  },
});

export default SearchPage;
