import { isToday } from "../utils/dates";
import { Location } from "./location";

export class Validator {
  address: string;
  uniqueName: string;
  connectDate: Date;
  isActive: boolean;
  blockCount: number;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;


  constructor(d: any) {
    this.address = d["address"];
    this.uniqueName = d["name"];
    this.isActive = d["is_active"];
    this.connectDate = new Date(d["date_connected"]);
    this.blockCount = d["block_count"];
    this.city = d['city'];
    this.country = d['country'];
    this.latitude = d['latitude'];
    this.longitude = d['longitude'];
  }

  get dateLabel(): string {
    if (isToday(this.connectDate)) {
      return `Today @ ${this.connectDate.toLocaleTimeString()}`;
    }
    return `${this.connectDate.toLocaleDateString()} ${this.connectDate.toLocaleTimeString()}`;
  }

  get uniqueNameLabel(): string {
    if (this.uniqueName.length > 16) {
      const amount = 8;
      return `${this.uniqueName.slice(0, amount)}...${this.uniqueName.slice(
        -amount
      )}`;
    }
    return this.uniqueName;
  }

  get locationLabel():string {
    if(this.country && this.city) {
      return `${this.city}, ${this.country}`;
    }

    if(this.country) {
      return this.country;
    }

    return "-";
  }
}
