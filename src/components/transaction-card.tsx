import { Transaction } from "../models/transaction";

interface Props {
  transaction: Transaction;
}

export const TransactionCard = (props: Props) => {
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
        Tx Type:
        <span className="badge bg-primary rounded-pill">
          {transaction.transactionTypeLabel}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Height:
        <span className="badge bg-primary rounded-pill">
          {transaction.height}
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Amount:
        <span className="badge bg-primary rounded-pill">
          {transaction.displayAmount}
        </span>
      </li>
      <li className="list-group-item">
        From:<br />
        <small className={transaction.isFromSentinel ? "text-muted fst-italic" : ""}>
          {transaction.displayFromAddress}
        </small>
      </li>
      <li className="list-group-item ">
        To:<br />
        <small className={transaction.isToSentinel ? "text-muted fst-italic" : ""}>
          {transaction.displayToAddress}
        </small>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Fee:
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
