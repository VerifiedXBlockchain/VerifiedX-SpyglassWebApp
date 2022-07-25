/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
        <h3 className="mt-3 text-center">Circulating Supply</h3>

      <ul className="list-group my-5">
        <li className="list-group-item d-flex justify-content-between align-items-center">
         Circulating Supply
          <span className="badge bg-primary badge-lg">{ numberWithCommas(circulation.balance)} RBX</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
        Amount Staked
          <span className="badge bg-primary badge-lg">{numberWithCommas(circulation.totalStaked)} RBX</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
        Total Burned Fees
          <span className="badge bg-primary badge-lg">{numberWithCommas(circulation.feesBurnedSum)} RBX</span>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
        Total Transactions
          <span className="badge bg-primary badge-lg">{numberWithCommas(circulation.feesBurned)}</span>
        </li>
      </ul>


      </div>
    </div>
  );
};

export default CirculationPage;
