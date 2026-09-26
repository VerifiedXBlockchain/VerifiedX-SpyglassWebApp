import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Block } from "../../models/block";
import { numberWithCommas } from "../../utils/formatting";
import { formatRelativeTime } from "../../utils/relative-time";
import { useLocalized } from "../../utils/use-localized";
import { Hash } from "../ui/hash";
import { ChevronDownIcon, ChevronUpIcon } from "../ui/icons";
import { Pill } from "../ui/pill";
import styles from "./block-cells.module.scss";

// Cells shared by the block table (tablet and up) and the compact phone list.

export const HeightLink = ({ block }: { block: Block }) => {
  const localized = useLocalized();
  const { locale } = useRouter();
  return (
    <a href={localized(`/block/${block.height}`)} className={styles.height}>
      {block.height.toLocaleString(locale)}
    </a>
  );
};

export const ValidatorCell = ({ block }: { block: Block }) => {
  const { t } = useTranslation("block");
  const localized = useLocalized();
  return (
    <div className={styles.stack}>
      {block.masternode ? (
        <a href={localized(`/validators/${block.masternode.address}`)} className={styles.validatorLink}>
          {block.masternode.uniqueNameLabel}
        </a>
      ) : (
        <Hash value={block.validator} side={6} copy={false} href={localized(`/validators/${block.validator}`)} />
      )}
      <span className={styles.sub}>{block.masternode?.locationLabel || t("row.locationFallback")}</span>
    </div>
  );
};

/** One tx: its hash. Several: a count pill that expands to the list. None: a dash. */
export const BlockTxCell = ({ block }: { block: Block }) => {
  const { t } = useTranslation("block");
  const localized = useLocalized();
  const [expanded, setExpanded] = useState(false);
  const txs = block.transactions;

  if (txs.length === 0) return <span className={styles.empty}>{t("row.noTransactions")}</span>;
  if (txs.length === 1) return <Hash value={txs[0].hash} side={6} copy={false} href={localized(`/transaction/${txs[0].hash}`)} />;

  return (
    <div>
      <Pill
        tone="accent"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-label={t("row.toggleTxs") as string}
        icon={expanded ? <ChevronUpIcon size={11} /> : <ChevronDownIcon size={11} />}
      >
        {t("row.txsCount", { count: txs.length })}
      </Pill>
      {expanded ? (
        <div className={styles.txList}>
          {txs.map((tx) => (
            <Hash key={tx.hash} value={tx.hash} side={6} copy={false} href={localized(`/transaction/${tx.hash}`)} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const Amount = ({ value, unit = "VFX" }: { value: number; unit?: string }) => (
  <span className={styles.amount}>
    {numberWithCommas(value)}
    <span className={styles.unit}>{unit}</span>
  </span>
);

export const TimeCell = ({ date, now }: { date: Date; now: number }) => {
  const { locale } = useRouter();
  return (
    <div className={styles.stack}>
      <span className={styles.primary}>{formatRelativeTime(date, now, locale)}</span>
      <span className={styles.sub}>{date.toLocaleTimeString(locale)}</span>
    </div>
  );
};

export const CraftTime = ({ block }: { block: Block }) => {
  const { t } = useTranslation("block");
  return <span className={styles.mono}>{t("row.craftTimeMs", { ms: block.craftTime })}</span>;
};
