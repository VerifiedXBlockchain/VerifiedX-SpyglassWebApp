/* eslint-disable @next/next/no-img-element */
// Token media comes from arbitrary hosts (S3, IPFS gateways), which next/image
// cannot optimise without an allowlist; a plain <img> in a fixed box is the
// existing convention here.
import { useState } from "react";
import styles from "./token-image.module.scss";

interface Props {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  /** Circle for token avatars (default), rounded square for NFT media. */
  shape?: "round" | "square";
  /** Shown when the image fails to load. */
  fallbackSrc?: string;
  /** Replace the image with a neutral pattern (NSFW-flagged tokens). */
  hidden?: boolean;
  hiddenLabel?: string;
  className?: string;
}

export const TokenImage = ({ src, alt, size = "md", shape = "round", fallbackSrc, hidden, hiddenLabel, className }: Props) => {
  const [failed, setFailed] = useState(false);
  const shown = failed ? fallbackSrc : src;
  const boxClass = [styles.box, styles[size], shape === "round" ? styles.round : styles.square, hidden || !shown ? styles.hidden : "", className]
    .filter(Boolean)
    .join(" ");

  if (hidden || !shown) {
    return <span className={boxClass} role="img" aria-label={hidden ? hiddenLabel ?? alt : alt} />;
  }

  return (
    <span className={boxClass}>
      <img src={shown} alt={alt} className={styles.img} loading="lazy" onError={() => setFailed(true)} />
    </span>
  );
};
