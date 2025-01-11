import { isToday } from "../utils/dates";
import pako from "pako";
import { Nft } from "./nft";
import { Recovery } from "./recovery";

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
  callbackDetails?: Transaction;
  recoveryDetails?: Recovery;

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
    this.callbackDetails = d['callback_details'] != null ? new Transaction(d['callback_details']) : undefined;
    this.recoveryDetails = d['recovery_details'] != null ? new Recovery(d['recovery_details']) : undefined;
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
        if (this.nftDataValue("Function") == "TokenDeploy()") {
          return "NFT Mint (Tokenized)";
        }
        return "NFT Mint";
      case 3:
        if (this.nftDataValue("Function") == "Transfer()") {
          return "NFT Transfer";
        }
        return "NFT Tx";
      case 4:
        return "NFT Burn";
      case 5:
        const saleFunc = this.nftDataValue("Function");
        if (saleFunc == "Sale_Start()") {
          return "NFT Sale Start"
        }

        if (saleFunc == "M_Sale_Start()") {
          return "NFT Sale Start (Manual)";
        }

        if (saleFunc == "Sale_Complete()") {
          return "NFT Sale Complete";
        }

        if (saleFunc == "M_Sale_Complete()") {
          return "NFT Sale Complete (Manual)";
        }

        return "NFT Sale";
      case 6:
        switch (this.nftDataValue("Function")) {
          case "AdnrCreate()":
            return "ADNR Create";
          case "AdnrTransfer()":
            return "ADNR Transfer";
          case "AdnrDelete()":
            return "ADNR Delete";
          case "BTCAdnrCreate()":
            return "BTC ADNR Create";
          case "BTCAdnrTransfer()":
            return "BTC ADNR Transfer";
          case "BTCAdnrDelete()":
            return "BTC ADNR Delete";
          default:
            return "ADNR";
        }
      case 7:
        return "DST Registration";
      case 8:
        return "Topic";
      case 9:
        return "Topic Vote";
      case 10:
        const reserveFunc = this.nftDataValue("Function");
        if (reserveFunc == "CallBack()") {
          return "Vault (Callback)";
        }
        if (reserveFunc == "Register()") {
          return "Vault (Register)";
        }
        if (reserveFunc == "Recover()") {
          return "Vault (Recover)";
        }
        return "Vault";
      case 11:
        return "Smart Contract Mint";
      case 12:
        return "Smart Contract TX";
      case 13:
        return "Smart Contract Burn";
      case 14:
        return "Fungible Token Mint";
      case 15:
        let amount = this.nftDataValue("Amount")
        let ticker = this.nftDataValue("TokenTicker")

        let valueString = "";
        if (amount != null && ticker != null) {
          valueString = ` (${amount} ${ticker})`;
        }

        let tickerString = "";
        if (ticker != null) {
          tickerString = ` ${ticker}`;
        }

        switch (this.nftDataValue("Function")) {
          case "TokenMint()":
            return `Fungible Token Mint${valueString}`;
          case "TokenBurn()":
            return `Fungible Token Burn${valueString}`
          case "TokenTransfer()":
            return `Fungible Token Transfer${valueString}`
          case "TokenContractOwnerChange()":
            return `Fungible Token Ownership Change${tickerString}`
          case "TokenPause()":
            const isPause = this.nftDataValue("Pause") == "true";
            return `Fungible Token ${isPause ? 'Pause' : 'Resume'}${tickerString}`;
          case "TokenVoteTopicCast()":
            return `Fungible Token Vote Cast${tickerString}`
          case "TokenVoteTopicCreate()":
            return `Fungible Token Topic Created${tickerString}`
          default:
            return "Fungible Token TX"

        }
      case 16:
        return "Fungible Token Burn";
      case 17:
        if (this.nftDataValue("Function") == "TokenDeploy()") {
          return "Fungible Token Deploy"
        }
        return "Tokenization Mint";
      case 18:
        if (this.nftDataValue("Function") == "TransferCoin()") {
          return `vBTC Transfer Coin (${this.nftDataValue('Amount')} vBTC)`;
        }
        if (this.nftDataValue("Function") == "Transfer()") {
          return "vBTC Token Ownership Transfer";
        }
        return "Tokenization TX";
      case 19:
        return "Tokenization Burn";
      case 20:
        return "Tokenization Withdrawl";
      case 21:
        return "Tokenization Withdrawl";


      default:
        return "-";
    }
  }
}
