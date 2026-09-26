import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Breadcrumbs } from "../../src/components/ui/breadcrumbs";
import { Button } from "../../src/components/ui/button";
import { SearchIcon } from "../../src/components/ui/icons";
import { Page } from "../../src/components/ui/page";
import { PageHeader } from "../../src/components/ui/page-header";
import { LiveDot, Pill } from "../../src/components/ui/pill";
import { ValidatorList } from "../../src/components/validators/validator-list";
import { API_BASE_URL, IS_DEVNET, IS_TESTNET } from "../../src/constants";
import { Validator } from "../../src/models/validator";
import { useLocalized } from "../../src/utils/use-localized";

const ValidatorPoolPage: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["validator", "common"]);
  const localized = useLocalized();
  const results: any[] = data?.results ?? [];
  const validators: Validator[] = results.map((v) => new Validator(v));
  const activeCount = validators.filter((v) => v.isActive).length;
  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("validator:list.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("validator:list.metaDescription") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page>
        <Breadcrumbs items={[{ label: t("common:breadcrumb.home"), href: localized("/") }, { label: t("common:nav.validators") }]} />
        <PageHeader
          title={t("validator:list.heading")}
          badges={
            validators.length ? (
              <Pill tone="green" size="md" icon={<LiveDot />}>
                {t("validator:list.activeCount", { count: activeCount })}
              </Pill>
            ) : null
          }
          meta={t("validator:list.description")}
          actions={
            <Button href={localized("/validators/search")} size="sm" icon={<SearchIcon size={14} />}>
              {t("validator:list.checkStatusCta")}
            </Button>
          }
        />
        <ValidatorList validators={validators} sortable />
      </Page>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ res, locale }) => {
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");

  let data: { results: any[] } = { results: [] };
  try {
    const result = await fetch(`${API_BASE_URL}/masternodes/?is_active=true&compact=true`);
    data = await result.json();
  } catch (error) {
    console.error("Validator list fetch failed", error);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search", "validator"])),
      data,
    },
  };
};

export default ValidatorPoolPage;
