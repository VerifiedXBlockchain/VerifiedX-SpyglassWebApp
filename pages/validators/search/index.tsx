import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Breadcrumbs } from "../../../src/components/ui/breadcrumbs";
import { Button } from "../../../src/components/ui/button";
import { Card } from "../../../src/components/ui/card";
import { SearchIcon } from "../../../src/components/ui/icons";
import { Page } from "../../../src/components/ui/page";
import { PageHeader } from "../../../src/components/ui/page-header";
import { TextInput } from "../../../src/components/ui/text-input";
import { ValidatorList } from "../../../src/components/validators/validator-list";
import { IS_DEVNET, IS_TESTNET } from "../../../src/constants";
import { Validator } from "../../../src/models/validator";
import { ValidatorService } from "../../../src/services/validator-service";
import { useLocalized } from "../../../src/utils/use-localized";
import styles from "../../../src/components/validators/validator-search.module.scss";

const ValidatorSearch: NextPage = () => {
  const { t } = useTranslation(["validator", "common"]);
  const localized = useLocalized();

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [loading, setLoading] = useState(false);
  const [validators, setValidators] = useState<Validator[]>([]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(trimmed);
    try {
      const data = await new ValidatorService().search(trimmed);
      setValidators(data.results);
    } catch (error) {
      console.error("Validator search failed", error);
      setValidators([]);
    } finally {
      setLoading(false);
    }
  };

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : "";

  return (
    <>
      <Head>
        <title>{`${t("validator:search.pageTitle")}${netTag}`}</title>
        <meta name="description" content={t("validator:search.body") as string} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Page narrow>
        <Breadcrumbs
          items={[
            { label: t("common:breadcrumb.home"), href: localized("/") },
            { label: t("common:nav.validators"), href: localized("/validators") },
            { label: t("validator:search.heading") },
          ]}
        />
        <PageHeader title={t("validator:search.heading")} />
        <Card>
          <form className={styles.form} onSubmit={submit} role="search">
            <TextInput
              name="validator"
              label={t("validator:search.label")}
              placeholder={t("validator:search.placeholder") as string}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              hint={t("validator:search.body")}
              mono
              autoComplete="off"
              spellCheck={false}
            />
            <Button type="submit" variant="primary" icon={<SearchIcon size={14} />} disabled={loading || !query.trim()} className={styles.submit}>
              {t("validator:search.cta")}
            </Button>
          </form>
        </Card>
        {searched ? (
          <div className={styles.results}>
            <ValidatorList validators={validators} loading={loading} emptyLabel={t("validator:search.noResults", { query: searched }) as string} />
          </div>
        ) : null}
      </Page>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["block", "common", "search", "validator"])),
  },
});

export default ValidatorSearch;
