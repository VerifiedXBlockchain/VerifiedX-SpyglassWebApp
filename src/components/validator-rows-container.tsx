import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Block } from "../models/block";
import { Validator } from "../models/validator";
import { BlockService } from "../services/block-service";
import { ValidatorService } from "../services/validator-service";
import { BlockList } from "./block-list";
import { ValidatorList } from "./validator-list";

export const ValidatorRowsContainer = () => {
  const [validators, setValidators] = useState<Validator[]>([]);
  const [canLoadMore, setCanLoadMore] = useState<boolean>(true);

  const [activeValidatorCount, setActiveValidatorCount] = useState<number>(0);

  const fetchPage = async (p: number) => {
    const service = new ValidatorService();
    try {
      const data = await service.list(p);
      const count = await service.activeCount();
      setActiveValidatorCount(count);
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
      service.list(1).then((data) => {
        setActiveValidatorCount(data.count);

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
      service.activeCount().then((count) => {
        setActiveValidatorCount(count);
      });
    };

    const interval = setInterval(() => {
      poll();
    }, 5000);

    return () => clearInterval(interval);
  }, [validators]);

  return (
    <div>
      <div className="bg-dark text-end px-3 py-2">
        <div className="d-inline-block bg-success h6 rounded py-1 px-2 mb-0">
          Total Active Validators: {activeValidatorCount}
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
        <ValidatorList validators={validators} />
      </InfiniteScroll>
    </div>
  );
};
