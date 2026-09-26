import { ElementType, ReactNode } from "react";
import styles from "./card.module.scss";

interface Props {
  children: ReactNode;
  /** Small uppercase heading inside the card. */
  title?: ReactNode;
  padded?: boolean;
  glow?: boolean;
  as?: ElementType;
  className?: string;
  "aria-label"?: string;
}

export const Card = ({ children, title, padded = true, glow, as: Tag = "div", className, ...rest }: Props) => (
  <Tag className={[styles.card, padded ? styles.padded : "", glow ? styles.glow : "", className].filter(Boolean).join(" ")} {...rest}>
    {title ? <h2 className={styles.title}>{title}</h2> : null}
    {children}
  </Tag>
);
