import { useTranslation } from "next-i18next";
import { Validator } from "../../models/validator";
import { useLocalized } from "../../utils/use-localized";
import { Column, DataTable } from "../ui/data-table";
import { Hash } from "../ui/hash";
import { Pill } from "../ui/pill";
import cells from "../blocks/block-cells.module.scss";

interface Props {
  validators: Validator[];
  loading?: boolean;
  emptyLabel?: string;
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

export const ValidatorTable = ({ validators, loading, emptyLabel }: Props) => {
  const { t } = useTranslation(["validator", "common"]);
  const localized = useLocalized();

  const columns: Column<Validator>[] = [
    { key: "status", header: t("validator:table.status"), nowrap: true, render: (v) => <ValidatorStatusPill validator={v} /> },
    { key: "address", header: t("validator:table.address"), nowrap: true, render: (v) => <Hash value={v.address} side={10} href={localized(`/validators/${v.address}`)} /> },
    {
      key: "name",
      header: t("validator:table.validatorName"),
      render: (v) => {
        const name = validatorDisplayName(v);
        return name ? <span className={cells.primary}>{name}</span> : <span className={cells.empty}>—</span>;
      },
    },
    { key: "location", header: t("validator:table.location"), render: (v) => <span className={cells.sub}>{v.locationLabel}</span> },
    {
      key: "blocks",
      header: t("validator:table.blocks"),
      align: "end",
      nowrap: true,
      hideBelowDesktop: true,
      render: (v) => <span className={cells.mono}>{Number.isFinite(v.blockCount) ? v.blockCount.toLocaleString() : "—"}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={validators}
      rowKey={(v) => v.address}
      rowHref={(v) => localized(`/validators/${v.address}`)}
      loading={loading}
      emptyLabel={emptyLabel ?? t("validator:table.empty")}
      caption={t("validator:table.caption") as string}
    />
  );
};
