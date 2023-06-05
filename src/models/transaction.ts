import { isToday } from "../utils/dates";
import pako from "pako";
import { Nft } from "./nft";

export class Transaction {
  hash: string;
  toAddress: string;
  fromAddress: string;
  amount: number;
  nounce: number;
  fee: number;
  dateCrafted: Date;
  nftData?: any;
  signature?: any;
  height: number;
  transactionType: number;
  nft?: Nft;

  constructor(d: any) {
    this.hash = d["hash"];
    this.toAddress = d["to_address"];
    this.fromAddress = d["from_address"];
    this.amount = d["total_amount"];
    this.nounce = d["nounce"];
    this.fee = d["total_fee"];
    this.dateCrafted = new Date(d["date_crafted"]);
    this.nftData = d["data"];
    this.signature = d["signature"];
    this.height = d["height"];
    this.transactionType = d["transaction_type"] ?? d["type"] ?? 0;
    this.nft = d['nft'] != null ? new Nft(d['nft']) : undefined;
  }

  hashPreview(n: number = 16): string {
    const amount = Math.floor(n / 2);
    return `${this.hash.slice(0, amount)}...${this.hash.slice(-amount)}`;
  }


  get timestampLabel(): string {
    // if (isToday(this.dateCrafted)) {
    //   return this.dateCrafted.toLocaleTimeString();
    // }
    return `${this.dateCrafted.toLocaleDateString()} ${this.dateCrafted.toLocaleTimeString()}`;
  }

  get nftDataFormatted() {
    if (this.nftData == null || this.nftData == "") {
      return "-";
    }

    let data: any[] = JSON.parse(this.nftData);

    if (data == null) {
      return "-";
    }

    // if (this.transactionType == 6) {

    //   return "-";
    // }

    if (!Array.isArray(data)) {
      data = [data];
    }

    const items = [];

    for (let item of data) {
      if (item && "Data" in item) {
        item = { ...item, Data: item["Data"] };
      }
      items.push(item);
    }

    return JSON.stringify(items, null, 4);
  }

  nftDataValue(key: string) {
    const d = this.nftDataFormatted;

    if (d == "-") {
      return null;
    }

    const data = JSON.parse(d)[0];


    return data[key];


  }




  get nftDataDataFormatted() {
    if (this.nftData == null || this.nftData == "") {
      return "";
    }



    let data: any[] = JSON.parse(this.nftData);

    const items = [];


    // if (this.transactionType == 6) {
    //   return "-";
    // }

    if (!Array.isArray(data)) {
      data = [data];

    }


    if (data) {

      for (let item of data) {
        if (item && "Data" in item) {
          const decoded = this.decompressData(item["Data"]);

          items.push(decoded);
        }
      }

      return items.toString();
    }
  }

  decompressData(encodedData: string) {
    const data = Buffer.from(encodedData, "base64");
    const str = pako.ungzip(data, { to: "string" });

    return str;
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
        const saleFunc = this.nftDataValue("Function");
        if (saleFunc == "Sale_Start()") {
          return "NFT Sale Start"
        }

        if (saleFunc == "Sale_Complete()") {
          return "NFT Sale Complete";
        }

        return "NFT Sale";
      case 6:
        return "ADNR";
      case 7:
        return "DST Registration";
      case 8:
        return "Topic";
      case 9:
        return "Topic Vote";
      case 10:
        const reserveFunc = this.nftDataValue("Function");
        if (reserveFunc == "CallBack()") {
          return "Reserve (Callback)";
        }
        if (reserveFunc == "Register()") {
          return "Reserve (Register)";
        }
        if (reserveFunc == "Recover()") {
          return "Reserve (Recover)";
        }
        return "Reserve";
      default:
        return "-";
    }
  }
}
