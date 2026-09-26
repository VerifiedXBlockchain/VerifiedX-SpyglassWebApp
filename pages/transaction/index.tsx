import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TransactionFeed } from "../../src/components/transactions/transaction-feed";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { useLocalized } from "../../src/utils/use-localized";

const TransactionListPage: NextPage = () => {
  const { t } = useTranslation(["transaction", "common"]);
  const localized = useLocalized();
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("transaction:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("transaction:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("transaction:list.breadcrumbCurrent") }]} />
        <PageHeader title={t("transaction:list.heading")} meta={t("transaction:list.description")} />
        <TransactionFeed />
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "search", "transaction"])),
  },
});

export default TransactionListPage;
