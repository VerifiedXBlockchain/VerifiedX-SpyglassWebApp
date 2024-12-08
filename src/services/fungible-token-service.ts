import { API_BASE_URL } from "../constants";
import { FungibleToken } from "../models/fungible-token";
import { PaginatedResponse } from "../models/paginated-response";
import { VbtcToken } from "../models/vbtc-token";
import { httpGet } from "../utils/network";

export class FungibleTokenService {
    async list(page: number): Promise<PaginatedResponse<FungibleToken>> {
        const response = await httpGet(`${API_BASE_URL}/fungible-tokens/`, { 'page': page });
        const data: any = response.parsedBody;

        const results = [];

        for (let result of data["results"]) {
            results.push(new FungibleToken(result));
        }

        return new PaginatedResponse<FungibleToken>(data["count"], data["page"], data["num_pages"], results);
    }

    async retrieve(sc_identifier: string): Promise<FungibleToken> {
        const response = await httpGet(`${API_BASE_URL}/fungible-tokens/${sc_identifier}/`, {});

        const data: any = response.parsedBody;

        return new FungibleToken(data);
    }


}
