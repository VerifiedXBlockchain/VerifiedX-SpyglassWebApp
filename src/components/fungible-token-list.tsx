import { useTranslation } from "next-i18next";
import { TABLET_QUERY, useMediaQuery } from "../hooks/useMediaQuery";
import { FungibleToken } from "../models/fungible-token";
import { useLocalized } from "../utils/use-localized";
import { FungibleTokenAvatar, FungibleTokenTable, TokenSupply } from "./tokens/fungible-token-table";
import { TokenRowsCompact } from "./tokens/token-rows-compact";
import { Skeleton } from "./ui/skeleton";

interface Props {
  tokens: FungibleToken[];
  loading?: boolean;
}

/** Responsive fungible token list: table from tablet width, avatar rows on phones. */
export const FungibleTokenList = ({ tokens, loading }: Props) => {
  const { t } = useTranslation("fungibleToken");
  const localized = useLocalized();
  const isTablet = useMediaQuery(TABLET_QUERY);

  if (isTablet === undefined) return <Skeleton height={320} radius={12} />;
  if (isTablet) return <FungibleTokenTable tokens={tokens} loading={loading} />;

  return (
    <TokenRowsCompact
      loading={loading}
      emptyLabel={t("list.empty") as string}
      rows={tokens.map((token) => ({
        key: token.sc_identifier,
        href: localized(`/fungible-token/${token.sc_identifier}`),
        image: <FungibleTokenAvatar token={token} />,
        title: token.ticker,
        subtitle: token.name,
        value: <TokenSupply value={token.circulating_supply} ticker={token.ticker} />,
        meta: token.is_paused ? t("list.paused") : undefined,
      }))}
    />
  );
};
