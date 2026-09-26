import { ReactNode } from "react";
import { useTranslation } from "next-i18next";
import styles from "./breadcrumbs.module.scss";

export interface Crumb {
  label: ReactNode;
  /** Omit on the last item (the current page). */
  href?: string;
  /** Render in the mono face (heights, hashes). */
  mono?: boolean;
}

interface Props {
  items: Crumb[];
  /** Right-aligned controls such as prev / next. */
  actions?: ReactNode;
  className?: string;
}

export const Breadcrumbs = ({ items, actions, className }: Props) => {
  const { t } = useTranslation("common");
  return (
    <div className={[styles.row, className].filter(Boolean).join(" ")}>
      <nav aria-label={t("breadcrumb.ariaLabel") as string}>
        <ol className={styles.list}>
          {items.map((item, index) => {
            const last = index === items.length - 1;
            return (
              <li key={index} className={styles.item}>
                {index > 0 ? (
                  <span className={styles.sep} aria-hidden="true">
                    /
                  </span>
                ) : null}
                {item.href && !last ? (
                  <a href={item.href} className={[styles.link, item.mono ? styles.mono : ""].filter(Boolean).join(" ")}>
                    {item.label}
                  </a>
                ) : (
                  <span className={[styles.current, item.mono ? styles.mono : ""].filter(Boolean).join(" ")} aria-current={last ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </div>
  );
};
