import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Address } from "../../models/address";
import { Card } from "../ui/card";
import { Hash } from "../ui/hash";
import { Pill } from "../ui/pill";
import { Skeleton } from "../ui/skeleton";
import styles from "./address-summary.module.scss";

interface Props {
  /** The searched address (always known). */
  value: string;
  /** undefined while loading, null when the balance lookup failed. */
  address?: Address | null;
}

const Stat = ({ label, amount, locale }: { label: string; amount?: number; locale?: string }) => (
  <div className={styles.stat}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>
      {amount === undefined ? (
        <Skeleton width="60%" height="1em" />
      ) : (
        <>
          {amount.toLocaleString(locale, { maximumFractionDigits: 8 })}
          <span className={styles.unit}>VFX</span>
        </>
      )}
    </span>
  </div>
);

/** Balance card at the top of an address's results. */
export const AddressSummary = ({ value, address }: Props) => {
  const { t } = useTranslation("search");
  const { locale } = useRouter();
  return (
    <Card as="section" aria-label={t("page.types.address") as string}>
      <div className={styles.top}>
        <Hash value={value} full tone="strong" />
        {address?.adnr ? <Pill tone="accent">{address.adnr}</Pill> : null}
      </div>
      {address === null ? (
        <span className={styles.unavailable}>{t("page.addressUnavailable")}</span>
      ) : (
        <div className={styles.grid}>
          <Stat label={t("page.labels.balance")} amount={address?.balance} locale={locale} />
          <Stat label={t("page.labels.locked")} amount={address?.balanceLocked} locale={locale} />
          <Stat label={t("page.labels.total")} amount={address?.balanceTotal} locale={locale} />
        </div>
      )}
    </Card>
  );
};
