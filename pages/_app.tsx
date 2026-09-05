/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import "../src/styles/styles.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Search } from "../src/components/search";
import { LanguageSwitcher } from "../src/components/language-switcher";
import { isMobile } from "react-device-detect";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IS_TESTNET, IS_DEVNET, MAINTENENCE_MODE, SITE_ORIGIN } from "../src/constants";
import Head from "next/head";
import { useEffect, useState } from "react";
import { appWithTranslation, useTranslation } from "next-i18next";
import nextI18NextConfig from "../next-i18next.config";
import { setActiveLocale } from "../src/utils/active-locale";
import {
  ASSISTANT_WIDGET_URL,
  deriveAssistantContext,
  pushAssistantContext,
  useAssistantContext,
} from "../src/hooks/useAssistantContext";

import 'bootstrap-icons/font/bootstrap-icons.css'
import Script from "next/script";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVzZXJ2ZWJsb2NrIiwiYSI6ImNsMXV2dWN6NjAyaTMzaW1xMXhqd243dG0ifQ.J6Sjh7N5mgmHAbhVytO_WQ";

function MyApp({ Component, pageProps }: AppProps) {

  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale, locales, defaultLocale, asPath } = router;

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  // VFX Assistant: page, entity and address follow the route (src/hooks/useAssistantContext.ts).
  useAssistantContext();

  const hreflangPath = asPath === "/" ? "" : asPath;
  const canonicalPath = locale && locale !== defaultLocale ? `/${locale}${hreflangPath}` : hreflangPath;
  const localized = (path: string) => (locale && locale !== defaultLocale ? `/${locale}${path}` : path);
  setActiveLocale(locale);

  if (MAINTENENCE_MODE) {
    return (
      <>
        <Head>
          <title>VFX Spyglass{IS_TESTNET ? ' TESTNET' : ''}</title>
          <meta name="description" content="VerifiedX Spyglass: Home" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <div className="p-5 text-center">
          {t("maintenance.message")}
        </div>
      </>
    );
  }

  return (
    <div>
      <header>
        <nav className="navbar navbar-dark navbar-expand-lg text-light bg-black fixed-top pb-1 pt-2">
          <div className="container-fluid">
            <a className="navbar-brand text-white" href="/">
              <img
                src="/cube.gif"
                alt="cube icon"
                className="me-1"
                style={{ width: 32, height: 32, position: "relative", top: -2 }}
              />
              <span>Verified<span className="text-secondary" style={{ fontWeight: '600' }}>X</span> <span style={{ opacity: 0.85, fontWeight: 200 }}>Spyglass</span></span>
            </a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07XL" aria-controls="navbarsExample07XL" aria-expanded="false" aria-label="Toggle navigation" onClick={handleNavCollapse}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarsExample07XL">
              <div className="navbar-nav">
                <a className="nav-link" href={localized("/block")}>
                  {t("nav.blocks")}
                </a>

                <a
                  className="nav-link"
                  href={localized("/transaction")}
                >
                  {t("nav.transactions")}
                </a>

                <a
                  className="nav-link"
                  href={localized("/validators")}
                >
                  {t("nav.validators")}
                </a>

                {!IS_TESTNET ? (

                  <a
                    className="nav-link"
                    href={localized("/metrics")}
                  >
                    {t("nav.metrics")}
                  </a>
                ) : null}

                <a
                  className="nav-link"
                  href={localized("/domains")}
                >
                  {t("nav.domains")}
                </a>


                <a
                  className="nav-link btc-link"
                  href={localized("/vbtc-token")}
                >
                  {t("nav.vbtc")}
                </a>

                <a
                  className="nav-link btc-link"
                  href={IS_DEVNET ? "https://mempool.space/testnet4" : IS_TESTNET ? "https://mempool.space/testnet4" : "https://mempool.space/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("nav.btcSpyglass")}
                </a>

                <a
                  className="nav-link"
                  href={localized("/fungible-token")}
                >
                  {t("nav.fungibleTokens")}
                </a>

                <a
                  className="nav-link"
                  href={localized("/nfts")}
                >
                  {t("nav.nfts")}
                </a>

                {/* {!IS_TESTNET ? (

                  <a
                    className="nav-link"
                    href="/map"
                  >
                    {t("nav.map")}
                  </a>
                ) : null} */}

                {IS_DEVNET || IS_TESTNET ? (

                  <a
                    className="nav-link"
                    href={localized("/faucet")}
                  >
                    {t("nav.faucet")}
                  </a>
                ) : null}

                <a
                  className="nav-link"
                  href={localized("/search")}
                >
                  {t("nav.search")}
                </a>

                <span className="nav-link text-muted d-none d-lg-block">|</span>
                <a
                  className="nav-link "
                  href="https://verifiedx.io"
                  target="blank"
                  rel="noreferrer"
                >
                  {t("nav.verifiedXSite")}
                </a>
                <a
                  className="nav-link "
                  href="https://docs.verifiedx.io"
                  target="blank"
                  rel="noreferrer"
                >
                  {t("nav.docs")}
                </a>

                <a
                  className="nav-link "
                  href="https://github.com/VerifiedXBlockchain"
                  target="blank"
                  rel="noreferrer"
                >
                  {t("nav.github")}
                </a>

                <a
                  className="nav-link "
                  href="https://discord.gg/7cd5ebDQCj"
                  target="blank"
                  rel="noreferrer"
                >
                  {t("nav.discord")}
                </a>

                <a
                  className="nav-link "
                  href="https://x.com/VFXBlockchain"
                  target="blank"
                  rel="noreferrer"
                >
                  {t("nav.x")}
                </a>
              </div>
            </div>
            <div className="d-none d-lg-flex align-items-center gap-2">
              <LanguageSwitcher />
              <Search />
            </div>
          </div>
        </nav>
      </header>
      <Head>
        <link rel="canonical" href={`${SITE_ORIGIN}${canonicalPath || "/"}`} />
        {locales?.map((loc) => {
          const href = loc === defaultLocale ? hreflangPath : `/${loc}${hreflangPath}`;
          return (
            <link
              key={loc}
              rel="alternate"
              hrefLang={loc}
              href={`${SITE_ORIGIN}${href || "/"}`}
            />
          );
        })}
        <link rel="alternate" hrefLang="x-default" href={`${SITE_ORIGIN}${hreflangPath || "/"}`} />
      </Head>
      <div style={{ height: 54 }}></div>

      <div className=" d-block d-lg-none">
        <div className="container d-flex align-items-center gap-2">
          <LanguageSwitcher />
          <Search />
        </div>
      </div>

      <Component {...pageProps} />

      {/* VFX Assistant chat widget. It loads after hydration, so the current
          route's context is pushed again once the script is in place. */}
      <Script
        src={ASSISTANT_WIDGET_URL}
        strategy="afterInteractive"
        data-app="spyglass"
        onLoad={() => pushAssistantContext(deriveAssistantContext(asPath))}
      />
    </div>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
