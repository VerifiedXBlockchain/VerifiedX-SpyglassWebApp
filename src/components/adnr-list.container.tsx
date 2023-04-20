import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Adnr } from "../models/adnr";
import { Block } from "../models/block";
import { Nft } from "../models/nft";
import { Validator } from "../models/validator";
import { AdnrService } from "../services/adnr-service";
import { BlockService } from "../services/block-service";
import { NftService } from "../services/nft-service";
import { ValidatorService } from "../services/validator-service";
import { BlockList } from "./block-list";
import { NftCardList } from "./nft-list";
import { ValidatorCardList } from "./validator-card-list";
import { ValidatorList } from "./validator-list";

export const AdnrListContainer = () => {
  const [adnrs, setAdnrs] = useState<Adnr[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const fetchPage = async (p: number) => {
    const service = new AdnrService();
    try {

      const data = await service.list(p);

      if (data.page == 1) {
        setAdnrs(data.results);
      } else {
        const results = [];
        for (const adnr of data.results) {
          const exists = adnrs.some((a) => a.domain == adnr.domain);
          if (!exists) {
            results.push(adnr);
          }
        }

        setAdnrs([...adnrs, ...results]);
      }

      setCanLoadMore(data.numPages > data.page);
    } catch (e) {
      console.log(e);
      setCanLoadMore(false);
    }
  };

  useEffect(() => {
    const poll = () => {
      const service = new AdnrService();

      service.list(1).then((data) => {
        const newAdnrs = [];
        for (const adnr of data.results) {
          const exists = adnrs.some((a) => a.domain == adnr.domain);
          if (!exists) {
            newAdnrs.push(adnr);
          }
        }
        if (newAdnrs.length > 0) {
          setAdnrs([...newAdnrs, ...adnrs]);
        }
      });

    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [adnrs]);

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

          <table className="table table-striped table-dark">
            <thead>
              <tr>
                <th scope="col" style={{ width: 300 }}>Domain</th>
                <th scope="col">Address</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adnrs.map((adnr) => (
                <tr key={adnr.domain}>
                  <td style={{ verticalAlign: 'middle' }}>

                    {adnr.domain}
                  </td>
                  <td style={{ verticalAlign: 'middle' }}>
                    <a href={`/search?q=${adnr.address}`}>{adnr.address}</a>
                  </td>
                  {/* <td>{adnr.address}</td> */}
                  {/* <td>{adnr.create_transaction.hash}</td> */}
                  <td className="text-center" style={{ verticalAlign: 'middle' }}>
                    <a href={`/transaction/${adnr.create_transaction.hash}`} className="btn btn-primary">View Transaction</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </InfiniteScroll>
      </div>
    </div>

  );
};
