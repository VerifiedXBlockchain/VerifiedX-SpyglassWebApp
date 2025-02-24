import { API_BASE_URL } from "../constants";
import { PaginatedResponse } from "../models/paginated-response";
import { Validator } from "../models/validator";
import { httpGet } from "../utils/network";

export class ValidatorService {
  async retrieve(id: string): Promise<Validator> {
    const response = await httpGet(`${API_BASE_URL}/masternodes/${id}`, {});
    const data: any = response.parsedBody;

    return new Validator(data);
  }
  async list(
    page: number = 1,
    params: any = {}
  ): Promise<PaginatedResponse<Validator>> {
    const response = await httpGet(`${API_BASE_URL}/masternodes/`, {
      page: page,
      ...params,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Validator(result));
    }

    return new PaginatedResponse<Validator>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }


  async map(
    page: number = 1,
    params: any = {}
  ): Promise<PaginatedResponse<Validator>> {
    const response = await httpGet(`${API_BASE_URL}/masternodes/map/`, {
      page: page,
      ...params,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Validator(result));
    }

    return new PaginatedResponse<Validator>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }



  async activeCount(): Promise<number> {
    const response = await httpGet(`${API_BASE_URL}/masternodes/`, {
      limit: 1,
      is_active: true,
    });
    const data: any = response.parsedBody;

    return parseInt(data["count"]);
  }

  async search(
    q: string,
    page: number = 1
  ): Promise<PaginatedResponse<Validator>> {
    const response = await httpGet(`${API_BASE_URL}/masternodes/`, {
      page: page,
      search: q,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Validator(result));
    }

    return new PaginatedResponse<Validator>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }
}
