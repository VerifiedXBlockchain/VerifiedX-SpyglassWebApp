import { API_BASE_URL } from "../constants";
import { Block } from "../models/block";
import { PaginatedResponse } from "../models/paginated-response";
import { httpGet } from "../utils/network";

export class BlockService {
  async retrieve(id: string): Promise<Block> {
    const response = await httpGet(`${API_BASE_URL}/blocks/${id}`, {});
    const data: any = response.parsedBody;

    return new Block(data);
  }
  async list(page: number = 1): Promise<PaginatedResponse<Block>> {
    const response = await httpGet(`${API_BASE_URL}/blocks/`, {
      page: page,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Block(result));
    }

    return new PaginatedResponse<Block>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }

  async search(q: string, page: number = 1): Promise<PaginatedResponse<Block>> {
    const response = await httpGet(`${API_BASE_URL}/blocks/`, {
      page: page,
      search: q,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Block(result));
    }

    return new PaginatedResponse<Block>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }
}
