import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { Validator } from "../../models/validator";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable, SortState } from "../ui/data-table";
import { Hash } from "../ui/hash";
import { Pill } from "../ui/pill";
import cells from "../blocks/block-cells.module.scss";

interface Props {
  validators: Validator[];
  loading?: boolean;
  emptyLabel?: string;
  /** Let the reader sort by clicking column headers. */
  sortable?: boolean;
}

export const ValidatorStatusPill = ({ validator, size }: { validator: Validator; size?: "sm" | "md" }) => {
  const { t } = useTranslation("common");
  return (
    <Pill tone={validator.isActive ? "green" : "red"} size={size}>
      {validator.isActive ? t("status.active") : t("status.inactive")}
    </Pill>
  );
};

/** Name only when the operator set one; the address column already shows the address. */
export const validatorDisplayName = (validator: Validator) => (validator.uniqueName && validator.uniqueName !== validator.address ? validator.uniqueName : undefined);

const sortValue = (validator: Validator, key: string): string | number => {
  switch (key) {
    case "status":
      return validator.isActive ? 0 : 1;
    case "name":
      return (validatorDisplayName(validator) ?? validator.address).toLowerCase();
    case "location":
      return validator.locationLabel.toLowerCase();
    case "blocks":
      return validator.blockCount ?? -1;
    default:
      return validator.address.toLowerCase();
  }
};

export const sortValidators = (validators: Validator[], sort?: SortState): Validator[] => {
  if (!sort) return validators;
  const factor = sort.direction === "asc" ? 1 : -1;
  return [...validators].sort((a, b) => {
    const av = sortValue(a, sort.key);
    const bv = sortValue(b, sort.key);
    if (av < bv) return -1 * factor;
    if (av > bv) return 1 * factor;
    return 0;
  });
};

export const ValidatorTable = ({ validators, loading, emptyLabel, sortable }: Props) => {
  const { t } = useTranslation(["validator", "common"]);
  const localized = useLocalized();
  const [sort, setSort] = useState<SortState | undefined>(undefined);

  const onSort = (key: string) =>
    setSort((current) => (current?.key === key ? { key, direction: current.direction === "asc" ? "desc" : "asc" } : { key, direction: "asc" }));

  const rows = useMemo(() => sortValidators(validators, sortable ? sort : undefined), [validators, sort, sortable]);
  // The compact list endpoint omits block counts; a column of dashes is noise.
  const hasBlockCounts = validators.some((v) => Number.isFinite(v.blockCount));

  const columns: Column<Validator>[] = [
    { key: "status", header: t("validator:table.status"), nowrap: true, sortable, render: (v) => <ValidatorStatusPill validator={v} /> },
    { key: "address", header: t("validator:table.address"), nowrap: true, sortable, render: (v) => <Hash value={v.address} side={10} href={localized(`/validators/${v.address}`)} /> },
    {
      key: "name",
      header: t("validator:table.validatorName"),
      sortable,
      render: (v) => {
        const name = validatorDisplayName(v);
        return name ? <span className={cells.primary}>{name}</span> : <span className={cells.empty}>—</span>;
      },
    },
    { key: "location", header: t("validator:table.location"), sortable, render: (v) => <span className={cells.sub}>{v.locationLabel}</span> },
    ...(hasBlockCounts
      ? [
          {
            key: "blocks",
            header: t("validator:table.blocks"),
            align: "end",
            nowrap: true,
            hideBelowDesktop: true,
            sortable,
            render: (v: Validator) => <span className={cells.mono}>{Number.isFinite(v.blockCount) ? v.blockCount.toLocaleString() : "—"}</span>,
          } as Column<Validator>,
        ]
      : []),
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      rowKey={(v) => v.address}
      rowHref={(v) => localized(`/validators/${v.address}`)}
      loading={loading}
      emptyLabel={emptyLabel ?? t("validator:table.empty")}
      caption={t("validator:table.caption") as string}
      sort={sortable ? sort : undefined}
      onSort={sortable ? onSort : undefined}
    />
  );
};
