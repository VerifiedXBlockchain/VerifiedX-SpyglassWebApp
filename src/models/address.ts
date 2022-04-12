export class Address {
  address: string;
  balance: number;

  constructor(d: any) {
    this.address = d["address"];
    this.balance = d["balance"];
  }
}
