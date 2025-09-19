import { Transaction } from "./transaction";

export class Adnr {
    address: string;
    domain: string;
    create_transaction: Transaction;
    btc_address: string;
    constructor(d: any) {
        this.address = d["address"];
        this.btc_address = d["btc_address"];
        this.domain = d["domain"];
        this.create_transaction = new Transaction(d['create_transaction']);
    }

    get isBtcDomain(): boolean {
        return this.domain.toString().toLowerCase().endsWith('.btc');
    }
}
