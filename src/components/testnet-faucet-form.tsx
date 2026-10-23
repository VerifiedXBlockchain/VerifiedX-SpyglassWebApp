import { FormEvent, useState } from "react";
import { useTranslation } from "next-i18next";
import { AsYouType, parsePhoneNumberWithError } from "libphonenumber-js";
import { IS_DEVNET, IS_TESTNET, MEMPOOL_BASE } from "../constants";
import { TestnetFaucetInfo } from "../models/testnet-faucet-info";
import { FaucetService } from "../services/faucet-service";
import { validateFaucetRequest } from "../utils/faucet-request";
import { useLocalized } from "../utils/use-localized";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { DetailList, DetailRow } from "./ui/detail-list";
import { Hash } from "./ui/hash";
import { CheckIcon } from "./ui/icons";
import { Pill } from "./ui/pill";
import { TextInput } from "./ui/text-input";
import styles from "./testnet-faucet-form.module.scss";

const faucetService = new FaucetService();
const isTestNetwork = Boolean(IS_DEVNET || IS_TESTNET);

// The verify endpoint returns the node's raw response as a string,
// e.g. {"Result":"Success","Message":"...","Hash":"60ab..."}
const extractTxHash = (raw: string): string => {
  try {
    return JSON.parse(raw).Hash ?? raw;
  } catch {
    return raw; // already a plain hash
  }
};

interface Props {
  info: TestnetFaucetInfo;
}

const TestnetFaucetForm = ({ info }: Props) => {
  const { t } = useTranslation("faucet");
  const localized = useLocalized();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [btcAddress, setBtcAddress] = useState("");
  const [btcAmount, setBtcAmount] = useState("");
  const [phone, setPhone] = useState("");

  const [verificationUuid, setVerificationUuid] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [addressInvalid, setAddressInvalid] = useState(false);
  const [amountInvalid, setAmountInvalid] = useState(false);
  const [btcAddressInvalid, setBtcAddressInvalid] = useState(false);
  const [btcAmountInvalid, setBtcAmountInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [verificationCodeInvalid, setVerificationCodeInvalid] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [hash, setHash] = useState<string | null>(null);
  const [btcHash, setBtcHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Format as the user types; numbers without a country code are treated as US.
  const handlePhoneChange = (value: string) => {
    setPhoneInvalid(false);
    setPhone(new AsYouType("US").input(value));
  };

  const handleRequest = async (event: FormEvent) => {
    event.preventDefault();
    setPhoneInvalid(false);
    setError(null);
    setHash(null);
    setBtcHash(null);

    const { valid, errors, payload } = validateFaucetRequest({ address, amount, btcAddress, btcAmount }, info);
    setAddressInvalid(errors.address);
    setAmountInvalid(errors.amount);
    setBtcAddressInvalid(errors.btcAddress);
    setBtcAmountInvalid(errors.btcAmount);
    if (errors.empty) setError(t("errors.nothingRequested") as string);
    let hasError = !valid;

    let phoneParsed = "";
    try {
      const phoneNumber = parsePhoneNumberWithError(phone, "US");
      if (phoneNumber.isValid()) {
        phoneParsed = phoneNumber.number; // E.164, e.g. +12223334444
      } else {
        setPhoneInvalid(true);
        hasError = true;
      }
    } catch (parseError) {
      console.error("Invalid phone number format", parseError);
      setPhoneInvalid(true);
      hasError = true;
    }

    if (hasError) return;

    setProcessing(true);
    try {
      const result = await faucetService.requestFunds({ ...payload, phone: phoneParsed });
      if (result.uuid) {
        setAddress("");
        setAmount("");
        setBtcAddress("");
        setBtcAmount("");
        setPhone("");
        setVerificationUuid(result.uuid);
      } else {
        setError(result.message ?? (t("errors.generic") as string));
      }
    } catch (requestError) {
      console.error("Faucet request failed", requestError);
      setError(t("errors.generic") as string);
    } finally {
      setProcessing(false);
    }
  };

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault();
    setVerificationCodeInvalid(false);
    setError(null);

    if (verificationCode.trim().length < 4) {
      setVerificationCodeInvalid(true);
      return;
    }

    setProcessing(true);
    try {
      const result = await faucetService.verify(verificationUuid, verificationCode.trim());
      // One part can be paid while the other fails: show whatever was sent, and the error beside it.
      if (result.hash) setHash(extractTxHash(result.hash));
      if (result.btc_hash) setBtcHash(result.btc_hash);
      if (result.hash || result.btc_hash) {
        setVerificationUuid("");
        setVerificationCode("");
      }
      if ((!result.hash && !result.btc_hash) || /fail/i.test(result.message ?? "")) {
        setError(result.message ?? (t("errors.generic") as string));
      }
    } catch (verifyError) {
      console.error("Faucet verification failed", verifyError);
      setError(t("errors.generic") as string);
    } finally {
      setProcessing(false);
    }
  };

  const addressLabel = IS_DEVNET ? t("form.addressLabelDevnet") : IS_TESTNET ? t("form.addressLabelTestnet") : t("form.addressLabelMainnet");
  const addressPlaceholder = isTestNetwork ? t("form.addressPlaceholderTestnet") : t("form.addressPlaceholderMainnet");

  return (
    <div className={styles.stack}>
      <Card title={t("info.heading")}>
        <DetailList>
          {isTestNetwork ? (
            <DetailRow label={t("info.availableLabel")} mono>
              {info.available} VFX
            </DetailRow>
          ) : null}
          <DetailRow label={t("info.minLabel")} mono>
            {info.minAmount} VFX
          </DetailRow>
          <DetailRow label={t("info.maxLabel")} mono>
            {info.maxAmount} VFX
          </DetailRow>
          {info.btc.enabled ? (
            <DetailRow label={t("info.btcMaxLabel")} mono>
              {info.btc.maxAmount} BTC
            </DetailRow>
          ) : null}
          {isTestNetwork ? (
            <DetailRow label={t("info.senderLabel")} stacked>
              <Hash value={info.address} full />
            </DetailRow>
          ) : null}
        </DetailList>
      </Card>

      {hash ? (
        <div className={[styles.notice, styles.success].join(" ")} role="status">
          <span className={styles.noticeTitle}>
            <Pill tone="green" icon={<CheckIcon size={11} />}>
              {t("success.broadcast")}
            </Pill>
          </span>
          <Hash value={hash} full href={localized(`/transaction/${hash}`)} />
        </div>
      ) : null}

      {btcHash ? (
        <div className={[styles.notice, styles.success].join(" ")} role="status">
          <span className={styles.noticeTitle}>
            <Pill tone="green" icon={<CheckIcon size={11} />}>
              {t("success.btcBroadcast")}
            </Pill>
          </span>
          <Hash value={btcHash} full href={`${MEMPOOL_BASE}/tx/${btcHash}`} />
        </div>
      ) : null}

      {error ? (
        <div className={[styles.notice, styles.failure].join(" ")} role="alert">
          {error}
        </div>
      ) : null}

      {verificationUuid ? (
        <Card title={t("form.verifyHeading")}>
          <form className={styles.fields} onSubmit={handleVerify}>
            <TextInput
              name="verification-code"
              label={t("form.verificationCodeLabel")}
              placeholder={t("form.verificationCodePlaceholder") as string}
              value={verificationCode}
              onChange={(event) => setVerificationCode(event.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              mono
              error={verificationCodeInvalid ? t("errors.invalidCode") : undefined}
            />
            <div className={styles.actions}>
              <Button type="submit" variant="primary" disabled={processing}>
                {t("form.verifyCta")}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card title={t("form.requestHeading")}>
          <form className={styles.fields} onSubmit={handleRequest}>
            <TextInput
              name="address"
              label={addressLabel}
              placeholder={addressPlaceholder as string}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              mono
              autoComplete="off"
              spellCheck={false}
              error={addressInvalid ? t("errors.invalidAddress") : undefined}
            />
            <TextInput
              name="amount"
              type="number"
              label={t("form.amountLabel")}
              placeholder={t("form.amountPlaceholder") as string}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              min={info.minAmount}
              max={info.maxAmount}
              step="any"
              error={amountInvalid ? t("errors.invalidAmount") : undefined}
            />
            {info.btc.enabled ? (
              <>
                <TextInput
                  name="btc-address"
                  label={t("form.btcAddressLabel")}
                  placeholder={t("form.btcAddressPlaceholder") as string}
                  value={btcAddress}
                  onChange={(event) => setBtcAddress(event.target.value)}
                  mono
                  autoComplete="off"
                  spellCheck={false}
                  hint={t("form.btcHelp")}
                  error={btcAddressInvalid ? t("errors.invalidBtcAddress") : undefined}
                />
                <TextInput
                  name="btc-amount"
                  type="number"
                  label={t("form.btcAmountLabel")}
                  placeholder={t("form.btcAmountPlaceholder") as string}
                  value={btcAmount}
                  onChange={(event) => setBtcAmount(event.target.value)}
                  min={info.btc.minAmount}
                  max={info.btc.maxAmount}
                  step="any"
                  error={btcAmountInvalid ? t("errors.invalidAmount") : undefined}
                />
              </>
            ) : null}
            <TextInput
              name="phone"
              type="tel"
              label={t("form.phoneLabel")}
              placeholder={t("form.phonePlaceholder") as string}
              value={phone}
              onChange={(event) => handlePhoneChange(event.target.value)}
              autoComplete="tel"
              hint={t("form.phoneHelp")}
              error={phoneInvalid ? t("errors.invalidPhone") : undefined}
            />
            <div className={styles.actions}>
              <Button type="submit" variant="primary" disabled={processing}>
                {t("form.requestCta")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {isTestNetwork ? <p className={styles.returnNote}>{IS_DEVNET ? t("returnCoinsDevnet", { address: info.address }) : t("returnCoinsTestnet", { address: info.address })}</p> : null}
    </div>
  );
};

export default TestnetFaucetForm;
