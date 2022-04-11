/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BlockDetail } from "../../../src/components/block-detail";
import { ValidatorDetail } from "../../../src/components/validator-detail";
import { Block } from "../../../src/models/block";
import { Validator } from "../../../src/models/validator";
import { BlockService } from "../../../src/services/block-service";
import { ValidatorService } from "../../../src/services/validator-service";

const ValidatorDetailPage: NextPage = () => {
  const router = useRouter();
  const { address } = router.query;

  const [validator, setValidator] = useState<Validator | undefined>(undefined);

  useEffect(() => {
    if (!address) return;

    const service = new ValidatorService();

    service.retrieve(`${address}`).then((data) => {
      console.log(data);
      setValidator(data);
    });
  }, [address]);

  if (!validator) return <></>;

  return (
    <div>
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb align-items-center">
            <li className="breadcrumb-item">
              <a href="/">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              <a href="/validators">Validators</a>
            </li>

            <li className="breadcrumb-item active" aria-current="page">
              <a href={`/validators/${validator.address}`}>
                {validator.address}
              </a>
            </li>
          </ol>
        </nav>
      </div>

      <ValidatorDetail validator={validator}></ValidatorDetail>
    </div>
  );
};

export default ValidatorDetailPage;
