import { vaultStatus, VaultHeights } from "../vbtc-vault";

const heights = (latestBlockHeight: number | null, overrides: Partial<VaultHeights> = {}): VaultHeights => ({
  recordHeight: 1_172_000,
  enforcementHeight: 1_192_500,
  latestBlockHeight,
  ...overrides,
});
const watched = { is_watched: true };
const legacy = { is_watched: false };

describe("vaultStatus", () => {
  it("says nothing before the chain reaches the record height", () => {
    expect(vaultStatus(legacy, heights(1_171_999))).toBeNull();
  });

  it("says nothing where the network has no record height (mainnet before 9.0)", () => {
    expect(vaultStatus(legacy, heights(9_000_000, { recordHeight: null, enforcementHeight: null }))).toBeNull();
  });

  it("says nothing when Spyglass did not serve the heights or the token's status", () => {
    expect(vaultStatus(watched, null)).toBeNull();
    expect(vaultStatus({ is_watched: null }, heights(1_180_000))).toBeNull();
    expect(vaultStatus(watched, heights(null))).toBeNull();
  });

  it("calls a vault Spyglass says the chain watches watched", () => {
    expect(vaultStatus(watched, heights(1_172_000))).toBe("watched");
    expect(vaultStatus(watched, heights(1_300_000))).toBe("watched");
  });

  it("calls any other vault legacy until the enforcement height", () => {
    expect(vaultStatus(legacy, heights(1_172_000))).toBe("legacy");
    expect(vaultStatus(legacy, heights(1_192_498))).toBe("legacy");
  });

  it("calls a legacy vault frozen once the next block is at the enforcement height", () => {
    expect(vaultStatus(legacy, heights(1_192_499))).toBe("frozen");
  });

  it("never freezes a legacy vault while the enforcement height is unset", () => {
    expect(vaultStatus(legacy, heights(5_000_000, { enforcementHeight: null }))).toBe("legacy");
  });
});
