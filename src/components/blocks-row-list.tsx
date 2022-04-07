import { Block } from "../models/block";
import { BlockCard } from "./block-card";
import { BlockRow } from "./block-row";

interface Props {
  blocks: Block[];
}

export const BlockRowList = (props: Props) => {
  const { blocks } = props;
  return (
    <table className="table table-sm ">
      <thead>
        <tr>
          <th className="text-center">Height</th>
          <th>Crafted</th>
          <th className="text-center">Craft Time</th>
          <th>Validator</th>
          <th>Hash</th>
          <th className="text-center">Size</th>
          <th className="text-center">Transactions</th>
          <th className="text-end">Total Amount</th>
          <th className="text-end">Total Reward</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      {blocks.map((block) => (
        // <div className="" key={block.height}>
        <tbody key={block.height}>
          <BlockRow block={block} />
        </tbody>
        // </div>
      ))}
    </table>
  );
};
