import { API_BASE_URL } from "../constants";
import { Circulation } from "../models/circulation";
import { Nft } from "../models/nft";
import { httpGet } from "../utils/network";

export class CirculationService {
  async retrieve(): Promise<Circulation> {
    const response = await httpGet(`${API_BASE_URL}/circulation`, {});
    const data: any = response.parsedBody;

    return new Circulation(data);
  }
 
}
