import { TABLET_QUERY, useMediaQuery } from "../../hooks/useMediaQuery";
import { useNow } from "../../hooks/useNow";
import { Block } from "../../models/block";
import { BlockListCompact } from "../blocks/block-list-compact";
import { BlockTable } from "../blocks/block-table";
import { Skeleton } from "../ui/skeleton";

interface Props {
  blocks: Block[];
  loading?: boolean;
  emptyLabel?: string;
}

/** Block results without the feed's own infinite scroll: the search page pages both tabs itself. */
export const BlockResults = ({ blocks, loading, emptyLabel }: Props) => {
  const isTablet = useMediaQuery(TABLET_QUERY);
  const now = useNow(1000);
  if (isTablet === undefined) return <Skeleton height={240} radius={12} />;
  if (isTablet) return <BlockTable blocks={blocks} loading={loading} now={now} emptyLabel={emptyLabel} />;
  return <BlockListCompact blocks={blocks} loading={loading} now={now} emptyLabel={emptyLabel} />;
};
