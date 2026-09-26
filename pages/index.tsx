import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { LiveBlocks } from "../src/components/home/live-blocks";
import { NetworkOverview } from "../src/components/home/network-overview";
import { Button } from "../src/components/ui/button";
import { ArrowRightIcon } from "../src/components/ui/icons";
import { Page } from "../src/components/ui/page";
import { SectionHeader } from "../src/components/ui/section-header";
import { IS_DEVNET, IS_TESTNET } from "../src/constants";
import { useLiveBlocks } from "../src/hooks/useLiveBlocks";
import { useLocalized } from "../src/utils/use-localized";

const Home: NextPage = () => {
  const { t } = useTranslation(["block", "common"]);
  const localized = useLocalized();
  const { blocks, loadMore, canLoadMore } = useLiveBlocks();
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("block:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("common:meta.defaultDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <NetworkOverview latestBlock={blocks[0]} />
        <SectionHeader
          as="h1"
          title={t("block:home.latestBlocks")}
          live={blocks.length > 0}
          liveLabel={t("block:home.live") as string}
          description={t("block:home.streaming")}
          actions={
            <Button href={localized("/block")} size="sm" iconRight={<ArrowRightIcon />}>
              {t("block:home.allBlocks")}
            </Button>
          }
        />
        <LiveBlocks blocks={blocks} loadMore={loadMore} canLoadMore={canLoadMore} />
      </Page>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search"])),
  },
});
