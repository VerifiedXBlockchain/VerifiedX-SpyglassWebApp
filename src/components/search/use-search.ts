import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Address } from "../../models/address";
import { Block } from "../../models/block";
import { Transaction } from "../../models/transaction";
import { AddressService } from "../../services/address-service";
import { BlockService } from "../../services/block-service";
import { TransactionService } from "../../services/transaction-service";
import { ResultTab, SearchType, classifyQuery, defaultTab } from "./search-type";

interface TabState<T> {
  items: T[];
  /** Total matches reported by the API; undefined until the tab has been fetched. */
  count?: number;
  hasMore: boolean;
  loaded: boolean;
}

export interface SearchState {
  query: string;
  type?: SearchType;
  tab: ResultTab;
  /** undefined = not fetched, null = lookup failed. */
  address?: Address | null;
  transactions: TabState<Transaction>;
  blocks: TabState<Block>;
  loading: boolean;
  /** A domain that resolves to nothing. */
  domainNotFound: boolean;
}

const emptyTab = <T,>(): TabState<T> => ({ items: [], hasMore: false, loaded: false });

const initialState = (query: string): SearchState => ({
  query,
  tab: "transactions",
  transactions: emptyTab(),
  blocks: emptyTab(),
  loading: false,
  domainNotFound: false,
});

type Item = Transaction | Block;

interface PageResult {
  items: Item[];
  count: number;
  hasMore: boolean;
}

const single = (item: Item | undefined): PageResult => ({ items: item ? [item] : [], count: item ? 1 : 0, hasMore: false });

/** One page of results for a query type and tab. Lookups that miss resolve to an empty page. */
async function fetchPage(query: string, type: SearchType, tab: ResultTab, page: number): Promise<PageResult> {
  const transactions = new TransactionService();
  const blocks = new BlockService();

  if (type === "address") {
    const data = tab === "transactions" ? await transactions.address(query, page) : await blocks.address(query, page);
    return { items: data.results, count: data.count, hasMore: data.numPages > data.page };
  }

  if (type === "blockHeight") {
    if (tab === "transactions") {
      const data = await transactions.listByBlockHeight(parseInt(query, 10), page);
      return { items: data.results, count: data.count, hasMore: data.numPages > data.page };
    }
    try {
      const block = await blocks.retrieve(query);
      return single(Number.isFinite(block.height) ? block : undefined);
    } catch (error) {
      console.error("Block lookup failed", error);
      return single(undefined);
    }
  }

  // hash
  if (tab === "transactions") {
    try {
      const tx = await transactions.retrieve(query);
      return single(tx.hash ? tx : undefined);
    } catch (error) {
      console.error("Transaction lookup failed", error);
      return single(undefined);
    }
  }
  try {
    const block = await blocks.retrieveByHash(query);
    return single(Number.isFinite(block.height) ? block : undefined);
  } catch (error) {
    console.error("Block lookup failed", error);
    return single(undefined);
  }
}

/**
 * Search page state: classifies the query, resolves domains to addresses,
 * loads the default tab (plus the address balance), and pages either tab on
 * demand. Responses from a superseded query are ignored.
 */
export function useSearch(q: string | undefined) {
  const router = useRouter();
  const query = (q ?? "").toString().trim();
  const [state, setState] = useState<SearchState>(() => initialState(query));
  const requestId = useRef(0);

  const isCurrent = (id: number) => requestId.current === id;

  const loadTab = useCallback(async (id: number, query: string, type: SearchType, tab: ResultTab, page: number) => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const result = await fetchPage(query, type, tab, page);
      if (!isCurrent(id)) return;
      setState((s) => {
        const current = s[tab] as TabState<Item>;
        const items: Item[] = page === 1 ? result.items : [...current.items, ...result.items];
        return { ...s, loading: false, [tab]: { items, count: result.count, hasMore: result.hasMore, loaded: true } };
      });
    } catch (error) {
      console.error("Search page fetch failed", error);
      if (!isCurrent(id)) return;
      setState((s) => ({ ...s, loading: false, [tab]: { ...s[tab], loaded: true, hasMore: false } }));
    }
  }, []);

  useEffect(() => {
    const id = ++requestId.current;
    if (!query) {
      setState(initialState(""));
      return;
    }

    const type = classifyQuery(query);

    if (type === "adnr") {
      setState({ ...initialState(query), type, loading: true });
      new AddressService()
        .retrieveByAdnr(query)
        .then((address) => {
          if (!isCurrent(id)) return;
          if (address.address) {
            router.replace({ pathname: router.pathname, query: { q: address.address } }, undefined, { shallow: true });
          } else {
            setState((s) => ({ ...s, loading: false, domainNotFound: true }));
          }
        })
        .catch((error) => {
          console.error("Domain lookup failed", error);
          if (isCurrent(id)) setState((s) => ({ ...s, loading: false, domainNotFound: true }));
        });
      return;
    }

    const tab = defaultTab(type);
    setState({ ...initialState(query), type, tab });
    loadTab(id, query, type, tab, 1);

    if (type === "address") {
      new AddressService()
        .retrieve(query)
        .then((address) => {
          if (isCurrent(id)) setState((s) => ({ ...s, address: address.address ? address : null }));
        })
        .catch((error) => {
          console.error("Address lookup failed", error);
          if (isCurrent(id)) setState((s) => ({ ...s, address: null }));
        });
    }
    // router is stable enough for our purposes; re-running on its identity would refetch on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, loadTab]);

  const switchTab = useCallback(
    (tab: ResultTab) => {
      setState((s) => ({ ...s, tab }));
      if (state.type && !state[tab].loaded && !state.domainNotFound) {
        loadTab(requestId.current, state.query, state.type, tab, 1);
      }
    },
    [state, loadTab]
  );

  const loadMore = useCallback(
    (page: number) => {
      if (!state.type || state.loading || !state[state.tab].hasMore) return;
      loadTab(requestId.current, state.query, state.type, state.tab, page);
    },
    [state, loadTab]
  );

  return { state, switchTab, loadMore };
}
