import { API_BASE_URL } from "../constants";
import { Block } from "../models/block";
import { PaginatedResponse } from "../models/paginated-response";
import { Transaction } from "../models/transaction";
import { httpGet } from "../utils/network";

export class TransactionService {
  async retrieve(id: string): Promise<Transaction> {
    const response = await httpGet(`${API_BASE_URL}/transaction/${id}`, {});
    const data: any = response.parsedBody;

    return new Transaction(data);
  }

  async list(page: number = 1): Promise<PaginatedResponse<Transaction>> {
    const response = await httpGet(`${API_BASE_URL}/transaction/`, {
      page: page,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Transaction(result));
    }

    return new PaginatedResponse<Transaction>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }

  async listByBlockHeight(height: number, page: number = 1): Promise<PaginatedResponse<Transaction>> {
    const response = await httpGet(`${API_BASE_URL}/transaction/block/${height}`, {
      page: page,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Transaction(result));
    }

    return new PaginatedResponse<Transaction>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }



  async search(
    q: string,
    page: number = 1
  ): Promise<PaginatedResponse<Transaction>> {
    const response = await httpGet(`${API_BASE_URL}/transaction/`, {
      page: page,
      search: q,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Transaction(result));
    }

    return new PaginatedResponse<Transaction>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }

  async address(
    address: string,
    page: number = 1
  ): Promise<PaginatedResponse<Transaction>> {
    const response = await httpGet(`${API_BASE_URL}/transaction/address/${address}`, {
      page: page,
    });
    const data: any = response.parsedBody;

    const results = [];

    for (let result of data["results"]) {
      results.push(new Transaction(result));
    }

    return new PaginatedResponse<Transaction>(
      data["count"],
      data["page"],
      data["num_pages"],
      results
    );
  }
}
