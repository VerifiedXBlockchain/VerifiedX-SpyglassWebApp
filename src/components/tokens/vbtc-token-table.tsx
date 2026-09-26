import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { VbtcToken } from "../../models/vbtc-token";
import { numberWithCommas } from "../../utils/formatting";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import { TokenImage } from "./token-image";
import styles from "./token-cells.module.scss";

export const VBTC_FALLBACK_IMAGE = "/vbtc-fallback.gif";

interface Props {
  tokens: VbtcToken[];
  loading?: boolean;
  emptyLabel?: string;
}

export const VbtcBalance = ({ value }: { value: number }) => (
  <span className={styles.mono}>
    {numberWithCommas(value)}
    <span className={styles.unit}>vBTC</span>
  </span>
);

export const VbtcTokenTable = ({ tokens, loading, emptyLabel }: Props) => {
  const { t } = useTranslation("vbtcToken");
  const { locale } = useRouter();
  const localized = useLocalized();

  const columns: Column<VbtcToken>[] = [
    {
      key: "token",
      header: t("list.table.token"),
      render: (token) => (
        <span className={styles.tokenCell}>
          <TokenImage src={token.image_url} alt={token.name} size="sm" fallbackSrc={VBTC_FALLBACK_IMAGE} />
          <span className={styles.stack}>
            <a href={localized(`/vbtc-token/${token.sc_identifier}`)} className={styles.name}>
              {token.name}
            </a>
          </span>
        </span>
      ),
    },
    { key: "contract", header: t("list.table.smartContract"), nowrap: true, render: (token) => <Hash value={token.sc_identifier} side={8} href={localized(`/vbtc-token/${token.sc_identifier}`)} /> },
    { key: "owner", header: t("list.table.owner"), nowrap: true, render: (token) => <Hash value={token.owner_address} side={8} href={localized(`/search?q=${encodeURIComponent(token.owner_address)}`)} /> },
    {
      key: "minted",
      header: t("list.table.mintedAt"),
      nowrap: true,
      hideBelowDesktop: true,
      render: (token) => <span className={styles.sub}>{token.created_at ? token.created_at.toLocaleDateString(locale) : "—"}</span>,
    },
    { key: "balance", header: t("list.table.globalBalance"), align: "end", nowrap: true, render: (token) => <VbtcBalance value={token.global_balance} /> },
  ];

  return (
    <DataTable
      columns={columns}
      rows={tokens}
      rowKey={(token) => token.sc_identifier}
      rowHref={(token) => localized(`/vbtc-token/${token.sc_identifier}`)}
      loading={loading}
      emptyLabel={emptyLabel ?? t("list.empty")}
      caption={t("list.caption") as string}
    />
  );
};
