import { MouseEvent, ReactNode } from "react";
import { navigateTo } from "../../utils/navigate";
import { ChevronDownIcon, ChevronUpIcon } from "./icons";
import { Skeleton } from "./skeleton";
import styles from "./data-table.module.scss";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  align?: "start" | "center" | "end";
  /** Column is secondary: drop it below the desktop breakpoint. */
  hideBelowDesktop?: boolean;
  nowrap?: boolean;
  width?: string;
  /** Header becomes a button that calls `onSort(key)`. */
  sortable?: boolean;
}

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  /** Makes the whole row a shortcut to this URL (cells keep their own links). */
  rowHref?: (row: T) => string;
  loading?: boolean;
  skeletonRows?: number;
  emptyLabel?: ReactNode;
  /** Screen-reader table description. */
  caption?: string;
  dense?: boolean;
  className?: string;
  /** Current sort, shown on the matching sortable header. The caller sorts `rows`. */
  sort?: SortState;
  onSort?: (key: string) => void;
}

const cellClass = <T,>(column: Column<T>, base: string) =>
  [
    base,
    column.align === "end" ? styles.alignEnd : "",
    column.align === "center" ? styles.alignCenter : "",
    column.hideBelowDesktop ? styles.hideBelowDesktop : "",
    column.nowrap ? styles.nowrap : "",
  ]
    .filter(Boolean)
    .join(" ");

/**
 * Styled data table. Rows can navigate on click while inner links and
 * buttons keep working; loading renders skeleton rows so the layout is
 * stable before data arrives.
 */
export function DataTable<T>({ columns, rows, rowKey, rowHref, loading, skeletonRows = 8, emptyLabel, caption, dense, className, sort, onSort }: Props<T>) {
  const onRowClick = (href: string) => (event: MouseEvent<HTMLTableRowElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, [role=button]")) return;
    navigateTo(href);
  };

  return (
    <div className={[styles.wrap, dense ? styles.dense : "", className].filter(Boolean).join(" ")}>
      <div className={styles.scroll}>
        <table className={styles.table}>
          {caption ? <caption className={styles.caption}>{caption}</caption> : null}
          <thead>
            <tr>
              {columns.map((column) => {
                const active = sort?.key === column.key;
                const ariaSort = active ? (sort?.direction === "asc" ? "ascending" : "descending") : undefined;
                return (
                  <th key={column.key} scope="col" className={cellClass(column, styles.th)} style={column.width ? { width: column.width } : undefined} aria-sort={ariaSort}>
                    {column.sortable && onSort ? (
                      <button type="button" className={[styles.sortButton, active ? styles.sortActive : ""].filter(Boolean).join(" ")} onClick={() => onSort(column.key)}>
                        {column.header}
                        {active && sort?.direction === "asc" ? <ChevronUpIcon size={11} /> : <ChevronDownIcon size={11} />}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const href = rowHref?.(row);
              return (
                <tr key={rowKey(row)} className={[styles.row, href ? styles.clickable : ""].filter(Boolean).join(" ")} onClick={href ? onRowClick(href) : undefined}>
                  {columns.map((column) => (
                    <td key={column.key} className={cellClass(column, styles.td)}>
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {loading
              ? Array.from({ length: skeletonRows }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className={styles.row} aria-hidden="true">
                    {columns.map((column) => (
                      <td key={column.key} className={cellClass(column, styles.td)}>
                        <Skeleton width={column.align === "end" ? "50%" : "70%"} height="1em" />
                      </td>
                    ))}
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
      {!loading && rows.length === 0 && emptyLabel ? <div className={styles.empty}>{emptyLabel}</div> : null}
    </div>
  );
}
