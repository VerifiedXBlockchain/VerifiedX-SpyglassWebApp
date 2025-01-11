export class TestnetFaucetInfo {
    address: string;
    available: number;
    minAmount: number;
    maxAmount: number;

    constructor(d: any) {
        this.address = d["address"];
        this.available = d["available"];
        this.minAmount = d["min_amount"];
        this.maxAmount = d["max_amount"];

    }
}
