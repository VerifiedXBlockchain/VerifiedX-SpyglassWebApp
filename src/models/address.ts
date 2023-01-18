export class Address {
  address: string;
  balance: number;
  adnr?: string;

  constructor(d: any) {
    this.address = d["address"];
    this.balance = d["balance"];
    this.adnr = d['adnr']
  }
}
