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
              value={`${transaction.amount} RBX`}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label="Fee"
              value={`${transaction.fee} RBX`}
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
        </div>
        <div>
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
      </div>
    </div>
  );
};

export default TransactionDetailPage;
