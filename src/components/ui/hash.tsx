import { truncateMiddle } from "../../utils/formatting";
import { CopyButton } from "./copy-button";
import styles from "./hash.module.scss";

interface Props {
  value: string;
  /** Characters kept at each end; ignored when `full`. */
  side?: number;
  /** Show the whole value, wrapping as needed. */
  full?: boolean;
  href?: string;
  /** Show the copy button (default true). */
  copy?: boolean;
  tone?: "default" | "muted" | "strong";
  size?: "sm" | "md";
  className?: string;
}

/** Monospace hash or address, truncated in the middle with the full value on hover and one click to copy. */
export const Hash = ({ value, side = 8, full, href, copy = true, tone = "default", size = "md", className }: Props) => {
  const text = full ? value : truncateMiddle(value, side);
  const textClass = [href ? styles.link : styles.text, tone === "muted" ? styles.muted : "", tone === "strong" ? styles.strong : "", full ? styles.full : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={[styles.hash, full ? styles.fullWrap : "", size === "sm" ? styles.sm : "", className].filter(Boolean).join(" ")}>
      {href ? (
        <a href={href} className={textClass} title={full ? undefined : value}>
          {text}
        </a>
      ) : (
        <span className={textClass} title={full ? undefined : value}>
          {text}
        </span>
      )}
      {copy ? <CopyButton value={value} /> : null}
    </span>
  );
};
