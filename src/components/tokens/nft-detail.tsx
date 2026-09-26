import { useTranslation } from "next-i18next";
import { Nft } from "../../models/nft";
import { Transaction } from "../../models/transaction";
import { formatBytes } from "../../utils/formatting";
import { useLocalized } from "../../utils/use-localized";
import { NftStatusPill } from "../nft-card";
import { AddressLink } from "../transactions/transaction-cells";
import { TransactionList } from "../transactions/transaction-list";
import { Card } from "../ui/card";
import { DetailList, DetailRow, Pre } from "../ui/detail-list";
import { Hash } from "../ui/hash";
import { PageHeader } from "../ui/page-header";
import { SectionHeader } from "../ui/section-header";
import layout from "../ui/detail-layout.module.scss";
import styles from "./token-detail.module.scss";

interface Props {
  nft: Nft;
  /** Undefined while the history request is in flight. */
  history?: Transaction[];
}

/** The contract payload is gzip+base64 from chain; a bad payload must not take the page down. */
const decodeCode = (nft: Nft) => {
  try {
    return nft.dataDataFormatted || undefined;
  } catch (error) {
    console.error("Could not decode smart contract code", error);
    return null;
  }
};

export const NftDetail = ({ nft, history }: Props) => {
  const { t } = useTranslation(["nft", "common"]);
  const localized = useLocalized();
  const code = decodeCode(nft);
  const description = nft.description ? nft.description.replace(/\\n/g, "\n") : "";

  return (
    <>
      <PageHeader title={nft.name} badges={<NftStatusPill nft={nft} size="md" />} meta={[`${t("nft:detail.minted")} ${nft.timestampLabel}`]} />

      <div className={layout.twoColumn}>
        <Card title={t("nft:detail.summary")} as="section" aria-label={t("nft:detail.summary") as string}>
          <DetailList>
            <DetailRow label={t("nft:detail.labels.ownerAddress")}>
              <AddressLink address={nft.ownerAddress} side={8} copy />
            </DetailRow>
            <DetailRow label={t("nft:detail.labels.minterAddress")}>
              <AddressLink address={nft.minterAddress} side={8} copy />
            </DetailRow>
            <DetailRow label={t("nft:detail.labels.minterName")}>{nft.minterName || "—"}</DetailRow>
            <DetailRow label={t("nft:detail.labels.primaryAssetName")}>{nft.primaryAssetName || "—"}</DetailRow>
            <DetailRow label={t("nft:detail.labels.primaryAssetSize")} mono>
              {nft.primaryAssetSize ? formatBytes(nft.primaryAssetSize) : "—"}
            </DetailRow>
          </DetailList>
        </Card>

        <Card title={t("nft:detail.labels.identifier")} as="section" aria-label={t("nft:detail.labels.identifier") as string}>
          <DetailList>
            <DetailRow label={t("nft:detail.labels.identifier")} stacked>
              <Hash value={nft.identifier} full tone="strong" />
            </DetailRow>
            <DetailRow label={t("nft:detail.labels.mintTransaction")} stacked>
              <Hash value={nft.mintTransaction} full href={localized(`/transaction/${nft.mintTransaction}`)} />
            </DetailRow>
            {nft.burnTransaction ? (
              <DetailRow label={t("nft:detail.labels.burnTransaction")} stacked>
                <Hash value={nft.burnTransaction} full href={localized(`/transaction/${nft.burnTransaction}`)} />
              </DetailRow>
            ) : null}
            {description ? (
              <DetailRow label={t("nft:detail.labels.description")} stacked>
                <span className={styles.description}>{description}</span>
              </DetailRow>
            ) : null}
          </DetailList>
        </Card>
      </div>

      {code !== undefined ? (
        <>
          <SectionHeader title={t("nft:detail.smartContractCodeHeading")} className={layout.section} />
          {code === null ? (
            <Card>
              <span className={styles.description}>{t("nft:detail.codeUnavailable")}</span>
            </Card>
          ) : (
            <Pre>{code}</Pre>
          )}
        </>
      ) : null}

      <SectionHeader title={t("nft:detail.transactionHistoryHeading")} className={layout.section} />
      <TransactionList transactions={history ?? []} loading={history === undefined} emptyLabel={t("nft:detail.noHistory") as string} />
    </>
  );
};
