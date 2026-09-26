import { CSSProperties } from "react";
import styles from "./skeleton.module.scss";

interface Props {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  className?: string;
}

/** Loading placeholder sized like the content it stands in for. */
export const Skeleton = ({ width, height, radius, className }: Props) => {
  const style: CSSProperties = {};
  if (width !== undefined) style.width = width;
  if (height !== undefined) style.height = height;
  if (radius !== undefined) style.borderRadius = radius;
  return <span className={[styles.skeleton, className].filter(Boolean).join(" ")} style={style} aria-hidden="true" />;
};
