import { useTranslation } from "next-i18next";
import { Block } from "../models/block";
import { DetailItem } from "./detail-item";
import { TransactionCard } from "./transaction-card";

interface Props {
  block: Block;
}

export const BlockDetail = (props: Props) => {
  const { t } = useTranslation("block");
  const { block } = props;

  const transactions = block.transactions;

  return (
    <>
      <div className="container">
        <h4>{t("detail.heading")}</h4>
        <div className="bg-dark p-2">
          <div className="d-block d-md-flex justify-start">
            <DetailItem
              label={t("detail.fields.blockHeight") as string}
              value={`${block.height}`}
            ></DetailItem>
            <div className="p-1"></div>
            <DetailItem
              label={t("detail.fields.transactions") as string}
              value={`${block.numberOfTransactions}`}
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem label={t("detail.fields.size") as string} value={`${block.sizeLabel}`}></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("detail.fields.amount") as string}
              value={`${block.totalAmount} VFX`}
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("detail.fields.reward") as string}
              value={`${block.totalReward} VFX`}
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("detail.fields.validator") as string}
              value={`${block.validator}`}
              smallValue
            ></DetailItem>
          </div>

          <div className="py-2"></div>

          <div className="d-block d-md-flex">
            <DetailItem
              label={t("detail.fields.hash") as string}
              value={`${block.hash}`}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("detail.fields.previousHash") as string}
              value={`${block.prevHash}`}
              smallValue
            ></DetailItem>
          </div>

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

          <div className="p-1"></div>

          <div className="d-block d-md-flex justify-content-start">
            <DetailItem
              label={t("detail.fields.chainRefId") as string}
              value={`${block.chainRefId}`}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>
            <DetailItem
              label={t("detail.fields.merkleRoot") as string}
              value={`${block.merkleRoot}`}
              smallValue
            ></DetailItem>
            <div className="p-1"></div>

            <DetailItem
              label={t("detail.fields.stateRoot") as string}
              value={`${block.stateRoot}`}
              smallValue
            ></DetailItem>
          </div>
          <div className="p-1"></div>

          <div>
            <DetailItem
              label={t("detail.fields.validatorSignature") as string}
              value={block.validatorSignature}
              smallValue
            />
          </div>
        </div>
        {transactions?.length ? <h4 className="mt-3">{t("detail.transactionsHeading")}</h4> : null}
        <div className="row">
          {transactions.map((tx) => (
            <div key={tx.hash} className="col-12 col-md-4">
              <TransactionCard transaction={tx} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
