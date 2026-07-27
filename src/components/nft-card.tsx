/* eslint-disable @next/next/no-html-link-for-pages */
import { useTranslation } from "next-i18next";
import { useLocalized } from "../utils/use-localized";
import { Nft } from "../models/nft";
import { Validator } from "../models/validator";

interface Props {
  nft: Nft;
}

export const NftCard = (props: Props) => {
  const { t } = useTranslation(["nft", "common"]);
  const localized = useLocalized();
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
          href={localized(`/nfts/${nft.identifier}`)}
          className="btn btn-primary btn-sm"
        >
          {t("nft:card.viewDetails")}
        </a>
      </div>
      <ul className="list-group">
        <li className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <div>{t("nft:card.status")}</div>
            {nft.isBurned ? (
              <div className="badge bg-danger">{t("nft:card.burned")}</div>
            ) : (
              <div className="badge bg-success">{t("nft:card.active")}</div>

            )}
          </div>
        </li>
        <li className="list-group-item ">
          <div>{t("nft:card.name")}</div>
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
            <div>{t("nft:card.owner")}</div>
            <small style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}>{nft.ownerAddress}</small>
          </div>
        </li>

        <li className="list-group-item ">
          <div className="">
            <div>{t("nft:card.minter")}</div>
            <small style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}>{nft.minterAddress}</small>
          </div>
        </li>

        <li className="list-group-item ">
          <div className="">
            <div>{t("nft:card.mintTx")}</div>
            <small style={{
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}>
              <a href={localized("/transaction/" + nft.mintTransaction)} >
                {nft.mintTransaction}
              </a>
            </small>
          </div>
        </li>



      </ul>
      <div className="card-footer text-muted text-center">
        {t("nft:card.minted", { date: nft.timestampLabel })}
      </div>
    </div>
  );
};
