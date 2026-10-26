import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { VbtcToken } from "../../models/vbtc-token";
import { identityT, mockRouter } from "../../test-utils/mocks";
import { VbtcTokenList } from "../vbtc-token-list";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));
jest.mock("../../hooks/useMediaQuery", () => ({ TABLET_QUERY: "tablet", useMediaQuery: () => false }));

describe("VbtcTokenList on phones", () => {
  it("lists funded vaults with their owner and no vault status badge", () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/vbtc-token" }));
    const funded = new VbtcToken({ sc_identifier: "sc:1", name: "Vault", owner_address: "xOwner", global_balance: 0.1, is_watched: false, nft: {} });
    const empty = new VbtcToken({ sc_identifier: "sc:2", name: "Empty vault", owner_address: "xOther", global_balance: 0, is_watched: true, nft: {} });
    render(<VbtcTokenList tokens={[funded, empty]} />);
    expect(screen.getByText("Vault")).toBeInTheDocument();
    expect(screen.getByText("xOwner")).toBeInTheDocument();
    expect(screen.queryByText("Empty vault")).not.toBeInTheDocument();
    expect(screen.queryByText(/detail\.vault\./)).not.toBeInTheDocument();
  });
});
