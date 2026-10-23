export interface BtcFaucetInfo {
    enabled: boolean;
    minAmount: number;
    maxAmount: number;
}

export class TestnetFaucetInfo {
    address: string;
    available: number;
    minAmount: number;
    maxAmount: number;
    /** Signet BTC from the same faucet (testnet only); disabled when the API doesn't offer it. */
    btc: BtcFaucetInfo;

    constructor(d: any) {
        this.address = d["address"];
        this.available = d["available"];
        this.minAmount = d["min_amount"];
        this.maxAmount = d["max_amount"];
        const btc = d["btc"] ?? {};
        this.btc = {
            enabled: Boolean(btc["enabled"]),
            minAmount: Number(btc["min_amount"] ?? 0),
            maxAmount: Number(btc["max_amount"] ?? 0),
        };
    }
}
