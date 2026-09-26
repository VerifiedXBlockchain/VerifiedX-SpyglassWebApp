import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Card } from "../../../src/components/ui/card";
import { Page } from "../../../src/components/ui/page";
import { Skeleton } from "../../../src/components/ui/skeleton";
import { CenteredState } from "../../../src/components/ui/spinner";
import { VbtcTokenDetail } from "../../../src/components/vbtc-token-detail";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { VbtcToken } from "../../../src/models/vbtc-token";
import { VbtcTokenService } from "../../../src/services/vbtc-service";
import { truncateMiddle } from "../../../src/utils/formatting";
import { useLocalized } from "../../../src/utils/use-localized";

const VbtcTokenDetailPage: NextPage = () => {
  const { t } = useTranslation(["vbtcToken", "common"]);
  const localized = useLocalized();
  const { id } = useRouter().query;

  const [token, setToken] = useState<VbtcToken | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setToken(undefined);
    setNotFound(false);
    new VbtcTokenService()
      .retrieve(id.toString())
      .then((data) => {
        if (cancelled) return;
        if (!data.sc_identifier) {
          setNotFound(true);
          return;
        }
        setToken(data);
      })
      .catch((error) => {
        console.error("vBTC token lookup failed", error);
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const idText = `${id ?? ""}`;
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("vbtcToken:detail.pageTitle", { name: token?.name ?? truncateMiddle(idText, 6) })}${netTag}`}</title>
        <meta name="description" content={t("vbtcToken:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs
          items={[
            { label: t("common:breadcrumb.home"), href: localized("/") },
            { label: t("vbtcToken:list.breadcrumbCurrent"), href: localized("/vbtc-token") },
            { label: token?.name ?? truncateMiddle(idText, 8), mono: !token },
          ]}
        />
        {notFound ? (
          <Card>
            <CenteredState title={t("vbtcToken:detail.notFound")} body={t("vbtcToken:detail.notFoundBody", { id: idText })} />
          </Card>
        ) : token ? (
          <VbtcTokenDetail token={token} />
        ) : (
          <>
            <Skeleton width={260} height={30} />
            <div style={{ height: 18 }} />
            <Card>
              <Skeleton height={200} />
            </Card>
          </>
        )}
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common", "search", "vbtcToken"])),
  },
});

export default VbtcTokenDetailPage;
