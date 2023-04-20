import { Transaction } from "./transaction";

export class Adnr {
    address: string;
    domain: number;
    create_transaction: Transaction;

    constructor(d: any) {
        this.address = d["address"];
        this.domain = d["domain"];
        this.create_transaction = new Transaction(d['create_transaction']);
    }
}
