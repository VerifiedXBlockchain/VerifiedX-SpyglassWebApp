import pako from "pako";

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
  
  
  }
  