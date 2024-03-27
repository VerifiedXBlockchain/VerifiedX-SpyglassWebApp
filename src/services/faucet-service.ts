import { API_BASE_URL } from "../constants";
import { Adnr } from "../models/adnr";
import { PaginatedResponse } from "../models/paginated-response";
import { TestnetFaucetInfo } from "../models/testnet-faucet-info";
import { httpGet, httpPost } from "../utils/network";

export class FaucetService {
    async info(): Promise<TestnetFaucetInfo | null> {
        const response = await httpGet(`${API_BASE_URL}/testnet-faucet/request/`, {});
        const data: any = response.parsedBody;
        const info = new TestnetFaucetInfo(data);
        return info;
    }

    async requestFunds(
        address: string,
        amount: number,
    ): Promise<any> {
        const response = await httpPost(`${API_BASE_URL}/testnet-faucet/request/`, {
            address: address,
            amount: amount,
        });
        const data: any = response.parsedBody;
        console.log(data);
        return data;

    }



}
