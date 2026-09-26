import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { TABLET_QUERY, useMediaQuery } from "../hooks/useMediaQuery";
import { VbtcToken } from "../models/vbtc-token";
import { truncateMiddle } from "../utils/formatting";
import { useLocalized } from "../utils/use-localized";
import { TokenImage } from "./tokens/token-image";
import { TokenRowsCompact } from "./tokens/token-rows-compact";
import { VBTC_FALLBACK_IMAGE, VbtcBalance, VbtcTokenTable } from "./tokens/vbtc-token-table";
import { Skeleton } from "./ui/skeleton";

interface Props {
  tokens: VbtcToken[];
  loading?: boolean;
}

/** Responsive vBTC token list; tokens with no balance are hidden, as before. */
export const VbtcTokenList = ({ tokens, loading }: Props) => {
  const { t } = useTranslation("vbtcToken");
  const { locale } = useRouter();
  const localized = useLocalized();
  const isTablet = useMediaQuery(TABLET_QUERY);
  const funded = tokens.filter((token) => token.global_balance > 0);

  if (isTablet === undefined) return <Skeleton height={320} radius={12} />;
  if (isTablet) return <VbtcTokenTable tokens={funded} loading={loading} />;

  return (
    <TokenRowsCompact
      loading={loading}
      emptyLabel={t("list.empty") as string}
      rows={funded.map((token) => ({
        key: token.sc_identifier,
        href: localized(`/vbtc-token/${token.sc_identifier}`),
        image: <TokenImage src={token.image_url} alt={token.name} size="sm" fallbackSrc={VBTC_FALLBACK_IMAGE} />,
        title: token.name,
        subtitle: truncateMiddle(token.owner_address, 6),
        value: <VbtcBalance value={token.global_balance} />,
        meta: token.created_at ? token.created_at.toLocaleDateString(locale) : undefined,
      }))}
    />
  );
};
