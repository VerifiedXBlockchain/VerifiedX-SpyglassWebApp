/* eslint-disable @next/next/no-html-link-for-pages */
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BlockDetail } from "../../../src/components/block-detail";
import { IS_TESTNET, IS_DEVNET } from "../../../src/constants";
import { Block } from "../../../src/models/block";
import { BlockService } from "../../../src/services/block-service";
import { useLocalized } from "../../../src/utils/use-localized";

const BlockDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(["block", "common"]);
  const localized = useLocalized();

  const [block, setBlock] = useState<Block | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    const service = new BlockService();

    service.retrieve(id.toString()).then((data) => {
      console.log(data);
      setBlock(data);
    });
  }, [id]);

  if (!block) return <></>;

  const next = block.height + 1;
  const prev = block.height - 1;
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';

  return (
    <>
      <Head>

        <meta name="description" />
        <title>{`${t("block:detail.pageTitle", { height: block.height })}${netTag}`}</title>
        <link rel="icon" href={localized("/favicon.png")} />
      </Head>
      <div>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb align-items-center">
              <li className="breadcrumb-item">
                <a href={localized("/")}>{t("common:breadcrumb.home")}</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <a href={localized("/block")}>{t("common:nav.blocks")}</a>
              </li>

              <li className="breadcrumb-item active" aria-current="page">
                <a href={localized(`/block/${block.height}`)}>{block.height}</a>
              </li>
              <div className="ms-auto">
                <div className="btn-group">
                  {prev > 0 ? (
                    <a
                      href={localized(`/block/${prev}`)}
                      className="btn btn-dark btn-sm border"
                    >
                      {t("common:action.prev")}
                    </a>
                  ) : null}
                  <a
                    href={localized(`/block/${next}`)}
                    className="btn btn-dark btn-sm border"
                  >
                    {t("common:action.next")}
                  </a>
                </div>
              </div>
            </ol>
          </nav>
        </div>

        <BlockDetail block={block} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['block', 'common', 'search', 'transaction'])),
  },
});

export default BlockDetailPage;
