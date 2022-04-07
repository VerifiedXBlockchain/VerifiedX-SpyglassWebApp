import { Transaction } from "../models/transaction";
import { TransactionCard } from "./transaction-card";

interface Props {
  transactions: Transaction[];
}

export const TransactionList = (props: Props) => {
  const { transactions } = props;
  return (
    <div className="row">
      {transactions.map((transaction) => (
        <div className="col-12 col-md-4 py-2" key={transaction.hash}>
          <TransactionCard transaction={transaction} />
        </div>
      ))}
    </div>
  );
};
