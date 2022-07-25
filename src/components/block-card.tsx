import { Block } from "../models/block";

interface Props {
  block: Block;
}

export const BlockCard = (props: Props) => {
  const { block } = props;
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <a href={`/block/${block.height}`} className="mb-0 h5 text-white">
          Block {block.height}
        </a>
        <a href={`/block/${block.height}`} className="btn btn-primary btn-sm">
          View Details
        </a>
      </div>
      <ul className="list-group">
        <li className="list-group-item ">
          Hash
          <br />
          {/* <small>{block.hashPreview()}</small> */}
          <small>{block.hash}</small>
        </li>
        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>Validated By:</div>
            {block.masternode ? (
              <div>
                <a
                  href={`/validators/${block.masternode.address}`}
                  className="btn btn-sm btn-success "
                >
                  {block.masternode.uniqueNameLabel}
                </a>
              </div>
            ) : null}
          </div>

          <small>{block.validator}</small>
        </li>
        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>Validator Location:</div>

            <small>
              {block.masternode?.locationLabel || "-"}
            </small>
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            Transactions
            {block.transactions.map((t, i) =>
              i < 4 ? (
                <div key={t.hash}>
                  <a href={`/transaction/${t.hash}`}>{t.hashPreview()}</a>
                </div>
              ) : null
            )}
            {block.transactions.length > 4 ? <div>...</div> : null}
          </div>
          <span className="badge bg-secondary text-dark rounded-pill">
            {block.numberOfTransactions}
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total Amount
          <span className="badge bg-primary rounded-pill">
            {block.totalAmount} RBX
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total Reward
          <span className="badge bg-primary rounded-pill">
            {block.totalReward} RBX
          </span>
        </li>
      </ul>
      <div className="card-body">
        <div className="text-center"></div>
      </div>

      <div className="card-footer text-muted text-center">
        {block.timestampLabel}
      </div>
    </div>
  );
};
