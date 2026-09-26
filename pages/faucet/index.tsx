import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TestnetFaucetForm from "../../src/components/testnet-faucet-form";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Card } from "../../src/components/ui/card";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { Skeleton } from "../../src/components/ui/skeleton";
import { CenteredState } from "../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { TestnetFaucetInfo } from "../../src/models/testnet-faucet-info";
import { FaucetService } from "../../src/services/faucet-service";
import { useLocalized } from "../../src/utils/use-localized";

const FaucetPage: NextPage = () => {
  const { t } = useTranslation(["faucet", "common"]);
  const localized = useLocalized();
  const [info, setInfo] = useState<TestnetFaucetInfo | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    new FaucetService()
      .info()
      .then((data) => {
        if (!cancelled) setInfo(data);
      })
      .catch((error) => {
        console.error("Faucet info unavailable", error);
        if (!cancelled) setInfo(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const title = IS_DEVNET ? t("faucet:pageTitleDevnet") : IS_TESTNET ? t("faucet:pageTitleTestnet") : t("faucet:pageTitleMainnet");

  return (
    <>
      <Head>
        <title>{`VFX Spyglass: ${title}`}</title>
        <meta name="description" content={title as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page narrow>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("common:nav.faucet") }]} />
        <PageHeader title={title} meta={t("faucet:description")} />
        {info ? (
          <TestnetFaucetForm info={info} />
        ) : info === null ? (
          <Card>
            <CenteredState title={t("faucet:unavailableHeading")} body={t("faucet:unavailableBody")} />
          </Card>
        ) : (
          <Card>
            <Skeleton height={140} />
          </Card>
        )}
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "faucet", "search"])),
  },
});

export default FaucetPage;
