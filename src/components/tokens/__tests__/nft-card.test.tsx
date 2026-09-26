import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { Nft } from "../../../models/nft";
import { identityT, mockRouter } from "../../../test-utils/mocks";
import { NftCard } from "../../nft-card";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));

const nft = (overrides: Record<string, unknown> = {}) =>
  new Nft({
    identifier: "9f15926a6a104dcf8738769aced2ede2:1783739084",
    name: "PulseXai Trade Receipt",
    owner_address: "RU3XgUWc8M9vCVFzAw1ae9hjzYhgFmbGnj",
    minter_address: "RM3bENZxNC45p7iV9htHbVwkoqBV7ajNuh",
    mint_transaction: "54e61f742d8b25bcb8854e6cea941399da640f71194e49f996ddc50471d2ce48",
    minted_at: "2026-09-14T16:32:07Z",
    is_burned: false,
    ...overrides,
  });

describe("NftCard", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/nfts" }));
  });

  it("links the title to the NFT page and the mint tx to its transaction", () => {
    render(<NftCard nft={nft()} />);
    expect(screen.getByRole("link", { name: "PulseXai Trade Receipt" })).toHaveAttribute("href", "/nfts/9f15926a6a104dcf8738769aced2ede2:1783739084");
    expect(screen.getByTitle("54e61f742d8b25bcb8854e6cea941399da640f71194e49f996ddc50471d2ce48")).toHaveAttribute(
      "href",
      "/transaction/54e61f742d8b25bcb8854e6cea941399da640f71194e49f996ddc50471d2ce48"
    );
    expect(screen.getByText("card.active")).toBeInTheDocument();
  });

  it("marks burned NFTs", () => {
    render(<NftCard nft={nft({ is_burned: true })} />);
    expect(screen.getByText("card.burned")).toBeInTheDocument();
  });
});
