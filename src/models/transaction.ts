import { isToday } from "../utils/dates";

export class Transaction {
  hash: string;
  toAddress: string;
  fromAddress: string;
  amount: number;
  nounce: number;
  fee: number;
  timestamp: number;
  nftData?: any;
  signature?: any;
  height: number;

  constructor(d: any) {
    this.hash = d["hash"];
    this.toAddress = d["to_address"];
    this.fromAddress = d["from_address"];
    this.amount = d["amount"];
    this.nounce = d["nounce"];
    this.fee = d["fee"];
    this.timestamp = d["timestamp"];
    this.nftData = d["nft_data"];
    this.signature = d["signature"];
    this.height = d["height"];
  }

  hashPreview(n: number = 16): string {
    const amount = Math.floor(n / 2);
    return `${this.hash.slice(0, amount)}...${this.hash.slice(-amount)}`;
  }

  get timestampDate(): Date {
    return new Date(this.timestamp * 1000);
  }

  get timestampLabel(): string {
    if (isToday(this.timestampDate)) {
      return `Today @ ${this.timestampDate.toLocaleTimeString()}`;
    }
    return `${this.timestampDate.toLocaleDateString()} ${this.timestampDate.toLocaleTimeString()}`;
  }
}
