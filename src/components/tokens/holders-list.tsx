import { useTranslation } from "next-i18next";
import { numberWithCommas } from "../../utils/formatting";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import styles from "./token-cells.module.scss";

interface Holder {
  address: string;
  balance: number;
}

interface Props {
  /** address → balance, as the token APIs return it. */
  balances: Record<string, number>;
  unit: string;
  emptyLabel: string;
}

/** Addresses holding a token, largest balance first. */
export const HoldersList = ({ balances, unit, emptyLabel }: Props) => {
  const { t } = useTranslation("common");
  const localized = useLocalized();
  const holders: Holder[] = Object.entries(balances)
    .map(([address, balance]) => ({ address, balance }))
    .sort((a, b) => b.balance - a.balance);

  const columns: Column<Holder>[] = [
    { key: "address", header: t("field.address"), render: (h) => <Hash value={h.address} side={12} href={localized(`/search?q=${encodeURIComponent(h.address)}`)} /> },
    {
      key: "balance",
      header: t("field.balance"),
      align: "end",
      nowrap: true,
      render: (h) => (
        <span className={styles.mono}>
          {numberWithCommas(h.balance)}
          <span className={styles.unit}>{unit}</span>
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} rows={holders} rowKey={(h) => h.address} emptyLabel={emptyLabel} caption={`${t("field.balance")}: ${unit}`} dense />;
};
