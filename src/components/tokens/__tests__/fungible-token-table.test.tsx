import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { FungibleToken } from "../../../models/fungible-token";
import { identityT, mockRouter } from "../../../test-utils/mocks";
import { FungibleTokenTable } from "../fungible-token-table";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));

const token = (overrides: Partial<FungibleToken> = {}) =>
  new FungibleToken({
    sc_identifier: "1ca4c664d5bd4657ac9b94c1905e0847:1789403529",
    name: "Butterfly Receipt",
    ticker: "BFLY",
    owner_address: "RU3XgUWc8M9vCVFzAw1ae9hjzYhgFmbGnj",
    circulating_supply: 1250000,
    image_url: "https://example.test/bfly.png",
    ...overrides,
  });

describe("FungibleTokenTable", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/fungible-token" }));
  });

  it("shows ticker, name and a thousands-separated supply", () => {
    render(<FungibleTokenTable tokens={[token()]} />);
    expect(screen.getByRole("link", { name: "BFLY" })).toHaveAttribute("href", "/fungible-token/1ca4c664d5bd4657ac9b94c1905e0847:1789403529");
    expect(screen.getByText("Butterfly Receipt")).toBeInTheDocument();
    expect(screen.getByText("1,250,000")).toBeInTheDocument();
  });

  it("flags paused tokens and hides NSFW artwork", () => {
    render(<FungibleTokenTable tokens={[token({ is_paused: true, nsfw: true })]} />);
    expect(screen.getByText("list.paused")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "detail.nsfw" })).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: "Butterfly Receipt" })).not.toBeInTheDocument();
  });
});
