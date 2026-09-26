import { ReactNode } from "react";
import styles from "./detail-list.module.scss";

/** Definition list of label / value pairs for detail pages. Pair with <Card>. */
export const DetailList = ({ children, className }: { children: ReactNode; className?: string }) => (
  <dl className={[styles.list, className].filter(Boolean).join(" ")}>{children}</dl>
);

interface RowProps {
  label: ReactNode;
  children: ReactNode;
  /** Label above value, for long hashes and free text. */
  stacked?: boolean;
  /** Mono face for the value (numbers, ids). */
  mono?: boolean;
  muted?: boolean;
  className?: string;
}

export const DetailRow = ({ label, children, stacked, mono, muted, className }: RowProps) => (
  <div className={[styles.row, stacked ? styles.stacked : "", className].filter(Boolean).join(" ")}>
    <dt className={styles.label}>{label}</dt>
    <dd className={[styles.value, mono ? styles.mono : "", muted ? styles.muted : ""].filter(Boolean).join(" ")}>{children}</dd>
  </div>
);

/** Two-up grid of stacked rows on tablet and wider. */
export const DetailGrid = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={[styles.grid, className].filter(Boolean).join(" ")}>{children}</div>
);

/** Preformatted payload (JSON, decoded data) in the mono face. */
export const Pre = ({ children, className }: { children: ReactNode; className?: string }) => (
  <pre className={[styles.pre, className].filter(Boolean).join(" ")}>{children}</pre>
);
