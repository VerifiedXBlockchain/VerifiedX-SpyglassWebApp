import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useNow } from "../../hooks/useNow";
import { Block } from "../../models/block";
import { NetworkMetrics } from "../../models/network_metrics";
import { NetworkMetricsService } from "../../services/network-metrics-service";
import { ValidatorService } from "../../services/validator-service";
import { blockTiming } from "../../utils/blocks";
import { formatRelativeTime } from "../../utils/relative-time";
import { useLocalized } from "../../utils/use-localized";
import { LiveDot } from "../ui/pill";
import { StatTile } from "../ui/stat-tile";
import styles from "./network-overview.module.scss";

const REFRESH_MS = 15000;

/** undefined = loading, null = the endpoint failed. */
type Loadable<T> = T | null | undefined;

interface Props {
  /** Blocks already loaded for the feed, newest first. */
  blocks: Block[];
}

/**
 * Headline numbers for the network. Block timing is derived from the blocks
 * on the page and only replaced by the indexer's rolling average when that
 * endpoint answers (it does not exist on every network). The validator count
 * comes from the masternode list, which every indexer serves.
 */
export const NetworkOverview = ({ blocks }: Props) => {
  const { t } = useTranslation("block");
  const { locale } = useRouter();
  const localized = useLocalized();
  const now = useNow(1000);
  const [metrics, setMetrics] = useState<Loadable<NetworkMetrics>>(undefined);
  const [validatorCount, setValidatorCount] = useState<Loadable<number>>(undefined);

  useEffect(() => {
    let cancelled = false;
    const metricsService = new NetworkMetricsService();
    const validatorService = new ValidatorService();

    const load = async () => {
      try {
        const data = await metricsService.retrieve();
        if (!cancelled) setMetrics(Number.isFinite(data.blockDifferenceAverage) ? data : null);
      } catch (error) {
        console.error("Network metrics unavailable", error);
        if (!cancelled) setMetrics(null);
      }
      try {
        const data = await validatorService.list(1, { is_active: true, compact: true });
        if (!cancelled) setValidatorCount(Number.isFinite(data.count) ? data.count : null);
      } catch (error) {
        console.error("Validator count unavailable", error);
        if (!cancelled) setValidatorCount(null);
      }
    };

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const latestBlock = blocks[0];
  const timing = useMemo(() => blockTiming(blocks), [blocks]);
  const dash = <span className={styles.dash}>—</span>;
  const unavailable = t("overview.unavailable");
  const seconds = (value: number) => value.toLocaleString(locale, { maximumFractionDigits: 1 });

  // Average: indexer's rolling figure when available, else the mean over the loaded blocks.
  const average = metrics
    ? { value: seconds(metrics.blockDifferenceAverage), sub: t("overview.avgBlockTimeSub") }
    : timing.averageSeconds !== undefined
    ? { value: seconds(timing.averageSeconds), sub: t("overview.avgBlockTimeComputedSub", { count: timing.sampleSize }) }
    : metrics === null
    ? { value: dash, sub: unavailable }
    : undefined;

  const lastDelay =
    timing.lastDelaySeconds !== undefined
      ? { value: seconds(timing.lastDelaySeconds) }
      : metrics
      ? { value: seconds(metrics.blockLastDelay) }
      : metrics === null
      ? { value: dash }
      : undefined;

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
      <StatTile label={t("overview.avgBlockTime")} value={average?.value} unit={average && average.value !== dash ? "s" : undefined} sub={average?.sub} />
      <StatTile
        label={t("overview.lastBlockDelay")}
        value={lastDelay?.value}
        unit={lastDelay && lastDelay.value !== dash ? "s" : undefined}
        sub={lastDelay ? (lastDelay.value === dash ? unavailable : t("overview.lastBlockDelaySub")) : undefined}
      />
      <StatTile
        label={t("overview.activeValidators")}
        value={validatorCount === undefined ? undefined : validatorCount === null ? dash : validatorCount.toLocaleString(locale)}
        sub={validatorCount === null ? unavailable : <a href={localized("/validators/search")}>{t("overview.checkStatus")}</a>}
      />
    </section>
  );
};
