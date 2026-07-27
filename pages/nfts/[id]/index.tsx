/* eslint-disable @next/next/no-html-link-for-pages */
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { IS_TESTNET, IS_DEVNET } from "../../../src/constants";
import { Nft } from "../../../src/models/nft";
import { NftService } from "../../../src/services/nft-service";
import { formatBytes } from "../../../src/utils/formatting";
import { Transaction } from "../../../src/models/transaction";
import { TransactionCard } from "../../../src/components/transaction-card";
import { useLocalized } from "../../../src/utils/use-localized";

const NftDetailPage: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation(["nft", "common"]);
  const localized = useLocalized();

  const { id } = router.query;

  const [nft, setNft] = useState<Nft | undefined>(undefined);
  const [history, setHistory] = useState<Transaction[]>([]);


  useEffect(() => {
    if (!id) return;

    const service = new NftService();

    service.retrieve(id.toString()).then((data) => {
      console.log(data);
      setNft(data);
    });

    service.history(id.toString()).then((data) => {
      setHistory(data);
    });

  }, [id]);

  if (!nft) return <></>;

  const netTag = IS_DEVNET ? ` ${t("common:brand.devnetTag")}` : IS_TESTNET ? ` ${t("common:brand.testnetTag")}` : '';

  return (
    <>
      <Head>
        <meta name="description" />
        <title>{`${t("nft:detail.pageTitle", { id })}${netTag}`}</title>
        <link rel="icon" href={localized("/favicon.png")} />
      </Head>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href={localized("/")}>{t("common:breadcrumb.home")}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href={localized("/nfts")}>{t("nft:list.breadcrumbCurrent")}</a>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              <a href={localized(`/nft/${nft.identifier}`)}>
                {nft.name}
              </a>
            </li>
          </ol>
        </nav>
        <div className="text-center p-3 h3">{nft.name}</div>


        <table className="table table-striped">
          <tbody>

            <tr>
              <th>{t("nft:detail.fields.identifier")}</th>
              <td>{nft.identifier}</td>
            </tr>
            <tr>
              <th>{t("nft:detail.fields.name")}</th>
              <td>{nft.name}</td>
            </tr>
            <tr>
              <th>{t("nft:detail.fields.description")}</th>
              <td dangerouslySetInnerHTML={{ __html: nft.description.replace(/\\n/g, '<br />').replace(/\n/g, '<br />') }}></td>
            </tr>

            <tr>
              <th>{t("nft:detail.fields.minterAddress")}</th>
              <td>{nft.minterAddress}</td>
            </tr>
            <tr>
              <th>{t("nft:detail.fields.ownerAddress")}</th>
              <td>{nft.ownerAddress}</td>
            </tr>

            <tr>
              <th>{t("nft:detail.fields.minterName")}</th>
              <td>{nft.minterName}</td>
            </tr>
            <tr>
              <th>{t("nft:detail.fields.primaryAssetName")}</th>
              <td>{nft.primaryAssetName}</td>
            </tr>
            <tr>
              <th>{t("nft:detail.fields.primaryAssetSize")}</th>
              <td>{formatBytes(nft.primaryAssetSize)}</td>
            </tr>

            <tr>
              <th>{t("nft:detail.fields.mintTransaction")}</th>
              <td> <a href={localized("/transaction/" + nft.mintTransaction)} >
                {nft.mintTransaction}
              </a></td>
            </tr>
            {nft.burnTransaction ? (
              <tr>
                <th>{t("nft:detail.fields.burnTransaction")}</th>
                <td> <a href={localized("/transaction/" + nft.burnTransaction)} >
                  {nft.burnTransaction}
                </a></td>
              </tr>
            ) : null}
          </tbody>

        </table>

        <div className="mt-3">
          <h4>{t("nft:detail.smartContractCodeHeading")}</h4>
          <pre className="bg-black p-2">
            {nft.dataDataFormatted}
          </pre>
        </div>
        {history.length && (
          <div className="mt-3">
            <h4>{t("nft:detail.transactionHistoryHeading")}</h4>
            <div className="row">

              {history.map(tx => {
                return (
                  <div key={tx.hash} className="col-12 col-md-4" >
                    <TransactionCard transaction={tx} />
                  </div>
                )
              })}


            </div>
          </div>)}

      </div>



    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'nft', 'search', 'transaction'])),
  },
});

export default NftDetailPage;
