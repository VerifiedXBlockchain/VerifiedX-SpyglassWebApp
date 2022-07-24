import { API_BASE_URL } from "../constants";
import { Nft } from "../models/nft";
import { httpGet } from "../utils/network";

export class NftService {
  async retrieve(id: string): Promise<Nft> {
    const response = await httpGet(`${API_BASE_URL}/nft/${id}`, {});
    const data: any = response.parsedBody;

    return new Nft(data);
  }
 
}
