import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { BlockCard } from "../../src/components/block-card";
import { TransactionCard } from "../../src/components/transaction-card";
import { IS_TESTNET } from "../../src/constants";
import { Address } from "../../src/models/address";
import { Block } from "../../src/models/block";
import { PaginatedResponse } from "../../src/models/paginated-response";
import { Transaction } from "../../src/models/transaction";
import { AddressService } from "../../src/services/address-service";
import { BlockService } from "../../src/services/block-service";
import { TransactionService } from "../../src/services/transaction-service";



enum SearchType {
    address,
    hash,
    blockHeight,
    adnr,
}

enum SearchResultType {
    blocks,
    transactions
}

const NewSearchPage: NextPage = () => {

    const router = useRouter();
    const { q } = router.query;

    let initialQuery = q;
    let initialResultType = SearchResultType.transactions;

    const [query, setQuery] = useState<string>(initialQuery?.toString() || '');
    const [resultType, setResultType] = useState<SearchResultType>(initialResultType);

    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);

    const [canLoadMoreTransactions, setCanLoadMoreTransactions] = useState<boolean>(false);
    const [canLoadMoreBlocks, setCanLoadMoreBlocks] = useState<boolean>(false);

    const [totalTransactionResults, setTotalTransactionResults] = useState<number>(0);
    const [totalBlockResults, setTotalBlocksResults] = useState<number>(0);

    const [address, setAddress] = useState<Address | undefined>(undefined);


    const transactionService = new TransactionService();
    const blockService = new BlockService();
    const addressService = new AddressService();



    useEffect(() => {
        if (q) {
            setQuery(q.toString());
            handleSearch(q.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q]);

    const searchInput = useCallback((inputElement) => {
        if (inputElement) {
            inputElement.focus();
        }
    }, []);

    const handleQueryChange = (q: string, andSearch = false) => {

        handleClear(q);
        if (andSearch) {
            handleSearch(q);
        }
    }


    const handleClear = (q = '') => {
        setQuery(q);
        setResultType(SearchResultType.transactions);
        setBlocks([]);
        setTransactions([]);
        setPage(0);
        setLoading(false);
        setCanLoadMoreBlocks(false);
        setCanLoadMoreTransactions(false);
        setAddress(undefined);
        setTotalBlocksResults(0)
        setTotalTransactionResults(0);

    }

    const valueToSearchType = (val: string) => {

        if (val.length == 34 && val.startsWith('xRBX')) {
            return SearchType.address;
        }

        if (val.length == 34 && val[0].toUpperCase() == (IS_TESTNET ? "X" : "R")) {
            return SearchType.address;
        }

        if (val.includes('.rbx')) {
            return SearchType.adnr;
        }

        const isNumber = /^\d+$/.test(val);

        if (isNumber) {
            return SearchType.blockHeight;
        }

        return SearchType.hash;

    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleSearch = async (q: string, p: number = 1, forceResultType?: SearchResultType) => {
        const type = valueToSearchType(q);



        if (type == SearchType.adnr) {

            const a = await addressService.retrieveByAdnr(q);
            handleQueryChange(a.address, true);
            return;
        }


        if (!q) {
            handleClear();
            return;
        }

        if (loading) {
            return;
        }

        setLoading(true);
        setPage(p);


        let _resultType: SearchResultType = SearchResultType.transactions;

        switch (type) {
            case SearchType.address:
                if (p == 1) {
                    addressService.retrieve(q).then((a) => {
                        setAddress(a);
                    })
                }

                _resultType = forceResultType !== undefined ? forceResultType : SearchResultType.transactions;
                setResultType(_resultType);

                if (_resultType == SearchResultType.transactions) {

                    const data = await transactionService.address(q, p);
                    if (p == 1) {
                        setTransactions(data.results);
                    } else {
                        setTransactions([...transactions, ...data.results]);
                    }

                    setCanLoadMoreTransactions(data.numPages > data.page);
                    setTotalTransactionResults(data.count);

                } else {
                    const data = await blockService.address(q, p);
                    if (p == 1) {
                        setBlocks(data.results);
                    } else {
                        setBlocks([...blocks, ...data.results]);

                    }
                    setCanLoadMoreBlocks(data.numPages > data.page);
                    setTotalBlocksResults(data.count);

                }
                break;
            case SearchType.blockHeight:
                setAddress(undefined);
                _resultType = forceResultType !== undefined ? forceResultType : SearchResultType.blocks;
                setResultType(_resultType);

                if (_resultType == SearchResultType.transactions) {
                    const data = await transactionService.listByBlockHeight(parseInt(q));
                    setTransactions(data.results);
                    setCanLoadMoreTransactions(data.numPages > data.page);
                    setTotalTransactionResults(data.count);

                } else {
                    try {
                        const data = await blockService.retrieve(q);
                        setBlocks([data]);
                        setCanLoadMoreBlocks(false);
                        setTotalBlocksResults(1);
                    } catch (e) {
                        console.log(e);
                        setBlocks([])
                        setCanLoadMoreBlocks(false);
                        setTotalBlocksResults(0);
                    }

                }
                break;
            case SearchType.hash:
                setAddress(undefined);
                _resultType = forceResultType !== undefined ? forceResultType : SearchResultType.transactions;
                setResultType(_resultType);

                if (_resultType == SearchResultType.transactions) {
                    try {
                        const data = await transactionService.retrieve(q);
                        setTransactions([data]);
                        setCanLoadMoreTransactions(false);
                        setTotalTransactionResults(1);
                    } catch (e) {
                        console.log(e);
                        setTransactions([])
                        setCanLoadMoreTransactions(false);
                        setTotalTransactionResults(0);
                    }

                } else {
                    try {
                        const data = await blockService.retrieveByHash(q);
                        setBlocks([data]);
                        setCanLoadMoreBlocks(false);
                        setTotalBlocksResults(1);
                    } catch (e) {
                        console.log(e);
                        setBlocks([])
                        setCanLoadMoreBlocks(false);
                        setTotalBlocksResults(0);
                    }

                }
                break;






        }

        setLoading(false);

    }

    const handleResultTypeChange = (type: SearchResultType) => {
        setResultType(type);
        handleSearch(query, 1, type);
    }


    useEffect(() => {
        const handleNextPage = (q: string, p: number, type: SearchResultType) => {
            if (!q) {
                return;
            }
            if (type == SearchResultType.transactions && !canLoadMoreTransactions) {
                return;
            }
            if (type == SearchResultType.blocks && !canLoadMoreBlocks) {
                return;
            }

            handleSearch(q, p, type);
        }

        const handleScroll = (event: any) => {
            const percentScrolled = (window.scrollY + window.innerHeight) / document.documentElement.offsetHeight;
            if (percentScrolled > 0.9) {
                if (!loading) {
                    handleNextPage(query, page + 1, resultType);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [query, page, resultType, loading, canLoadMoreTransactions, canLoadMoreBlocks, handleSearch,]);


    return (
        <div>
            <Head>
                <title>RBX Explorer{IS_TESTNET ? ' [TESTNET]' : ''}</title>
                <meta
                    name="description"
                    content="ReserveBlock Explorer: Search Results"
                />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <nav aria-label="breadcrumb">
                <ol className="breadcrumb align-items-center">
                    <li className="breadcrumb-item">
                        <Link href="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        <Link href="/search">Search</Link>
                    </li>
                </ol>
            </nav>

            <div className="container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSearch(query, 1);
                }}>
                    <div className="input-group">

                        <input
                            type="text"
                            autoFocus={true}
                            className="form-control py-2 bg-dark text-white"
                            placeholder="Search for address, block, hash, or domain..."
                            style={isMobile ? { fontSize: 12 } : { fontSize: 24 }}
                            ref={searchInput}
                            value={query}
                            onChange={(event) => handleQueryChange(event.target.value)}
                            onKeyDown={e => e.key === "Enter" ? handleSearch(query, 1) : null}
                        ></input>

                        <button type="submit" className="btn btn-secondary">Search</button>

                        {query ?
                            <button className="btn"
                                style={{ backgroundColor: 'transparent' }}
                                onClick={() => handleClear()}
                            >Clear</button> : null}

                    </div>
                </form>

                {address ?

                    <div className="mt-4 alert bg-success text-center">
                        Balance: {address.balance} RBX<br />
                        Locked Balance: {address.balanceLocked} RBX<br />
                        Total Balance: {address.balanceTotal} RBX<br />
                        {address.adnr != null ? `RBX Domain: ${address.adnr}` : ``}
                    </div>
                    : null}

                {page > 0 ?
                    <div className="d-flex justify-content-between">

                        <div className="mt-3">
                            <ul className="nav nav-tabs border-bottom-0">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${resultType == SearchResultType.transactions ? 'active' : ''}`}
                                        onClick={() => handleResultTypeChange(SearchResultType.transactions)}
                                    >
                                        Transactions
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${resultType == SearchResultType.blocks ? 'active' : ''}`}
                                        onClick={() => handleResultTypeChange(SearchResultType.blocks)}
                                    >
                                        Blocks
                                    </button>
                                </li>

                            </ul>
                        </div>
                        {resultType == SearchResultType.transactions && totalTransactionResults ?
                            <div className="mt-4 d-none d-md-block">{totalTransactionResults} Transactions</div> : null}
                        {resultType == SearchResultType.blocks && totalBlockResults ?
                            <div className="mt-4 d-none d-md-block">{totalBlockResults} Blocks</div> : null}
                    </div>

                    : null}

                {resultType == SearchResultType.transactions ?
                    <div>
                        <div className="row">
                            {transactions.map(t => {
                                return (
                                    <div key={t.hash} className="col-12 pb-3 col-md-4 col-lg-4">
                                        <TransactionCard transaction={t}></TransactionCard>
                                    </div>
                                )
                            })}
                        </div>


                    </div>
                    :

                    <div className="row">
                        {blocks.map(b => {
                            return (
                                <div key={b.height} className="col-12 pb-3 col-md-4 col-lg-4">
                                    <BlockCard block={b}></BlockCard>
                                </div>
                            )
                        })}
                    </div>}

                {loading ?
                    <div className="d-flex justify-content-center align-items-center py-3">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    : null}
            </div>
        </div>
    )

}


export default NewSearchPage;