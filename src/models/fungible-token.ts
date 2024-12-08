

export class FungibleToken {
    sc_identifier: string;
    name: string;
    ticker: string;
    owner_address: string;
    can_mint: boolean;
    can_burn: boolean;
    can_vote: boolean;
    created_at: Date | null; // ISO date string
    initial_supply: number;
    circulating_supply: number;
    decimal_places: number;
    image_url: string;
    is_paused: boolean;
    banned_addresses: string[];

    constructor(data: Partial<FungibleToken>) {
        this.sc_identifier = data.sc_identifier || '';
        this.name = data.name || '';
        this.ticker = data.ticker || '';
        this.owner_address = data.owner_address || '';
        this.can_mint = data.can_mint ?? false;
        this.can_burn = data.can_burn ?? false;
        this.can_vote = data.can_vote ?? false;
        this.created_at = data.created_at ? new Date(data.created_at) : null;
        this.initial_supply = data.initial_supply || 0;
        this.circulating_supply = data.circulating_supply || 0;
        this.decimal_places = data.decimal_places || 0;
        this.image_url = data.image_url || '';
        this.is_paused = data.is_paused ?? false;
        this.banned_addresses = data.banned_addresses || [];
    }
}