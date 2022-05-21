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
  transactionType: number;

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
    this.transactionType = d["transaction_type"] ?? 0;
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

  get nftDataFormatted() {
    if (this.nftData == null) {
      return "-";
    }

    const data: any[] = JSON.parse(this.nftData);

    const items = [];
    for (let item of data) {
      if ("Data" in item) {
        // const decoded = atob(item["Data"]);
        const decoded = item["Data"];
        item = { ...item, Data: decoded };
      }
      items.push(item);
    }

    return JSON.stringify(items, null, 4);
  }

  get transactionTypeLabel() {
    switch (this.transactionType) {
      case 0:
        return "Tx";
      case 1:
        return "Node";
      case 2:
        return "NFT Mint";
      case 3:
        return "NFT Tx";
      case 4:
        return "NFT Burn";
      case 5:
        return "NFT Sale";
      case 6:
        return "Address";
      case 7:
        return "DST Registration";
      default:
        return "-";
    }
  }
}
