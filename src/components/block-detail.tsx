import { Block } from "../models/block";
import { DetailItem } from "./detail-item";
import { TransactionCard } from "./transaction-card";

interface Props {
  block: Block;
}

export const BlockDetail = (props: Props) => {
  const { block } = props;

  const transactions = block.transactions;

  return (
    <div className="container">
      <h4>Block Details</h4>
      <div className="bg-dark p-2">
        <div className="d-flex justify-start">
          <DetailItem
            label="Block Height"
            value={`${block.height}`}
          ></DetailItem>
          <div className="px-1"></div>
          <DetailItem
            label="Transactions"
            value={`${block.numberOfTransactions}`}
          ></DetailItem>
          <div className="px-1"></div>

          <DetailItem label="Size" value={`${block.sizeLabel}`}></DetailItem>
          <div className="px-1"></div>

          <DetailItem
            label="Amount"
            value={`${block.totalAmount} RBX`}
          ></DetailItem>
          <div className="px-1"></div>

          <DetailItem
            label="Reward"
            value={`${block.totalReward} RBX`}
          ></DetailItem>
          <div className="px-1"></div>

          <DetailItem
            label="Validator"
            value={`${block.validator}`}
            smallValue
          ></DetailItem>
        </div>

        <div className="py-2"></div>

        <div className="d-flex">
          <DetailItem
            label="Hash"
            value={`${block.hash}`}
            smallValue
          ></DetailItem>
          <div className="px-1"></div>

          <DetailItem
            label="Previous Hash"
            value={`${block.prevHash}`}
            smallValue
          ></DetailItem>
        </div>

        <div className="py-2"></div>

        {/* <div className="d-flex justify-content-start">
          <DetailItem
            label="Next Validator"
            value={`${block.nextValidators[0]}`}
            smallValue
          ></DetailItem>
          <div className="px-2"></div>
          <DetailItem
            label="Next Backup Validator"
            value={`${block.nextValidators[1]}`}
            smallValue
          ></DetailItem>
        </div> */}

        <div className="py-2"></div>

        <div className="d-flex justify-content-start">
          <DetailItem
            label="Chain Ref ID"
            value={`${block.chainRefId}`}
            smallValue
          ></DetailItem>
          <div className="px-1"></div>
          <DetailItem
            label="Merkle Root"
            value={`${block.merkleRoot}`}
            smallValue
          ></DetailItem>
          <div className="px-1"></div>

          <DetailItem
            label="State Root"
            value={`${block.stateRoot}`}
            smallValue
          ></DetailItem>
        </div>
        <div className="py-2"></div>

        <div>
          <DetailItem
            label="Validator Signature"
            value={block.validatorSignature}
            smallValue
          />
        </div>
      </div>
      {transactions?.length ? <h4 className="mt-3">Transactions</h4> : null}
      <div className="row">
        {transactions.map((t) => (
          <div key={t.hash} className="col-12 col-md-4">
            <TransactionCard transaction={t} />
          </div>
        ))}
      </div>
    </div>
  );
};
