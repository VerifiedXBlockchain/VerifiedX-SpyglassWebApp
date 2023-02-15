import { API_BASE_URL } from "../constants";
import { PaginatedResponse } from "../models/paginated-response";
import { Validator } from "../models/validator";
import { httpGet } from "../utils/network";
import algoliasearch from 'algoliasearch';

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


  async algoliaSearch() {

    const ALGOLIA_INDEX_NAME = "rbx_validators_mainnet";
    const ALGOLIA_API_KEY = "075ecef6ebb6b7b2a6ba27ce19a8e372";
    const ALGOLIA_APP_ID = "V0FU5CB15I"

    const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

    const index = searchClient.initIndex(ALGOLIA_INDEX_NAME)

    const results: any[] = [];

    await index.browseObjects({
      facetFilters: ["is_active:true"],
      batch: (items) => {
        for (const item of items) {
          results.push(item);
        }
      }

    })


    const validators = results.map((r) => {
      return new Validator({
        address: r.address,
        name: r.unique_name,
        is_active: r.is_active,
        date_connected: r.connect_date,
        block_count: r.block_count,
        city: r.city,
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
      });
    })

    console.log(validators.length)


    return new PaginatedResponse<Validator>(
      validators.length,
      1,
      1,
      validators
    );


  }
}
