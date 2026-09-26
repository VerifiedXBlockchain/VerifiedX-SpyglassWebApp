import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Card } from "../../../src/components/ui/card";
import { Column, DataTable } from "../../../src/components/ui/data-table";
import { Hash } from "../../../src/components/ui/hash";
import { Page } from "../../../src/components/ui/page";
import { PageHeader } from "../../../src/components/ui/page-header";
import { CenteredState } from "../../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { TopHolder } from "../../../src/models/address";
import { AddressService } from "../../../src/services/address-service";
import { useLocalized } from "../../../src/utils/use-localized";
import cells from "../../../src/components/blocks/block-cells.module.scss";

type Ranked = TopHolder & { rank: number };

const TopHoldersPage: NextPage = () => {
  const { t } = useTranslation(["search", "common"]);
  const { locale } = useRouter();
  const localized = useLocalized();
  const [holders, setHolders] = useState<Ranked[] | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    new AddressService()
      .topHolders()
      .then((data) => {
        if (!cancelled) setHolders(data.map((holder, index) => Object.assign(holder, { rank: index + 1 })));
      })
      .catch((error) => {
        console.error("Top holders fetch failed", error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  const columns: Column<Ranked>[] = [
    { key: "rank", header: "#", align: "end", nowrap: true, width: "1%", render: (h) => <span className={cells.mono}>{h.rank}</span> },
    { key: "address", header: t("search:topHolders.table.address"), nowrap: true, render: (h) => <Hash value={h.address} side={12} href={localized(`/search?q=${encodeURIComponent(h.address)}`)} /> },
    {
      key: "domain",
      header: t("search:topHolders.table.domain"),
      render: (h) => (h.adnr?.domain ? <span className={cells.primary}>{h.adnr.domain}</span> : <span className={cells.empty}>—</span>),
    },
    {
      key: "balance",
      header: t("search:topHolders.table.balance"),
      align: "end",
      nowrap: true,
      render: (h) => (
        <span className={cells.amount}>
          {h.balance.toLocaleString(locale, { maximumFractionDigits: 2 })}
          <span className={cells.unit}>VFX</span>
        </span>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>{`${t("search:topHolders.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("search:topHolders.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page narrow>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("search:topHolders.breadcrumbCurrent") }]} />
        <PageHeader title={t("search:topHolders.heading")} meta={t("search:topHolders.description")} />
        {failed ? (
          <Card>
            <CenteredState title={t("search:topHolders.error")} />
          </Card>
        ) : (
          <DataTable
            columns={columns}
            rows={holders ?? []}
            rowKey={(h) => h.address}
            rowHref={(h) => localized(`/search?q=${encodeURIComponent(h.address)}`)}
            loading={holders === undefined}
            skeletonRows={12}
            emptyLabel={t("search:topHolders.empty")}
            caption={t("search:topHolders.heading") as string}
            dense
          />
        )}
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "search"])),
  },
});

export default TopHoldersPage;
