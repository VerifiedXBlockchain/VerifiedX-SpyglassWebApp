import { useState } from "react";
import { Block } from "../models/block";

interface Props {
  block: Block;
}

export const BlockRow = (props: Props) => {
  const { block } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <tr>
      <td className="text-center">
        <div className="badge badge-lg  ps-0">{block.height}</div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{block.timestampLabel}</div>
      </td>
      <td className="text-center">
        <div className={`badge bg-${block.craftTimeAccent}`}>
          {block.craftTime}ms
        </div>
      </td>
      <td>
        {block.masternode ? (
          <div>
            <a href={`/validators/${block.masternode.address}`}>
              {block.masternode.uniqueNameLabel}
            </a>
          </div>
        ) : (
          <div className="badge badge-lg  ps-0">{block.validator}</div>
        )}
      </td>
      <td>
        <div className="badge badge-lg  ps-0">
          {block.masternode?.location ? block.masternode.location.label : "-"}
        </div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{block.hashPreview()}</div>
      </td>

      <td className="text-center">
        <div className="badge badge-lg  ps-0">{block.sizeLabel}</div>
      </td>
      <td className="text-center">
        {block.transactions.length > 0 ? (
          block.transactions.length == 1 ? (
            <div className="badge badge-lg  ps-0 d-block">
              <a href={`/transaction/${block.transactions[0].hash}`}>
                {block.transactions[0].hashPreview()}
              </a>
            </div>
          ) : (
            <>
              <div
                className="badge badge-lg  ps-0"
                onClick={() => setExpanded(!expanded)}
                style={{ cursor: "pointer" }}
              >
                {block.transactions.length} Txs{" "}
                <i
                  className={`bi ${
                    expanded ? `bi-chevron-up` : "bi-chevron-down"
                  }`}
                ></i>
              </div>

              {expanded ? (
                <div>
                  {block.transactions.map((t) => (
                    <div className="badge badge-lg  ps-0 d-block" key={t.hash}>
                      <a href={`/transaction/${t.hash}`}>{t.hashPreview()}</a>
                    </div>
                  ))}
                </div>
              ) : null}
            </>
          )
        ) : (
          "-"
        )}
      </td>
      <td className="text-end">
        <div className="badge badge-lg  ps-0">{block.totalAmount} RBX</div>
      </td>
      <td className="text-end">
        <div className="badge badge-lg  ps-0">{block.totalReward} RBX</div>
      </td>
      <td className="text-center">
        <a href={`/block/${block.height}`} className="btn btn-primary btn-sm">
          Details
        </a>
      </td>
    </tr>
  );
};
