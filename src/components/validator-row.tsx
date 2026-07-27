import { useTranslation } from "next-i18next";
import { useLocalized } from "../utils/use-localized";
import { Validator } from "../models/validator";

interface Props {
  validator: Validator;
}

export const ValidatorRow = (props: Props) => {
  const { t } = useTranslation("common");
  const localized = useLocalized();
  const { validator } = props;

  return (
    <tr>
      <td>
        {validator.isActive ? (
          <div className="badge bg-success">{t("status.active")}</div>
        ) : (
          <div className="badge bg-danger">{t("status.inactive")}</div>
        )}
      </td>
      <td>
        <div className="badge badge-lg ps-0">{validator.address}</div>
      </td>
      <td>
        <div className="badge badge-lg  ps-0">{validator.uniqueNameLabel}</div>
      </td>
      {/* <td>
        <div className="badge badge-lg  ps-0">{validator.blockCount}</div>
      </td> */}

      <td>
        <div className="badge badge-lg  ps-0">
          {validator.locationLabel }
        </div>
      </td>

      {/* <td>
        <div className="badge badge-lg  ps-0">{validator.dateLabel}</div>
      </td> */}
      <td>
        <a
          href={localized(`/validators/${validator.address}`)}
          className="btn btn-primary btn-sm"
        >
          {t("action.viewDetails")}
        </a>
      </td>
    </tr>
  );
};
