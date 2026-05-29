import { API_BASE_URL } from "../constants";
import { PaginatedResponse } from "../models/paginated-response";
import { VbtcToken } from "../models/vbtc-token";
import { httpGet } from "../utils/network";

export class VbtcTokenService {
    async list(page: number): Promise<PaginatedResponse<VbtcToken>> {
        const response = await httpGet(`${API_BASE_URL}/btc/vbtc-v2/`, { 'page': page });
        const data: any = response.parsedBody;

        const results = [];

        for (let result of data["results"]) {
            results.push(new VbtcToken(result));
        }

        return new PaginatedResponse<VbtcToken>(data["count"] || results.length, data["page"] || 1, data["num_pages"] || 1, results);
    }

    async retrieve(sc_identifier: string): Promise<VbtcToken> {
        const response = await httpGet(`${API_BASE_URL}/btc/vbtc-v2/detail/${sc_identifier}/`, {});

        const data: any = response.parsedBody;

        return new VbtcToken(data);
    }


}
