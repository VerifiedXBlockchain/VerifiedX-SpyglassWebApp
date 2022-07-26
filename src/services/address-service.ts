import { API_BASE_URL } from "../constants";
import { Address } from "../models/address";
import { httpGet } from "../utils/network";

export class AddressService {
  async retrieve(id: string): Promise<Address> {
    const response = await httpGet(`${API_BASE_URL}/addresses/${id}`, {});
    const data: any = response.parsedBody;

    return new Address(data);
  }
}
