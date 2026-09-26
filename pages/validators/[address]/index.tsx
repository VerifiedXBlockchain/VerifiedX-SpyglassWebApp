import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ValidatorDetail } from "../../../src/components/validator-detail";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Card } from "../../../src/components/ui/card";
import { Page } from "../../../src/components/ui/page";
import { Skeleton } from "../../../src/components/ui/skeleton";
import { CenteredState } from "../../../src/components/ui/spinner";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { Validator } from "../../../src/models/validator";
import { ValidatorService } from "../../../src/services/validator-service";
import { truncateMiddle } from "../../../src/utils/formatting";
import { useLocalized } from "../../../src/utils/use-localized";

const ValidatorDetailPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;
  const { t } = useTranslation(["validator", "common"]);
  const localized = useLocalized();

  const [validator, setValidator] = useState<Validator | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!address) return;
    let cancelled = false;
    setValidator(undefined);
    setNotFound(false);
    new ValidatorService()
      .retrieve(`${address}`)
      .then((data) => {
        if (cancelled) return;
        if (!data.address) {
          setNotFound(true);
          return;
        }
        setValidator(data);
      })
      .catch((error) => {
        console.error("Validator lookup failed", error);
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [address]);

  const addressText = `${address ?? ""}`;
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("validator:detail.pageTitle", { address: truncateMiddle(addressText, 6) })}${netTag}`}</title>
        <meta name="description" content={t("validator:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs
          items={[
            { label: t("common:breadcrumb.home"), href: localized("/") },
            { label: t("common:nav.validators"), href: localized("/validators") },
            { label: truncateMiddle(addressText, 8), mono: true },
          ]}
        />
        {notFound ? (
          <Card>
            <CenteredState title={t("validator:detail.notFound")} body={t("validator:detail.notFoundBody", { address: addressText })} />
          </Card>
        ) : validator ? (
          <ValidatorDetail validator={validator} />
        ) : (
          <>
            <Skeleton width={280} height={30} />
            <div style={{ height: 18 }} />
            <Card>
              <Skeleton height={180} />
            </Card>
          </>
        )}
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search", "transaction", "validator"])),
  },
});

export default ValidatorDetailPage;
