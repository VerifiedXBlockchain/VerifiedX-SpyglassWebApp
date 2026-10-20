import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { MEMPOOL_BASE } from "../../constants";
import { TABLET_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { VbtcWithdrawal } from "../../models/vbtc-token";
import { truncateMiddle } from "../../utils/formatting";
import { useLocalized } from "../../utils/use-localized";
import { WITHDRAWAL_STAGE_TONE, withdrawalStage } from "../../utils/vbtc-withdrawal";
import { AddressLink } from "../transactions/transaction-cells";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import { ExternalLinkIcon } from "../ui/icons";
import { Pill } from "../ui/pill";
import { Skeleton } from "../ui/skeleton";
import { VbtcBalance } from "./vbtc-token-table";
import styles from "./vbtc-withdrawals.module.scss";

/** A Bitcoin txid or address, opened on mempool.space in a new tab. */
const MempoolLink = ({ kind, value }: { kind: "tx" | "address"; value: string }) => (
  <a href={`${MEMPOOL_BASE}/${kind}/${value}`} target="_blank" rel="noreferrer" className={styles.external} title={value}>
    {truncateMiddle(value, 6)}
    <ExternalLinkIcon />
  </a>
);

const StagePill = ({ withdrawal }: { withdrawal: VbtcWithdrawal }) => {
  const { t } = useTranslation("vbtcToken");
  const stage = withdrawalStage(withdrawal);
  return <Pill tone={WITHDRAWAL_STAGE_TONE[stage]}>{t(`detail.withdrawals.stage.${stage}`)}</Pill>;
};

const newestFirst = (a: VbtcWithdrawal, b: VbtcWithdrawal) => (b.created_at?.getTime() ?? 0) - (a.created_at?.getTime() ?? 0);

/** The vault's withdrawal requests, newest first (the token payload lists them oldest first). */
export const VbtcWithdrawals = ({ withdrawals: unsorted }: { withdrawals: VbtcWithdrawal[] }) => {
  const withdrawals = [...unsorted].sort(newestFirst);
  const { t } = useTranslation("vbtcToken");
  const { locale } = useRouter();
  const localized = useLocalized();
  const isTablet = useMediaQuery(TABLET_QUERY);
  const date = (value: Date | null) => (value ? value.toLocaleString(locale) : "—");
  const feeRate = (w: VbtcWithdrawal) => t("detail.withdrawals.feeRate", { rate: w.fee_rate });
  const txHref = (hash: string) => localized(`/transaction/${hash}`);

  if (isTablet === undefined) return <Skeleton height={160} radius={12} />;

  if (isTablet) {
    const columns: Column<VbtcWithdrawal>[] = [
      {
        key: "requested",
        header: t("detail.withdrawals.requested"),
        nowrap: true,
        render: (w) => (
          <span className={styles.stack}>
            <Hash value={w.request_transaction_hash} side={6} href={txHref(w.request_transaction_hash)} copy={false} />
            <span className={styles.sub}>{date(w.created_at)}</span>
          </span>
        ),
      },
      { key: "requester", header: t("detail.withdrawals.requester"), nowrap: true, hideBelowDesktop: true, render: (w) => <AddressLink address={w.requestor_address} /> },
      { key: "amount", header: t("detail.withdrawals.amount"), align: "end", nowrap: true, render: (w) => <VbtcBalance value={w.amount} /> },
      { key: "to", header: t("detail.withdrawals.to"), nowrap: true, render: (w) => <MempoolLink kind="address" value={w.btc_address} /> },
      { key: "fee", header: t("detail.withdrawals.requestedFee"), nowrap: true, hideBelowDesktop: true, render: (w) => <span className={styles.sub}>{feeRate(w)}</span> },
      { key: "status", header: t("detail.withdrawals.status"), nowrap: true, render: (w) => <StagePill withdrawal={w} /> },
      {
        key: "bitcoin",
        header: t("detail.withdrawals.bitcoinTx"),
        nowrap: true,
        render: (w) =>
          w.btc_transaction_hash ? (
            <span className={styles.stack}>
              <MempoolLink kind="tx" value={w.btc_transaction_hash} />
              {w.completed_at ? <span className={styles.sub}>{date(w.completed_at)}</span> : null}
            </span>
          ) : (
            <span className={styles.sub}>—</span>
          ),
      },
      {
        key: "settled",
        header: t("detail.withdrawals.settledBy"),
        nowrap: true,
        hideBelowDesktop: true,
        render: (w) =>
          w.completion_transaction_hash ? (
            <Hash value={w.completion_transaction_hash} side={6} href={txHref(w.completion_transaction_hash)} copy={false} />
          ) : (
            <span className={styles.sub}>—</span>
          ),
      },
    ];
    return (
      <DataTable
        columns={columns}
        rows={withdrawals}
        rowKey={(w) => w.id || w.request_transaction_hash}
        emptyLabel={t("detail.withdrawals.empty")}
        caption={t("detail.withdrawals.heading") as string}
      />
    );
  }

  return (
    <div className={styles.list}>
      {withdrawals.map((w) => (
        <div key={w.id || w.request_transaction_hash} className={styles.item}>
          <div className={styles.line}>
            <VbtcBalance value={w.amount} />
            <StagePill withdrawal={w} />
          </div>
          <div className={styles.line}>
            <MempoolLink kind="address" value={w.btc_address} />
            <span className={styles.sub}>{feeRate(w)}</span>
          </div>
          <div className={styles.line}>
            <Hash value={w.request_transaction_hash} side={6} href={txHref(w.request_transaction_hash)} copy={false} size="sm" />
            <span className={styles.sub}>{date(w.created_at)}</span>
          </div>
          {w.btc_transaction_hash ? (
            <div className={styles.line}>
              <span className={styles.sub}>{t("detail.withdrawals.bitcoinTx")}</span>
              <MempoolLink kind="tx" value={w.btc_transaction_hash} />
            </div>
          ) : null}
        </div>
      ))}
      {withdrawals.length === 0 ? <div className={styles.empty}>{t("detail.withdrawals.empty")}</div> : null}
    </div>
  );
};
