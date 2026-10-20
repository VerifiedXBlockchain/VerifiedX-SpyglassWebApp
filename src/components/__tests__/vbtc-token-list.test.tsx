import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { VbtcToken } from "../../models/vbtc-token";
import { identityT, mockRouter } from "../../test-utils/mocks";
import { VbtcTokenList } from "../vbtc-token-list";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));
jest.mock("../../hooks/useMediaQuery", () => ({ TABLET_QUERY: "tablet", useMediaQuery: () => false }));

describe("VbtcTokenList on phones", () => {
  it("badges a watched vault in the compact row", () => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/vbtc-token" }));
    const token = new VbtcToken({ sc_identifier: "sc:1", name: "Vault", owner_address: "xOwner", global_balance: 0.1, is_watched: true, nft: {} });
    render(<VbtcTokenList tokens={[token]} heights={{ recordHeight: 1_172_000, enforcementHeight: 1_192_500, latestBlockHeight: 1_180_000 }} />);
    expect(screen.getByText("detail.vault.badge.watched")).toBeInTheDocument();
  });
});
