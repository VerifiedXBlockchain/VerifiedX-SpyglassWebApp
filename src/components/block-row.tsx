import { Block } from "../models/block";

interface Props {
  block: Block;
}

export const BlockRow = (props: Props) => {
  const { block } = props;

  return (
    <tr>
      <td className="text-center">
        <div className="badge">{block.height}</div>
      </td>
      <td>
        <div className="badge">{block.timestampLabel}</div>
      </td>
      <td className="text-center">
        <div className={`badge bg-${block.craftTimeAccent}`}>
          {block.craftTime}s
        </div>
      </td>
      <td>
        <div className="badge">{block.hash}</div>
      </td>
      <td className="text-center">
        <div className="badge">{block.sizeLabel}</div>
      </td>
      <td className="text-center">
        {block.transactions.map((t, i) =>
          i < 4 ? (
            <div className="badge" key={t.hash}>
              <a href={`/transaction/${t.hash}`}>{t.hashPreview()}</a>
            </div>
          ) : (
            ""
          )
        )}
        {block.transactions.length > 4 ? "..." : null}
      </td>
      <td className="text-end">
        <div className="badge">{block.totalAmount} RBX</div>
      </td>
      <td className="text-end">
        <div className="badge">{block.totalReward} RBX</div>
      </td>
      <td className="text-center">
        <a href={`/block/${block.height}`} className="btn btn-primary btn-sm">
          Details
        </a>
      </td>
    </tr>
  );
};
