import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Block } from "../models/block";
import { Nft } from "../models/nft";
import { Validator } from "../models/validator";
import { BlockService } from "../services/block-service";
import { NftService } from "../services/nft-service";
import { ValidatorService } from "../services/validator-service";
import { BlockList } from "./block-list";
import { NftCardList } from "./nft-list";
import { ValidatorCardList } from "./validator-card-list";
import { ValidatorList } from "./validator-list";

export const NftListContainer = () => {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const fetchPage = async (p: number) => {
    const service = new NftService();
    try {

      const data = await service.list(p);

      if (data.page == 1) {
        setNfts(data.results);
      } else {
        const results = [];
        for (const result of data.results) {
          const exists = nfts.some((n) => n.identifier == result.identifier);
          if (!exists) {
            results.push(result);
          }
        }

        setNfts([...nfts, ...results]);
      }

      setCanLoadMore(data.numPages > data.page);
    } catch (e) {
      console.log(e);
      setCanLoadMore(false);
    }
  };

  useEffect(() => {
    const poll = () => {
      const service = new NftService();

      service.list(1).then((data) => {
        const newNfts = [];
        for (const nft of data.results) {
          const exists = nfts.some((n) => n.identifier == nft.identifier);
          if (!exists) {
            newNfts.push(nft);
          }
        }
        if (newNfts.length > 0) {
          setNfts([...newNfts, ...nfts]);
        }
      });

    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [nfts]);

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
        <NftCardList nfts={nfts} />
      </InfiniteScroll>
    </div>
    </div>

  );
};
