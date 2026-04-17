/* eslint-disable @next/next/no-html-link-for-pages */
import { GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
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
  const { t } = useTranslation(["metrics", "common"]);
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
        <h3 className="mt-3 text-center">{t("metrics:heading")}</h3>


        <ul className="list-group my-5">
          {circulation ? (
            <>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.lifetimeSupply")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.lifetimeSupply)} VFX</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.circulatingSupply")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.balance)} VFX</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.amountAssured")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalStaked)} VFX</span>
              </li>

              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                Effective Circulating Supply
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.balance - circulation.totalStaked)} VFX</span>
              </li> */}
              {/* 
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Founder Assured
                <span className="badge bg-secondary badge-lg text-black">58,000,000 VFX</span>
              </li> */}


              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.totalBurnedFees")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.feesBurnedSum)} VFX</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.totalTransactions")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalTransactions)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span style={{ textDecoration: 'underline' }}>{t("metrics:labels.network")}</span>
                <span className="badge bg-secondary badge-lg text-black">{ }</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.cliVersion")}
                <span className="badge bg-secondary badge-lg text-black">{circulation.cliVersion}</span>
              </li>
              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                Total Validator Pool
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalMasterNodes)}</span>
              </li> */}

              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.totalVfxAddresses")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.totalAddresses)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center" style={{ borderBottom: 'none' }}>
                <div className="d-flex align-items-start  flex-column">
                  <div className="">

                    {t("metrics:labels.activeValidatorPool")}
                  </div>
                </div>
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(circulation.activeMasterNodes)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between align-items-center">
                <Search placeholder={t("metrics:search.placeholder") as string} mini />
              </li>
            </>
          ) : null}
          {metrics ? (
            <>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span style={{ textDecoration: 'underline' }}>{t("metrics:labels.networkMetrics")}</span>
                <span className="badge bg-secondary badge-lg text-black">{ }</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.blockDifferenceAverage")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(metrics.blockDifferenceAverage)} s</span>
              </li>
              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                Block Last Received
                <span className="badge bg-secondary badge-lg text-black">{timeago.format(metrics.blockLastReceived)}</span>
              </li> */}
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.blockLastDelay")}
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(metrics.blockLastDelay)} s</span>
              </li>
              {/* <li className="list-group-item d-flex justify-content-between align-items-center">
                Time Since Last Block
                <span className="badge bg-secondary badge-lg text-black">{numberWithCommas(metrics.timeSinceLastBlock)} s</span>
              </li> */}
              <li className="list-group-item d-flex justify-content-between align-items-center">
                {t("metrics:labels.blockAverages")}
                <span className="badge bg-secondary badge-lg text-black">{metrics.blocksAverages}</span>
              </li>
            </>) : null}
        </ul>

        <div className="row">
          <div className="col-12 col-md-6 offset-3">
            <h3 className="mt-3 mb-4 text-center">{t("metrics:spyglassHeading")}</h3>
            <LatestBlock />
          </div>


        </div>


        <div className="py-5"></div>


      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common', 'metrics', 'search'])),
  },
});

export default CirculationPage;
