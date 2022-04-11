import { isToday } from "../utils/dates";
import { Location } from "./location";

export class Validator {
  address: string;
  uniqueName: string;
  ipAddress: string;
  connectDate: Date;
  isActive: boolean;
  blockCount: number;

  location?: Location;

  constructor(d: any) {
    this.address = d["address"];
    this.uniqueName = d["unique_name"];
    this.ipAddress = d["ip_address"];
    this.connectDate = new Date(d["connect_date"]);
    this.isActive = d["is_active"];
    this.blockCount = d["block_count"];

    if (d["location"]) {
      this.location = new Location(d["location"]);
    }
  }

  get dateLabel(): string {
    if (isToday(this.connectDate)) {
      return this.connectDate.toLocaleTimeString();
    }
    return `${this.connectDate.toLocaleDateString()} ${this.connectDate.toLocaleTimeString()}`;
  }

  get uniqueNameLabel(): string {
    if (this.uniqueName.length > 32) {
      const amount = 14;
      return `${this.uniqueName.slice(0, amount)}...${this.uniqueName.slice(
        -amount
      )}`;
    }
    return this.uniqueName;
  }
}
