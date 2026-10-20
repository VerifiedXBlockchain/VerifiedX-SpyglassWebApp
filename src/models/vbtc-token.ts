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
        this.addresses = data.addresses || {};
        this.withdrawal_requests = (data.withdrawal_requests || []).map((w: any) => new VbtcWithdrawal(w));
        this.nft = new Nft(data.nft);
        this.created_at = data.created_at ? new Date(data.created_at) : null;
    }
}