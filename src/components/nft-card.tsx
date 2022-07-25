import { Nft } from "../models/nft";
import { Validator } from "../models/validator";

interface Props {
  nft: Nft;
}

export const NftCard = (props: Props) => {
  const { nft } = props;

  return (
    <div className="card">
      <div className="card-header  d-flex justify-content-between align-items-center">
        <span
          style={{
            // wordBreak: "break-all",
            whiteSpace: "pre-line",
            overflowWrap: "anywhere",
          }}
        >
          {nft.name}
        </span>
        <a
          href={`/nfts/${nft.identifier}`}
          className="btn btn-primary btn-sm"
        >
          View Details
        </a>
      </div>
      <ul className="list-group">
        <li className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <div>Status</div>
            {nft.isBurned ? (
              <div className="badge bg-danger">Burned</div>
            ) : (
                <div className="badge bg-success">Active</div>

            )}
          </div>
        </li>
        <li className="list-group-item ">
          <div>Name</div>
          <small
            style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}
          >
            {nft.name}
          </small>
        </li>

        <li className="list-group-item ">
          <div className="">
            <div>Owner</div>
            <small style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}>{nft.ownerAddress}</small>
          </div>
        </li>

        <li className="list-group-item ">
          <div className="">
            <div>Minter</div>
            <small style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}>{nft.minterAddress}</small>
          </div>
        </li>

        <li className="list-group-item ">
          <div className="">
            <div>Mint Tx</div>
            <small style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}>
                <a href={"/transaction/" + nft.mintTransaction} >
                {nft.mintTransaction}
                </a>
            </small>
          </div>
        </li>
          {nft.burnTransaction ?(
        <li className="list-group-item ">
          <div className="">
            <div>Burn Tx</div>
            <small style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}>
                <a href={"/transaction/" + nft.burnTransaction} >
                {nft.burnTransaction}
                </a>
            </small>
          </div>
        </li>) :null}

       
      </ul>
      <div className="card-footer text-muted text-center">
        Minted: {nft.timestampLabel}
      </div>
    </div>
  );
};
