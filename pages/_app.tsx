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
import { useEffect, useState } from "react";

import 'bootstrap-icons/font/bootstrap-icons.css'
import Script from "next/script";

mapboxgl.accessToken =
  "pk.eyJ1IjoicmVzZXJ2ZWJsb2NrIiwiYSI6ImNsMXV2dWN6NjAyaTMzaW1xMXhqd243dG0ifQ.J6Sjh7N5mgmHAbhVytO_WQ";

function MyApp({ Component, pageProps }: AppProps) {




  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  if (MAINTENENCE_MODE) {
    return (
      <>
        <Head>
          <title>VFX Spyglass{IS_TESTNET ? ' TESTNET' : ''}</title>
          <meta name="description" content="VerifiedX Spyglass: Home" />
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
                style={{ width: 32, height: 32, position: "relative", top: -2 }}
              />
              <span>Verified<span className="text-secondary" style={{ fontWeight: '600' }}>X</span> <span style={{ opacity: 0.85, fontWeight: 200 }}>Spyglass</span></span>
            </a>

            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07XL" aria-controls="navbarsExample07XL" aria-expanded="false" aria-label="Toggle navigation" onClick={handleNavCollapse}>
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarsExample07XL">
              <div className="navbar-nav">
                <a className="nav-link" href="/block">
                  Blocks
                </a>

                <a
                  className="nav-link"
                  href="/transaction"
                >
                  Transactions
                </a>

                <a
                  className="nav-link"
                  href="/validators"
                >
                  Validators
                </a>

                {!IS_TESTNET ? (

                  <a
                    className="nav-link"
                    href="/metrics"
                  >
                    Metrics
                  </a>
                ) : null}

                <a
                  className="nav-link"
                  href="/domains"
                >
                  Domains
                </a>


                <a
                  className="nav-link btc-link"
                  href="/vbtc-token"
                >
                  vBTC
                </a>

                <a
                  className="nav-link btc-link"
                  href={IS_TESTNET ? "https://mempool.space/testnet4" : "https://mempool.space/"}
                  target="_blank"
                  rel="noreferrer"
                >
                  BTC Spyglass
                </a>

                <a
                  className="nav-link"
                  href="/fungible-token"
                >
                  Fungible Tokens
                </a>

                <a
                  className="nav-link"
                  href="/nfts"
                >
                  NFTs
                </a>

                {/* {!IS_TESTNET ? (

                  <a
                    className="nav-link"
                    href="/map"
                  >
                    Map
                  </a>
                ) : null} */}

                {IS_TESTNET ? (

                  <a
                    className="nav-link"
                    href="/faucet"
                  >
                    Faucet
                  </a>
                ) : null}

                <a
                  className="nav-link"
                  href="/search"
                >
                  Search
                </a>

                <span className="nav-link text-muted d-none d-lg-block">|</span>
                <a
                  className="nav-link "
                  href="https://verifiedx.io"
                  target="blank"
                  rel="noreferrer"
                >
                  VerifiedX.io
                </a>
                <a
                  className="nav-link "
                  href="https://docs.verifiedx.io"
                  target="blank"
                  rel="noreferrer"
                >
                  Docs
                </a>

                <a
                  className="nav-link "
                  href="https://github.com/VerifiedXBlockchain"
                  target="blank"
                  rel="noreferrer"
                >
                  Github
                </a>

                <a
                  className="nav-link "
                  href="https://discord.gg/7cd5ebDQCj"
                  target="blank"
                  rel="noreferrer"
                >
                  Discord
                </a>

                <a
                  className="nav-link "
                  href="https://x.com/VFXBlockchain"
                  target="blank"
                  rel="noreferrer"
                >
                  X
                </a>
              </div>
            </div>
            <div className="d-flex  d-none d-lg-block">
              <Search />
            </div>
          </div>
        </nav>
      </header>
      <div style={{ height: 54 }}></div>

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
