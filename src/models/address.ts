export class Address {
  address: string;
  balance: number;
  balanceLocked: number;
  balanceTotal: number;
  adnr?: string;

  constructor(d: any) {
    this.address = d["address"];
    this.balance = d["balance"];
    this.balanceLocked = d["balance_locked"];
    this.balanceTotal = d["balance_total"];

    this.adnr = d['adnr']
  }
}
