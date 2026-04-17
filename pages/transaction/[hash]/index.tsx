/* eslint-disable @next/next/no-html-link-for-pages */
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { DetailItem } from "../../../src/components/detail-item";
import { TransactionCard } from "../../../src/components/transaction-card";
import { LoadingSpinner } from "../../../src/components/loading-spinner";
import { useTransactionPolling } from "../../../src/hooks/useTransactionPolling";
import { LAYOUT_HEIGHTS } from "../../../src/constants/ui";

const TransactionDetailPage: NextPage = () => {
  const router = useRouter();
  const { hash } = router.query;
  const { t } = useTranslation(["transaction", "common"]);

  const { transaction, loading, error, isPolling } = useTransactionPolling(hash);

  if (loading || error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: LAYOUT_HEIGHTS.PENDING_MIN_HEIGHT }}>
        <div className="text-center">
          <h4 className="text-light mb-3">{t("transaction:detail.pendingHeading")}</h4>
          <p className="text-muted mb-4">
            {t("transaction:detail.pendingBody")}
          </p>

          {(isPolling || loading) && (
            <LoadingSpinner variant="light" message={t("common:status.loading") as string} />
          )}
        </div>
      </div>
    );
  }

  if (!transaction) return <></>;

  return (
    <div>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href="/">{t("common:breadcrumb.home")}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/transaction">{t("common:nav.transactions")}</a>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              <a href={`/transaction/${transaction.hash || hash}`}>
                {transaction.hashPreview()}
              </a>
            </li>
          </ol>
        </nav>
        <h4>{t("transaction:detail.heading")}</h4>
        <div className="bg-dark p-2">
          <div className="d-block d-md-flex">
            <DetailItem
              label={t("transaction:detail.fields.txType") as string}
              value={transaction.transactionTypeLabel}
              dontBreak
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("transaction:detail.fields.craftTime") as string}
              value={transaction.timestampLabel}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>
            <DetailItem
              label={t("transaction:detail.fields.hash") as string}
              value={transaction.hash || (t("transaction:detail.fields.hashPendingPlaceholder") as string)}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("transaction:detail.fields.block") as string}
              value={`${transaction.height}`}
              smallValue
              href={`/block/${transaction.height}`}
            ></DetailItem>
            <div className="p-1"></div>
            <DetailItem
              label={t("transaction:detail.fields.amount") as string}
              value={`${transaction.amount} VFX`}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("transaction:detail.fields.fee") as string}
              value={`${transaction.fee} VFX`}
              smallValue
            ></DetailItem>
          </div>
          <div className="py-1"></div>

          <div className="d-block d-md-flex">
            <DetailItem
              label={t("transaction:detail.fields.from") as string}
              value={transaction.fromAddress}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("transaction:detail.fields.to") as string}
              value={transaction.toAddress}
              smallValue
            ></DetailItem>
          </div>

          <div className="p-1"></div>
          {transaction.signature ? (
            <DetailItem
              label={t("transaction:detail.fields.signature") as string}
              value={transaction.signature}
              smallValue
            ></DetailItem>) : null}
        </div>
        <div>
          {transaction.nft ? (
            <div className="mt-3">
              <h4>{t("transaction:detail.smartContractHeading")}</h4>
              <table className="table table-striped">
                <tbody>

                  <tr>
                    <th>{t("transaction:detail.nft.identifier")}</th>
                    <td>{transaction.nft.identifier}</td>
                  </tr>
                  <tr>
                    <th>{t("transaction:detail.nft.name")}</th>
                    <td>{transaction.nft.name}</td>
                  </tr>
                  <tr>
                    <th>{t("transaction:detail.nft.description")}</th>
                    <td dangerouslySetInnerHTML={{ __html: transaction.nft.description.replace(/\\n/g, '<br />').replace(/\n/g, '<br />') }}></td>
                  </tr>

                  <tr>
                    <th>{t("transaction:detail.nft.minterAddress")}</th>
                    <td>{transaction.nft.minterAddress}</td>
                  </tr>
                  <tr>
                    <th>{t("transaction:detail.nft.ownerAddress")}</th>
                    <td>{transaction.nft.ownerAddress}</td>
                  </tr>

                  <tr>
                    <th>{t("transaction:detail.nft.minterName")}</th>
                    <td>{transaction.nft.minterName}</td>
                  </tr>
                  <tr>
                    <th>{t("transaction:detail.nft.primaryAssetName")}</th>
                    <td>{transaction.nft.primaryAssetName}</td>
                  </tr>
                  <tr>
                    <th>{t("transaction:detail.nft.primaryAssetSize")}</th>
                    <td>{transaction.nft.primaryAssetSize}</td>
                  </tr>
                </tbody>

              </table>
            </div>
          ) : null}

          {transaction.nftData != null ? (
            <div className="mt-3">
              <h4>{t("transaction:detail.txDetailsHeading")}</h4>
              <pre
                className="bg-black p-2"
                style={{
                  // wordBreak: "break-all",
                  whiteSpace: "pre-line",
                  overflowWrap: "anywhere",
                }}
              >
                {transaction.nftDataFormatted}
              </pre>
            </div>
          ) : null}

          {transaction.nftDataDataFormatted != "" ? (
            <div className="mt-3">
              <h4>{t("transaction:detail.txDataDecodedHeading")}</h4>
              <pre className="bg-black p-2">
                {transaction.nftDataDataFormatted}
              </pre>
            </div>
          ) : null}
        </div>

        {transaction.callbackDetails ? (
          <div>
            <h4>{t("transaction:detail.callbackDetailsHeading")}</h4>

            <div className="row">
              <div className="col-12 col-md-4 py-2">
                <TransactionCard transaction={transaction.callbackDetails} />

              </div>
            </div>


          </div>
        ) : null}

        {transaction.recoveryDetails ? (
          <div>
            <h4>{t("transaction:detail.recoveryDetailsHeading")}</h4>

            <pre className="bg-black p-2">
              {t("transaction:detail.recovery.originalAddress")} {transaction.recoveryDetails.originalAddress}<br />
              {t("transaction:detail.recovery.newAddress")} {transaction.recoveryDetails.newAddress}<br />
              {t("transaction:detail.recovery.amount")} {transaction.recoveryDetails.amount}<br />
            </pre>

            {transaction.recoveryDetails ? (

              <>
                <h4>{t("transaction:detail.outstandingTransactionsHeading")}</h4>
                <div className="row">

                  {transaction.recoveryDetails.outstandingTransactions.map(tx => {
                    return (
                      <div key={tx.hash} className="col-12 col-md-4 py-2">
                        <TransactionCard transaction={tx} />

                      </div>
                    );
                  })}


                </div></>) : null}


          </div>
        ) : null}


      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'transaction', 'search'])),
  },
});

export default TransactionDetailPage;
