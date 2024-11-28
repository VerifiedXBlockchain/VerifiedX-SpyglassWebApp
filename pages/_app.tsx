/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import "../src/styles/styles.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { AppProps } from "next/app";
import { Search } from "../src/components/search";
import { isMobile } from "react-device-detect";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IS_TESTNET, MAINTENENCE_MODE } from "../src/constants";
import Head from "next/head";
import { useState } from "react";

import 'bootstrap-icons/font/bootstrap-icons.css'

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVzZXJ2ZWJsb2NrIiwiYSI6ImNsMXV2dWN6NjAyaTMzaW1xMXhqd243dG0ifQ.J6Sjh7N5mgmHAbhVytO_WQ";

function MyApp({ Component, pageProps }: AppProps) {


  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  if (MAINTENENCE_MODE) {
    return (
      <>
        <Head>
          <title>VFX Explorer{IS_TESTNET ? ' TESTNET' : ''}</title>
          <meta name="description" content="ReserveBlock Explorer: Home" />
          <link rel="icon" href="/favicon.png" />
        </Head>
        <div className="p-5 text-center">
          Down for Maintenance. Come back soon!
        </div>
      </>
    );
  }

  return (
    <div>
      <header>
        <nav className="navbar navbar-dark navbar-expand-lg text-light bg-black fixed-top pb-1 pt-2">
          <div className="container-fluid">
            <a className="navbar-brand text-white" href="/">
              <img
                src="/cube.gif"
                alt="cube icon"
                className="me-1"
                style={{ width: 40, height: 40, position: "relative", top: -2 }}
              />
              <span>VFX{IS_TESTNET ? <span style={{ fontWeight: 500, color: "#67ad5f" }}>  Testnet</span> : <span> Explorer</span>}</span>
            </a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07XL" aria-controls="navbarsExample07XL" aria-expanded="false" aria-label="Toggle navigation" onClick={handleNavCollapse}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarsExample07XL">
              <div className="navbar-nav">
                <a className="nav-link text-secondary" href="/block">
                  Blocks
                </a>
                <a
                  className="nav-link text-secondary"
                  href="/transaction"
                >
                  Transactions
                </a>

                <a
                  className="nav-link text-secondary"
                  href="/nfts"
                >
                  NFT Data
                </a>

                <a
                  className="nav-link text-secondary"
                  href="/validators"
                >
                  Validators
                </a>

                <a
                  className="nav-link text-secondary"
                  href="/domains"
                >
                  Domains
                </a>

                <a
                  className="nav-link text-secondary"
                  href="/vbtc-token"
                >
                  vBTC Tokens
                </a>

                {!IS_TESTNET ? (

                  <a
                    className="nav-link text-secondary"
                    href="/map"
                  >
                    Map
                  </a>
                ) : null}

                {!IS_TESTNET ? (

                  <a
                    className="nav-link text-secondary"
                    href="/metrics"
                  >
                    Metrics
                  </a>
                ) : null}

                {IS_TESTNET ? (

                  <a
                    className="nav-link text-secondary"
                    href="/faucet"
                  >
                    Faucet
                  </a>
                ) : null}


                <a
                  className="nav-link text-secondary"
                  href="/search"
                >
                  Search
                </a>

                <span className="nav-link text-muted d-none d-lg-block">|</span>
                <a
                  className="nav-link text-secondary "
                  href="https://reserveblock.io"
                  target="blank"
                  rel="noreferrer"
                >
                  ReserveBlock.io
                </a>
                <a
                  className="nav-link text-secondary "
                  href="https://github.com/ReserveBlockIO"
                  target="blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </div>
            </div>
            <div className="d-flex  d-none d-lg-block">
              <Search />
            </div>
          </div>
        </nav>
      </header>
      <div style={{ height: 64 }}></div>

      <div className=" d-block d-lg-none">
        <div className="container">
          <Search />
        </div>
      </div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
