/* eslint-disable @next/next/no-html-link-for-pages */
import { NextPage } from "next";
import TestnetFaucetForm from "../../src/components/testnet-faucet-form";
import { useEffect, useState } from "react";
import { TestnetFaucetInfo } from "../../src/models/testnet-faucet-info";
import { FaucetService } from "../../src/services/faucet-service";
import { IS_TESTNET } from "../../src/constants";


const faucetService = new FaucetService();


const FaucetPage: NextPage = () => {

    const [info, setInfo] = useState<TestnetFaucetInfo | null>(null);


    useEffect(() => {
        faucetService.info().then((data) => {
            setInfo(data);
        })
    }, [])




    return (
        <div>
            <div className="container">
                <h3 className="mt-3 text-center">VFX {IS_TESTNET && 'Testnet '}Faucet</h3>
                <div className="py-1"></div>


                {info && <TestnetFaucetForm info={info} />}

            </div>
        </div>
    );
};

export default FaucetPage;
