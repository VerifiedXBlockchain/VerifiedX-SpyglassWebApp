import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Block } from "../models/block";
import { Validator } from "../models/validator";
import { BlockService } from "../services/block-service";
import { ValidatorService } from "../services/validator-service";
import { BlockList } from "./block-list";
import { ValidatorCardList } from "./validator-card-list";
import { ValidatorList } from "./validator-list";

export const ValidatorListContainer = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const fetchPage = async (p: number) => {
    const service = new ValidatorService();
    try {


      const data = await service.list(p, { 'is_active': true });

      if (data.page == 1) {
        setValidators(data.results);
      } else {
        const results = [];
        for (const result of data.results) {
          const exists = validators.some((b) => b.address == result.address);
          if (!exists) {
            results.push(result);
          }
        }

        setValidators([...validators, ...results]);
      }

      setCanLoadMore(data.numPages > data.page);
    } catch (e) {
      console.log(e);
      setCanLoadMore(false);
    }
  };

  useEffect(() => {
    const poll = () => {
      const service = new ValidatorService();

      service.list(1, { 'is_active': true }).then((data) => {

        const newValidators = [];
        for (const validator of data.results) {
          const exists = validators.some((v) => v.address == validator.address);
          if (!exists) {
            newValidators.push(validator);
          }
        }
        if (newValidators.length > 0) {
          setValidators([...newValidators, ...validators]);
        }
      });


    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [validators]);

  return (
    <div>
      <div className="container">
        <div className="text-center px-3 pt-2">
          {validators.length ? (
            <div className="d-inline-block bg-success h6 rounded py-1 px-2 mb-0">
              Total Active Validators: {validators.filter(v => v.isActive).length}
            </div>) : null}
          <Link href={"/validators/search"}>
            <a className="btn-link btn btn-sm" >Check Validator Status</a>
          </Link>
        </div>
      </div>
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
        <ValidatorCardList validators={validators} />
      </InfiniteScroll>
    </div>
  );
};
