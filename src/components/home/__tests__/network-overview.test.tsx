import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/router";
import { NetworkOverview } from "../network-overview";
import { Block } from "../../../models/block";
import { NetworkMetrics } from "../../../models/network_metrics";
import { PaginatedResponse } from "../../../models/paginated-response";
import { Validator } from "../../../models/validator";
import { identityT, mockRouter } from "../../../test-utils/mocks";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));

const retrieveMetrics = jest.fn();
const listValidators = jest.fn();
jest.mock("../../../services/network-metrics-service", () => ({
  NetworkMetricsService: jest.fn().mockImplementation(() => ({ retrieve: retrieveMetrics })),
}));
jest.mock("../../../services/validator-service", () => ({
  ValidatorService: jest.fn().mockImplementation(() => ({ list: listValidators })),
}));

const NOW = Date.now();
const block = (height: number, secondsAgo: number) =>
  new Block({ height, hash: `h${height}`, date_crafted: new Date(NOW - secondsAgo * 1000).toISOString(), transactions: [] });
// Newest first: 7,381,935 just now, then one every 12 seconds.
const BLOCKS = [block(7381935, 14), block(7381934, 26), block(7381933, 38), block(7381932, 50)];

describe("NetworkOverview", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/" }));
    retrieveMetrics.mockReset();
    listValidators.mockReset();
    listValidators.mockResolvedValue(new PaginatedResponse<Validator>(160, 1, 1, []));
  });

  it("prefers the indexer's rolling average when the metrics endpoint answers", async () => {
    retrieveMetrics.mockResolvedValue(new NetworkMetrics({ block_difference_average: 12.57, block_last_delay: 11 }));
    render(<NetworkOverview blocks={BLOCKS} />);
    expect(await screen.findByText("12.6")).toBeInTheDocument();
    expect(screen.getByText("overview.avgBlockTimeSub")).toBeInTheDocument();
    expect(screen.getByText("160")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "overview.checkStatus" })).toHaveAttribute("href", "/validators/search");
  });

  it("derives block timing from the loaded blocks when the metrics endpoint fails", async () => {
    retrieveMetrics.mockRejectedValue(new Error("500"));
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    render(<NetworkOverview blocks={BLOCKS} />);
    // 36 seconds across 3 intervals = 12 s average; newest two are 12 s apart.
    expect(await screen.findAllByText("12")).toHaveLength(2);
    expect(screen.getByText("overview.avgBlockTimeComputedSub")).toBeInTheDocument();
    expect(screen.queryByText("overview.unavailable")).not.toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("only says unavailable when neither the API nor the blocks can answer", async () => {
    retrieveMetrics.mockRejectedValue(new Error("500"));
    listValidators.mockRejectedValue(new Error("500"));
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    render(<NetworkOverview blocks={[BLOCKS[0]]} />);
    // The two requests settle independently; wait for all three tiles rather than the first.
    await waitFor(() => expect(screen.getAllByText("overview.unavailable")).toHaveLength(3));
    consoleError.mockRestore();
  });

  it("shows the latest block height with a live timestamp", async () => {
    retrieveMetrics.mockResolvedValue(new NetworkMetrics({ block_difference_average: 12, block_last_delay: 11 }));
    render(<NetworkOverview blocks={BLOCKS} />);
    expect(await screen.findByText("7,381,935")).toBeInTheDocument();
    expect(screen.getByText(/14/)).toBeInTheDocument();
  });
});
