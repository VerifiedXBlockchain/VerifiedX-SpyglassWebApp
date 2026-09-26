/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element */
// Raw <a href> on purpose: the app navigates with full page loads and
// useLocalized() keeps the active locale prefix on every internal link.
// Plain <img> for the brand mark: it is an animated GIF, which next/image
// would only pass through unoptimized anyway.
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { FormEvent, useEffect, useRef, useState } from "react";
import { IS_DEVNET, IS_TESTNET } from "../../constants";
import { navigateTo } from "../../utils/navigate";
import { useLocalized } from "../../utils/use-localized";
import { LanguageSwitcher } from "../language-switcher";
import { CloseIcon, ExternalLinkIcon, MenuIcon, MoreIcon, SearchIcon } from "./icons";
import { Menu, MenuItem } from "./menu";
import { NetworkBadge } from "./network-badge";
import styles from "./app-header.module.scss";

interface NavLink {
  key: string;
  /** Translation key under common:nav.* */
  labelKey: string;
  href: string;
  /** Route prefixes that mark this link current. "/" matches only the home page. */
  matches: string[];
}

const PRIMARY_LINKS: NavLink[] = [
  { key: "blocks", labelKey: "nav.blocks", href: "/block", matches: ["/", "/block"] },
  { key: "transactions", labelKey: "nav.transactions", href: "/transaction", matches: ["/transaction"] },
  { key: "validators", labelKey: "nav.validators", href: "/validators", matches: ["/validators"] },
  ...(!IS_TESTNET && !IS_DEVNET ? [{ key: "metrics", labelKey: "nav.metrics", href: "/metrics", matches: ["/metrics"] }] : []),
  { key: "domains", labelKey: "nav.domains", href: "/domains", matches: ["/domains"] },
  ...(IS_TESTNET || IS_DEVNET ? [{ key: "faucet", labelKey: "nav.faucet", href: "/faucet", matches: ["/faucet"] }] : []),
];

const TOKEN_LINKS: NavLink[] = [
  { key: "vbtc", labelKey: "nav.vbtc", href: "/vbtc-token", matches: ["/vbtc-token"] },
  { key: "fungibleTokens", labelKey: "nav.fungibleTokens", href: "/fungible-token", matches: ["/fungible-token"] },
  { key: "nfts", labelKey: "nav.nfts", href: "/nfts", matches: ["/nfts"] },
];

const BTC_SPYGLASS_URL = IS_DEVNET || IS_TESTNET ? "https://mempool.space/testnet4" : "https://mempool.space/";

const EXTERNAL_LINKS: { key: string; labelKey: string; href: string }[] = [
  { key: "verifiedXSite", labelKey: "nav.verifiedXSite", href: "https://verifiedx.io" },
  { key: "docs", labelKey: "nav.docs", href: "https://docs.verifiedx.io" },
  { key: "github", labelKey: "nav.github", href: "https://github.com/VerifiedXBlockchain" },
  { key: "discord", labelKey: "nav.discord", href: "https://discord.gg/7cd5ebDQCj" },
  { key: "x", labelKey: "nav.x", href: "https://x.com/VFXBlockchain" },
];

const isCurrent = (pathname: string, matches: string[]) =>
  matches.some((m) => (m === "/" ? pathname === "/" : pathname === m || pathname.startsWith(`${m}/`)));

const isTypingTarget = (target: EventTarget | null) => {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || el.isContentEditable;
};

export const AppHeader = () => {
  const { t } = useTranslation(["common", "search"]);
  const router = useRouter();
  const localized = useLocalized();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Collapse the drawer whenever the route changes (client-side locale switch included).
  useEffect(() => {
    setMenuOpen(false);
  }, [router.asPath]);

  // "/" focuses search from anywhere that isn't already a text field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigateTo(localized(`/search?q=${encodeURIComponent(trimmed)}`));
  };

  const pathname = router.pathname;
  const tokensActive = TOKEN_LINKS.some((link) => isCurrent(pathname, link.matches));

  const tokenItems: MenuItem[] = TOKEN_LINKS.map((link) => ({
    key: link.key,
    label: t(`common:${link.labelKey}`) as string,
    href: localized(link.href),
    active: isCurrent(pathname, link.matches),
  }));

  const externalItems: MenuItem[] = EXTERNAL_LINKS.map((link) => ({
    key: link.key,
    label: t(`common:${link.labelKey}`) as string,
    href: link.href,
    external: true,
  }));

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <a className={styles.brand} href={localized("/")}>
          <span className={styles.brandMark}>
            <img src="/cube.gif" alt="" width={30} height={30} className={styles.brandGif} />
          </span>
          <span className={styles.brandName}>
            Verified<span className={styles.brandX}>X</span>
          </span>
          <span className={styles.brandProduct}>{t("common:brand.spyglass")}</span>
        </a>
        <NetworkBadge />

        <nav className={styles.nav} aria-label={t("common:nav.primaryAria") as string}>
          {PRIMARY_LINKS.map((link) => {
            const active = isCurrent(pathname, link.matches);
            return (
              <a
                key={link.key}
                href={localized(link.href)}
                className={[styles.navLink, active ? styles.navLinkActive : ""].filter(Boolean).join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {t(`common:${link.labelKey}`)}
              </a>
            );
          })}
          <Menu label={t("common:nav.tokens") as string} items={tokenItems} active={tokensActive} />
        </nav>

        <div className={styles.spacer} />

        <form className={styles.search} role="search" onSubmit={submitSearch}>
          <SearchIcon />
          <input
            ref={searchRef}
            type="text"
            className={styles.searchInput}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search:component.headerPlaceholder") as string}
            aria-label={t("search:component.ariaLabel") as string}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.searchHint} aria-hidden="true">
            /
          </kbd>
          <button type="submit" className={styles.searchSubmit} aria-label={t("search:component.cta") as string}>
            <span className="visually-hidden">{t("search:component.cta")}</span>
          </button>
        </form>

        <a className={styles.btcLink} href={BTC_SPYGLASS_URL} target="_blank" rel="noreferrer" title={t("common:nav.btcSpyglass") as string}>
          {t("common:nav.btcShort")}
          <ExternalLinkIcon />
        </a>

        <LanguageSwitcher className={styles.language} />

        <Menu label={t("common:nav.more") as string} items={externalItems} icon={<MoreIcon />} align="end" className={styles.more} />

        <button
          type="button"
          className={styles.menuToggle}
          aria-expanded={menuOpen}
          aria-controls="app-header-drawer"
          aria-label={t(menuOpen ? "common:nav.closeMenu" : "common:nav.openMenu") as string}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav id="app-header-drawer" className={styles.drawer} hidden={!menuOpen} aria-label={t("common:nav.primaryAria") as string}>
        <div className={styles.drawerGroup}>
          <h2 className={styles.drawerHeading}>{t("common:nav.exploreHeading")}</h2>
          {PRIMARY_LINKS.map((link) => {
            const active = isCurrent(pathname, link.matches);
            return (
              <a
                key={link.key}
                href={localized(link.href)}
                className={[styles.drawerLink, active ? styles.drawerLinkActive : ""].filter(Boolean).join(" ")}
                aria-current={active ? "page" : undefined}
              >
                {t(`common:${link.labelKey}`)}
              </a>
            );
          })}
        </div>
        <div className={styles.drawerGroup}>
          <h2 className={styles.drawerHeading}>{t("common:nav.tokens")}</h2>
          {tokenItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={[styles.drawerLink, item.active ? styles.drawerLinkActive : ""].filter(Boolean).join(" ")}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
          <a className={[styles.drawerLink, styles.drawerLinkBtc].join(" ")} href={BTC_SPYGLASS_URL} target="_blank" rel="noreferrer">
            {t("common:nav.btcSpyglass")}
            <span className={styles.drawerMeta}>
              <ExternalLinkIcon />
            </span>
          </a>
        </div>
        <div className={styles.drawerGroup}>
          <h2 className={styles.drawerHeading}>{t("common:nav.resourcesHeading")}</h2>
          {externalItems.map((item) => (
            <a key={item.key} href={item.href} className={styles.drawerLink} target="_blank" rel="noreferrer">
              {item.label}
              <span className={styles.drawerMeta}>
                <ExternalLinkIcon />
              </span>
            </a>
          ))}
          <div className={styles.drawerFooter}>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};
