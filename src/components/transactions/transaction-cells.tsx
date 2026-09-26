import { Transaction } from "../../models/transaction";
import { txTypeTone } from "../../utils/tx-type";
import { useLocalized } from "../../utils/use-localized";
import { Hash } from "../ui/hash";
import { Pill } from "../ui/pill";
import styles from "./transaction-cells.module.scss";

// Cells shared by the transaction table, the compact list and detail pages.

interface AddressProps {
  address: string;
  /** Human label for protocol addresses (Coinbase, Shielded Pool…); shown instead of the hash. */
  sentinelLabel?: string;
  side?: number;
  copy?: boolean;
  full?: boolean;
}

// Real addresses are base58-ish and 34+ chars; anything else ("Coinbase_BlkRwd",
// "Shielded_Pool") is a protocol sentinel with no address page to link to.
const looksLikeAddress = (value: string) => /^[A-Za-z0-9]{30,}$/.test(value);

/** Address as a link to its explorer page, or a quiet label for protocol sentinels. */
export const AddressLink = ({ address, sentinelLabel, side = 6, copy = false, full }: AddressProps) => {
  const localized = useLocalized();
  if (sentinelLabel && sentinelLabel !== address) return <span className={styles.sentinel}>{sentinelLabel}</span>;
  if (!address) return <span className={styles.sentinel}>—</span>;
  if (!looksLikeAddress(address)) return <span className={styles.sentinel}>{address.replace(/_/g, " ")}</span>;
  return <Hash value={address} side={side} full={full} copy={copy} href={localized(`/search?q=${encodeURIComponent(address)}`)} />;
};

export const TxFrom = ({ tx, ...rest }: { tx: Transaction; side?: number; copy?: boolean; full?: boolean }) => (
  <AddressLink address={tx.fromAddress} sentinelLabel={tx.isFromSentinel ? tx.displayFromAddress : undefined} {...rest} />
);

export const TxTo = ({ tx, ...rest }: { tx: Transaction; side?: number; copy?: boolean; full?: boolean }) => (
  <AddressLink address={tx.toAddress} sentinelLabel={tx.isToSentinel ? tx.displayToAddress : undefined} {...rest} />
);

export const TxTypePill = ({ tx, size }: { tx: Transaction; size?: "sm" | "md" }) => (
  <Pill tone={txTypeTone(tx.transactionType)} size={size} className={styles.typePill} title={tx.transactionTypeLabel}>
    {tx.transactionTypeLabel}
  </Pill>
);

/** displayAmount already carries the unit (VFX / vBTC) or "Hidden" for private transfers. */
export const TxAmount = ({ tx }: { tx: Transaction }) => (
  <span className={[styles.amount, tx.displayAmount === "Hidden" ? styles.hidden : ""].filter(Boolean).join(" ")}>{tx.displayAmount}</span>
);

export const TxFee = ({ tx }: { tx: Transaction }) => <span className={styles.amount}>{tx.fee} VFX</span>;
