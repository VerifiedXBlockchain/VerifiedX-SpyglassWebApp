import "../src/styles/styles.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import "mapbox-gl/dist/mapbox-gl.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { appWithTranslation, useTranslation } from "next-i18next";
import mapboxgl from "mapbox-gl";
import nextI18NextConfig from "../next-i18next.config";
import { AppHeader } from "../src/components/ui/app-header";
import { IS_TESTNET, MAINTENENCE_MODE, SITE_ORIGIN } from "../src/constants";
import { setActiveLocale } from "../src/utils/active-locale";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVzZXJ2ZWJsb2NrIiwiYSI6ImNsMXV2dWN6NjAyaTMzaW1xMXhqd243dG0ifQ.J6Sjh7N5mgmHAbhVytO_WQ";

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const { locale, locales, defaultLocale, asPath } = router;

  const hreflangPath = asPath === "/" ? "" : asPath;
  const canonicalPath = locale && locale !== defaultLocale ? `/${locale}${hreflangPath}` : hreflangPath;
  setActiveLocale(locale);

  if (MAINTENENCE_MODE) {
    return (
      <>
        <Head>
          <title>VFX Spyglass{IS_TESTNET ? " TESTNET" : ""}</title>
          <meta name="description" content="VerifiedX Spyglass: Home" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <div className="p-5 text-center">{t("maintenance.message")}</div>
      </>
    );
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${SITE_ORIGIN}${canonicalPath || "/"}`} />
        {locales?.map((loc) => {
          const href = loc === defaultLocale ? hreflangPath : `/${loc}${hreflangPath}`;
          return <link key={loc} rel="alternate" hrefLang={loc} href={`${SITE_ORIGIN}${href || "/"}`} />;
        })}
        <link rel="alternate" hrefLang="x-default" href={`${SITE_ORIGIN}${hreflangPath || "/"}`} />
      </Head>
      <AppHeader />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
