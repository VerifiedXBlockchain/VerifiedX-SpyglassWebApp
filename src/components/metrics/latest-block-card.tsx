import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Block } from "../../models/block";
import { BlockService } from "../../services/block-service";
import { useLocalized } from "../../utils/use-localized";
import { Amount } from "../blocks/block-cells";
import { Card } from "../ui/card";
import { DetailList, DetailRow } from "../ui/detail-list";
import { Hash } from "../ui/hash";
import { LiveDot, Pill } from "../ui/pill";
import { Skeleton } from "../ui/skeleton";
import styles from "./latest-block-card.module.scss";

const POLL_MS = 5000;

/** The newest block, refreshed every few seconds, as a compact fact sheet. */
export const LatestBlockCard = () => {
  const { t } = useTranslation(["metrics", "block"]);
  const { locale } = useRouter();
  const localized = useLocalized();
  const [block, setBlock] = useState<Block | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await new BlockService().list(1, { limit: 1 });
        if (!cancelled && data.results.length > 0) setBlock(data.results[0]);
      } catch (error) {
        console.error("Latest block fetch failed", error);
      }
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Card
      title={
        <span className={styles.title}>
          <LiveDot pulse />
          {t("metrics:labels.latestBlock")}
        </span>
      }
    >
      {block ? (
        <DetailList>
          <DetailRow label={t("block:row.height")}>
            <a href={localized(`/block/${block.height}`)} className={styles.height}>
              {block.height.toLocaleString(locale)}
            </a>
          </DetailRow>
          <DetailRow label={t("block:row.hash")} stacked>
            <Hash value={block.hash} full href={localized(`/block/${block.height}`)} />
          </DetailRow>
          <DetailRow label={t("block:row.crafted")}>{block.timestampLabel}</DetailRow>
          <DetailRow label={t("block:row.craftTime")} mono>
            {t("block:row.craftTimeMs", { ms: block.craftTime })}
          </DetailRow>
          <DetailRow label={t("block:detail.fields.size")} mono>
            {block.sizeLabel}
          </DetailRow>
          <DetailRow label={t("block:row.transactions")}>
            <Pill tone={block.transactions.length > 0 ? "accent" : "neutral"}>{t("block:row.txsCount", { count: block.transactions.length })}</Pill>
          </DetailRow>
          <DetailRow label={t("block:row.amount")}>
            <Amount value={block.totalAmount} />
          </DetailRow>
          <DetailRow label={t("block:row.reward")}>
            <Amount value={block.totalReward} />
          </DetailRow>
          <DetailRow label={t("block:row.validator")}>
            {block.masternode ? (
              <a href={localized(`/validators/${block.masternode.address}`)}>{block.masternode.uniqueNameLabel}</a>
            ) : (
              <Hash value={block.validator} side={6} copy={false} href={localized(`/validators/${block.validator}`)} />
            )}
          </DetailRow>
        </DetailList>
      ) : (
        <DetailList>
          {Array.from({ length: 6 }).map((_, i) => (
            <DetailRow key={i} label={<Skeleton width={80} height={11} />}>
              <Skeleton width={120} height={14} />
            </DetailRow>
          ))}
        </DetailList>
      )}
    </Card>
  );
};
