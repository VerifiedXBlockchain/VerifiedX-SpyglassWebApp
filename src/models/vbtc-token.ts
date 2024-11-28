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
    public_key_proofs: string;
    global_balance: number;
    addresses: AddressBalances;
    nft: Nft;
    created_at: Date | null;

    constructor(data: Partial<VbtcToken>) {
        this.sc_identifier = data.sc_identifier || '';
        this.name = data.name || '';
        this.description = data.description || '';
        this.owner_address = data.owner_address || '';
        this.image_url = data.image_url || '';
        this.deposit_address = data.deposit_address || '';
        this.public_key_proofs = data.public_key_proofs || '';
        this.global_balance = data.global_balance || 0;
        this.addresses = data.addresses || {};
        this.nft = new Nft(data.nft);
        this.created_at = data.created_at ? new Date(data.created_at) : null;
    }
}