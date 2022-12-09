/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LatestBlock } from "../../src/components/latest-block";
import { Search } from "../../src/components/search";
import { Circulation } from "../../src/models/circulation";
import { CirculationService } from "../../src/services/circulation-service";
import { numberWithCommas } from "../../src/utils/formatting";


const CirculationPage: NextPage = () => {
  const router = useRouter();
  const { hash } = router.query;

  const [circulation, setCirculation] = useState<Circulation | undefined>(
    undefined
  );

  useEffect(() => {

    const service = new CirculationService();
    service.retrieve().then((data) => {
      setCirculation(data);
    });

    const interval = setInterval(() => {
      service.retrieve().then((data) => {
        setCirculation(data);
      });
    }, 1000 * 15);

    return () => clearInterval(interval);

  }, []);

  if (!circulation) return <></>;

  return (
    <div>
      <div className="container">
        <h3 className="mt-3 text-center">Metrics</h3>

        <ul className="list-group my-5">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Circulating Supply
            <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.balance)} RBX</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Lifetime Supply
            <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.lifetimeSupply)} RBX</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Total Assured
            <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalStaked)} RBX</span>
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
        </ul>

        <h3 className="mt-3 mb-4 text-center">Spyglass</h3>


        <LatestBlock />


      </div>
    </div>
  );
};

export default CirculationPage;
