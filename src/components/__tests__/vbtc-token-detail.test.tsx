import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";
import { VbtcToken } from "../../models/vbtc-token";
import { identityT, mockRouter } from "../../test-utils/mocks";
import { VbtcTokenDetail } from "../vbtc-token-detail";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));
jest.mock("../../hooks/useMediaQuery", () => ({ TABLET_QUERY: "tablet", useMediaQuery: () => true }));

const token = () =>
  new VbtcToken({
    sc_identifier: "0dac78723e6240319785:1790068995",
    name: "Test vault",
    owner_address: "xOwner",
    deposit_address: "tb1qdeposit",
    global_balance: 0.25,
    total_received: 3,
    total_sent: 2,
    tx_count: 7,
    nft: { identifier: "0dac78723e6240319785:1790068995", mint_transaction: "mint" },
  });

describe("VbtcTokenDetail vault status", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/vbtc-token/x" }));
  });

  it("reads as before with no status: global balance and the providers' totals", () => {
    render(<VbtcTokenDetail token={token()} />);
    expect(screen.getByText("detail.fields.globalBalance")).toBeInTheDocument();
    expect(screen.getByText("detail.fields.totalReceived")).toBeInTheDocument();
    expect(screen.getByText("detail.fields.depositAddress")).toBeInTheDocument();
    expect(screen.queryByText("detail.vault.label")).not.toBeInTheDocument();
  });

  it("shows a watched vault's backing and current deposit address, without the providers' totals", () => {
    render(<VbtcTokenDetail token={token()} vault="watched" />);
    expect(screen.getByText("detail.vault.badge.watched")).toBeInTheDocument();
    expect(screen.getByText("detail.vault.explain.watched")).toBeInTheDocument();
    expect(screen.getByText("detail.fields.backing")).toBeInTheDocument();
    expect(screen.getByText("detail.fields.currentDepositAddress")).toBeInTheDocument();
    expect(screen.queryByText("detail.fields.totalReceived")).not.toBeInTheDocument();
    expect(screen.queryByText("detail.fields.txCount")).not.toBeInTheDocument();
  });

  it("badges a legacy vault and keeps its provider totals", () => {
    render(<VbtcTokenDetail token={token()} vault="legacy" />);
    expect(screen.getByText("detail.vault.badge.legacy")).toBeInTheDocument();
    expect(screen.getByText("detail.vault.explain.legacy")).toBeInTheDocument();
    expect(screen.getByText("detail.fields.totalReceived")).toBeInTheDocument();
  });

  it("explains the watched withdrawal lifecycle on a watched vault only", () => {
    const { unmount } = render(<VbtcTokenDetail token={token()} vault="watched" />);
    expect(screen.getByText("detail.withdrawals.watchedLifecycle")).toBeInTheDocument();
    unmount();
    render(<VbtcTokenDetail token={token()} vault="legacy" />);
    expect(screen.queryByText("detail.withdrawals.watchedLifecycle")).not.toBeInTheDocument();
    expect(screen.getByText("detail.withdrawals.empty")).toBeInTheDocument();
  });

  it("badges a frozen legacy vault", () => {
    render(<VbtcTokenDetail token={token()} vault="frozen" />);
    expect(screen.getByText("detail.vault.badge.frozen")).toBeInTheDocument();
    expect(screen.getByText("detail.vault.explain.frozen")).toBeInTheDocument();
  });
});
