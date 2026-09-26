import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FungibleTokenDetail } from "../../../src/components/fungible-token-detail";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Card } from "../../../src/components/ui/card";
import { Page } from "../../../src/components/ui/page";
import { Skeleton } from "../../../src/components/ui/skeleton";
import { CenteredState } from "../../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { FungibleTokenDetailResponse } from "../../../src/models/fungible-token";
import { FungibleTokenService } from "../../../src/services/fungible-token-service";
import { truncateMiddle } from "../../../src/utils/formatting";
import { useLocalized } from "../../../src/utils/use-localized";

const FungibleTokenDetailPage: NextPage = () => {
  const { t } = useTranslation(["fungibleToken", "common"]);
  const localized = useLocalized();
  const { id } = useRouter().query;

  const [details, setDetails] = useState<FungibleTokenDetailResponse | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setDetails(undefined);
    setNotFound(false);
    new FungibleTokenService()
      .retrieve(id.toString())
      .then((data) => {
        if (cancelled) return;
        if (!data.token.sc_identifier) {
          setNotFound(true);
          return;
        }
        setDetails(data);
      })
      .catch((error) => {
        console.error("Fungible token lookup failed", error);
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const idText = `${id ?? ""}`;
  const token = details?.token;
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("fungibleToken:detail.pageTitle", { name: token?.name ?? truncateMiddle(idText, 6) })}${netTag}`}</title>
        <meta name="description" content={t("fungibleToken:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs
          items={[
            { label: t("common:breadcrumb.home"), href: localized("/") },
            { label: t("fungibleToken:list.breadcrumbCurrent"), href: localized("/fungible-token") },
            { label: token?.ticker ?? truncateMiddle(idText, 8), mono: !token },
          ]}
        />
        {notFound ? (
          <Card>
            <CenteredState title={t("fungibleToken:detail.notFound")} body={t("fungibleToken:detail.notFoundBody", { id: idText })} />
          </Card>
        ) : details && token ? (
          <FungibleTokenDetail token={token} holders={details.holders ?? {}} />
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
    ...(await serverSideTranslations(locale ?? "en", ["common", "fungibleToken", "search"])),
  },
});

export default FungibleTokenDetailPage;
