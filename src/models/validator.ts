import { isToday } from "../utils/dates";

export class Validator {
  address: string;
  uniqueName: string;
  connectionId: string;
  ipAddress: string;
  connectDate: Date;
  isActive: boolean;

  constructor(d: any) {
    this.address = d["address"];
    this.uniqueName = d["unique_name"];
    this.connectionId = d["connection_id"];
    this.ipAddress = d["ip_address"];
    this.connectDate = new Date(d["connect_date"]);
    this.isActive = d["is_active"];
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
