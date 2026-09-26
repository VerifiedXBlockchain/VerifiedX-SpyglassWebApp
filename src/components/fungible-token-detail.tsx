import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FungibleToken } from "../models/fungible-token";
import { numberWithCommas } from "../utils/formatting";
import { FungibleTokenAvatar, TokenSupply } from "./tokens/fungible-token-table";
import { HoldersList } from "./tokens/holders-list";
import { AddressLink } from "./transactions/transaction-cells";
import { Card } from "./ui/card";
import { DetailList, DetailRow } from "./ui/detail-list";
import { Hash } from "./ui/hash";
import { PageHeader } from "./ui/page-header";
import { Pill } from "./ui/pill";
import { SectionHeader } from "./ui/section-header";
import layout from "./ui/detail-layout.module.scss";
import styles from "./tokens/token-detail.module.scss";

interface Props {
  token: FungibleToken;
  holders: { [address: string]: number };
}

export const FungibleTokenDetail = ({ token, holders }: Props) => {
  const { t } = useTranslation(["fungibleToken", "common"]);
  const { locale } = useRouter();
  const yes = t("common:status.yes") as string;
  const no = t("common:status.no") as string;
  const description = token.description.replace(/\\n/g, "\n");

  const flag = (enabled: boolean) => <Pill tone={enabled ? "green" : "neutral"}>{enabled ? yes : no}</Pill>;

  return (
    <>
      <PageHeader
        title={token.name}
        badges={
          <>
            <Pill tone="accent" size="md">
              {token.ticker}
            </Pill>
            {token.is_paused ? (
              <Pill tone="gold" size="md">
                {t("fungibleToken:list.paused")}
              </Pill>
            ) : null}
          </>
        }
        meta={[token.created_at ? `${t("fungibleToken:detail.fields.deployedAt")} ${token.created_at.toLocaleDateString(locale)}` : null]}
      />

      <div className={layout.twoColumn}>
        <Card title={t("fungibleToken:detail.summary")} as="section" aria-label={t("fungibleToken:detail.summary") as string}>
          <div className={styles.hero}>
            <FungibleTokenAvatar token={token} size="lg" />
            <div className={styles.heroText}>
              <span className={styles.heroName}>{token.name}</span>
              <span className={styles.heroSub}>
                <TokenSupply value={token.circulating_supply} ticker={token.ticker} />
              </span>
            </div>
          </div>
          <DetailList>
            <DetailRow label={t("fungibleToken:detail.fields.ticker")} mono>
              {token.ticker}
            </DetailRow>
            <DetailRow label={t("fungibleToken:detail.fields.owner")}>
              <AddressLink address={token.owner_address} side={8} copy />
            </DetailRow>
            <DetailRow label={t("fungibleToken:detail.fields.circulatingSupply")}>
              <TokenSupply value={token.circulating_supply} ticker={token.ticker} />
            </DetailRow>
            <DetailRow label={t("fungibleToken:detail.fields.initialSupply")}>
              <TokenSupply value={token.initial_supply} ticker={token.ticker} />
            </DetailRow>
            <DetailRow label={t("fungibleToken:detail.fields.decimals")} mono>
              {numberWithCommas(token.decimal_places)}
            </DetailRow>
            <DetailRow label={t("fungibleToken:detail.fields.mintable")}>{flag(token.can_mint)}</DetailRow>
            <DetailRow label={t("fungibleToken:detail.fields.burnable")}>{flag(token.can_burn)}</DetailRow>
            <DetailRow label={t("fungibleToken:detail.fields.supportsVoting")}>{flag(token.can_vote)}</DetailRow>
          </DetailList>
        </Card>

        <Card title={t("fungibleToken:detail.contract")} as="section" aria-label={t("fungibleToken:detail.contract") as string}>
          <DetailList>
            <DetailRow label={t("fungibleToken:detail.fields.smartContractId")} stacked>
              <Hash value={token.sc_identifier} full tone="strong" />
            </DetailRow>
            {description ? (
              <DetailRow label={t("fungibleToken:detail.descriptionHeading")} stacked>
                <span className={styles.description}>{description}</span>
              </DetailRow>
            ) : null}
            {token.banned_addresses.length > 0 ? (
              <DetailRow label={t("fungibleToken:detail.bannedHeading")} stacked>
                <div className={styles.bannedList}>
                  {token.banned_addresses.map((address) => (
                    <AddressLink key={address} address={address} side={10} copy />
                  ))}
                </div>
              </DetailRow>
            ) : null}
          </DetailList>
        </Card>
      </div>

      <SectionHeader title={t("fungibleToken:detail.balancesHeading")} className={layout.section} />
      <HoldersList balances={holders} unit={token.ticker} emptyLabel={t("fungibleToken:detail.noHolders") as string} />
    </>
  );
};
