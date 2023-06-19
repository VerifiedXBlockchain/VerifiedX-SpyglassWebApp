import { Transaction } from "./transaction";


export class Recovery {
    originalAddress: string;
    newAddress: string;
    amount: number;
    outstandingTransactions: Transaction[] = [];

    constructor(d: any) {
        this.originalAddress = d['original_address'];
        this.newAddress = d['new_address'];
        this.amount = d['amount'];

        const outstandingTxs = d['outstanding_transactions'];

        if (outstandingTxs) {
            for (let tx of outstandingTxs) {
                this.outstandingTransactions.push(new Transaction(tx));
            }
        }
    }
}