import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ExternalLinkIcon } from "./icons";
import styles from "./menu.module.scss";

// React 17 has no useId; a module counter gives each panel a stable id.
let menuCounter = 0;

export interface MenuItem {
  key: string;
  label: string;
  href: string;
  external?: boolean;
  active?: boolean;
  tone?: "default" | "btc";
}

interface Props {
  /** Visible trigger text, or the accessible name when `icon` is given. */
  label: string;
  items: MenuItem[];
  /** Render an icon-only trigger (square button) instead of text. */
  icon?: ReactNode;
  /** Highlight the trigger because one of its items is the current page. */
  active?: boolean;
  /** Which edge of the trigger the panel aligns to. */
  align?: "start" | "end";
  className?: string;
}

/**
 * Small dropdown of links. Click to toggle; closes on outside click, Escape,
 * or choosing an item. Kept deliberately simple: no roving focus, since the
 * panel is a list of plain links that Tab already walks.
 */
export const Menu = ({ label, items, icon, active, align = "start", className }: Props) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [panelId] = useState(() => `menu-panel-${++menuCounter}`);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const triggerClass = [
    styles.trigger,
    icon ? styles.triggerIcon : "",
    active ? styles.triggerActive : "",
    open ? styles.triggerOpen : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={[styles.root, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={icon ? label : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {icon ?? (
          <>
            {label}
            <ChevronDownIcon />
          </>
        )}
      </button>
      {open ? (
        <div id={panelId} role="menu" className={[styles.panel, align === "end" ? styles.panelEnd : ""].filter(Boolean).join(" ")}>
          {items.map((item) => (
            <a
              key={item.key}
              role="menuitem"
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
              aria-current={item.active ? "page" : undefined}
              className={[styles.item, item.active ? styles.itemActive : "", item.tone === "btc" ? styles.itemBtc : ""]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setOpen(false)}
            >
              {item.label}
              {item.external ? (
                <span className={styles.itemMeta}>
                  <ExternalLinkIcon />
                </span>
              ) : null}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
};
