import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { BTC_IS_SIGNET, MEMPOOL_BASE } from "../constants";
import { VbtcToken } from "../models/vbtc-token";
import { numberWithCommas } from "../utils/formatting";
import { useLocalized } from "../utils/use-localized";
import { VaultHeights, vaultStatus } from "../utils/vbtc-vault";
import { HoldersList } from "./tokens/holders-list";
import { TokenImage } from "./tokens/token-image";
import { VBTC_FALLBACK_IMAGE, VbtcBalance } from "./tokens/vbtc-token-table";
import { VbtcWithdrawals } from "./tokens/vbtc-withdrawals";
import { AddressLink } from "./transactions/transaction-cells";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { DetailList, DetailRow } from "./ui/detail-list";
import { Hash } from "./ui/hash";
import { ExternalLinkIcon } from "./ui/icons";
import { PageHeader } from "./ui/page-header";
import { Pill } from "./ui/pill";
import { SectionHeader } from "./ui/section-header";
import layout from "./ui/detail-layout.module.scss";
import styles from "./tokens/token-detail.module.scss";

interface Props {
  token: VbtcToken;
  /** Null until loaded, or when Spyglass did not answer: the page reads as it always has. */
  heights?: VaultHeights | null;
}

export const VbtcTokenDetail = ({ token, heights = null }: Props) => {
  const { t } = useTranslation(["vbtcToken", "common"]);
  const { locale } = useRouter();
  const localized = useLocalized();
  const description = token.description.replace(/\\n/g, "\n");
  // A watched vault's backing is what the chain holds on Bitcoin (global_balance);
  // Spyglass stops keeping the providers' received / sent / count for it.
  // The status is not shown as a badge; it only decides which fields apply.
  const watched = vaultStatus(token, heights) === "watched";

  return (
    <>
      <PageHeader
        title={token.name}
        badges={
          <>
            <Pill tone="btc" size="md">
              {t("vbtcToken:detail.badge")}
            </Pill>
            {token.is_pending_withdrawal ? (
              <Pill tone="gold" size="md">
                {t("vbtcToken:detail.pendingWithdrawal")}
              </Pill>
            ) : null}
          </>
        }
        meta={[
          token.created_at ? `${t("vbtcToken:detail.fields.mintedAt")} ${token.created_at.toLocaleDateString(locale)}` : null,
          watched ? null : `${numberWithCommas(token.tx_count)} ${t("vbtcToken:detail.fields.txCount").toLowerCase()}`,
        ]}
      />

      <div className={layout.twoColumn}>
        <Card title={t("vbtcToken:detail.summary")} as="section" aria-label={t("vbtcToken:detail.summary") as string}>
          <div className={styles.hero}>
            <TokenImage src={token.image_url} alt={token.name} size="lg" fallbackSrc={VBTC_FALLBACK_IMAGE} />
            <div className={styles.heroText}>
              <span className={styles.heroName}>{token.name}</span>
              <span className={styles.heroSub}>
                <VbtcBalance value={token.global_balance} />
              </span>
            </div>
          </div>
          <DetailList>
            <DetailRow label={t("vbtcToken:detail.fields.owner")}>
              <AddressLink address={token.owner_address} side={8} copy />
            </DetailRow>
            <DetailRow label={t(watched ? "vbtcToken:detail.fields.backing" : "vbtcToken:detail.fields.globalBalance")}>
              <VbtcBalance value={token.global_balance} />
            </DetailRow>
            {watched ? null : (
              <>
                <DetailRow label={t("vbtcToken:detail.fields.totalReceived")}>
                  <VbtcBalance value={token.total_received} />
                </DetailRow>
                <DetailRow label={t("vbtcToken:detail.fields.totalSent")}>
                  <VbtcBalance value={token.total_sent} />
                </DetailRow>
                <DetailRow label={t("vbtcToken:detail.fields.txCount")} mono>
                  {numberWithCommas(token.tx_count)}
                </DetailRow>
              </>
            )}
            <DetailRow label={t("vbtcToken:detail.fields.threshold")} mono>
              {token.required_threshold}
            </DetailRow>
          </DetailList>
        </Card>

        <Card title={t("vbtcToken:detail.custody")} as="section" aria-label={t("vbtcToken:detail.custody") as string}>
          <DetailList>
            <DetailRow label={t("vbtcToken:detail.fields.smartContractId")} stacked>
              <Hash value={token.sc_identifier} full tone="strong" href={localized(`/nfts/${token.sc_identifier}`)} />
            </DetailRow>
            {token.deposit_address ? (
              <DetailRow label={t(watched ? "vbtcToken:detail.fields.currentDepositAddress" : "vbtcToken:detail.fields.depositAddress")} stacked>
                <Hash value={token.deposit_address} full tone="strong" />
                <div style={{ marginTop: 8 }}>
                  <Button href={`${MEMPOOL_BASE}/address/${token.deposit_address}`} external variant="btc" size="sm" iconRight={<ExternalLinkIcon />}>
                    {t(BTC_IS_SIGNET ? "vbtcToken:detail.viewOnSignet" : "vbtcToken:detail.viewOnMempool")}
                  </Button>
                </div>
              </DetailRow>
            ) : null}
            {token.frost_group_public_key ? (
              <DetailRow label={t("vbtcToken:detail.fields.frostKey")} stacked>
                <Hash value={token.frost_group_public_key} full tone="muted" size="sm" />
              </DetailRow>
            ) : null}
            {description ? (
              <DetailRow label={t("vbtcToken:detail.fields.description")} stacked>
                <span className={styles.description}>{description}</span>
              </DetailRow>
            ) : null}
          </DetailList>
        </Card>
      </div>

      <SectionHeader title={t("vbtcToken:detail.balancesHeading")} className={layout.section} />
      <HoldersList balances={token.addresses} unit="vBTC" emptyLabel={t("vbtcToken:detail.noBalances") as string} />

      <SectionHeader title={t("vbtcToken:detail.withdrawals.heading")} className={layout.section} />
      {watched ? <p className={styles.lifecycle}>{t("vbtcToken:detail.withdrawals.watchedLifecycle")}</p> : null}
      <VbtcWithdrawals withdrawals={token.withdrawal_requests} />
    </>
  );
};
