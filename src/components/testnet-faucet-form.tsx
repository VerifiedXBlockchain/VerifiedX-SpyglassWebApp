import { FormEvent, useState } from "react";
import { useTranslation } from "next-i18next";
import { AsYouType, parsePhoneNumberWithError } from "libphonenumber-js";
import { IS_DEVNET, IS_TESTNET } from "../constants";
import { TestnetFaucetInfo } from "../models/testnet-faucet-info";
import { FaucetService } from "../services/faucet-service";
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
  const [phone, setPhone] = useState("");

  const [verificationUuid, setVerificationUuid] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [addressInvalid, setAddressInvalid] = useState(false);
  const [amountInvalid, setAmountInvalid] = useState(false);
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [verificationCodeInvalid, setVerificationCodeInvalid] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Format as the user types; numbers without a country code are treated as US.
  const handlePhoneChange = (value: string) => {
    setPhoneInvalid(false);
    setPhone(new AsYouType("US").input(value));
  };

  const handleRequest = async (event: FormEvent) => {
    event.preventDefault();
    setAddressInvalid(false);
    setAmountInvalid(false);
    setPhoneInvalid(false);
    setError(null);
    setHash(null);

    let hasError = false;

    if (address.length !== 34 || address[0].toUpperCase() !== "X") {
      setAddressInvalid(true);
      hasError = true;
    }

    const amountParsed = parseFloat(amount);
    if (!amountParsed || amountParsed <= info.minAmount || amountParsed > info.maxAmount) {
      setAmountInvalid(true);
      hasError = true;
    }

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
      const result = await faucetService.requestFunds(address, amountParsed, phoneParsed);
      if (result.uuid) {
        setAddress("");
        setAmount("");
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
      if (result.hash) {
        setVerificationUuid("");
        setVerificationCode("");
        setHash(extractTxHash(result.hash));
      } else {
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
