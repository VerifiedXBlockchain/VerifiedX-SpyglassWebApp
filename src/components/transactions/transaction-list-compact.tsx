import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Transaction } from "../../models/transaction";
import { truncateMiddle } from "../../utils/formatting";
import { formatRelativeTime } from "../../utils/relative-time";
import { useLocalized } from "../../utils/use-localized";
import { ArrowRightIcon } from "../ui/icons";
import { Skeleton } from "../ui/skeleton";
import { TxTypePill } from "./transaction-cells";
import styles from "./transaction-list-compact.module.scss";

interface Props {
  transactions: Transaction[];
  loading?: boolean;
  now: number;
  emptyLabel?: string;
}

/** Truncate real addresses; show sentinel names ("Coinbase_BlkRwd") as words. */
const shortParty = (value: string) => (/^[A-Za-z0-9]{30,}$/.test(value) ? truncateMiddle(value, 6) : value.replace(/_/g, " "));

/** Phone layout: hash and type, from → to, amount and age. */
export const TransactionListCompact = ({ transactions, loading, now, emptyLabel }: Props) => {
  const { t } = useTranslation("transaction");
  const localized = useLocalized();
  const { locale } = useRouter();

  return (
    <div className={styles.list}>
      {transactions.map((tx) => (
        <a key={tx.hash} href={localized(`/transaction/${tx.hash}`)} className={styles.row}>
          <div className={styles.top}>
            <span className={styles.hash}>{truncateMiddle(tx.hash, 8)}</span>
            <TxTypePill tx={tx} />
          </div>
          <div className={styles.route}>
            <span>{shortParty(tx.isFromSentinel ? tx.displayFromAddress : tx.fromAddress)}</span>
            <ArrowRightIcon className={styles.arrow} />
            <span>{shortParty(tx.isToSentinel ? tx.displayToAddress : tx.toAddress)}</span>
          </div>
          <div className={styles.bottom}>
            <span className={styles.amount}>{tx.displayAmount}</span>
            <span>{formatRelativeTime(tx.dateCrafted, now, locale)}</span>
          </div>
        </a>
      ))}
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className={styles.row} aria-hidden="true">
              <div className={styles.top}>
                <Skeleton width={140} height={13} />
                <Skeleton width={56} height={18} radius={999} />
              </div>
              <Skeleton width="70%" height={12} />
              <div className={styles.bottom}>
                <Skeleton width={64} height={13} />
                <Skeleton width={48} height={12} />
              </div>
            </div>
          ))
        : null}
      {!loading && transactions.length === 0 ? <div className={styles.empty}>{emptyLabel ?? t("table.empty")}</div> : null}
    </div>
  );
};
