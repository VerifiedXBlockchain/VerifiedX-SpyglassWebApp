import { ReactNode } from "react";
import { LiveDot } from "./pill";
import styles from "./section-header.module.scss";

interface Props {
  title: ReactNode;
  as?: "h1" | "h2" | "h3";
  /** Show a pulsing LIVE tag next to the title. */
  live?: boolean;
  liveLabel?: string;
  /** Quiet helper text, desktop only. */
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ title, as: Tag = "h2", live, liveLabel = "Live", description, actions, className }: Props) => (
  <div className={[styles.header, className].filter(Boolean).join(" ")}>
    <div className={styles.titleRow}>
      <Tag className={styles.title}>{title}</Tag>
      {live ? (
        <span className={styles.live}>
          <LiveDot pulse />
          {liveLabel}
        </span>
      ) : null}
    </div>
    {description || actions ? (
      <div className={styles.right}>
        {description ? <span className={styles.description}>{description}</span> : null}
        {actions}
      </div>
    ) : null}
  </div>
);
