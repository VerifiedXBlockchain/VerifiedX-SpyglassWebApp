import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ValidatorMap } from "../../src/components/map/validator-map";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { useLocalized } from "../../src/utils/use-localized";

const MapPage: NextPage = () => {
  const { t } = useTranslation(["search", "common"]);
  const localized = useLocalized();
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("common:brand.spyglass")} VFX${netTag}`}</title>
        <meta name="description" content={t("search:map.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("search:map.heading") }]} />
        <PageHeader title={t("search:map.heading")} />
        <ValidatorMap />
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search"])),
  },
});

export default MapPage;
