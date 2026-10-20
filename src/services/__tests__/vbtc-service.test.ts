import { VbtcToken } from "../../models/vbtc-token";
import { BlockService } from "../block-service";
import { TransactionService } from "../transaction-service";
import { VbtcTokenService } from "../vbtc-service";

jest.mock("../../constants", () => ({
  API_BASE_URL: "https://api.test",
  VBTC_RECORD_HEIGHT: 1_172_000,
  VBTC_ENFORCEMENT_HEIGHT: 1_192_500,
}));
jest.mock("../block-service");
jest.mock("../transaction-service");

const token = (mint: string | null = "minthash") => new VbtcToken({ sc_identifier: "sc", nft: { mint_transaction: mint } });

const givenChain = (mintHeight: number, tip: number) => {
  (TransactionService as jest.Mock).mockImplementation(() => ({ retrieve: jest.fn().mockResolvedValue({ height: mintHeight }) }));
  (BlockService as jest.Mock).mockImplementation(() => ({ list: jest.fn().mockResolvedValue({ results: [{ height: tip }] }) }));
};

describe("VbtcTokenService.vaultStatus", () => {
  it("reads the mint transaction's height against the chain tip", async () => {
    givenChain(1_180_000, 1_190_000);
    await expect(new VbtcTokenService().vaultStatus(token())).resolves.toBe("watched");
    givenChain(1_024_808, 1_190_000);
    await expect(new VbtcTokenService().vaultStatus(token())).resolves.toBe("legacy");
    givenChain(1_024_808, 1_192_499);
    await expect(new VbtcTokenService().vaultStatus(token())).resolves.toBe("frozen");
  });

  it("gives no status for a token without a mint transaction", async () => {
    givenChain(1_180_000, 1_190_000);
    await expect(new VbtcTokenService().vaultStatus(token(null))).resolves.toBeNull();
  });
});
