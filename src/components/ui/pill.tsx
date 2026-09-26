import { ReactNode } from "react";
import styles from "./pill.module.scss";

export type PillTone = "neutral" | "accent" | "green" | "gold" | "indigo" | "btc" | "red";

interface Props {
  children: ReactNode;
  tone?: PillTone;
  size?: "sm" | "md";
  icon?: ReactNode;
  /** When given, renders a <button>. */
  onClick?: () => void;
  "aria-expanded"?: boolean;
  "aria-label"?: string;
  title?: string;
  className?: string;
}

/** Compact status or count label: transaction counts, tx types, active/inactive. */
export const Pill = ({ children, tone = "neutral", size = "sm", icon, onClick, className, ...rest }: Props) => {
  const classes = [styles.pill, styles[tone], size === "md" ? styles.md : "", onClick ? styles.interactive : "", className]
    .filter(Boolean)
    .join(" ");
  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} {...rest}>
        {children}
        {icon}
      </button>
    );
  }
  return (
    <span className={classes} title={rest.title} aria-label={rest["aria-label"]}>
      {icon}
      {children}
    </span>
  );
};

/** Small glowing green dot, optionally pulsing, for "live" affordances. */
export const LiveDot = ({ pulse = false, className }: { pulse?: boolean; className?: string }) => (
  <span className={[styles.dot, pulse ? styles.pulse : "", className].filter(Boolean).join(" ")} aria-hidden="true" />
);
