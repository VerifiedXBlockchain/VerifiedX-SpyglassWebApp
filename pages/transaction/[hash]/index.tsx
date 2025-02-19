/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DetailItem } from "../../../src/components/detail-item";
import { TransactionCard } from "../../../src/components/transaction-card";
import { Transaction } from "../../../src/models/transaction";

import { TransactionService } from "../../../src/services/transaction-service";

const TransactionDetailPage: NextPage = () => {
  const router = useRouter();
  const { hash } = router.query;

  const [transaction, setTransaction] = useState<Transaction | undefined>(
    undefined
  );

  useEffect(() => {
    if (!hash) return;

    const service = new TransactionService();

    service.retrieve(hash.toString()).then((data) => {
      console.log(data);
      setTransaction(data);
    });
  }, [hash]);

  if (!transaction) return <></>;

  return (
    <div>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/transaction">Transactions</a>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              <a href={`/transaction/${transaction.hash}`}>
                {transaction.hashPreview()}
              </a>
            </li>
          </ol>
        </nav>
        <h4>Transaction Details</h4>
        <div className="bg-dark p-2">
          <div className="d-block d-md-flex">
            <DetailItem
              label="Tx&nbsp;Type"
              value={transaction.transactionTypeLabel}
              dontBreak
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label="Craft Time"
              value={transaction.timestampLabel}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>
            <DetailItem
              label="Hash"
              value={transaction.hash}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label="Block"
              value={`${transaction.height}`}
              smallValue
              href={`/block/${transaction.height}`}
            ></DetailItem>
            <div className="p-1"></div>
            <DetailItem
              label="Amount"
              value={`${transaction.amount} VFX`}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label="Fee"
              value={`${transaction.fee} VFX`}
              smallValue
            ></DetailItem>
          </div>
          <div className="py-1"></div>

          <div className="d-block d-md-flex">
            <DetailItem
              label="From"
              value={transaction.fromAddress}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label="To"
              value={transaction.toAddress}
              smallValue
            ></DetailItem>
          </div>

          <div className="p-1"></div>
          {transaction.signature ? (
            <DetailItem
              label="Signature"
              value={transaction.signature}
              smallValue
            ></DetailItem>) : null}
        </div>
        <div>
          {transaction.nft ? (
            <div className="mt-3">
              <h4>Smart Contract Details</h4>
              <table className="table table-striped">
                <tbody>

                  <tr>
                    <th>Identifier:</th>
                    <td>{transaction.nft.identifier}</td>
                  </tr>
                  <tr>
                    <th>Name:</th>
                    <td>{transaction.nft.name}</td>
                  </tr>
                  <tr>
                    <th>Description:</th>
                    <td>{transaction.nft.description}</td>
                  </tr>

                  <tr>
                    <th>minterAddress:</th>
                    <td>{transaction.nft.minterAddress}</td>
                  </tr>
                  <tr>
                    <th>ownerAddress:</th>
                    <td>{transaction.nft.ownerAddress}</td>
                  </tr>

                  <tr>
                    <th>minterName:</th>
                    <td>{transaction.nft.minterName}</td>
                  </tr>
                  <tr>
                    <th>primaryAssetName:</th>
                    <td>{transaction.nft.primaryAssetName}</td>
                  </tr>
                  <tr>
                    <th>primaryAssetSize:</th>
                    <td>{transaction.nft.primaryAssetSize}</td>
                  </tr>
                </tbody>

              </table>
            </div>
          ) : null}

          {transaction.nftData != null ? (
            <div className="mt-3">
              <h4>Tx Details</h4>
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
              <h4>Tx Data Decoded</h4>
              <pre className="bg-black p-2">
                {transaction.nftDataDataFormatted}
              </pre>
            </div>
          ) : null}
        </div>

        {transaction.callbackDetails ? (
          <div>
            <h4>Callback Details</h4>

            <div className="row">
              <div className="col-12 col-md-4 py-2">
                <TransactionCard transaction={transaction.callbackDetails} />

              </div>
            </div>


          </div>
        ) : null}

        {transaction.recoveryDetails ? (
          <div>
            <h4>Recovery Details</h4>

            <pre className="bg-black p-2">
              Original Address: {transaction.recoveryDetails.originalAddress}<br />
              New Address: {transaction.recoveryDetails.newAddress}<br />
              Amount: {transaction.recoveryDetails.amount}<br />
            </pre>

            {transaction.recoveryDetails ? (

              <>
                <h4>Outstanding Transactions</h4>
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

export default TransactionDetailPage;
