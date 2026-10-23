import { TestnetFaucetInfo } from "../models/testnet-faucet-info";

/** Signet uses testnet address formats: bech32/bech32m "tb1…", base58 "m…"/"n…" (P2PKH) and "2…" (P2SH). */
const SIGNET_ADDRESS_RE = /^(tb1[02-9ac-hj-np-z]{8,87}|[mn2][1-9A-HJ-NP-Za-km-z]{25,34})$/;

export interface FaucetRequestInput {
    address: string;
    amount: string;
    btcAddress: string;
    btcAmount: string;
}

export interface FaucetRequestPayload {
    address: string;
    amount: number;
    btc_address: string;
    btc_amount: number;
    phone: string;
}

export interface FaucetRequestErrors {
    address: boolean;
    amount: boolean;
    btcAddress: boolean;
    btcAmount: boolean;
    /** Nothing was asked for: neither part was filled in. */
    empty: boolean;
}

/**
 * Checks the two optional parts of a faucet request: VFX (address + amount) and, when the faucet offers it,
 * signet BTC (address + amount). A part counts once either of its fields is filled in, and then both must be
 * valid. At least one part is required.
 */
export const validateFaucetRequest = (input: FaucetRequestInput, info: TestnetFaucetInfo) => {
    const errors: FaucetRequestErrors = { address: false, amount: false, btcAddress: false, btcAmount: false, empty: false };
    const address = input.address.trim();
    const btcAddress = input.btcAddress.trim();
    const wantsVfx = address !== "" || input.amount.trim() !== "";
    const wantsBtc = info.btc.enabled && (btcAddress !== "" || input.btcAmount.trim() !== "");

    const amount = wantsVfx ? parseFloat(input.amount) : 0;
    if (wantsVfx) {
        errors.address = address.length !== 34 || address[0].toUpperCase() !== "X";
        errors.amount = !amount || amount <= info.minAmount || amount > info.maxAmount;
    }

    const btcAmount = wantsBtc ? parseFloat(input.btcAmount) : 0;
    if (wantsBtc) {
        errors.btcAddress = !SIGNET_ADDRESS_RE.test(btcAddress);
        errors.btcAmount = !btcAmount || btcAmount < info.btc.minAmount || btcAmount > info.btc.maxAmount;
    }

    errors.empty = !wantsVfx && !wantsBtc;
    const valid = !errors.address && !errors.amount && !errors.btcAddress && !errors.btcAmount && !errors.empty;
    const payload: Omit<FaucetRequestPayload, "phone"> = {
        address: wantsVfx ? address : "",
        amount: wantsVfx ? amount : 0,
        btc_address: wantsBtc ? btcAddress : "",
        btc_amount: wantsBtc ? btcAmount : 0,
    };
    return { valid, errors, payload };
};
