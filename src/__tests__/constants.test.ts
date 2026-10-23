export {};

const NETWORK_ENV = ["NEXT_PUBLIC_IS_TESTNET", "NEXT_PUBLIC_IS_DEVNET", "NEXT_PUBLIC_BTC_EXPLORER_URL"];

const loadConstants = (env: Record<string, string>) => {
  const saved = { ...process.env };
  NETWORK_ENV.forEach((key) => delete process.env[key]);
  Object.assign(process.env, env);
  let constants: typeof import("../constants") | undefined;
  jest.isolateModules(() => {
    constants = require("../constants");
  });
  process.env = saved;
  if (!constants) throw new Error("constants module failed to load");
  return constants;
};

describe("Bitcoin explorer base", () => {
  it("stays on mempool.space on mainnet", () => {
    const { MEMPOOL_BASE, BTC_IS_SIGNET } = loadConstants({});
    expect(MEMPOOL_BASE).toBe("https://mempool.space");
    expect(BTC_IS_SIGNET).toBe(false);
  });

  it("uses the VFX signet explorer on testnet", () => {
    const { MEMPOOL_BASE, BTC_IS_SIGNET } = loadConstants({ NEXT_PUBLIC_IS_TESTNET: "true" });
    expect(MEMPOOL_BASE).toBe("https://signet.verifiedx.io");
    expect(BTC_IS_SIGNET).toBe(true);
  });

  it("keeps devnet on mempool.space testnet4", () => {
    const { MEMPOOL_BASE, BTC_IS_SIGNET } = loadConstants({ NEXT_PUBLIC_IS_DEVNET: "true", NEXT_PUBLIC_IS_TESTNET: "true" });
    expect(MEMPOOL_BASE).toBe("https://mempool.space/testnet4");
    expect(BTC_IS_SIGNET).toBe(false);
  });

  it("honours NEXT_PUBLIC_BTC_EXPLORER_URL and drops a trailing slash", () => {
    const { MEMPOOL_BASE } = loadConstants({ NEXT_PUBLIC_IS_TESTNET: "true", NEXT_PUBLIC_BTC_EXPLORER_URL: "https://btc.example.test/" });
    expect(MEMPOOL_BASE).toBe("https://btc.example.test");
  });
});
