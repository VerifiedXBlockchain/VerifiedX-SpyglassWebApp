import { API_BASE_URL, VBTC_RECORD_HEIGHT } from "../constants";
import { PaginatedResponse } from "../models/paginated-response";
import { VbtcToken } from "../models/vbtc-token";
import { httpGet } from "../utils/network";
import { vaultStatus, VaultStatus } from "../utils/vbtc-vault";
import { BlockService } from "./block-service";
import { TransactionService } from "./transaction-service";

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

    /** Whether the chain watches this vault, from its mint transaction's height and the chain tip. */
    async vaultStatus(token: VbtcToken): Promise<VaultStatus | null> {
        if (VBTC_RECORD_HEIGHT == null || !token.nft.mintTransaction) return null;
        const [mint, blocks] = await Promise.all([
            new TransactionService().retrieve(token.nft.mintTransaction),
            new BlockService().list(1),
        ]);
        const tip = blocks.results[0]?.height;
        if (!mint.height || !tip) return null;
        return vaultStatus(mint.height, tip);
    }

}
