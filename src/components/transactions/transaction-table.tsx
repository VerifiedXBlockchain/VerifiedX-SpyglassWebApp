import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Transaction } from "../../models/transaction";
import { formatRelativeTime } from "../../utils/relative-time";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import cells from "../blocks/block-cells.module.scss";
import { TxAmount, TxFee, TxFrom, TxTo, TxTypePill } from "./transaction-cells";

interface Props {
  transactions: Transaction[];
  loading?: boolean;
  now: number;
  /** Include the block height column (off inside a block's own page). */
  showBlock?: boolean;
  emptyLabel?: string;
}

export const TransactionTable = ({ transactions, loading, now, showBlock = true, emptyLabel }: Props) => {
  const { t } = useTranslation(["transaction", "common"]);
  const { locale } = useRouter();
  const localized = useLocalized();

  const columns: Column<Transaction>[] = [
    { key: "hash", header: t("common:field.hash"), nowrap: true, render: (tx) => <Hash value={tx.hash} href={localized(`/transaction/${tx.hash}`)} /> },
    { key: "type", header: t("transaction:table.type"), render: (tx) => <TxTypePill tx={tx} /> },
    ...(showBlock
      ? [
          {
            key: "block",
            header: t("transaction:table.block"),
            nowrap: true,
            hideBelowDesktop: true,
            render: (tx: Transaction) => (
              <a href={localized(`/block/${tx.height}`)} className={cells.height}>
                {tx.height?.toLocaleString(locale)}
              </a>
            ),
          } as Column<Transaction>,
        ]
      : []),
    { key: "from", header: t("common:field.from"), nowrap: true, render: (tx) => <TxFrom tx={tx} /> },
    { key: "to", header: t("common:field.to"), nowrap: true, render: (tx) => <TxTo tx={tx} /> },
    { key: "amount", header: t("common:field.amount"), align: "end", nowrap: true, render: (tx) => <TxAmount tx={tx} /> },
    { key: "fee", header: t("common:field.fee"), align: "end", nowrap: true, hideBelowDesktop: true, render: (tx) => <TxFee tx={tx} /> },
    {
      key: "time",
      header: t("transaction:table.time"),
      nowrap: true,
      render: (tx) => (
        <div className={cells.stack}>
          <span className={cells.primary}>{formatRelativeTime(tx.dateCrafted, now, locale)}</span>
          <span className={cells.sub}>{tx.timestampLabel}</span>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={transactions}
      rowKey={(tx) => tx.hash}
      rowHref={(tx) => localized(`/transaction/${tx.hash}`)}
      loading={loading}
      emptyLabel={emptyLabel ?? t("transaction:table.empty")}
      caption={t("transaction:table.caption") as string}
    />
  );
};
