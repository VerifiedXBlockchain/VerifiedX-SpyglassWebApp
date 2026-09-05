import { useRouter } from "next/router";
import { useEffect } from "react";
import nextI18NextConfig from "../../next-i18next.config";
import { IS_DEVNET, IS_TESTNET } from "../constants";

/**
 * Keeps the VFX Assistant widget (chat.verifiedx.io) told about what the
 * visitor is looking at, so its answers can refer to the transaction, block,
 * address or validator on screen. The widget tracks the URL itself; this hook
 * adds the semantic `page`, `entity` and `address` fields on every route
 * change, plus `custom.network` (mainnet, testnet or devnet) for this build.
 * Integration guide:
 * https://github.com/VerifiedXBlockchain/vfx-chat/blob/main/docs/integration.md
 */

export const ASSISTANT_WIDGET_URL = "https://chat.verifiedx.io/widget.js";

export interface AssistantEntity {
  type: string;
  id: string;
}

export interface AssistantContext {
  page: string;
  /** Null clears the field inside the widget when the visitor leaves a detail page. */
  entity: AssistantEntity | null;
  /** The address whose details are on screen; null elsewhere. */
  address: string | null;
}

export type AssistantNetwork = "mainnet" | "testnet" | "devnet";

/** The widget's page API (window.VfxAssistant); `app` and `url` exist too but Spyglass leaves them to the widget. */
interface VfxAssistantApi {
  setContext(context: Partial<AssistantContext> & { app?: string; url?: string; custom?: Record<string, string> }): void;
  open(): void;
  close(): void;
  toggle(): void;
  ask(text: string): void;
}

declare global {
  interface Window {
    VfxAssistant?: VfxAssistantApi;
  }
}

/** First path segment → page label for list pages. */
const LIST_PAGES: Record<string, string> = {
  "": "home",
  block: "blocks",
  transaction: "transactions",
  validators: "validators",
  domains: "domains",
  "vbtc-token": "vbtc-tokens",
  "fungible-token": "fungible-tokens",
  nfts: "nfts",
  metrics: "metrics",
  faucet: "faucet",
  map: "map",
  search: "search",
};

/** First path segment → entity type for `/<segment>/<id>` detail pages (page label is the type). */
const DETAIL_TYPES: Record<string, string> = {
  block: "block",
  transaction: "transaction",
  validators: "validator",
  "vbtc-token": "vbtc-token",
  "fungible-token": "fungible-token",
  nfts: "nft",
};

const LOCALES: string[] = nextI18NextConfig.i18n.locales;

/** Mirrors the search page's own test for an address. */
export function looksLikeAddress(value: string): boolean {
  if (value.length !== 34) return false;
  if (value.startsWith("xRBX")) return true;
  const prefix = IS_DEVNET ? "X" : IS_TESTNET ? "X" : "R";
  return value[0].toUpperCase() === prefix;
}

function searchContext(query: URLSearchParams): AssistantContext {
  const q = (query.get("q") ?? "").trim();
  if (!q) return { page: "search", entity: null, address: null };
  if (looksLikeAddress(q)) return { page: "address", entity: { type: "address", id: q }, address: q };
  if (q.includes(".rbx") || q.includes(".vfx")) return { page: "search", entity: { type: "domain", id: q }, address: null };
  return { page: "search", entity: { type: "query", id: q }, address: null };
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** Derives the assistant context from a Next.js `asPath` (path plus query, no locale). */
export function deriveAssistantContext(asPath: string): AssistantContext {
  const url = new URL(asPath, "https://spyglass.verifiedx.io");
  const segments = url.pathname.split("/").filter((segment) => segment.length > 0);
  if (segments.length > 0 && LOCALES.includes(segments[0])) segments.shift();
  const [section = "", id, extra] = segments;

  if (section === "search" && segments.length === 1) return searchContext(url.searchParams);
  if (section === "addresses" && id === "top-holders") return { page: "top-holders", entity: null, address: null };
  if (section === "validators" && id === "search") return { page: "validator-search", entity: null, address: null };

  if (id && !extra && DETAIL_TYPES[section]) {
    const type = DETAIL_TYPES[section];
    return { page: type, entity: { type, id: decodeSegment(id) }, address: null };
  }
  if (segments.length <= 1 && LIST_PAGES[section] !== undefined) {
    return { page: LIST_PAGES[section], entity: null, address: null };
  }
  return { page: segments.join("/") || "home", entity: null, address: null };
}

/**
 * The network this build serves: the NEXT_PUBLIC_IS_DEVNET / NEXT_PUBLIC_IS_TESTNET
 * build flags first, then a hostname that names the network, else mainnet.
 */
export function detectNetwork(hostname: string = typeof window === "undefined" ? "" : window.location.hostname): AssistantNetwork {
  if (IS_DEVNET) return "devnet";
  if (IS_TESTNET) return "testnet";
  const host = hostname.toLowerCase();
  if (host.includes("devnet")) return "devnet";
  if (host.includes("testnet")) return "testnet";
  return "mainnet";
}

/** Sends the context to the widget when it is present; a no-op before the script has loaded. */
export function pushAssistantContext(context: AssistantContext): void {
  if (typeof window === "undefined") return;
  // `custom` is replaced as a whole by the widget, so the network rides on every push.
  window.VfxAssistant?.setContext({ ...context, custom: { network: detectNetwork() } });
}

/** Pushes the current route's context on mount and after every client-side navigation. */
export function useAssistantContext(): void {
  const { asPath } = useRouter();
  useEffect(() => {
    pushAssistantContext(deriveAssistantContext(asPath));
  }, [asPath]);
}
