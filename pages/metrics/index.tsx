/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LatestBlock } from "../../src/components/latest-block";
import { Search } from "../../src/components/search";
import { Circulation } from "../../src/models/circulation";
import { NetworkMetrics } from "../../src/models/network_metrics";
import { CirculationService } from "../../src/services/circulation-service";
import { NetworkMetricsService } from "../../src/services/network-metrics-service";
import { numberWithCommas } from "../../src/utils/formatting";
import * as timeago from 'timeago.js';
import BlockRewardsCalculator from "../../src/components/block-rewards-calculator";


const CirculationPage: NextPage = () => {
  const router = useRouter();
  const { hash } = router.query;

  const [circulation, setCirculation] = useState<Circulation | undefined>(
    undefined
  );


  const [metrics, setMetrics] = useState<NetworkMetrics | undefined>(
    undefined
  );

  useEffect(() => {

    const service = new CirculationService();
    const networkMetricsService = new NetworkMetricsService();
    service.retrieve().then((data) => {
      setCirculation(data);
    });

    networkMetricsService.retrieve().then((data) => {
      setMetrics(data);
    });

    const interval = setInterval(() => {
      service.retrieve().then((data) => {
        setCirculation(data);
      });


      networkMetricsService.retrieve().then((data) => {
        setMetrics(data);
      });


    }, 1000 * 15);



    return () => clearInterval(interval);

  }, []);

  if (!circulation && !metrics) return <></>;

  return (
    <div>
      <div className="container">
        <h3 className="mt-3 text-center">Metrics</h3>


        <ul className="list-group my-5">
          {circulation ? (
            <>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Lifetime Supply
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.lifetimeSupply)} RBX</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Circulating Supply
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.balance)} RBX</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                Amount Assured
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalStaked)} RBX</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                Effective Circulating Supply
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.balance - circulation.totalStaked)} RBX</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                Total Burned Fees
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.feesBurnedSum)} RBX</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Total Transactions
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.feesBurned)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span style={{ textDecoration: 'underline' }}>Network</span>
                <span className="badge bg-secondary badge-lg text-black">{ }</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                CLI Version
                <span className="badge bg-secondary badge-lg text-black">{circulation.cliVersion}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Total Validator Pool
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalMasterNodes)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center" style={{ borderBottom: 'none' }}>
                <div className="d-flex align-items-start  flex-column">
                  <div className="">

                    Active&nbsp;Validator&nbsp;Pool
                  </div>
                </div>
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.activeMasterNodes)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                <Search placeholder="Search Address" mini />
              </li>
            </>
          ) : null}
          {metrics ? (
            <>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span style={{ textDecoration: 'underline' }}>Network Metrics</span>
                <span className="badge bg-secondary badge-lg text-black">{ }</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block Difference Average
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(metrics.blockDifferenceAverage)} s</span>
              </li>
              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                Block Last Received
                <span className="badge bg-secondary badge-lg text-black">{timeago.format(metrics.blockLastReceived)}</span>
              </li> */}
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block Last Delay
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(metrics.blockLastDelay)} s</span>
              </li>
              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                Time Since Last Block
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(metrics.timeSinceLastBlock)} s</span>
              </li> */}
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Block Averages
                <span className="badge bg-secondary badge-lg text-black">{metrics.blocksAverages}</span>
              </li>
            </>) : null}
        </ul>

        <div className="row">
          <div className="col-12 col-md-6">
            <h3 className="mt-3 mb-4 text-center">Spyglass</h3>
            <LatestBlock />
          </div>

          {circulation ?
            <div className="col-12 col-md-6">
              <h3 className="mt-3 mb-4 text-center">Block Rewards Calculator</h3>
              <BlockRewardsCalculator totalValidators={circulation.activeMasterNodes} />
            </div> : null}
        </div>


        <div className="py-5"></div>


      </div>
    </div>
  );
};

export default CirculationPage;
