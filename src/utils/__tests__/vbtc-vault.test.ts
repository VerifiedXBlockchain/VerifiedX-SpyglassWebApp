import { vaultStatus } from "../vbtc-vault";

const gates = { recordHeight: 1_172_000, enforcementHeight: 1_192_500 };

describe("vaultStatus", () => {
  it("says nothing before the chain reaches the record height", () => {
    expect(vaultStatus(1_171_990, 1_171_999, gates)).toBeNull();
  });

  it("says nothing where the network has no record height", () => {
    expect(vaultStatus(5, 9_000_000, { recordHeight: null, enforcementHeight: null })).toBeNull();
  });

  it("calls a vault minted at or above the record height watched", () => {
    expect(vaultStatus(1_172_000, 1_172_000, gates)).toBe("watched");
    expect(vaultStatus(1_180_000, 1_200_000, gates)).toBe("watched");
  });

  it("calls an older vault legacy until the enforcement height", () => {
    expect(vaultStatus(1_024_808, 1_172_000, gates)).toBe("legacy");
    expect(vaultStatus(1_024_808, 1_192_498, gates)).toBe("legacy");
  });

  it("calls an older vault frozen once the next block is at the enforcement height", () => {
    expect(vaultStatus(1_024_808, 1_192_499, gates)).toBe("frozen");
    expect(vaultStatus(1_171_999, 1_300_000, gates)).toBe("frozen");
  });
});
