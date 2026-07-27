import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BlockMapContainer } from "../../src/components/block-map-container";
import { IS_TESTNET, IS_DEVNET } from "../../src/constants";

const MapPage: NextPage = () => {
  const { t } = useTranslation(["search", "common"]);
  if (typeof window === "undefined") {
    return null;
  }

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';

  return (
    <div>
      <Head>
        <title>{`${t("common:brand.spyglass")} VFX${netTag}`}</title>
        <meta
          name="description"
          content={t("search:map.metaDescription") as string}
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h3 className="text-center">{t("search:map.heading")}</h3>
      <BlockMapContainer />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['block', 'common', 'search'])),
  },
});

export default MapPage;
