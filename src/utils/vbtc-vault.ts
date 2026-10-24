import { VbtcToken } from "../models/vbtc-token";

/**
 * How the chain treats a vBTC V2 vault, from what Spyglass serves (the
 * token's is_watched and /btc/vbtc-v2/heights/):
 * - watched: minted at or above the record height; its backing is what the
 *   chain holds on Bitcoin and its withdrawals settle from Bitcoin reports.
 * - legacy: minted before the record height; it keeps the earlier rules.
 * - frozen: a legacy vault once the next block is at the enforcement height;
 *   nothing debits a balance on it any more (Core BtcLegacyFreeze).
 */
export type VaultStatus = "watched" | "legacy" | "frozen";

/** The network's attestation heights; null where Core has not set one (mainnet before 9.0). */
export interface VaultHeights {
  recordHeight: number | null;
  enforcementHeight: number | null;
  latestBlockHeight: number | null;
}

/** Null when the network has no record height yet, the chain has not reached it, or Spyglass did not say: every vault is as it was. */
export function vaultStatus(token: Pick<VbtcToken, "is_watched">, heights: VaultHeights | null): VaultStatus | null {
  if (!heights || token.is_watched == null) return null;
  const { recordHeight, enforcementHeight, latestBlockHeight } = heights;
  if (recordHeight == null || latestBlockHeight == null || latestBlockHeight < recordHeight) return null;
  if (token.is_watched) return "watched";
  if (enforcementHeight != null && latestBlockHeight + 1 >= enforcementHeight) return "frozen";
  return "legacy";
}
