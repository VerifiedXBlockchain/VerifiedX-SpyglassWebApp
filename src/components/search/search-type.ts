import { IS_DEVNET, IS_TESTNET } from "../../constants";

export type SearchType = "address" | "hash" | "blockHeight" | "adnr";
export type ResultTab = "transactions" | "blocks";

const ADDRESS_LENGTH = 34;
const DOMAIN_SUFFIXES = [".rbx", ".vfx", ".btc"];

interface Network {
  testnet: boolean;
  devnet: boolean;
}

const currentNetwork = (): Network => ({ testnet: Boolean(IS_TESTNET), devnet: Boolean(IS_DEVNET) });

/**
 * What the user pasted. Addresses are 34 chars and start with R on mainnet or
 * X on test networks (legacy xRBX prefix included); domains carry a known
 * suffix; a bare number is a block height; anything else is treated as a hash.
 */
export function classifyQuery(raw: string, network: Network = currentNetwork()): SearchType {
  const value = raw.trim();
  if (value.length === ADDRESS_LENGTH && value.startsWith("xRBX")) return "address";
  const prefix = network.devnet || network.testnet ? "X" : "R";
  if (value.length === ADDRESS_LENGTH && value[0].toUpperCase() === prefix) return "address";
  const lower = value.toLowerCase();
  if (lower.includes(".rbx") || DOMAIN_SUFFIXES.some((suffix) => lower.endsWith(suffix))) return "adnr";
  if (/^\d+$/.test(value)) return "blockHeight";
  return "hash";
}

/** Which result list to open first for a query type. */
export function defaultTab(type: SearchType): ResultTab {
  return type === "blockHeight" ? "blocks" : "transactions";
}
