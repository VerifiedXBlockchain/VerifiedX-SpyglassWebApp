import { useTranslation } from "next-i18next";
import { Validator } from "../../models/validator";
import { truncateMiddle } from "../../utils/formatting";
import { useLocalized } from "../../utils/use-localized";
import { Skeleton } from "../ui/skeleton";
import { ValidatorStatusPill, validatorDisplayName } from "./validator-table";
import styles from "./validator-list-compact.module.scss";

interface Props {
  validators: Validator[];
  loading?: boolean;
  emptyLabel?: string;
}

export const ValidatorListCompact = ({ validators, loading, emptyLabel }: Props) => {
  const { t } = useTranslation("validator");
  const localized = useLocalized();
  return (
    <div className={styles.list}>
      {validators.map((v) => {
        const name = validatorDisplayName(v);
        return (
          <a key={v.address} href={localized(`/validators/${v.address}`)} className={styles.row}>
            <div className={styles.main}>
              {name ? <span className={styles.name}>{name}</span> : null}
              <span className={styles.address}>{name ? truncateMiddle(v.address, 10) : v.address}</span>
              <span className={styles.sub}>{v.locationLabel}</span>
            </div>
            <ValidatorStatusPill validator={v} />
          </a>
        );
      })}
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <div key={`skeleton-${index}`} className={styles.row} aria-hidden="true">
              <div className={styles.main}>
                <Skeleton width="80%" height={13} />
                <Skeleton width="40%" height={11} />
              </div>
              <Skeleton width={52} height={18} radius={999} />
            </div>
          ))
        : null}
      {!loading && validators.length === 0 ? <div className={styles.empty}>{emptyLabel ?? t("table.empty")}</div> : null}
    </div>
  );
};
