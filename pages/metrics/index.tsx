import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LatestBlockCard } from "../../src/components/metrics/latest-block-card";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Card } from "../../src/components/ui/card";
import { DetailList, DetailRow } from "../../src/components/ui/detail-list";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { StatTile } from "../../src/components/ui/stat-tile";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { Circulation } from "../../src/models/circulation";
import { NetworkMetrics } from "../../src/models/network_metrics";
import { CirculationService } from "../../src/services/circulation-service";
import { NetworkMetricsService } from "../../src/services/network-metrics-service";
import { useLocalized } from "../../src/utils/use-localized";
import styles from "../../src/components/metrics/metrics-overview.module.scss";

const REFRESH_MS = 15000;

/** undefined = loading, null = endpoint failed. */
type Loadable<T> = T | null | undefined;

const MetricsPage: NextPage = () => {
  const { t } = useTranslation(["metrics", "common"]);
  const { locale } = useRouter();
  const localized = useLocalized();
  const [circulation, setCirculation] = useState<Loadable<Circulation>>(undefined);
  const [metrics, setMetrics] = useState<Loadable<NetworkMetrics>>(undefined);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await new CirculationService().retrieve();
        if (!cancelled) setCirculation(data);
      } catch (error) {
        console.error("Circulation unavailable", error);
        if (!cancelled) setCirculation(null);
      }
      try {
        const data = await new NetworkMetricsService().retrieve();
        if (!cancelled) setMetrics(data);
      } catch (error) {
        console.error("Network metrics unavailable", error);
        if (!cancelled) setMetrics(null);
      }
    };
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";
  const dash = <span className={styles.dash}>—</span>;
  const unavailable = t("metrics:unavailable");
  const vfx = (value: number | undefined) => (value === undefined ? dash : value.toLocaleString(locale, { maximumFractionDigits: 2 }));
  const count = (value: number | undefined) => (value === undefined ? dash : value.toLocaleString(locale));
  const supplyValue = (pick: (c: Circulation) => number) => (circulation === undefined ? undefined : circulation === null ? dash : vfx(pick(circulation)));
  const countValue = (pick: (c: Circulation) => number) => (circulation === undefined ? undefined : circulation === null ? dash : count(pick(circulation)));
  const supplySub = circulation === null ? unavailable : t("metrics:units.vfx");
  const seconds = (value: number) => value.toLocaleString(locale, { maximumFractionDigits: 1 });

  return (
    <>
      <Head>
        <title>{`${t("metrics:pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("metrics:description") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("metrics:heading") }]} />
        <PageHeader title={t("metrics:heading")} meta={t("metrics:description")} />

        <section className={styles.grid} aria-label={t("metrics:supplyHeading") as string}>
          <StatTile label={t("metrics:labels.circulatingSupply")} value={supplyValue((c) => c.balance)} sub={supplySub} />
          <StatTile label={t("metrics:labels.lifetimeSupply")} value={supplyValue((c) => c.lifetimeSupply)} sub={supplySub} />
          <StatTile label={t("metrics:labels.amountAssured")} value={supplyValue((c) => c.totalStaked)} sub={supplySub} />
          <StatTile label={t("metrics:labels.totalBurnedFees")} value={supplyValue((c) => c.feesBurnedSum)} sub={supplySub} />
          <StatTile label={t("metrics:labels.totalTransactions")} value={countValue((c) => c.totalTransactions)} sub={circulation === null ? unavailable : t("metrics:labels.totalTransactionsSub")} />
          <StatTile label={t("metrics:labels.totalVfxAddresses")} value={countValue((c) => c.totalAddresses)} sub={circulation === null ? unavailable : t("metrics:labels.totalVfxAddressesSub")} />
          <StatTile
            label={t("metrics:labels.activeValidatorPool")}
            value={countValue((c) => c.activeMasterNodes)}
            sub={circulation === null ? unavailable : <a href={localized("/validators")}>{t("metrics:labels.viewValidators")}</a>}
          />
          <StatTile
            label={t("metrics:labels.cliVersion")}
            value={circulation === undefined ? undefined : circulation === null ? dash : <span className={styles.mono}>{circulation.cliVersion}</span>}
            sub={circulation === null ? unavailable : t("metrics:labels.cliVersionSub")}
          />
        </section>

        <div className={styles.columns}>
          <Card title={t("metrics:labels.networkMetrics")} as="section" aria-label={t("metrics:labels.networkMetrics") as string}>
            <DetailList>
              <DetailRow label={t("metrics:labels.blockDifferenceAverage")} mono>
                {metrics === undefined ? "…" : metrics === null ? dash : `${seconds(metrics.blockDifferenceAverage)} ${t("metrics:units.seconds")}`}
              </DetailRow>
              <DetailRow label={t("metrics:labels.blockLastDelay")} mono>
                {metrics === undefined ? "…" : metrics === null ? dash : `${seconds(metrics.blockLastDelay)} ${t("metrics:units.seconds")}`}
              </DetailRow>
              <DetailRow label={t("metrics:labels.blockAverages")} mono>
                {metrics === undefined ? "…" : metrics === null ? dash : metrics.blocksAverages}
              </DetailRow>
            </DetailList>
          </Card>
          <LatestBlockCard />
        </div>
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "metrics", "search"])),
  },
});

export default MetricsPage;
