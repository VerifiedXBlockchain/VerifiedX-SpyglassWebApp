import { ReactNode } from "react";
import { Skeleton } from "./skeleton";
import styles from "./stat-tile.module.scss";

interface Props {
  label: ReactNode;
  /** Undefined while loading (renders a skeleton). */
  value?: ReactNode;
  unit?: ReactNode;
  sub?: ReactNode;
  className?: string;
}

/** Headline number with a small uppercase label, for overview strips. */
export const StatTile = ({ label, value, unit, sub, className }: Props) => (
  <div className={[styles.tile, className].filter(Boolean).join(" ")}>
    <div className={styles.label}>{label}</div>
    <div className={styles.value}>
      {value === undefined ? (
        <Skeleton width="60%" height="1em" />
      ) : (
        <>
          {value}
          {unit !== undefined ? <span className={styles.unit}>{unit}</span> : null}
        </>
      )}
    </div>
    <div className={styles.sub}>{value === undefined ? <Skeleton width="40%" height="0.9em" /> : sub}</div>
  </div>
);
