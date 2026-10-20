import { VBTC_ENFORCEMENT_HEIGHT, VBTC_RECORD_HEIGHT } from "../constants";

/**
 * How the chain treats a vBTC V2 vault. Spyglass does not serve this, so it is
 * derived from the vault's mint height and the chain tip:
 * - watched: minted at or above the record height; its backing is what the
 *   chain holds on Bitcoin and its withdrawals settle from Bitcoin reports.
 * - legacy: minted before the record height; it keeps the earlier rules.
 * - frozen: a legacy vault once the next block is at the enforcement height;
 *   nothing debits a balance on it any more (Core BtcLegacyFreeze).
 */
export type VaultStatus = "watched" | "legacy" | "frozen";

export interface VaultGates {
  recordHeight: number | null;
  enforcementHeight: number | null;
}

const NETWORK_GATES: VaultGates = { recordHeight: VBTC_RECORD_HEIGHT, enforcementHeight: VBTC_ENFORCEMENT_HEIGHT };

/** Null when the network has no record height yet or the chain has not reached it: every vault is as it was. */
export function vaultStatus(mintHeight: number, tipHeight: number, gates: VaultGates = NETWORK_GATES): VaultStatus | null {
  const { recordHeight, enforcementHeight } = gates;
  if (recordHeight == null || tipHeight < recordHeight) return null;
  if (mintHeight >= recordHeight) return "watched";
  if (enforcementHeight != null && tipHeight + 1 >= enforcementHeight) return "frozen";
  return "legacy";
}
