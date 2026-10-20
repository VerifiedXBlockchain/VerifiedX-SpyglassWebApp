import { useTranslation } from "next-i18next";
import { VaultStatus } from "../../utils/vbtc-vault";
import { Pill, PillTone } from "../ui/pill";

const VAULT_TONE: Record<VaultStatus, PillTone> = { watched: "green", legacy: "neutral", frozen: "red" };

/** Watched, Legacy vault or Frozen; nothing when the status is not known. */
export const VaultBadge = ({ status, size = "sm" }: { status: VaultStatus | null; size?: "sm" | "md" }) => {
  const { t } = useTranslation("vbtcToken");
  if (!status) return null;
  return (
    <Pill tone={VAULT_TONE[status]} size={size}>
      {t(`vbtcToken:detail.vault.badge.${status}`)}
    </Pill>
  );
};
