import { API_BASE_URL } from "../constants";
import { NetworkMetrics } from "../models/network_metrics";
import { httpGet } from "../utils/network";

export class NetworkMetricsService {
    async retrieve(): Promise<NetworkMetrics> {
        const response = await httpGet(`${API_BASE_URL}/network-metrics`, {});
        const data: any = response.parsedBody;

        return new NetworkMetrics(data);
    }

}
