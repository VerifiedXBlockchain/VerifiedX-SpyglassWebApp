import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BlockDetail } from "../../../src/components/block-detail";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Button } from "../../../src/components/ui/button";
import { Card } from "../../../src/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "../../../src/components/ui/icons";
import { Page } from "../../../src/components/ui/page";
import { CenteredState } from "../../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { Block } from "../../../src/models/block";
import { BlockService } from "../../../src/services/block-service";
import { useLocalized } from "../../../src/utils/use-localized";

const BlockDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { locale } = router;
  const { t } = useTranslation(["block", "common"]);
  const localized = useLocalized();

  const [block, setBlock] = useState<Block | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setBlock(undefined);
    setNotFound(false);
    new BlockService()
      .retrieve(id.toString())
      .then((data) => {
        if (cancelled) return;
        if (!Number.isFinite(data.height)) {
          setNotFound(true);
          return;
        }
        setBlock(data);
      })
      .catch((error) => {
        console.error("Block lookup failed", error);
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";
  const heightLabel = block ? block.height.toLocaleString(locale) : `${id ?? ""}`;

  return (
    <>
      <Head>
        <title>{`${t("block:detail.pageTitle", { height: heightLabel })}${netTag}`}</title>
        <meta name="description" content={t("block:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs
          items={[
            { label: t("common:breadcrumb.home"), href: localized("/") },
            { label: t("common:nav.blocks"), href: localized("/block") },
            { label: heightLabel, mono: true },
          ]}
          actions={
            block ? (
              <>
                {block.height > 1 ? (
                  <Button href={localized(`/block/${block.height - 1}`)} size="sm" icon={<ChevronLeftIcon />} aria-label={t("block:detail.prevBlock") as string}>
                    {(block.height - 1).toLocaleString(locale)}
                  </Button>
                ) : null}
                <Button href={localized(`/block/${block.height + 1}`)} size="sm" iconRight={<ChevronRightIcon />} aria-label={t("block:detail.nextBlock") as string}>
                  {(block.height + 1).toLocaleString(locale)}
                </Button>
              </>
            ) : null
          }
        />
        {notFound ? (
          <Card>
            <CenteredState title={t("block:detail.notFound")} body={t("block:detail.notFoundBody", { id })} />
          </Card>
        ) : (
          <BlockDetail block={block} />
        )}
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search", "transaction"])),
  },
});

export default BlockDetailPage;
