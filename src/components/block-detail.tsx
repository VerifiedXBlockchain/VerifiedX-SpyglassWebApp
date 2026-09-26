import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Block } from "../models/block";
import { useLocalized } from "../utils/use-localized";
import { Amount } from "./blocks/block-cells";
import { TransactionList } from "./transactions/transaction-list";
import { Card } from "./ui/card";
import { DetailGrid, DetailList, DetailRow } from "./ui/detail-list";
import { ExpandableValue } from "./ui/expandable-value";
import { Hash } from "./ui/hash";
import { Mono, PageHeader, TitleValue } from "./ui/page-header";
import { Pill } from "./ui/pill";
import { SectionHeader } from "./ui/section-header";
import { Skeleton } from "./ui/skeleton";
import layout from "./ui/detail-layout.module.scss";
import styles from "./block-detail.module.scss";

interface Props {
  /** Undefined while loading. */
  block?: Block;
}

export const BlockDetail = ({ block }: Props) => {
  const { t } = useTranslation(["block", "common"]);
  const { locale } = useRouter();
  const localized = useLocalized();

  if (!block) return <BlockDetailSkeleton />;

  const txCount = block.transactions.length;

  return (
    <>
      <PageHeader
        title={
          <>
            {t("block:detail.title")} <TitleValue>{block.height.toLocaleString(locale)}</TitleValue>
          </>
        }
        badges={
          <Pill tone={txCount > 0 ? "accent" : "neutral"} size="md">
            {t("block:detail.txCount", { count: txCount })}
          </Pill>
        }
        meta={[`${t("block:detail.crafted")} ${block.timestampLabel}`, <Mono key="craft">{t("block:row.craftTimeMs", { ms: block.craftTime })}</Mono>, <Mono key="size">{block.sizeLabel}</Mono>]}
      />

      <div className={layout.twoColumn}>
        <Card title={t("block:detail.summary")} as="section" aria-label={t("block:detail.summary") as string}>
          <DetailList>
            <DetailRow label={t("block:detail.fields.validator")}>
              <span className={styles.validator}>
                {block.masternode ? (
                  <a href={localized(`/validators/${block.masternode.address}`)}>{block.masternode.uniqueNameLabel}</a>
                ) : (
                  <Hash value={block.validator} side={6} copy={false} href={localized(`/validators/${block.validator}`)} />
                )}
                <span className={styles.sub}>{block.masternode?.locationLabel || t("block:row.locationFallback")}</span>
              </span>
            </DetailRow>
            <DetailRow label={t("block:detail.fields.amount")}>
              <Amount value={block.totalAmount} />
            </DetailRow>
            <DetailRow label={t("block:detail.fields.reward")}>
              <Amount value={block.totalReward} />
            </DetailRow>
            <DetailRow label={t("block:detail.fields.size")} mono>
              {block.sizeLabel}
            </DetailRow>
            <DetailRow label={t("block:row.craftTime")} mono>
              {t("block:row.craftTimeMs", { ms: block.craftTime })}
            </DetailRow>
            <DetailRow label={t("block:detail.fields.chainRefId")}>
              <Hash value={block.chainRefId} side={8} tone="muted" size="sm" />
            </DetailRow>
          </DetailList>
        </Card>

        <Card title={t("block:detail.hashes")} as="section" aria-label={t("block:detail.hashes") as string}>
          <DetailList>
            <DetailRow label={t("block:detail.fields.hash")} stacked>
              <Hash value={block.hash} full tone="strong" />
            </DetailRow>
            <DetailRow label={t("block:detail.fields.previousHash")} stacked>
              <Hash value={block.prevHash} full href={block.height > 1 ? localized(`/block/${block.height - 1}`) : undefined} />
            </DetailRow>
            <DetailGrid>
              <DetailRow label={t("block:detail.fields.merkleRoot")} stacked>
                <Hash value={block.merkleRoot} full tone="muted" size="sm" />
              </DetailRow>
              <DetailRow label={t("block:detail.fields.stateRoot")} stacked>
                <Hash value={block.stateRoot} full tone="muted" size="sm" />
              </DetailRow>
            </DetailGrid>
            <DetailRow label={t("block:detail.fields.validatorSignature")} stacked>
              <ExpandableValue value={block.validatorSignature} />
            </DetailRow>
          </DetailList>
        </Card>
      </div>

      <SectionHeader title={t("block:detail.transactionsHeading")} description={t("block:detail.txInBlock")} className={layout.section} />
      <TransactionList transactions={block.transactions} showBlock={false} emptyLabel={t("block:detail.noTransactions") as string} />
    </>
  );
};

const BlockDetailSkeleton = () => (
  <>
    <PageHeader title={<Skeleton width={260} height={30} />} />
    <div className={layout.twoColumn}>
      <Card>
        <DetailList>
          {Array.from({ length: 6 }).map((_, i) => (
            <DetailRow key={i} label={<Skeleton width={80} height={11} />}>
              <Skeleton width={120} height={14} />
            </DetailRow>
          ))}
        </DetailList>
      </Card>
      <Card>
        <DetailList>
          {Array.from({ length: 4 }).map((_, i) => (
            <DetailRow key={i} label={<Skeleton width={80} height={11} />} stacked>
              <Skeleton width="90%" height={14} />
            </DetailRow>
          ))}
        </DetailList>
      </Card>
    </div>
  </>
);
