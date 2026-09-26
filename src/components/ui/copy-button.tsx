import { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { CheckIcon, CopyIcon } from "./icons";
import styles from "./copy-button.module.scss";

interface Props {
  value: string;
  /** Accessible name; defaults to "Copy". */
  label?: string;
  /** Bordered variant for standalone use next to full-width hashes. */
  boxed?: boolean;
  className?: string;
}

const CONFIRM_MS = 1500;

export const CopyButton = ({ value, label, boxed, className }: Props) => {
  const { t } = useTranslation("common");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  useEffect(() => clearTimer, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimer();
      timer.current = setTimeout(() => setCopied(false), CONFIRM_MS);
    } catch (error) {
      console.error("Clipboard write failed", error);
    }
  };

  return (
    <button
      type="button"
      className={[styles.button, boxed ? styles.boxed : "", copied ? styles.copied : "", className].filter(Boolean).join(" ")}
      onClick={copy}
      aria-label={copied ? (t("action.copied") as string) : label ?? (t("action.copy") as string)}
      title={label ?? (t("action.copy") as string)}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
};
