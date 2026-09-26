import { useTranslation } from "next-i18next";
import { IS_DEVNET, IS_TESTNET } from "../../constants";
import { usePagedList } from "../../hooks/usePagedList";
import { Adnr } from "../../models/adnr";
import { AdnrService } from "../../services/adnr-service";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import { ExternalLinkIcon } from "../ui/icons";
import { InfiniteList } from "../ui/infinite-list";
import { Pill } from "../ui/pill";
import cells from "../blocks/block-cells.module.scss";
import styles from "./domain-feed.module.scss";

const MEMPOOL_BASE = IS_DEVNET || IS_TESTNET ? "https://mempool.space/testnet4" : "https://mempool.space";

/** Registered VFX and BTC domains with the address each one resolves to. */
export const DomainFeed = () => {
  const { t } = useTranslation(["domains", "common"]);
  const localized = useLocalized();
  const { items, loadMore, canLoadMore, loaded } = usePagedList<Adnr>((page) => new AdnrService().list(page), (adnr) => adnr.domain, { pollMs: 15000 });

  const columns: Column<Adnr>[] = [
    {
      key: "domain",
      header: t("domains:list.table.domain"),
      render: (adnr) => (
        <span className={styles.domain}>
          <span className={cells.primary}>{adnr.domain}</span>
          {adnr.isBtcDomain ? <Pill tone="btc">BTC</Pill> : null}
        </span>
      ),
    },
    {
      key: "address",
      header: t("domains:list.table.address"),
      nowrap: true,
      render: (adnr) =>
        adnr.isBtcDomain ? (
          <a href={`${MEMPOOL_BASE}/address/${adnr.btc_address}`} target="_blank" rel="noreferrer" className={styles.external}>
            <Hash value={adnr.btc_address} side={8} copy={false} />
            <ExternalLinkIcon />
          </a>
        ) : (
          <Hash value={adnr.address} side={8} href={localized(`/search?q=${encodeURIComponent(adnr.address)}`)} />
        ),
    },
    {
      key: "tx",
      header: t("domains:list.table.registeredIn"),
      nowrap: true,
      hideBelowDesktop: true,
      render: (adnr) =>
        adnr.create_transaction?.hash ? (
          <Hash value={adnr.create_transaction.hash} side={8} copy={false} href={localized(`/transaction/${adnr.create_transaction.hash}`)} />
        ) : (
          <span className={cells.empty}>—</span>
        ),
    },
  ];

  return (
    <InfiniteList loadMore={loadMore} hasMore={canLoadMore}>
      <DataTable
        columns={columns}
        rows={items}
        rowKey={(adnr) => adnr.domain}
        rowHref={(adnr) => (adnr.isBtcDomain ? `${MEMPOOL_BASE}/address/${adnr.btc_address}` : localized(`/search?q=${encodeURIComponent(adnr.address)}`))}
        loading={!loaded}
        emptyLabel={t("domains:list.empty")}
        caption={t("domains:list.table.caption") as string}
      />
    </InfiniteList>
  );
};
