import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";
import styles from "./token-cells.module.scss";

export interface TokenRow {
  key: string;
  href: string;
  image: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned primary value (balance, supply). */
  value?: ReactNode;
  /** Right-aligned secondary line (date, status). */
  meta?: ReactNode;
}

interface Props {
  rows: TokenRow[];
  loading?: boolean;
  emptyLabel?: string;
}

/** Phone layout shared by the vBTC and fungible token lists: avatar, name, one value. */
export const TokenRowsCompact = ({ rows, loading, emptyLabel }: Props) => (
  <div className={styles.list}>
    {rows.map((row) => (
      <a key={row.key} href={row.href} className={styles.row}>
        {row.image}
        <div className={styles.rowMain}>
          <span className={styles.name}>{row.title}</span>
          {row.subtitle ? <span className={styles.sub}>{row.subtitle}</span> : null}
        </div>
        <div className={styles.rowMeta}>
          {row.value ? <span className={styles.mono}>{row.value}</span> : null}
          {row.meta ? <span className={styles.sub}>{row.meta}</span> : null}
        </div>
      </a>
    ))}
    {loading
      ? Array.from({ length: 6 }).map((_, index) => (
          <div key={`skeleton-${index}`} className={styles.row} aria-hidden="true">
            <Skeleton width={36} height={36} radius="50%" />
            <div className={styles.rowMain}>
              <Skeleton width="60%" height={14} />
              <Skeleton width="40%" height={11} />
            </div>
            <Skeleton width={72} height={13} />
          </div>
        ))
      : null}
    {!loading && rows.length === 0 && emptyLabel ? <div className={styles.empty}>{emptyLabel}</div> : null}
  </div>
);
