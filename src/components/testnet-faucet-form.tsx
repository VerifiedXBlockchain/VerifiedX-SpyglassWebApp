import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { FaucetService } from "../services/faucet-service";
import { TestnetFaucetInfo } from "../models/testnet-faucet-info";
import { IS_TESTNET, IS_DEVNET } from "../constants";
import { isValidPhoneNumber, AsYouType, parsePhoneNumberWithError } from 'libphonenumber-js';

const faucetService = new FaucetService();

interface Props {
    info: TestnetFaucetInfo
}

const TestnetFaucetForm = (props: Props) => {
    const { t } = useTranslation("faucet");

    const { info } = props;

    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [phone, setPhone] = useState("");
    const [formattedPhone, setFormattedPhone] = useState("");


    const [verificationUuid, setVerificationUuid] = useState("");
    const [verificationCode, setVerificationCode] = useState("");



    const [addressInvalid, setAddressInvalid] = useState(false)
    const [amountInvalid, setAmountInvalid] = useState(false)
    const [phoneInvalid, setPhoneInvalid] = useState(false)
    const [verificationCodeInvalid, setVerificationCodeInvalid] = useState(false)
    const [processing, setProcessing] = useState(false)

    const [hash, setHash] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Format phone number as user types
    const handlePhoneChange = (value: string) => {
        setPhone(value);
        setPhoneInvalid(false);
        
        // Use AsYouType formatter for real-time formatting
        const formatter = new AsYouType('US'); // Default to US, but will auto-detect international
        const formatted = formatter.input(value);
        setFormattedPhone(formatted);
    }

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



        let phoneParsed = '';
        try {
            const phoneNumber = parsePhoneNumberWithError(phone);
            
            if (phoneNumber && isValidPhoneNumber(phoneNumber.number)) {
                phoneParsed = phoneNumber.number; // Get the international format
            } else {
                console.log('Invalid phone number');
                setPhoneInvalid(true);
                hasError = true;
            }
        } catch (error) {
            console.log('Invalid phone number format:', error);
            setPhoneInvalid(true);
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
            setError(result.message ?? (t("errors.generic") as string))
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
            setError(result.message ?? (t("errors.generic") as string))
        }



    }





    return (
        <>



            <div className="text-center">


                <ul className="list-group">
                    {(IS_DEVNET || IS_TESTNET) && (
                        <li className="list-group-item">{t("info.available", { amount: info.available })}</li>
                    )}
                    <li className="list-group-item">{t("info.min", { amount: info.minAmount })}</li>
                    <li className="list-group-item">{t("info.max", { amount: info.maxAmount })}</li>
                    {(IS_DEVNET || IS_TESTNET) && (
                        <li className="list-group-item">{t("info.sender", { address: info.address })}</li>
                    )}
                </ul>

                <div className="py-2"></div>

            </div>


            {hash && <div className="alert alert-success" >{t("success.broadcast")}<br />{t("success.hash", { hash })}</div>}
            {error && <div className="alert alert-danger" >{error}</div>}

            {verificationUuid && (

                <div className="card">

                    <div className="card-body">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">{t("form.verificationCodeLabel")}</span>
                            </div>
                            <input type="text" placeholder={t("form.verificationCodePlaceholder") as string} value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                        </div>

                        {verificationCodeInvalid && <p className="text-danger">{t("errors.invalidCode")}</p>}


                    </div>

                    <div className="card-footer">
                        <button className="btn btn-secondary" disabled={processing} onClick={handleVerify}>{t("form.verifyCta")}</button>
                    </div>

                </div>
            )}

            {!verificationUuid && (

                <div className="card">
                    <div className="card-body">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">{IS_DEVNET ? t("form.addressLabelDevnet") : IS_TESTNET ? t("form.addressLabelTestnet") : t("form.addressLabelMainnet")}</span>
                            </div>
                            <input type="text" placeholder={(IS_DEVNET || IS_TESTNET) ? (t("form.addressPlaceholderTestnet") as string) : (t("form.addressPlaceholderMainnet") as string)} value={address} onChange={(e) => setAddress(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                        </div>

                        {addressInvalid && <p className="text-danger">{t("errors.invalidAddress")}</p>}


                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">{t("form.amountLabel")}</span>
                            </div>
                            <input type="number" placeholder={t("form.amountPlaceholder") as string} value={amount ?? ''} onChange={(e) => setAmount(e.target.value)} className="form-control bg-dark text-light" pattern="^[0-9\b]+$" />
                        </div>

                        {amountInvalid && <p className="text-danger">{t("errors.invalidAmount")}</p>}

                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon3">{t("form.phoneLabel")}</span>
                            </div>
                            <input
                                type="tel"
                                value={phone ?? ''}
                                placeholder={t("form.phonePlaceholder") as string}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                className="form-control bg-dark text-light"
                            />
                        </div>

                        <div className="text-muted"><small>{t("form.phoneHelp")}</small></div>

                        {phoneInvalid && <p className="text-danger">{t("errors.invalidPhone")}</p>}


                    </div>

                    <div className="card-footer">
                        <button className="btn btn-secondary" disabled={processing} onClick={handleFormSubmit}>{t("form.requestCta")}</button>
                    </div>
                </div>

            )}
            {(IS_DEVNET || IS_TESTNET) && (
                <p className="py-2 text-center"><strong>{IS_DEVNET ? t("returnCoinsDevnet", { address: info.address }) : t("returnCoinsTestnet", { address: info.address })}</strong></p>
            )}
        </>
    )

}

export default TestnetFaucetForm;