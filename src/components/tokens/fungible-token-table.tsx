import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FungibleToken } from "../../models/fungible-token";
import { numberWithCommas } from "../../utils/formatting";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import { Pill } from "../ui/pill";
import { TokenImage } from "./token-image";
import styles from "./token-cells.module.scss";

interface Props {
  tokens: FungibleToken[];
  loading?: boolean;
  emptyLabel?: string;
}

export const TokenSupply = ({ value, ticker }: { value: number; ticker: string }) => (
  <span className={styles.mono}>
    {numberWithCommas(value)}
    <span className={styles.unit}>{ticker}</span>
  </span>
);

export const FungibleTokenAvatar = ({ token, size = "sm" }: { token: FungibleToken; size?: "sm" | "md" | "lg" }) => {
  const { t } = useTranslation("fungibleToken");
  return <TokenImage src={token.image_url} alt={token.name} size={size} hidden={token.nsfw} hiddenLabel={t("detail.nsfw") as string} />;
};

export const FungibleTokenTable = ({ tokens, loading, emptyLabel }: Props) => {
  const { t } = useTranslation("fungibleToken");
  const { locale } = useRouter();
  const localized = useLocalized();

  const columns: Column<FungibleToken>[] = [
    {
      key: "token",
      header: t("list.table.token"),
      render: (token) => (
        <span className={styles.tokenCell}>
          <FungibleTokenAvatar token={token} />
          <span className={styles.stack}>
            <a href={localized(`/fungible-token/${token.sc_identifier}`)} className={styles.name}>
              {token.ticker}
            </a>
            <span className={styles.sub}>{token.name}</span>
          </span>
          {token.is_paused ? <Pill tone="gold">{t("list.paused")}</Pill> : null}
        </span>
      ),
    },
    { key: "contract", header: t("list.table.smartContract"), nowrap: true, hideBelowDesktop: true, render: (token) => <Hash value={token.sc_identifier} side={8} href={localized(`/fungible-token/${token.sc_identifier}`)} /> },
    { key: "owner", header: t("list.table.owner"), nowrap: true, render: (token) => <Hash value={token.owner_address} side={8} href={localized(`/search?q=${encodeURIComponent(token.owner_address)}`)} /> },
    {
      key: "deployed",
      header: t("list.table.deployedAt"),
      nowrap: true,
      hideBelowDesktop: true,
      render: (token) => <span className={styles.sub}>{token.created_at ? token.created_at.toLocaleDateString(locale) : "—"}</span>,
    },
    { key: "supply", header: t("list.table.circulatingSupply"), align: "end", nowrap: true, render: (token) => <TokenSupply value={token.circulating_supply} ticker={token.ticker} /> },
  ];

  return (
    <DataTable
      columns={columns}
      rows={tokens}
      rowKey={(token) => token.sc_identifier}
      rowHref={(token) => localized(`/fungible-token/${token.sc_identifier}`)}
      loading={loading}
      emptyLabel={emptyLabel ?? t("list.empty")}
      caption={t("list.caption") as string}
    />
  );
};
