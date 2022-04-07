/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import "../src/styles/styles.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { AppProps } from "next/app";
import { Search } from "../src/components/search";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <header>
        <nav className="navbar navbar-expand text-light bg-black fixed-top pb-1 pt-2">
          <div className="container-fluid">
            <a className="navbar-brand text-white" href="/">
              <img
                src="/cube.gif"
                alt="cube icon"
                className="me-1"
                style={{ width: 40, height: 40, position: "relative", top: -2 }}
              />
              <span>RBX Explorer</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <a className="nav-link text-secondary" href="/block">
                  Blocks
                </a>
                <a className="nav-link text-secondary" href="/transaction">
                  Transactions
                </a>
                <span className="nav-link text-muted">|</span>
                <a
                  className="nav-link text-secondary"
                  href="https://reserveblock.io"
                  target="blank"
                  rel="noreferrer"
                >
                  ReserveBlock.io
                </a>
                <a
                  className="nav-link text-secondary"
                  href="https://github.com/ReserveBlockIO"
                  target="blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </div>
            </div>
            <form className="d-flex">
              <Search />
            </form>
          </div>
        </nav>
      </header>
      <div style={{ height: 70 }}></div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
