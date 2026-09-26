import { useTranslation } from "next-i18next";
import { Block } from "../../models/block";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import { Amount, BlockTxCell, CraftTime, HeightLink, TimeCell, ValidatorCell } from "./block-cells";

interface Props {
  blocks: Block[];
  loading?: boolean;
  /** Shared clock for the relative timestamps. */
  now: number;
}

export const BlockTable = ({ blocks, loading, now }: Props) => {
  const { t } = useTranslation("block");
  const localized = useLocalized();

  const columns: Column<Block>[] = [
    { key: "height", header: t("row.height"), nowrap: true, render: (block) => <HeightLink block={block} /> },
    { key: "hash", header: t("row.hash"), nowrap: true, render: (block) => <Hash value={block.hash} /> },
    { key: "validator", header: t("row.validator"), render: (block) => <ValidatorCell block={block} /> },
    { key: "txs", header: t("row.transactions"), render: (block) => <BlockTxCell block={block} /> },
    { key: "amount", header: t("row.amount"), align: "end", nowrap: true, render: (block) => <Amount value={block.totalAmount} /> },
    { key: "reward", header: t("row.reward"), align: "end", nowrap: true, hideBelowDesktop: true, render: (block) => <Amount value={block.totalReward} /> },
    { key: "crafted", header: t("row.crafted"), nowrap: true, render: (block) => <TimeCell date={block.dateCrafted} now={now} /> },
    { key: "craftTime", header: t("row.craftTime"), align: "end", nowrap: true, hideBelowDesktop: true, render: (block) => <CraftTime block={block} /> },
  ];

  return (
    <DataTable
      columns={columns}
      rows={blocks}
      rowKey={(block) => block.height}
      rowHref={(block) => localized(`/block/${block.height}`)}
      loading={loading}
      caption={t("home.tableCaption") as string}
    />
  );
};
