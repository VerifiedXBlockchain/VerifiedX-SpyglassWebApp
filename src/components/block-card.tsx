import { useTranslation } from "next-i18next";
import { useLocalized } from "../utils/use-localized";
import { Block } from "../models/block";

interface Props {
  block: Block;
}

export const BlockCard = (props: Props) => {
  const { t } = useTranslation(["block", "common"]);
  const localized = useLocalized();
  const { block } = props;
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <a href={localized(`/block/${block.height}`)} className="mb-0 h5 text-white">
          {t("block:card.title", { height: block.height })}
        </a>
        <a href={localized(`/block/${block.height}`)} className="btn btn-primary btn-sm">
          {t("common:action.viewDetails")}
        </a>
      </div>
      <ul className="list-group">
        <li className="list-group-item ">
          {t("block:card.hash")}
          <br />
          {/* <small>{block.hashPreview()}</small> */}
          <small>{block.hash}</small>
        </li>
        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>{t("block:card.validatedBy")}</div>
            {block.masternode ? (
              <div>
                <a
                  href={localized(`/validators/${block.masternode.address}`)}
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
            <div>{t("block:card.validatorLocation")}</div>

            <small>
              {block.masternode?.locationLabel || t("block:card.locationFallback")}
            </small>
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            {t("block:card.transactions")}
            {block.transactions.map((tx, i) =>
              i < 4 ? (
                <div key={tx.hash}>
                  <a href={localized(`/transaction/${tx.hash}`)}>{tx.hashPreview()}</a>
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
          {t("block:card.totalAmount")}
          <span className="badge bg-primary rounded-pill">
            {block.totalAmount} VFX
          </span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          {t("block:card.fee")}
          <span className="badge bg-primary rounded-pill">
            {block.totalReward} VFX
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
