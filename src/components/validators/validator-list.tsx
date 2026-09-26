import { TABLET_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { Validator } from "../../models/validator";
import { Skeleton } from "../ui/skeleton";
import { ValidatorListCompact } from "./validator-list-compact";
import { ValidatorTable } from "./validator-table";

interface Props {
  validators: Validator[];
  loading?: boolean;
  emptyLabel?: string;
}

/** Responsive validator list: table from tablet width, stacked rows on phones. */
export const ValidatorList = ({ validators, loading, emptyLabel }: Props) => {
  const isTablet = useMediaQuery(TABLET_QUERY);
  if (isTablet === undefined) return <Skeleton height={240} radius={12} />;
  if (isTablet) return <ValidatorTable validators={validators} loading={loading} emptyLabel={emptyLabel} />;
  return <ValidatorListCompact validators={validators} loading={loading} emptyLabel={emptyLabel} />;
};
