import { PillTone } from "../components/ui/pill";
import { VbtcWithdrawal } from "../models/vbtc-token";

/**
 * Where a withdrawal stands, from what Spyglass serves. On a watched vault an
 * open request is waiting for the chain to fix (pin) its Bitcoin transaction,
 * pinned to one (the requester can raise its fee), or being released (given
 * up for a refund less the release's Bitcoin fee). It is paid when a Bitcoin
 * report sees its transaction confirmed, or closed: cancelled by its
 * requester, released, expired (never pinned in time) or void (a pinned coin
 * was spent elsewhere). A Bitcoin reorg can reopen a paid one.
 * pending_btc and cancellation_requested only occur on legacy vaults.
 * "open" and "closed" are what is left when Spyglass does not say more.
 */
export type WithdrawalStage =
  | "open"
  | "waiting"
  | "pinned"
  | "releasing"
  | "bitcoinPending"
  | "cancelRequested"
  | "paid"
  | "closed"
  | "cancelled"
  | "released"
  | "expired"
  | "void";

const CLOSED_STAGE: Record<NonNullable<VbtcWithdrawal["closed_because"]>, WithdrawalStage> = {
  Cancelled: "cancelled",
  Released: "released",
  Expired: "expired",
  Void: "void",
};

export function withdrawalStage(withdrawal: VbtcWithdrawal): WithdrawalStage {
  switch (withdrawal.status) {
    case "completed":
      return "paid";
    case "cancelled":
      return withdrawal.closed_because ? CLOSED_STAGE[withdrawal.closed_because] : "closed";
    case "pending_btc":
      return "bitcoinPending";
    case "cancellation_requested":
      return "cancelRequested";
    default:
      if (withdrawal.pin_state === "Waiting") return "waiting";
      if (withdrawal.pin_state === "Pinned") return withdrawal.releasing ? "releasing" : "pinned";
      return "open";
  }
}

export const WITHDRAWAL_STAGE_TONE: Record<WithdrawalStage, PillTone> = {
  open: "gold",
  waiting: "gold",
  pinned: "btc",
  releasing: "indigo",
  bitcoinPending: "btc",
  cancelRequested: "indigo",
  paid: "green",
  closed: "neutral",
  cancelled: "neutral",
  released: "neutral",
  expired: "neutral",
  void: "neutral",
};
