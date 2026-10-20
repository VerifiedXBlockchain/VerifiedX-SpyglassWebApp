import { PillTone } from "../components/ui/pill";
import { VbtcWithdrawal } from "../models/vbtc-token";

/**
 * Where a withdrawal stands, from Spyglass's status. On a watched vault a
 * request stays open while the chain fixes (pins) and, if asked, re-fixes its
 * Bitcoin transaction; it is paid when a Bitcoin report sees that transaction
 * confirmed, or closed with the vBTC returned when it is released, cancelled
 * or expires. A Bitcoin rewind can reopen a paid one. Spyglass does not say
 * whether an open request is pinned yet, nor why a closed one closed.
 * pending_btc and cancellation_requested only occur on legacy vaults.
 */
export type WithdrawalStage = "open" | "bitcoinPending" | "cancelRequested" | "paid" | "closed";

export function withdrawalStage(withdrawal: VbtcWithdrawal): WithdrawalStage {
  switch (withdrawal.status) {
    case "completed":
      return "paid";
    case "cancelled":
      return "closed";
    case "pending_btc":
      return "bitcoinPending";
    case "cancellation_requested":
      return "cancelRequested";
    default:
      return "open";
  }
}

export const WITHDRAWAL_STAGE_TONE: Record<WithdrawalStage, PillTone> = {
  open: "gold",
  bitcoinPending: "btc",
  cancelRequested: "indigo",
  paid: "green",
  closed: "neutral",
};
