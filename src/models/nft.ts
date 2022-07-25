import pako from "pako";
import { isToday } from "../utils/dates";

export class Nft {
    identifier: string;
    name: string;
    description: string;
    minterAddress: string;
    ownerAddress: string;
    minterName: string;
    primaryAssetName: string;
    primaryAssetSize: number;
    data: string;
    isBurned: boolean;
    mintTransaction: string;
    burnTransaction?: string;
    mintedAt: Date;
  
    constructor(d: any) {
        this.identifier = d["identifier"];
        this.name = d["name"];
        this.description = d["description"];
        this.minterAddress = d["minter_address"];
        this.ownerAddress = d["owner_address"];
        this.minterName = d["minter_name"];
        this.primaryAssetName = d["primary_asset_name"];
        this.primaryAssetSize = d["primary_asset_size"];
        this.data = d["data"];
        this.isBurned = d['is_burned'];
        this.mintTransaction = d['mint_transaction'];
        this.burnTransaction = d['burn_transaction'];
        this.mintedAt = new Date(d['minted_at']);
    }

    get nftDataFormatted() {
        if (this.data == null || this.data == "") {
          return "-";
        }
    
        const data: any[] = JSON.parse(this.data);
    
        if (data == null) {
          return "-";
        }
    
        const items = [];
        for (let item of data) {
          if ("Data" in item) {
            item = { ...item, Data: item["Data"] };
          }
          items.push(item);
        }
    
        return JSON.stringify(items, null, 4);
      }
    
      get dataDataFormatted() {
        if (this.data == null || this.data == "") {
          return "";
        }
    
        const data: any[] = JSON.parse(this.data);
    
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
    return str;
  }

  get timestampLabel(): string {
    if (isToday(this.mintedAt)) {
      return this.mintedAt.toLocaleTimeString();
    }
    return `${this.mintedAt.toLocaleDateString()} ${this.mintedAt.toLocaleTimeString()}`;
  }
  
  
  }
  