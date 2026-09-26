import { ReactNode } from "react";
import { useTranslation } from "next-i18next";
import styles from "./spinner.module.scss";

interface Props {
  size?: "md" | "lg";
  /** Screen-reader text; defaults to "Loading…". */
  label?: string;
  className?: string;
}

export const Spinner = ({ size = "md", label, className }: Props) => {
  const { t } = useTranslation("common");
  return (
    <span role="status" className={[styles.spinner, size === "lg" ? styles.lg : "", className].filter(Boolean).join(" ")}>
      <span className="visually-hidden">{label ?? t("status.loading")}</span>
    </span>
  );
};

/** Centered state block: spinner or icon, a short title and one line of body. */
export const CenteredState = ({ title, body, children, className }: { title?: ReactNode; body?: ReactNode; children?: ReactNode; className?: string }) => (
  <div className={[styles.center, className].filter(Boolean).join(" ")}>
    {children}
    {title ? <h2 className={styles.title}>{title}</h2> : null}
    {body ? <p className={styles.body}>{body}</p> : null}
  </div>
);
