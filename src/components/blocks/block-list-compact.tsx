import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Block } from "../../models/block";
import { truncateMiddle } from "../../utils/formatting";
import { formatRelativeTime } from "../../utils/relative-time";
import { useLocalized } from "../../utils/use-localized";
import { Pill } from "../ui/pill";
import { Skeleton } from "../ui/skeleton";
import styles from "./block-list-compact.module.scss";

interface Props {
  blocks: Block[];
  loading?: boolean;
  now: number;
  emptyLabel?: string;
}

/** Phone layout: one tappable row per block with the essentials only. */
export const BlockListCompact = ({ blocks, loading, now, emptyLabel }: Props) => {
  const { t } = useTranslation("block");
  const localized = useLocalized();
  const { locale } = useRouter();

  return (
    <div className={styles.list}>
      {blocks.map((block) => (
        <a key={block.height} href={localized(`/block/${block.height}`)} className={styles.row}>
          <div className={styles.height}>
            <span className={styles.heightValue}>{block.height.toLocaleString(locale)}</span>
            <span className={styles.sub}>{formatRelativeTime(block.dateCrafted, now, locale)}</span>
          </div>
          <div className={styles.validator}>
            <span className={styles.validatorName}>{block.masternode ? block.masternode.uniqueNameLabel : truncateMiddle(block.validator, 6)}</span>
            <span className={styles.sub}>{block.masternode?.locationLabel || t("row.locationFallback")}</span>
          </div>
          <div className={styles.meta}>
            <Pill tone={block.transactions.length > 0 ? "accent" : "neutral"}>{t("row.txsCount", { count: block.transactions.length })}</Pill>
            <span className={styles.mono}>{t("row.craftTimeMs", { ms: block.craftTime })}</span>
          </div>
        </a>
      ))}
      {loading
        ? Array.from({ length: 8 }).map((_, index) => (
            <div key={`skeleton-${index}`} className={styles.row} aria-hidden="true">
              <div className={styles.height}>
                <Skeleton width={72} height={14} />
                <Skeleton width={48} height={10} />
              </div>
              <div className={styles.validator}>
                <Skeleton width="60%" height={14} />
                <Skeleton width="40%" height={10} />
              </div>
              <div className={styles.meta}>
                <Skeleton width={44} height={18} radius={999} />
              </div>
            </div>
          ))
        : null}
      {!loading && blocks.length === 0 && emptyLabel ? <div className={styles.empty}>{emptyLabel}</div> : null}
    </div>
  );
};
