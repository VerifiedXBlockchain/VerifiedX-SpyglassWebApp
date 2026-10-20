import { render, screen, within } from "@testing-library/react";
import { useRouter } from "next/router";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { VbtcWithdrawal } from "../../../models/vbtc-token";
import { identityT, mockRouter } from "../../../test-utils/mocks";
import { VbtcWithdrawals } from "../vbtc-withdrawals";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({ useTranslation: () => ({ t: (key: string) => identityT(key) }) }));
jest.mock("../../../hooks/useMediaQuery", () => ({ TABLET_QUERY: "tablet", useMediaQuery: jest.fn() }));

const PAID_TXID = "588473dece9364b2e177ee008c44df1f8b2e48d3310417a110e3c0958727c9fe";

const withdrawal = (overrides: Record<string, unknown> = {}) =>
  new VbtcWithdrawal({
    id: 23,
    requestor_address: "xMjrfrzkrNC2g3KJidbwF21gB7R3m46B9w",
    btc_address: "tb1qrdch62tavgpq7jc6zx096mltyfuxkl4rptxuqx",
    amount: 0.0001,
    fee_rate: 2,
    btc_transaction_hash: "",
    status: "requested",
    request_transaction_hash: "790c5b62a5e91bb10ed742f35d31f20af705bfa0c37714293b6bc295dbc0f041",
    completion_transaction_hash: null,
    created_at: "2026-09-28T21:00:07Z",
    ...overrides,
  });

const paid = () =>
  withdrawal({
    id: 22,
    status: "completed",
    btc_transaction_hash: PAID_TXID,
    completion_transaction_hash: "5c7d6a7b3231a5c7bc80730c21073b9a828935aba364bdb556e5c9e133b83d1a",
    completed_at: "2026-09-28T21:01:31Z",
  });

describe("VbtcWithdrawals", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter({ pathname: "/vbtc-token/x", locale: "es" }));
  });

  describe("table (tablet and up)", () => {
    beforeEach(() => (useMediaQuery as jest.Mock).mockReturnValue(true));

    it("shows each withdrawal's stage", () => {
      render(<VbtcWithdrawals withdrawals={[withdrawal(), paid(), withdrawal({ id: 21, status: "cancelled" })]} />);
      expect(screen.getByText("detail.withdrawals.stage.open")).toBeInTheDocument();
      expect(screen.getByText("detail.withdrawals.stage.paid")).toBeInTheDocument();
      expect(screen.getByText("detail.withdrawals.stage.closed")).toBeInTheDocument();
    });

    it("links a paid withdrawal's Bitcoin transaction and the destination to mempool.space in a new tab", () => {
      render(<VbtcWithdrawals withdrawals={[paid()]} />);
      const tx = screen.getByTitle(PAID_TXID);
      expect(tx).toHaveAttribute("href", `https://mempool.space/tx/${PAID_TXID}`);
      expect(tx).toHaveAttribute("target", "_blank");
      expect(screen.getByTitle("tb1qrdch62tavgpq7jc6zx096mltyfuxkl4rptxuqx")).toHaveAttribute(
        "href",
        "https://mempool.space/address/tb1qrdch62tavgpq7jc6zx096mltyfuxkl4rptxuqx",
      );
    });

    it("links the request and the recording transaction to their localized pages", () => {
      render(<VbtcWithdrawals withdrawals={[paid()]} />);
      const row = screen.getAllByRole("row")[1];
      expect(within(row).getByTitle(paid().request_transaction_hash)).toHaveAttribute("href", `/es/transaction/${paid().request_transaction_hash}`);
      expect(within(row).getByTitle(paid().completion_transaction_hash as string)).toHaveAttribute(
        "href",
        `/es/transaction/${paid().completion_transaction_hash}`,
      );
    });

    it("shows the requested fee rate and no Bitcoin link for an open withdrawal", () => {
      render(<VbtcWithdrawals withdrawals={[withdrawal()]} />);
      expect(screen.getByText("detail.withdrawals.feeRate")).toBeInTheDocument();
      expect(screen.queryByRole("link", { name: /588473/ })).not.toBeInTheDocument();
    });

    it("says so when the vault has no withdrawals", () => {
      render(<VbtcWithdrawals withdrawals={[]} />);
      expect(screen.getByText("detail.withdrawals.empty")).toBeInTheDocument();
    });

    it("lists the newest request first", () => {
      const older = withdrawal({ id: 1, request_transaction_hash: "a".repeat(64), created_at: "2026-08-12T02:10:20Z" });
      const newer = withdrawal({ id: 2, request_transaction_hash: "b".repeat(64), created_at: "2026-09-28T21:00:07Z" });
      render(<VbtcWithdrawals withdrawals={[older, newer]} />);
      const rows = screen.getAllByRole("row");
      expect(within(rows[1]).getByTitle("b".repeat(64))).toBeInTheDocument();
      expect(within(rows[2]).getByTitle("a".repeat(64))).toBeInTheDocument();
    });
  });

  describe("compact list (phones)", () => {
    beforeEach(() => (useMediaQuery as jest.Mock).mockReturnValue(false));

    it("shows the stage and the mempool.space link", () => {
      render(<VbtcWithdrawals withdrawals={[paid()]} />);
      expect(screen.getByText("detail.withdrawals.stage.paid")).toBeInTheDocument();
      expect(screen.getByTitle(PAID_TXID)).toHaveAttribute("href", `https://mempool.space/tx/${PAID_TXID}`);
    });

    it("says so when the vault has no withdrawals", () => {
      render(<VbtcWithdrawals withdrawals={[]} />);
      expect(screen.getByText("detail.withdrawals.empty")).toBeInTheDocument();
    });
  });
});
