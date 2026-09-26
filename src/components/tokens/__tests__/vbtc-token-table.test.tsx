import { render, screen, within } from "@testing-library/react";
import { useRouter } from "next/router";
import { VbtcToken } from "../../../models/vbtc-token";
import { identityT, mockRouter } from "../../../test-utils/mocks";
import { VbtcTokenTable } from "../vbtc-token-table";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));

const token = (overrides: Record<string, unknown> = {}) =>
  new VbtcToken({
    sc_identifier: "158f63c10f5e46f39a1926080433cbea:1790068995",
    name: "Bfly vBTC RXXL4L9q",
    owner_address: "RXXL4L9qaFtKPSZkWV7bUg1AaUftLNSN1w",
    image_url: "https://example.test/token.gif",
    global_balance: 1.5,
    created_at: "2026-09-14T16:32:07Z",
    nft: { identifier: "158f63c10f5e46f39a1926080433cbea:1790068995", name: "Bfly vBTC RXXL4L9q" },
    ...overrides,
  });

describe("VbtcTokenTable", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/vbtc-token", locale: "es" }));
  });

  it("links each token to its localized detail page and shows the balance in vBTC", () => {
    render(<VbtcTokenTable tokens={[token()]} />);
    const row = screen.getByRole("row", { name: /Bfly vBTC/ });
    expect(within(row).getByRole("link", { name: "Bfly vBTC RXXL4L9q" })).toHaveAttribute("href", "/es/vbtc-token/158f63c10f5e46f39a1926080433cbea:1790068995");
    expect(within(row).getByText("1.5")).toBeInTheDocument();
    expect(within(row).getByText("vBTC")).toBeInTheDocument();
  });

  it("links the owner to the address search", () => {
    render(<VbtcTokenTable tokens={[token()]} />);
    expect(screen.getByTitle("RXXL4L9qaFtKPSZkWV7bUg1AaUftLNSN1w")).toHaveAttribute("href", "/es/search?q=RXXL4L9qaFtKPSZkWV7bUg1AaUftLNSN1w");
  });

  it("shows the empty label instead of a blank table", () => {
    render(<VbtcTokenTable tokens={[]} />);
    expect(screen.getByText("list.empty")).toBeInTheDocument();
  });
});
