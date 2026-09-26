import { Fragment, ReactNode } from "react";
import styles from "./page-header.module.scss";

interface Props {
  title: ReactNode;
  /** Pills shown next to the title. */
  badges?: ReactNode;
  /** Quiet facts; separated by dots when given as an array. */
  meta?: ReactNode | ReactNode[];
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, badges, meta, actions, className }: Props) => {
  const metaItems = Array.isArray(meta) ? meta.filter(Boolean) : meta ? [meta] : [];
  return (
    <div className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {badges}
      </div>
      {metaItems.length > 0 || actions ? (
        <div className={styles.right}>
          {metaItems.length > 0 ? (
            <div className={styles.meta}>
              {metaItems.map((item, index) => (
                <Fragment key={index}>
                  {index > 0 ? (
                    <span className={styles.metaSep} aria-hidden="true">
                      ·
                    </span>
                  ) : null}
                  <span>{item}</span>
                </Fragment>
              ))}
            </div>
          ) : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
};

/** Mono-face part of a title, e.g. the height in "Block 7,381,925". */
export const TitleValue = ({ children }: { children: ReactNode }) => <span className={styles.titleValue}>{children}</span>;

export const Mono = ({ children }: { children: ReactNode }) => <span className={styles.mono}>{children}</span>;
