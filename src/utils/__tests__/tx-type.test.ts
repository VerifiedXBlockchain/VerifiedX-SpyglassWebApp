import { txTypeTone } from "../tx-type";

describe("txTypeTone", () => {
  it("gives the vBTC bridge types (39 to 42) the Bitcoin tone", () => {
    for (const type of [39, 40, 41, 42]) expect(txTypeTone(type)).toBe("btc");
  });

  it("gives the Bitcoin attestation types (43 to 46) the Bitcoin tone", () => {
    for (const type of [43, 44, 45, 46]) expect(txTypeTone(type)).toBe("btc");
  });

  it("keeps an unknown type neutral", () => {
    expect(txTypeTone(47)).toBe("neutral");
    expect(txTypeTone(24)).toBe("neutral");
  });
});
