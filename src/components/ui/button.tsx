import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./button.module.scss";

type Variant = "primary" | "secondary" | "ghost" | "btc";

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
  icon?: ReactNode;
  iconRight?: ReactNode;
  /** Renders an <a>; internal hrefs should already be localized. */
  href?: string;
  external?: boolean;
  onClick?: () => void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  className?: string;
  title?: string;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
}

export const Button = ({ children, variant = "secondary", size = "md", icon, iconRight, href, external, onClick, type = "button", disabled, className, ...rest }: Props) => {
  const classes = [styles.button, styles[variant], size === "sm" ? styles.sm : "", className].filter(Boolean).join(" ");
  const content = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  );
  if (href) {
    return (
      <a href={href} className={classes} aria-disabled={disabled || undefined} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...rest}>
      {content}
    </button>
  );
};
