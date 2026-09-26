import { useState } from "react";
import { useTranslation } from "next-i18next";
import { Button } from "./button";
import { CopyButton } from "./copy-button";
import styles from "./expandable-value.module.scss";

interface Props {
  value: string;
  className?: string;
}

/** Long opaque strings (signatures): one clipped line with Show / Hide and copy. */
export const ExpandableValue = ({ value, className }: Props) => {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <div className={styles.row}>
        {open ? <span className={styles.full}>{value}</span> : <span className={styles.preview}>{value}</span>}
        <CopyButton value={value} />
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? t("action.hide") : t("action.show")}
        </Button>
      </div>
    </div>
  );
};
