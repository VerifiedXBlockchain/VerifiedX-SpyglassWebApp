import { API_BASE_URL } from "../constants";
import { Adnr } from "../models/adnr";
import { PaginatedResponse } from "../models/paginated-response";
import { TestnetFaucetInfo } from "../models/testnet-faucet-info";
import { httpGet, httpPost } from "../utils/network";

export class FaucetService {
    async info(): Promise<TestnetFaucetInfo | null> {
        const response = await httpGet(`${API_BASE_URL}/faucet/request/`, {});
        const data: any = response.parsedBody;
        const info = new TestnetFaucetInfo(data);
        return info;
    }

    async requestFunds(
        address: string,
        amount: number,
        phone: string,
    ): Promise<any> {
        const response = await httpPost(`${API_BASE_URL}/faucet/request/`, {
            address: address,
            amount: amount,
            phone: phone,
        });
        const data: any = response.parsedBody;
        console.log(data);
        return data;

    }

    async verify(
        uuid: string,
        code: string,
    ): Promise<any> {
        const response = await httpPost(`${API_BASE_URL}/faucet/verify/`, {
            uuid: uuid,
            verification_code: code
        });
        const data: any = response.parsedBody;
        console.log(data);
        return data;

    }



}
