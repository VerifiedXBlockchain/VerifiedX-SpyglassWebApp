import { ReactNode } from "react";
import { useRouter } from "next/router";
import styles from "./tabs.module.scss";

export interface TabItem<T extends string> {
  id: T;
  label: ReactNode;
  /** Result count shown in a small badge; omitted until known. */
  count?: number;
}

interface Props<T extends string> {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  "aria-label"?: string;
}

/** Segmented pill control for switching between result lists. */
export function Tabs<T extends string>({ tabs, active, onChange, ...rest }: Props<T>) {
  const { locale } = useRouter();
  return (
    <div role="tablist" className={styles.tabs} aria-label={rest["aria-label"]}>
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            className={[styles.tab, selected ? styles.active : ""].filter(Boolean).join(" ")}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined ? <span className={styles.count}>{tab.count.toLocaleString(locale)}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
