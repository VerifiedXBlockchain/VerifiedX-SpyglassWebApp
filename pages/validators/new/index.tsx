import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { ValidatorList } from "../../../src/components/validator-list";
import { API_BASE_URL, IS_TESTNET } from "../../../src/constants";
import { Validator } from "../../../src/models/validator";

interface Props {
  validators: Validator[];
}

const ValidatorPoolPage: NextPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  if (typeof window === "undefined") {
    return null;
  }
  const results: any[] = data.results;
  const validators: Validator[] = results.map(v => new Validator(v));

  console.log(validators);


  return (
    <div>
      <Head>
        <title>RBX Explorer: Validator Pool{IS_TESTNET ? ' [TESTNET]' : ''}</title>
        <meta name="description" content="ReserveBlock Explorer: Home" />
        <link rel="icon" href="/favicon.png" />
      </Head>


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
      </div>

      <ValidatorList validators={validators} />

    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  // res.setHeader(
  //   'Cache-Control',
  //   'public, s-maxage=10, stale-while-revalidate=59'
  // )

  const url = `${API_BASE_URL}/masternodes/?is_active=true`;
  const result = await fetch(url)
  const data: any[] = await result.json()


  return {
    props: {
      data: data
    },
  }
}



export default ValidatorPoolPage;
