import { useTranslation } from "next-i18next";
import { Nft } from "../../models/nft";
import { NftCard } from "../nft-card";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import styles from "./nft-grid.module.scss";

interface Props {
  nfts: Nft[];
  loading?: boolean;
}

/** Responsive card grid (1 / 2 / 3 columns) for the NFT list. */
export const NftGrid = ({ nfts, loading }: Props) => {
  const { t } = useTranslation("nft");
  if (!loading && nfts.length === 0) return <div className={styles.empty}>{t("list.empty")}</div>;
  return (
    <div className={styles.grid}>
      {nfts.map((nft) => (
        <NftCard key={nft.identifier} nft={nft} />
      ))}
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className={styles.card} aria-label="">
              <Skeleton width="70%" height={18} />
              <Skeleton width="90%" height={12} />
              <Skeleton width="80%" height={12} />
              <Skeleton width="60%" height={12} />
            </Card>
          ))
        : null}
    </div>
  );
};
