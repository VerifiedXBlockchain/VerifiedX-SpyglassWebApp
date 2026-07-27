import { useTranslation } from "next-i18next";
import { useLocalized } from "../utils/use-localized";
import { Validator } from "../models/validator";

interface Props {
  validator: Validator;
}

export const ValidatorCard = (props: Props) => {
  const { t } = useTranslation(["validator", "common"]);
  const localized = useLocalized();
  const { validator } = props;

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
          {validator.uniqueName}
        </span>
        <a
          href={localized(`/validators/${validator.address}`)}
          className="btn btn-primary btn-sm"
        >
          {t("common:action.details")}
        </a>
      </div>
      <ul className="list-group">
        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>{t("common:status.status")}</div>
            {validator.isActive ? (
              <div className="badge bg-success">{t("common:status.active")}</div>
            ) : (
              <div className="badge bg-danger">{t("common:status.inactive")}</div>
            )}
          </div>
        </li>
        <li className="list-group-item ">
          <div>{t("common:field.address")}</div>
          <small
            style={{
              // wordBreak: "break-all",
              whiteSpace: "pre-line",
              overflowWrap: "anywhere",
            }}
          >
            {validator.address}
          </small>
        </li>

        <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>{t("common:field.location")}</div>
            <small>{validator.locationLabel}</small>
          </div>
        </li>

        {/* <li className="list-group-item ">
          <div className="d-flex justify-content-between align-items-center">
            <div>Blocks Crafted</div>
            <small>{validator.blockCount}</small>
          </div>
        </li> */}
      </ul>

      {/* <div className="card-footer text-muted text-center">
        Connected: {validator.dateLabel}
      </div> */}
    </div>
  );
};
