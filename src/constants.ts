export const IS_TESTNET = process.env.NEXT_PUBLIC_IS_TESTNET || false;
export const IS_DEVNET = process.env.NEXT_PUBLIC_IS_DEVNET || false;
// export const IS_TESTNET = process.env.NEXT_PUBLIC_IS_TESTNET == "true" ? true : false;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || (IS_DEVNET ? "https://devnet-data.rbx.network/api" : IS_TESTNET ? "https://testnet-data.rbx.network/api" : "https://data.rbx.network/api");
export const SOCKET_HOST = process.env.NEXT_PUBLIC_SOCKET_HOST || "https://web-6616-56d67ef0-xroythiw.onporter.run/";
// export const API_BASE_URL = "http://127.0.0.1:8000/api";



export const MAINTENENCE_MODE = process.env.NEXT_PUBLIC_MAINTENENCE_MODE == "true" ? true : false;

export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://spyglass.verifiedx.io";

/** VerifiedX's private Bitcoin signet: the Bitcoin network vBTC uses on the VFX testnet. */
export const SIGNET_EXPLORER_BASE = "https://signet.verifiedx.io";

/** True when this build's Bitcoin explorer is the VFX signet (testnet only; devnet stays on testnet4). */
export const BTC_IS_SIGNET = !IS_DEVNET && !!IS_TESTNET;

/**
 * Bitcoin explorer for the network vBTC uses here, without a trailing slash: mempool.space on mainnet,
 * the VFX signet explorer on testnet, mempool.space/testnet4 on devnet. Links are `${MEMPOOL_BASE}/tx/<txid>`,
 * `/address/<addr>`, `/block/<hash>`. NEXT_PUBLIC_BTC_EXPLORER_URL overrides it.
 */
export const MEMPOOL_BASE = (
  process.env.NEXT_PUBLIC_BTC_EXPLORER_URL ||
  (IS_DEVNET ? "https://mempool.space/testnet4" : IS_TESTNET ? SIGNET_EXPLORER_BASE : "https://mempool.space")
).replace(/\/+$/, "");

/** VerifiedX Live: the real-time 3D globe of validators, blocks and transactions. */
export const LIVE_SITE_URL = "https://live.verifiedx.io";

export const SENTINEL_ADDRESSES: Record<string, string> = {
  "Shielded_Pool": "Shielded Pool",
  "TW_Base": "Token Withdrawal Base",
};

