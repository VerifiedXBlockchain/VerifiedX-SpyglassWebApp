import { useTranslation } from "next-i18next";
import { IS_DEVNET, IS_TESTNET } from "../../constants";
import styles from "./network-badge.module.scss";

export type Network = "mainnet" | "testnet" | "devnet";

export const currentNetwork = (): Network => (IS_DEVNET ? "devnet" : IS_TESTNET ? "testnet" : "mainnet");

/** Pill naming the chain this deployment indexes, so testnet is never mistaken for mainnet. */
export const NetworkBadge = ({ className }: { className?: string }) => {
  const { t } = useTranslation("common");
  const network = currentNetwork();
  return (
    <span className={[styles.badge, styles[network], className].filter(Boolean).join(" ")} title={t(`brand.${network}Suffix`) as string}>
      {t(`brand.${network}Suffix`)}
    </span>
  );
};
