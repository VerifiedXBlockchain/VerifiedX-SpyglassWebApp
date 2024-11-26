/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BlockDetail } from "../../../src/components/block-detail";
import { IS_TESTNET } from "../../../src/constants";
import { Block } from "../../../src/models/block";
import { BlockService } from "../../../src/services/block-service";

const BlockDetailPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [block, setBlock] = useState<Block | undefined>(undefined);

  useEffect(() => {
    if (!id) return;

    const service = new BlockService();

    service.retrieve(id.toString()).then((data) => {
      console.log(data);
      setBlock(data);
    });
  }, [id]);

  if (!block) return <></>;

  const next = block.height + 1;
  const prev = block.height - 1;

  return (
    <>
      <Head>

        <meta name="description" />
        <title>{`VFX Explorer: Block ${block.height}`}{IS_TESTNET ? ' [TESTNET]' : ''}</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div>
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb align-items-center">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <a href="/block">Blocks</a>
              </li>

              <li className="breadcrumb-item active" aria-current="page">
                <a href={`/block/${block.height}`}>{block.height}</a>
              </li>
              <div className="ms-auto">
                <div className="btn-group">
                  {prev > 0 ? (
                    <a
                      href={`/block/${prev}`}
                      className="btn btn-dark btn-sm border"
                    >
                      Prev
                    </a>
                  ) : null}
                  <a
                    href={`/block/${next}`}
                    className="btn btn-dark btn-sm border"
                  >
                    Next
                  </a>
                </div>
              </div>
            </ol>
          </nav>
        </div>

        <BlockDetail block={block} />
      </div>
    </>
  );
};

export default BlockDetailPage;
