import { useEffect, useState } from "react";
import { FaucetService } from "../services/faucet-service";
import { TestnetFaucetInfo } from "../models/testnet-faucet-info";
import { IS_TESTNET } from "../constants";

const faucetService = new FaucetService();

interface Props {
    info: TestnetFaucetInfo
}

const TestnetFaucetForm = (props: Props) => {

    const { info } = props;

    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");


    const [verificationUuid, setVerificationUuid] = useState("");
    const [verificationCode, setVerificationCode] = useState("");



    const [addressInvalid, setAddressInvalid] = useState(false)
    const [amountInvalid, setAmountInvalid] = useState(false)
    const [phoneInvalid, setPhoneInvalid] = useState(false)
    const [verificationCodeInvalid, setVerificationCodeInvalid] = useState(false)
    const [processing, setProcessing] = useState(false)

    const [hash, setHash] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)


    // const handleAmountChange = (value: string) => {
    //     let result = parseFloat(value.replace(/[^0-9.]/g, ''));

    //     console.log(result);

    //     if (result !== undefined) {
    //         setAmount(result);
    //     }

    // }

    const handleFormSubmit = async () => {

        setAddressInvalid(false)
        setAmountInvalid(false)
        setError(null)
        setHash(null);


        let hasError = false;


        if (address.length != 34 || address[0].toUpperCase() != "X") {
            setAddressInvalid(true);
            hasError = true;
        }

        const amountParsed = parseFloat(amount);

        if (!amountParsed || amountParsed <= info.minAmount || amountParsed > info.maxAmount) {
            setAmountInvalid(true)
            hasError = true;
        }



        let phoneParsed = phone.replace(/[\s-]/g, ''); // Remove spaces and hyphens
        if (phoneParsed.length >= 10) {
            if (phoneParsed.length === 10) {
                phoneParsed = '+1' + phoneParsed;
            }
        } else {
            console.log('Invalid phone number');
            setPhoneInvalid(true)
            hasError = true;
        }

        if (hasError) {
            return
        }


        setProcessing(true);
        const result = await faucetService.requestFunds(address, amountParsed, phoneParsed)
        setProcessing(false);

        if (result.uuid) {
            setAddress("");
            setAmount("");
            setPhone("");
            setVerificationUuid(result.uuid)
        } else {
            setError(result.message ?? "Error")
        }
        // if (result.hash) {
        //     setAddress("");
        //     setAmount("");
        //     setHash(result.hash);
        // } else {
        //     setError(result.message ?? "Error")
        // }



    }

    const handleVerify = async () => {
        setVerificationCodeInvalid(false);

        if (verificationCode.length < 4) {
            setVerificationCodeInvalid(true);
            return;
        }

        setProcessing(true);
        const result = await faucetService.verify(verificationUuid, verificationCode)
        setProcessing(false);

        if (result.hash) {
            setVerificationUuid("")

            setHash(result.hash);
        } else {
            setError(result.message ?? "Error")
        }



    }





    return (
        <>



            <div className="text-center">


                <ul className="list-group">
                    {IS_TESTNET && (
                        <li className="list-group-item">Available Funds: {info.available} VFX</li>
                    )}
                    <li className="list-group-item">Minimum Request Amount: {info.minAmount} VFX</li>
                    <li className="list-group-item">Maximum Request Amount: {info.maxAmount} VFX</li>
                    {IS_TESTNET && (
                        <li className="list-group-item">Sender Address: {info.address}</li>
                    )}
                </ul>

                <div className="py-2"></div>

            </div>


            {hash && <div className="alert alert-success" >Success, TX Broadcasted!<br />Transaction Hash: {hash}</div>}
            {error && <div className="alert alert-danger" >{error}</div>}

            {verificationUuid && (

                <div className="card">

                    <div className="card-body">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">Verification Code {IS_TESTNET ? '(For Testnet just use 1234)' : ''}</span>
                            </div>
                            <input type="text" placeholder="1234" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                        </div>

                        {verificationCodeInvalid && <p className="text-danger">Invalid Code</p>}


                    </div>

                    <div className="card-footer">
                        <button className="btn btn-secondary" disabled={processing} onClick={handleVerify}>Verify</button>
                    </div>

                </div>
            )}

            {!verificationUuid && (

                <div className="card">
                    <div className="card-body">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">VFX {IS_TESTNET && 'Testnet '}Address</span>
                            </div>
                            <input type="text" placeholder={IS_TESTNET ? `xArscSBw9qk3xuMErGDEXXcbxigfccQvqD` : `RArscSBw9qk3xuMErGDEXXcbxigfccQvqD`} value={address} onChange={(e) => setAddress(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                        </div>

                        {addressInvalid && <p className="text-danger">Invalid Address</p>}


                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">Amount Requested</span>
                            </div>
                            <input type="number" placeholder="10" value={amount ?? ''} onChange={(e) => setAmount(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                        </div>

                        {amountInvalid && <p className="text-danger">Invalid Amount</p>}

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">Phone Number</span>
                            </div>
                            <input type="text" value={phone ?? ''} placeholder="1234567890" onChange={(e) => setPhone(e.target.value)} className="form-control bg-dark text-light" />
                        </div>

                        <div className="text-muted"><small>Your phone number is required to prevent abuse of this service. Once the verification code is sent, only a hash of the phone number is stored.</small></div>

                        {phoneInvalid && <p className="text-danger">Invalid Phone Number</p>}


                    </div>

                    <div className="card-footer">
                        <button className="btn btn-secondary" disabled={processing} onClick={handleFormSubmit}>Request Funds</button>
                    </div>
                </div>

            )}
            {IS_TESTNET && (
                <p className="py-2 text-center"><strong>Please send testnet coin back to <code>{info.address}</code> when you don&apos;t need them anymore.<br />By returning the testnet coins, you contribute to the testnet ecosystem and help maintain its functionality for other developers and testers.</strong></p>
            )}
        </>
    )

}

export default TestnetFaucetForm;