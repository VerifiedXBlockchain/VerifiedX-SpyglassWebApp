import { IS_TESTNET } from "../constants";
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
          {!IS_TESTNET ? <th>Validator Location</th> : null}
          <th>Hash</th>
          <th className="text-center">Size</th>
          <th className="text-center">Transactions</th>
          <th className="text-end">Total Amount</th>
          <th className="text-end">Total Reward</th>
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {blocks.map((block) => (
          <BlockRow block={block} key={block.height} />
        ))}
      </tbody>
    </table>
  );
};
