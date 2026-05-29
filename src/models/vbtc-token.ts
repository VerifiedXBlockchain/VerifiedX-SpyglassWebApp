import { Nft } from "./nft";
export interface AddressBalances {
    [address: string]: number;
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
        this.nft = new Nft(data.nft);
        this.created_at = data.created_at ? new Date(data.created_at) : null;
    }
}