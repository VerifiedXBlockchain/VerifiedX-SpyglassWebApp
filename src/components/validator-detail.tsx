import { useTranslation } from "next-i18next";
import { Block } from "../models/block";
import { Validator } from "../models/validator";
import { BlockListContainer } from "./block-list-container";
import { DetailItem } from "./detail-item";
import { TransactionCard } from "./transaction-card";

interface Props {
  validator: Validator;
}

export const ValidatorDetail = (props: Props) => {
  const { t } = useTranslation(["validator", "common"]);
  const { validator } = props;

  return (
    <>
      <div className="container">
        <h4>{t("validator:detail.heading")}</h4>
        <div className="bg-dark p-2">
          <div className="d-block d-md-flex justify-start">
            <DetailItem
              label={t("validator:detail.fields.address") as string}
              value={`${validator.address}`}
            ></DetailItem>
            <div className="px-1 py-1"></div>
            <DetailItem
              label={t("validator:detail.fields.name") as string}
              value={`${validator.uniqueName}`}
            ></DetailItem>
            <div className="px-1  py-1"></div>

            <DetailItem
              label={t("validator:detail.fields.location") as string}
              value={`${validator.locationLabel}`}
            ></DetailItem>
          </div>
          <div className="py-1"></div>

          <div className="d-block d-md-flex justify-start">
            <DetailItem
              label={t("validator:detail.fields.connectionDate") as string}
              value={`${validator.dateLabel}`}
            ></DetailItem>
            <div className="px-1  py-1"></div>

            <div className="px-1  py-1"></div>
            <DetailItem
              label={t("validator:detail.fields.status") as string}
              value={`${validator.isActive ? t("common:status.active") : t("common:status.inactive")}`}
            ></DetailItem>
            <div className="px-1  py-1"></div>

            <DetailItem
              label={t("validator:detail.fields.blocksCrafted") as string}
              value={`${validator.blockCount}`}
            ></DetailItem>
          </div>
        </div>
        <h4 className="mt-3">{t("validator:detail.blocksHeading")}</h4>
      </div>
      <div>
        <BlockListContainer initialBlocks={[]} validatorAddress={validator.address} />
      </div>
    </>
  );
};
