export class NetworkMetrics {
    blockDifferenceAverage: number;
    blockLastReceived: Date;
    blockLastDelay: number;
    timeSinceLastBlock: number;
    blocksAverages: string;

    constructor(d: any) {
        this.blockDifferenceAverage = d["block_difference_average"];
        this.blockLastReceived = d["block_last_received"];
        this.blockLastDelay = d["block_last_delay"];
        this.timeSinceLastBlock = d["time_since_last_block"];
        this.blocksAverages = d["blocks_averages"];

    }
}
