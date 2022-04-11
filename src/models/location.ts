export class Location {
  city: string;
  region: string;
  country: string;
  timeZone: string;
  latitude: number;
  longitude: number;

  constructor(d: any) {
    this.city = d["city"];
    this.region = d["region"];
    this.country = d["country"];
    this.timeZone = d["time_zone"];
    this.latitude = d["latitude"];
    this.longitude = d["longitude"];
  }

  get label(): string {
    if (this.city && this.country) {
      return `${this.city}, ${this.country}`;
    }

    if (this.city) {
      return this.city;
    }

    if (this.country) {
      return this.country;
    }
    return "-";
  }
}
