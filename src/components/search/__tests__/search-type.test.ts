import { classifyQuery, defaultTab } from "../search-type";

const mainnet = { testnet: false, devnet: false };
const testnet = { testnet: true, devnet: false };

describe("classifyQuery", () => {
  it("recognises mainnet addresses by length and R prefix", () => {
    expect(classifyQuery("RRe6iMqiJMphVTDshjtnkJyGfwatVQzhrV", mainnet)).toBe("address");
    expect(classifyQuery("  RRe6iMqiJMphVTDshjtnkJyGfwatVQzhrV  ", mainnet)).toBe("address");
  });

  it("recognises test-network addresses by X prefix and legacy xRBX addresses anywhere", () => {
    expect(classifyQuery("XRe6iMqiJMphVTDshjtnkJyGfwatVQzhrV", testnet)).toBe("address");
    expect(classifyQuery("XRe6iMqiJMphVTDshjtnkJyGfwatVQzhrV", mainnet)).toBe("hash");
    expect(classifyQuery("xRBXiMqiJMphVTDshjtnkJyGfwatVQzhrV", mainnet)).toBe("address");
  });

  it("treats a bare number as a block height", () => {
    expect(classifyQuery("7381925", mainnet)).toBe("blockHeight");
    expect(classifyQuery("7381925a", mainnet)).toBe("hash");
  });

  it("treats domain-looking values as ADNR lookups", () => {
    expect(classifyQuery("tyler.rbx", mainnet)).toBe("adnr");
    expect(classifyQuery("Tyler.VFX", mainnet)).toBe("adnr");
    expect(classifyQuery("tyler.btc", mainnet)).toBe("adnr");
  });

  it("falls back to hash for everything else", () => {
    expect(classifyQuery("e9ece09fc19865d3dd8b8c797d6a4ad69191325a79efafc3a5d9473328e2effa", mainnet)).toBe("hash");
  });
});

describe("defaultTab", () => {
  it("opens blocks for a height and transactions otherwise", () => {
    expect(defaultTab("blockHeight")).toBe("blocks");
    expect(defaultTab("address")).toBe("transactions");
    expect(defaultTab("hash")).toBe("transactions");
  });
});
