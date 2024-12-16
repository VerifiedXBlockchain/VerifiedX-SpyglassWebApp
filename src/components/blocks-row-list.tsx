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
    <div className="block-row-list-container">

      <table className="table table-sm block-row-list-table">
        <thead>
          <tr>
            <th className="text-center">Height</th>
            <th>Hash</th>
            <th className="text-end">Amount</th>
            <th className="text-end">Fee</th>
            <th className="text-center">Validator</th>
            <th>Validator Location</th>
            {/* <th className="text-center">Size</th> */}
            <th className="text-center">Transactions</th>
            <th className="text-start">Crafted</th>
            <th className="text-center">Craft Time</th>

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
