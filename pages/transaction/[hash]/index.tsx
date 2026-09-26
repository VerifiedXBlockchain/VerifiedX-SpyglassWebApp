import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TransactionDetail } from "../../../src/components/transaction-detail";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Card } from "../../../src/components/ui/card";
import { Page } from "../../../src/components/ui/page";
import { Skeleton } from "../../../src/components/ui/skeleton";
import { CenteredState, Spinner } from "../../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { useTransactionPolling } from "../../../src/hooks/useTransactionPolling";
import { truncateMiddle } from "../../../src/utils/formatting";
import { useLocalized } from "../../../src/utils/use-localized";

const TransactionDetailPage: NextPage = () => {
  const router = useRouter();
  const { hash } = router.query;
  const { t } = useTranslation(["transaction", "common"]);
  const localized = useLocalized();
  const { transaction, loading, error } = useTransactionPolling(hash);

  const hashText = `${hash ?? ""}`;
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("transaction:detail.pageTitle", { hash: truncateMiddle(hashText, 6) })}${netTag}`}</title>
        <meta name="description" content={t("transaction:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs
          items={[
            { label: t("common:breadcrumb.home"), href: localized("/") },
            { label: t("common:nav.transactions"), href: localized("/transaction") },
            { label: truncateMiddle(hashText, 8), mono: true },
          ]}
        />
        {transaction && !loading && !error ? (
          <TransactionDetail transaction={transaction} />
        ) : error ? (
          // Not indexed yet: the hook keeps polling until the broadcast lands.
          <Card>
            <CenteredState title={t("transaction:detail.pendingHeading")} body={t("transaction:detail.pendingBody")}>
              <Spinner size="lg" />
            </CenteredState>
          </Card>
        ) : (
          <>
            <Skeleton width={220} height={30} />
            <div style={{ height: 18 }} />
            <Card>
              <Skeleton height={160} />
            </Card>
          </>
        )}
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "search", "transaction"])),
  },
});

export default TransactionDetailPage;
