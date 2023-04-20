import { API_BASE_URL } from "../constants";
import { Nft } from "../models/nft";
import { PaginatedResponse } from "../models/paginated-response";
import { Transaction } from "../models/transaction";
import { httpGet } from "../utils/network";

export class NftService {
  async retrieve(id: string): Promise<Nft> {
    const response = await httpGet(`${API_BASE_URL}/nft/${id}`, {});
    const data: any = response.parsedBody;

    return new Nft(data);
  }

  async list(
    page: number = 1,
    params: any = {}
  ): Promise<PaginatedResponse<Nft>> {
    const response = await httpGet(`${API_BASE_URL}/nft/`, {
      page: page,
      ...params,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Nft(result));
    }

    return new PaginatedResponse<Nft>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }

  async search(q: string, page: number = 1): Promise<PaginatedResponse<Nft>> {
    const response = await httpGet(`${API_BASE_URL}/nft/`, {
      page: page,
      search: q,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Nft(result));
    }

    return new PaginatedResponse<Nft>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }

  async history(id: string): Promise<Transaction[]> {
    const response = await httpGet(`${API_BASE_URL}/nft/${id}/history`, {});
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Transaction(result));
    }

    return results;

  }



}
