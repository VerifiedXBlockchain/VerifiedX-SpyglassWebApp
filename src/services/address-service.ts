import { API_BASE_URL } from "../constants";
import { Address, TopHolder } from "../models/address";
import { httpGet } from "../utils/network";

export class AddressService {
  async retrieve(id: string): Promise<Address> {
    const response = await httpGet(`${API_BASE_URL}/addresses/${id}`, {});
    const data: any = response.parsedBody;

    return new Address(data);
  }

  async retrieveByAdnr(id: string): Promise<Address> {
    const response = await httpGet(`${API_BASE_URL}/addresses/adnr/${id}`, {});
    const data: any = response.parsedBody;

    return new Address(data);
  }

  async topHolders(): Promise<TopHolder[]> {
    const response = await httpGet(`${API_BASE_URL}/addresses/top-holders/`, {});
    const data: any = response.parsedBody;

    const results: TopHolder[] = [];
    for (let result of data) {
      results.push(new TopHolder(result));
    }

    return results;
  }
}
