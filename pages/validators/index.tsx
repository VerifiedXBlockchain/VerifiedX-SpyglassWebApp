import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { isMobile } from "react-device-detect";
import { ValidatorCardList } from "../../src/components/validator-card-list";
import { ValidatorList } from "../../src/components/validator-list";
import { API_BASE_URL, IS_TESTNET } from "../../src/constants";
import { Validator } from "../../src/models/validator";



const ValidatorPoolPage: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (typeof window === "undefined") {
    return null;
  }
  const results: any[] = data.results;
  const validators: Validator[] = results.map(v => new Validator(v));

  return (
    <>
      <Head>
        <title>RBX Explorer: Validator Pool{IS_TESTNET ? ' [TESTNET]' : ''}</title>
        <meta name="description" content="ReserveBlock Explorer: Home" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      {isMobile ?
        <div className="text-center px-3 pt-2">
          {validators.length ? (
            <div className="d-inline-block bg-success h6 rounded py-1 px-2 mb-0">
              Total Active Validators: {validators.filter(v => v.isActive).length}
            </div>) : null}
          <Link href={"/validators/search"}>
            <a className="btn-link btn btn-sm" >Check Validator Status</a>
          </Link>
        </div>
        :
        <div className="bg-dark text-end px-3 py-2">
          <div className="d-flex justify-content-end align-items-center">

            {validators.length ? (
              <div className="d-inline-block bg-success h6 rounded py-1 px-2 mb-0">
                Total Active Validators: {validators.filter(v => v.isActive).length}
              </div>) : null}
            <div>
              <Link href={"/validators/search"}>
                <a className="btn-link btn btn-sm" >Check Validator Status</a>
              </Link>
            </div>
          </div>
        </div>}

      {isMobile ? <ValidatorCardList validators={validators} /> : <ValidatorList validators={validators} />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=120'
  )

  const url = `${API_BASE_URL}/masternodes/?is_active=true&compact=true`;
  const result = await fetch(url)
  const data: any[] = await result.json()


  return {
    props: {
      data: data
    },
  }
}



export default ValidatorPoolPage;
