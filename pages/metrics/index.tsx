/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
          <span className="badge bg-secondary badge-lg text-black">{ numberWithCommas(circulation.balance)} RBX</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
        Amount Staked
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
        <span style={{textDecoration: 'underline'}}>Network</span>
          <span className="badge bg-secondary badge-lg text-black">{}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
        CLI Version
          <span className="badge bg-secondary badge-lg text-black">{circulation.cliVersion}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Total Validator Pool
          <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalMasterNodes)}</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-start align-items-md-center flex-column flex-md-row">
            <div className="pe-2 pb-2 pb-md-0">

            Active&nbsp;Validator&nbsp;Pool
            </div>
            {/* <div className="py-1"></div> */}
            <Search placeholder="Search Address" mini />
          </div>
          <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.activeMasterNodes)}</span>
        </li>
      </ul>

  


      </div>
    </div>
  );
};

export default CirculationPage;
