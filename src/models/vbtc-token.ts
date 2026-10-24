import { Nft } from "./nft";
export interface AddressBalances {
    [address: string]: number;
}


/** One vBTC V2 withdrawal request as Spyglass serves it (VbtcV2WithdrawalRequestSerializer). */
export class VbtcWithdrawal {
    id: number;
    requestor_address: string;
    btc_address: string;
    amount: number;
    /** The rate the request asked for, in sat/vB. */
    fee_rate: number;
    /** The Bitcoin transaction that paid it; empty until paid. */
    btc_transaction_hash: string;
    status: string;
    request_transaction_hash: string;
    /** Legacy vault: the owner's completion. Watched vault: the Bitcoin report that saw it paid. */
    completion_transaction_hash: string | null;
    created_at: Date | null;
    completed_at: Date | null;
    /** Open request on a watched vault: Waiting for its Bitcoin transaction to be fixed, or Pinned to one. Null otherwise or not read yet. */
    pin_state: "Waiting" | "Pinned" | null;
    /** The newest live pin's Bitcoin txid and fee rate (sat/vB), while pinned. */
    pin_txid: string | null;
    pin_fee_rate: number | null;
    /** A release (the requester giving it up) is pinned. */
    releasing: boolean;
    /** The block a waiting request closes at if it is still not fixed. */
    expires_at_height: number | null;
    /** Why a closed request closed without payment. Null while open, when paid, or not known. */
    closed_because: "Cancelled" | "Released" | "Expired" | "Void" | null;
    /** What a closed request refunded when less than its amount; null: the whole amount. */
    refunded_amount: number | null;

    constructor(data: any) {
        this.id = data.id || 0;
        this.requestor_address = data.requestor_address || '';
        this.btc_address = data.btc_address || '';
        this.amount = data.amount || 0;
        this.fee_rate = data.fee_rate || 0;
        this.btc_transaction_hash = data.btc_transaction_hash || '';
        this.status = data.status || '';
        this.request_transaction_hash = data.request_transaction_hash || '';
        this.completion_transaction_hash = data.completion_transaction_hash || null;
        this.created_at = data.created_at ? new Date(data.created_at) : null;
        this.completed_at = data.completed_at ? new Date(data.completed_at) : null;
        this.pin_state = data.pin_state === "Waiting" || data.pin_state === "Pinned" ? data.pin_state : null;
        this.pin_txid = data.pin_txid || null;
        this.pin_fee_rate = data.pin_fee_rate ?? null;
        this.releasing = data.releasing === true;
        this.expires_at_height = data.expires_at_height ?? null;
        this.closed_because = ["Cancelled", "Released", "Expired", "Void"].includes(data.closed_because) ? data.closed_because : null;
        this.refunded_amount = data.refunded_amount ?? null;
    }
}

export class VbtcToken {
    sc_identifier: string;
    name: string;
    description: string;
    owner_address: string;
    image_url: string;
    deposit_address: string;
    frost_group_public_key: string;
    required_threshold: number;
    global_balance: number;
    total_received: number;
    total_sent: number;
    tx_count: number;
    is_pending_withdrawal: boolean;
    /** The chain watches this vault's Bitcoin (minted from the record height on). Null when Spyglass does not say. */
    is_watched: boolean | null;
    addresses: AddressBalances;
    withdrawal_requests: VbtcWithdrawal[];
    nft: Nft;
    created_at: Date | null;

    constructor(data: any) {
        this.sc_identifier = data.sc_identifier || '';
        this.name = data.name || '';
        this.description = data.description || '';
        this.owner_address = data.owner_address || '';
        this.image_url = data.image_url || '';
        this.deposit_address = data.deposit_address || '';
        this.frost_group_public_key = data.frost_group_public_key || '';
        this.required_threshold = data.required_threshold || 0;
        this.global_balance = data.global_balance || 0;
        this.total_received = data.total_received || 0;
        this.total_sent = data.total_sent || 0;
        this.tx_count = data.tx_count || 0;
        this.is_pending_withdrawal = data.is_pending_withdrawal || false;
        this.is_watched = typeof data.is_watched === "boolean" ? data.is_watched : null;
        this.addresses = data.addresses || {};
        this.withdrawal_requests = (data.withdrawal_requests || []).map((w: any) => new VbtcWithdrawal(w));
        this.nft = new Nft(data.nft);
        this.created_at = data.created_at ? new Date(data.created_at) : null;
    }
}