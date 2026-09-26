import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { NetworkOverview } from "../network-overview";
import { Block } from "../../../models/block";
import { Circulation } from "../../../models/circulation";
import { NetworkMetrics } from "../../../models/network_metrics";
import { identityT, mockRouter } from "../../../test-utils/mocks";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));

const retrieveMetrics = jest.fn();
const retrieveCirculation = jest.fn();
jest.mock("../../../services/network-metrics-service", () => ({
  NetworkMetricsService: jest.fn().mockImplementation(() => ({ retrieve: retrieveMetrics })),
}));
jest.mock("../../../services/circulation-service", () => ({
  CirculationService: jest.fn().mockImplementation(() => ({ retrieve: retrieveCirculation })),
}));

describe("NetworkOverview", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/" }));
    retrieveMetrics.mockReset();
    retrieveCirculation.mockReset();
  });

  it("shows block timing and validator count once loaded", async () => {
    retrieveMetrics.mockResolvedValue(new NetworkMetrics({ block_difference_average: 12.57, block_last_delay: 11 }));
    retrieveCirculation.mockResolvedValue(new Circulation({ active_master_nodes: 160 }));
    render(<NetworkOverview />);
    expect(await screen.findByText("12.6")).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(screen.getByText("160")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "overview.checkStatus" })).toHaveAttribute("href", "/validators/search");
  });

  it("marks tiles unavailable when an endpoint fails instead of leaving them blank", async () => {
    retrieveMetrics.mockRejectedValue(new Error("404"));
    retrieveCirculation.mockResolvedValue(new Circulation({ active_master_nodes: 3 }));
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    render(<NetworkOverview />);
    expect(await screen.findAllByText("overview.unavailable")).toHaveLength(2);
    expect(screen.getByText("3")).toBeInTheDocument();
    consoleError.mockRestore();
  });

  it("shows the latest block height with a live timestamp", async () => {
    retrieveMetrics.mockResolvedValue(new NetworkMetrics({ block_difference_average: 12, block_last_delay: 11 }));
    retrieveCirculation.mockResolvedValue(new Circulation({ active_master_nodes: 160 }));
    const block = new Block({ height: 7381935, hash: "abc", date_crafted: new Date(Date.now() - 14000).toISOString(), transactions: [] });
    render(<NetworkOverview latestBlock={block} />);
    expect(await screen.findByText("7,381,935")).toBeInTheDocument();
    expect(screen.getByText(/14/)).toBeInTheDocument();
  });
});
