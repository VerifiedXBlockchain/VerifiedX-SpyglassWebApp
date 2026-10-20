import { httpGet } from "../../utils/network";
import { VbtcTokenService } from "../vbtc-service";

jest.mock("../../constants", () => ({ API_BASE_URL: "https://api.test" }));
jest.mock("../../utils/network", () => ({ httpGet: jest.fn() }));

const answer = (body: unknown, ok = true, status = 200) => (httpGet as jest.Mock).mockResolvedValue({ ok, status, parsedBody: body });

describe("VbtcTokenService.heights", () => {
  it("reads the network's attestation heights from Spyglass", async () => {
    answer({ record_height: 1_172_000, enforcement_height: 1_192_500, latest_block_height: 1_172_400 });
    await expect(new VbtcTokenService().heights()).resolves.toEqual({
      recordHeight: 1_172_000,
      enforcementHeight: 1_192_500,
      latestBlockHeight: 1_172_400,
    });
    expect(httpGet).toHaveBeenCalledWith("https://api.test/btc/vbtc-v2/heights/", {});
  });

  it("keeps a height Core has not set as null", async () => {
    answer({ record_height: null, enforcement_height: null, latest_block_height: 7_500_000 });
    await expect(new VbtcTokenService().heights()).resolves.toEqual({ recordHeight: null, enforcementHeight: null, latestBlockHeight: 7_500_000 });
  });

  it("fails when Spyglass does not serve the heights", async () => {
    answer({ detail: "Not found." }, false, 404);
    await expect(new VbtcTokenService().heights()).rejects.toThrow("HTTP 404");
  });
});
