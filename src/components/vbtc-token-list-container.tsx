import { useEffect, useState } from "react";
import { VbtcToken } from "../models/vbtc-token";
import { VbtcTokenService } from "../services/vbtc-service";
import InfiniteScroll from "react-infinite-scroller";
import { VbtcTokenList } from "./vbtc-token-list";



export const VbtcTokenListContainer = () => {

    const [tokens, setTokens] = useState<VbtcToken[]>([]);
    const [canLoadMore, setCanLoadMore] = useState<boolean>(true);




    const fetchPage = async (p: number) => {
        const service = new VbtcTokenService();
        try {


            const data = await service.list(p);

            if (data.page == 1) {
                setTokens(data.results);
            } else {
                const results = [];
                for (const result of data.results) {
                    const exists = tokens.some((b) => b.sc_identifier == result.sc_identifier);
                    if (!exists) {
                        results.push(result);
                    }
                }

                setTokens([...tokens, ...results]);
            }

            setCanLoadMore(data.numPages > data.page);
        } catch (e) {
            console.log(e);
            setCanLoadMore(false);
        }
    };



    useEffect(() => {
        const poll = () => {
            const service = new VbtcTokenService();

            service.list(1).then((data) => {

                const newTokens = [];
                for (const token of data.results) {
                    const exists = tokens.some((v) => v.sc_identifier == token.sc_identifier);
                    if (!exists) {
                        newTokens.push(token);
                    }
                }
                if (newTokens.length > 0) {
                    setTokens([...newTokens, ...tokens]);
                }
            });


        };

        const interval = setInterval(() => {
            poll();
        }, 5000);

        return () => clearInterval(interval);
    }, [tokens]);


    return (
        <div>
            <div className="container">


                <InfiniteScroll
                    pageStart={0}
                    loadMore={fetchPage}
                    hasMore={canLoadMore}
                    initialLoad={true}
                    loader={
                        <div
                            className="d-flex justify-content-center align-items-center"
                            key={0}
                        >
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                >
                    <VbtcTokenList tokens={tokens} />
                </InfiniteScroll>
            </div>
        </div>
    );


}
