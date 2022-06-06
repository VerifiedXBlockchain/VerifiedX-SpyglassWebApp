import { isToday } from "../utils/dates";
import pako from "pako";

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
        item = { ...item, Data: item["Data"] };
      }
      items.push(item);
    }

    return JSON.stringify(items, null, 4);
  }

  get nftDataDataFormatted() {
    const data: any[] = JSON.parse(this.nftData);

    const items = [];
    for (let item of data) {
      if ("Data" in item) {
        const decoded = this.decompressData(item["Data"]);

        items.push(decoded);
      }
    }

    return items.toString();
  }

  decompressData(encodedData: string) {
    const data = Buffer.from(encodedData, "base64");
    const str = pako.ungzip(data, { to: "string" });

    console.log(str);
    // return decodeURIComponent(escape(str));
    return str;

    // const output = decodeURIComponent(
    //   JSON.parse('"' + str.replace(/\"/g, '\\"') + '"')
    // );
    // return output;
    // var r = /\\u([\d\w]{4})/gi;
    // var x = str.replace(r, function (match, grp) {
    //   return String.fromCharCode(parseInt(grp, 16));
    // });
    // return x;

    // let output = "";
    // for (let c of str) {
    //   console.log(c);

    //   output = `${output}${c.toString()}`;
    // }

    // console.log(output);

    // return output;

    // return str.replace(/\\u[\dA-F]{4}/gi, function (match) {
    //   return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    // });
  }

  unicodeToChar(char: string) {
    return char.replace(/\\u[\dA-F]{4}/gi, function (match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });
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
