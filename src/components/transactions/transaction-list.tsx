import { TABLET_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { useNow } from "../../hooks/useNow";
import { Transaction } from "../../models/transaction";
import { Skeleton } from "../ui/skeleton";
import { TransactionListCompact } from "./transaction-list-compact";
import { TransactionTable } from "./transaction-table";

interface Props {
  transactions: Transaction[];
  loading?: boolean;
  showBlock?: boolean;
  emptyLabel?: string;
}

/** Responsive transaction list: table from tablet width, stacked rows on phones. */
export const TransactionList = ({ transactions, loading, showBlock, emptyLabel }: Props) => {
  const isTablet = useMediaQuery(TABLET_QUERY);
  const now = useNow(1000);

  if (isTablet === undefined) return <Skeleton height={240} radius={12} />;
  if (isTablet) return <TransactionTable transactions={transactions} loading={loading} now={now} showBlock={showBlock} emptyLabel={emptyLabel} />;
  return <TransactionListCompact transactions={transactions} loading={loading} now={now} emptyLabel={emptyLabel} />;
};
