import { ReactNode } from "react";
import styles from "./page.module.scss";

interface Props {
  children: ReactNode;
  /** Cap at 1100px for reading-heavy pages (detail views, metrics). */
  narrow?: boolean;
  className?: string;
}

/** Page body container: max width, responsive gutters, bottom breathing room. */
export const Page = ({ children, narrow, className }: Props) => (
  <div className={[styles.page, narrow ? styles.narrow : "", className].filter(Boolean).join(" ")}>{children}</div>
);
