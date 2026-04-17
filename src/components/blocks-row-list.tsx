import { useTranslation } from "next-i18next";
import { Block } from "../models/block";
import { BlockCard } from "./block-card";
import { BlockRow } from "./block-row";

interface Props {
  blocks: Block[];
}

export const BlockRowList = (props: Props) => {
  const { t } = useTranslation("block");
  const { blocks } = props;
  return (
    <div className="block-row-list-container">

      <table className="table table-sm block-row-list-table">
        <thead>
          <tr>
            <th className="text-center">{t("row.height")}</th>
            <th>{t("row.hash")}</th>
            <th className="text-end">{t("row.amount")}</th>
            <th className="text-end">{t("row.fee")}</th>
            <th className="text-center">{t("row.validator")}</th>
            <th>{t("row.validatorLocation")}</th>
            {/* <th className="text-center">Size</th> */}
            <th className="text-center">{t("row.transactions")}</th>
            <th className="text-start">{t("row.crafted")}</th>
            <th className="text-center">{t("row.craftTime")}</th>

            {/* <th className="text-center">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {blocks.sort((a, b) => a.height > b.height ? -1 : 1).map((block) => (
            <BlockRow block={block} key={block.height} />
          ))}
        </tbody>
      </table>
    </div>

  );
};
