import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useNow } from "../../hooks/useNow";
import { Block } from "../../models/block";
import { Circulation } from "../../models/circulation";
import { NetworkMetrics } from "../../models/network_metrics";
import { CirculationService } from "../../services/circulation-service";
import { NetworkMetricsService } from "../../services/network-metrics-service";
import { formatRelativeTime } from "../../utils/relative-time";
import { useLocalized } from "../../utils/use-localized";
import { LiveDot } from "../ui/pill";
import { StatTile } from "../ui/stat-tile";
import styles from "./network-overview.module.scss";

const REFRESH_MS = 15000;

/** undefined = loading, null = the endpoint failed (shown as unavailable, never as a blank tile). */
type Loadable<T> = T | null | undefined;

interface Props {
  latestBlock?: Block;
}

export const NetworkOverview = ({ latestBlock }: Props) => {
  const { t } = useTranslation("block");
  const { locale } = useRouter();
  const localized = useLocalized();
  const now = useNow(1000);
  const [metrics, setMetrics] = useState<Loadable<NetworkMetrics>>(undefined);
  const [circulation, setCirculation] = useState<Loadable<Circulation>>(undefined);

  useEffect(() => {
    let cancelled = false;
    const metricsService = new NetworkMetricsService();
    const circulationService = new CirculationService();

    const load = async () => {
      try {
        const data = await metricsService.retrieve();
        if (!cancelled) setMetrics(data);
      } catch (error) {
        console.error("Network metrics unavailable", error);
        if (!cancelled) setMetrics(null);
      }
      try {
        const data = await circulationService.retrieve();
        if (!cancelled) setCirculation(data);
      } catch (error) {
        console.error("Circulation unavailable", error);
        if (!cancelled) setCirculation(null);
      }
    };

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const dash = <span className={styles.dash}>—</span>;
  const unavailable = t("overview.unavailable");
  const seconds = (value: number) => value.toLocaleString(locale, { maximumFractionDigits: 1 });

  return (
    <section className={styles.grid} aria-label={t("overview.ariaLabel") as string}>
      <StatTile
        label={t("overview.latestBlock")}
        value={latestBlock ? latestBlock.height.toLocaleString(locale) : undefined}
        sub={
          latestBlock ? (
            <>
              <LiveDot />
              {formatRelativeTime(latestBlock.dateCrafted, now, locale)}
            </>
          ) : null
        }
      />
      <StatTile
        label={t("overview.avgBlockTime")}
        value={metrics === undefined ? undefined : metrics === null ? dash : seconds(metrics.blockDifferenceAverage)}
        unit={metrics ? "s" : undefined}
        sub={metrics === null ? unavailable : t("overview.avgBlockTimeSub")}
      />
      <StatTile
        label={t("overview.lastBlockDelay")}
        value={metrics === undefined ? undefined : metrics === null ? dash : seconds(metrics.blockLastDelay)}
        unit={metrics ? "s" : undefined}
        sub={metrics === null ? unavailable : t("overview.lastBlockDelaySub")}
      />
      <StatTile
        label={t("overview.activeValidators")}
        value={circulation === undefined ? undefined : circulation === null ? dash : circulation.activeMasterNodes.toLocaleString(locale)}
        sub={circulation === null ? unavailable : <a href={localized("/validators/search")}>{t("overview.checkStatus")}</a>}
      />
    </section>
  );
};
