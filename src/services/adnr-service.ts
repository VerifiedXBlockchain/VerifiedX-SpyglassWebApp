import { API_BASE_URL } from "../constants";
import { Adnr } from "../models/adnr";
import { PaginatedResponse } from "../models/paginated-response";
import { httpGet } from "../utils/network";

export class AdnrService {
    async retrieve(id: string): Promise<Adnr> {
        const response = await httpGet(`${API_BASE_URL}/adnr/${id}`, {});
        const data: any = response.parsedBody;

        return new Adnr(data);
    }

    async list(
        page: number = 1,
        params: any = {}
    ): Promise<PaginatedResponse<Adnr>> {
        const response = await httpGet(`${API_BASE_URL}/adnr/`, {
            page: page,
            ...params,
        });
        const data: any = response.parsedBody;

        const results = [];

        for (let result of data["results"]) {
            results.push(new Adnr(result));
        }

        return new PaginatedResponse<Adnr>(
            data["count"],
            data["page"],
            data["num_pages"],
            results
        );
    }



}
