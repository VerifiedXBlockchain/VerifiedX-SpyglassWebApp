import { TestnetFaucetInfo } from "../../models/testnet-faucet-info";
import { validateFaucetRequest } from "../faucet-request";

const VFX = "xD5hREu1jsJ4tmDmfYZPYhgQNJMGmMqjP6";
const BTC = "tb1qpy9ngm474wy0n5e96ykqevmgf6hdps06t0gntw";

const info = (btcEnabled = true) =>
  new TestnetFaucetInfo({
    address: "x8NemQSjMUKXaLqbpVU6YNq4P2d6Jbcrra",
    available: 1000,
    min_amount: 0.0001,
    max_amount: 100,
    btc: { enabled: btcEnabled, min_amount: 0.00001, max_amount: 0.01 },
  });

const input = (over: Partial<Record<"address" | "amount" | "btcAddress" | "btcAmount", string>>) => ({
  address: "",
  amount: "",
  btcAddress: "",
  btcAmount: "",
  ...over,
});

describe("validateFaucetRequest", () => {
  it("accepts VFX only, as before", () => {
    const result = validateFaucetRequest(input({ address: VFX, amount: "5" }), info());
    expect(result.valid).toBe(true);
    expect(result.payload).toEqual({ address: VFX, amount: 5, btc_address: "", btc_amount: 0 });
  });

  it("accepts BTC only", () => {
    const result = validateFaucetRequest(input({ btcAddress: BTC, btcAmount: "0.002" }), info());
    expect(result.valid).toBe(true);
    expect(result.payload).toEqual({ address: "", amount: 0, btc_address: BTC, btc_amount: 0.002 });
  });

  it("accepts both in one request", () => {
    const result = validateFaucetRequest(input({ address: VFX, amount: "5", btcAddress: BTC, btcAmount: "0.002" }), info());
    expect(result.valid).toBe(true);
  });

  it("refuses an empty request", () => {
    const result = validateFaucetRequest(input({}), info());
    expect(result.valid).toBe(false);
    expect(result.errors.empty).toBe(true);
  });

  it("checks a part once either of its fields is filled in", () => {
    expect(validateFaucetRequest(input({ btcAddress: BTC }), info()).errors.btcAmount).toBe(true);
    expect(validateFaucetRequest(input({ btcAmount: "0.002" }), info()).errors.btcAddress).toBe(true);
    expect(validateFaucetRequest(input({ amount: "5" }), info()).errors.address).toBe(true);
  });

  it("refuses a VFX address or a mainnet address in the BTC field, and amounts over the limit", () => {
    expect(validateFaucetRequest(input({ btcAddress: VFX, btcAmount: "0.002" }), info()).errors.btcAddress).toBe(true);
    expect(validateFaucetRequest(input({ btcAddress: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq", btcAmount: "0.002" }), info()).errors.btcAddress).toBe(true);
    expect(validateFaucetRequest(input({ btcAddress: BTC, btcAmount: "0.02" }), info()).errors.btcAmount).toBe(true);
  });

  it("ignores the BTC fields when the faucet doesn't offer BTC", () => {
    const result = validateFaucetRequest(input({ btcAddress: BTC, btcAmount: "0.002" }), info(false));
    expect(result.errors.empty).toBe(true);
    expect(result.payload.btc_amount).toBe(0);
  });

  it("reads an API answer without a btc block as BTC disabled", () => {
    expect(new TestnetFaucetInfo({ address: "x", available: 1, min_amount: 0, max_amount: 1 }).btc.enabled).toBe(false);
  });
});
