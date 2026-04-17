import { useTranslation } from "next-i18next";
import { Transaction } from "../models/transaction";

interface Props {
  transaction: Transaction;
}

export const TransactionCard = (props: Props) => {
  const { t } = useTranslation("transaction");
  const { transaction } = props;

  return (
    <div className="card">
      <div className="card-header text-start">
        <a
          href={`/transaction/${transaction.hash}`}
          className="mb-0 h6 text-white"
        >
          {transaction.hash}
        </a>
      </div>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        {t("card.txType")}
        <span className="badge bg-primary rounded-pill">
          {transaction.transactionTypeLabel}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        {t("card.height")}
        <span className="badge bg-primary rounded-pill">
          {transaction.height}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        {t("card.amount")}
        <span className="badge bg-primary rounded-pill">
          {transaction.amount} VFX
        </span>
      </li>
      <li className="list-group-item">
        {t("card.from")}<br />
        <small>{transaction.fromAddress}</small>
      </li>
      <li className="list-group-item ">
        {t("card.to")}<br />
        <small>{transaction.toAddress}</small>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        {t("card.fee")}
        <span className="badge bg-primary rounded-pill">
          {transaction.fee} VFX
        </span>
      </li>

      <div className="card-footer text-muted text-center">
        {transaction.timestampLabel}
      </div>
    </div>
  );
};
