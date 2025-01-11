import { useState } from "react";
import { IS_TESTNET } from "../constants";
import { Block } from "../models/block";

interface Props {
  block: Block;
}

export const BlockRow = (props: Props) => {
  const { block } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <tr onClick={(e) => { window.location.href = `/block/${block.height}` }}>
      <td className="text-center">
        <div>

          {block.height.toLocaleString()}
        </div>
      </td>
      <td>
        <div className=" ps-0" title={block.hash}>{block.hashPreview()}</div>
      </td>


      <td className="text-end">
        <div className=" ps-0">{block.totalAmount} VFX</div>
      </td>
      <td className="text-end">
        <div className=" ps-0">{block.totalReward} VFX</div>
      </td>

      <td className="text-center">
        {block.masternode ? (
          <div>
            <a href={`/validators/${block.masternode.address}`}>
              {block.masternode.uniqueNameLabel}
            </a>
          </div>
        ) : (
          <div className=" ps-0">{block.validator}</div>
        )}
      </td>

      <td>
        <div className=" ps-0">
          {block.masternode?.locationLabel || "-"}
        </div>
      </td>

      <td className="text-center">
        {block.transactions.length > 0 ? (
          block.transactions.length == 1 ? (
            <div className=" ps-0 d-block">
              <a href={`/transaction/${block.transactions[0].hash}`} title={block.transactions[0].hash}>
                {block.transactions[0].hashPreview()}
              </a>
            </div>
          ) : (
            <>
              <div
                className=" ps-0"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExpanded(!expanded); }}
                style={{ cursor: "pointer" }}
              >
                {block.transactions.length} Txs{" "}
                <i
                  className={`bi ${expanded ? `bi-chevron-up` : "bi-chevron-down"
                    }`}
                ></i>
              </div>

              {expanded ? (
                <div>
                  {block.transactions.map((t) => (
                    <div className=" ps-0 d-block" key={t.hash}>
                      <a href={`/transaction/${t.hash}`} title={t.hash}>{t.hashPreview()}</a>
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

      <td className="text-start" >
        <div className=" ps-0">{block.timestampLabel}</div>
      </td>

      <td className="text-center">
        <div>
          {block.craftTime}ms
        </div>
      </td>


      {/* <td className="text-center">
        <a href={`/block/${block.height}`} className="btn btn-primary btn-sm">
          Details
        </a>
      </td> */}
    </tr>
  );
};
