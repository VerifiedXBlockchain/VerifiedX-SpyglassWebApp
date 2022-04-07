import { Block } from "../models/block";
import { BlockCard } from "./block-card";

interface Props {
  blocks: Block[];
}

export const BlockList = (props: Props) => {
  const { blocks } = props;
  return (
    <div className="row">
      {blocks.map((block) => (
        <div className="col-12 col-md-4 py-2" key={block.height}>
          <BlockCard block={block} />
        </div>
      ))}
    </div>
  );
};
