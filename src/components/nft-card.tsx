import { useTranslation } from "next-i18next";
import { Nft } from "../models/nft";
import { useLocalized } from "../utils/use-localized";
import { AddressLink } from "./transactions/transaction-cells";
import { Card } from "./ui/card";
import { DetailList, DetailRow } from "./ui/detail-list";
import { Hash } from "./ui/hash";
import { Pill } from "./ui/pill";
import styles from "./tokens/nft-grid.module.scss";

interface Props {
  nft: Nft;
}

export const NftStatusPill = ({ nft, size }: { nft: Nft; size?: "sm" | "md" }) => {
  const { t } = useTranslation("nft");
  return (
    <Pill tone={nft.isBurned ? "red" : "green"} size={size}>
      {nft.isBurned ? t("card.burned") : t("card.active")}
    </Pill>
  );
};

export const NftCard = ({ nft }: Props) => {
  const { t } = useTranslation("nft");
  const localized = useLocalized();
  const href = localized(`/nfts/${nft.identifier}`);

  return (
    <Card as="article" className={styles.card} aria-label={nft.name}>
      <div className={styles.head}>
        <h3 className={styles.title}>
          <a href={href}>{nft.name}</a>
        </h3>
        <NftStatusPill nft={nft} />
      </div>
      <DetailList>
        <DetailRow label={t("card.owner")}>
          <AddressLink address={nft.ownerAddress} side={6} />
        </DetailRow>
        <DetailRow label={t("card.minter")}>
          <AddressLink address={nft.minterAddress} side={6} />
        </DetailRow>
        <DetailRow label={t("card.mintTx")}>
          <Hash value={nft.mintTransaction} side={6} copy={false} href={localized(`/transaction/${nft.mintTransaction}`)} />
        </DetailRow>
      </DetailList>
      <div className={styles.foot}>{t("card.minted", { date: nft.timestampLabel })}</div>
    </Card>
  );
};
