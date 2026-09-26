import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NftDetail } from "../../../src/components/tokens/nft-detail";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Card } from "../../../src/components/ui/card";
import { Page } from "../../../src/components/ui/page";
import { Skeleton } from "../../../src/components/ui/skeleton";
import { CenteredState } from "../../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { Nft } from "../../../src/models/nft";
import { Transaction } from "../../../src/models/transaction";
import { NftService } from "../../../src/services/nft-service";
import { truncateMiddle } from "../../../src/utils/formatting";
import { useLocalized } from "../../../src/utils/use-localized";

const NftDetailPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation(["nft", "common"]);
  const localized = useLocalized();
  const { id } = router.query;

  const [nft, setNft] = useState<Nft | undefined>(undefined);
  const [history, setHistory] = useState<Transaction[] | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setNft(undefined);
    setHistory(undefined);
    setNotFound(false);
    const service = new NftService();

    service
      .retrieve(id.toString())
      .then((data) => {
        if (cancelled) return;
        if (!data.identifier) {
          setNotFound(true);
          return;
        }
        setNft(data);
      })
      .catch((error) => {
        console.error("NFT lookup failed", error);
        if (!cancelled) setNotFound(true);
      });

    service
      .history(id.toString())
      .then((data) => {
        if (!cancelled) setHistory(data);
      })
      .catch((error) => {
        console.error("NFT history failed", error);
        if (!cancelled) setHistory([]);
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
        <title>{`${t("nft:detail.pageTitle", { id: nft?.name ?? truncateMiddle(idText, 6) })}${netTag}`}</title>
        <meta name="description" content={t("nft:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs
          items={[
            { label: t("common:breadcrumb.home"), href: localized("/") },
            { label: t("nft:list.breadcrumbCurrent"), href: localized("/nfts") },
            { label: nft?.name ?? truncateMiddle(idText, 8), mono: !nft },
          ]}
        />
        {notFound ? (
          <Card>
            <CenteredState title={t("nft:detail.notFound")} body={t("nft:detail.notFoundBody", { id: idText })} />
          </Card>
        ) : nft ? (
          <NftDetail nft={nft} history={history} />
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
    ...(await serverSideTranslations(locale ?? "en", ["common", "nft", "search", "transaction"])),
  },
});

export default NftDetailPage;
