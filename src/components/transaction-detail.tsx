import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Transaction } from "../models/transaction";
import { useLocalized } from "../utils/use-localized";
import { AddressLink, TxAmount, TxFee, TxFrom, TxTo, TxTypePill } from "./transactions/transaction-cells";
import { TransactionList } from "./transactions/transaction-list";
import { Card } from "./ui/card";
import { DetailList, DetailRow, Pre } from "./ui/detail-list";
import { ExpandableValue } from "./ui/expandable-value";
import { Hash } from "./ui/hash";
import { Mono, PageHeader } from "./ui/page-header";
import { SectionHeader } from "./ui/section-header";
import layout from "./ui/detail-layout.module.scss";
import styles from "./transaction-detail.module.scss";

interface Props {
  transaction: Transaction;
}

/** Model getters parse and decompress on-chain payloads; a malformed one must not take the page down. */
const tryRead = (label: string, read: () => string | undefined) => {
  try {
    return read();
  } catch (error) {
    console.error(`Could not render ${label}`, error);
    return undefined;
  }
};

export const TransactionDetail = ({ transaction: tx }: Props) => {
  const { t } = useTranslation(["transaction", "common"]);
  const { locale } = useRouter();
  const localized = useLocalized();

  const payload = tx.nftData != null ? tryRead("tx payload", () => tx.nftDataFormatted) : undefined;
  const decoded = tx.nftData != null ? tryRead("decoded tx data", () => tx.nftDataDataFormatted) : undefined;

  return (
    <>
      <PageHeader
        title={t("transaction:detail.title")}
        badges={<TxTypePill tx={tx} size="md" />}
        meta={[
          tx.timestampLabel,
          <a key="block" href={localized(`/block/${tx.height}`)}>
            {t("transaction:detail.fields.block")} <Mono>{tx.height?.toLocaleString(locale)}</Mono>
          </a>,
        ]}
      />

      <div className={layout.twoColumn}>
        <Card title={t("transaction:detail.summary")} as="section" aria-label={t("transaction:detail.summary") as string}>
          <DetailList>
            <DetailRow label={t("transaction:detail.fields.block")}>
              <a href={localized(`/block/${tx.height}`)} className={styles.blockLink}>
                {tx.height?.toLocaleString(locale)}
              </a>
            </DetailRow>
            <DetailRow label={t("transaction:detail.fields.amount")}>
              <TxAmount tx={tx} />
            </DetailRow>
            <DetailRow label={t("transaction:detail.fields.fee")}>
              <TxFee tx={tx} />
            </DetailRow>
            <DetailRow label={t("transaction:detail.fields.from")}>
              <TxFrom tx={tx} side={8} copy />
            </DetailRow>
            <DetailRow label={t("transaction:detail.fields.to")}>
              <TxTo tx={tx} side={8} copy />
            </DetailRow>
            <DetailRow label={t("transaction:detail.fields.time")}>{tx.timestampLabel}</DetailRow>
          </DetailList>
        </Card>

        <Card title={t("transaction:detail.identity")} as="section" aria-label={t("transaction:detail.identity") as string}>
          <DetailList>
            <DetailRow label={t("transaction:detail.fields.hash")} stacked>
              <Hash value={tx.hash} full tone="strong" />
            </DetailRow>
            {tx.signature ? (
              <DetailRow label={t("transaction:detail.fields.signature")} stacked>
                <ExpandableValue value={`${tx.signature}`} />
              </DetailRow>
            ) : null}
          </DetailList>
        </Card>
      </div>

      {tx.nft ? (
        <>
          <SectionHeader title={t("transaction:detail.smartContractHeading")} className={layout.section} />
          <Card>
            <DetailList>
              <DetailRow label={t("transaction:detail.nftFields.identifier")} stacked>
                <Hash value={tx.nft.identifier} full href={localized(`/nfts/${tx.nft.identifier}`)} />
              </DetailRow>
              <DetailRow label={t("transaction:detail.nftFields.name")}>{tx.nft.name}</DetailRow>
              {tx.nft.description ? (
                <DetailRow label={t("transaction:detail.nftFields.description")} stacked>
                  <span className={styles.description}>{tx.nft.description.replace(/\\n/g, "\n")}</span>
                </DetailRow>
              ) : null}
              <DetailRow label={t("transaction:detail.nftFields.minterAddress")}>
                <AddressLink address={tx.nft.minterAddress} side={8} copy />
              </DetailRow>
              <DetailRow label={t("transaction:detail.nftFields.ownerAddress")}>
                <AddressLink address={tx.nft.ownerAddress} side={8} copy />
              </DetailRow>
              <DetailRow label={t("transaction:detail.nftFields.minterName")}>{tx.nft.minterName || "—"}</DetailRow>
              <DetailRow label={t("transaction:detail.nftFields.primaryAssetName")}>{tx.nft.primaryAssetName || "—"}</DetailRow>
              <DetailRow label={t("transaction:detail.nftFields.primaryAssetSize")} mono>
                {tx.nft.primaryAssetSize ?? "—"}
              </DetailRow>
            </DetailList>
          </Card>
        </>
      ) : null}

      {payload && payload !== "-" ? (
        <>
          <SectionHeader title={t("transaction:detail.txDetailsHeading")} className={layout.section} />
          <Pre>{payload}</Pre>
        </>
      ) : null}

      {decoded ? (
        <>
          <SectionHeader title={t("transaction:detail.txDataDecodedHeading")} className={layout.section} />
          <Pre>{decoded}</Pre>
        </>
      ) : null}

      {tx.callbackDetails ? (
        <>
          <SectionHeader title={t("transaction:detail.callbackDetailsHeading")} className={layout.section} />
          <TransactionList transactions={[tx.callbackDetails]} />
        </>
      ) : null}

      {tx.recoveryDetails ? (
        <>
          <SectionHeader title={t("transaction:detail.recoveryDetailsHeading")} className={layout.section} />
          <Card>
            <DetailList>
              <DetailRow label={t("transaction:detail.recoveryFields.originalAddress")}>
                <AddressLink address={tx.recoveryDetails.originalAddress} side={8} copy />
              </DetailRow>
              <DetailRow label={t("transaction:detail.recoveryFields.newAddress")}>
                <AddressLink address={tx.recoveryDetails.newAddress} side={8} copy />
              </DetailRow>
              <DetailRow label={t("transaction:detail.recoveryFields.amount")} mono>
                {tx.recoveryDetails.amount} VFX
              </DetailRow>
            </DetailList>
          </Card>
          {tx.recoveryDetails.outstandingTransactions.length > 0 ? (
            <>
              <SectionHeader title={t("transaction:detail.outstandingTransactionsHeading")} className={layout.section} />
              <TransactionList transactions={tx.recoveryDetails.outstandingTransactions} />
            </>
          ) : null}
        </>
      ) : null}
    </>
  );
};
