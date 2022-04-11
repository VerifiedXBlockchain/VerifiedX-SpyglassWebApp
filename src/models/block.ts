import { isToday } from "../utils/dates";
import { formatBytes, numberWithCommas } from "../utils/formatting";
import { Transaction } from "./transaction";
import { Validator } from "./validator";

export class Block {
  height: number;
  timestamp: number;
  hash: string;
  validator: string;
  totalAmount: number;
  totalReward: number;
  numberOfTransactions: number;
  size: number;
  craftTime: number;
  transactions: Transaction[] = [];
  prevHash: string;
  chainRefId: string;
  merkleRoot: string;
  stateRoot: string;
  validatorSignature: string;
  // nextValidators: string[];
  totalValidators: number;
  version: number;
  masternode?: Validator;

  constructor(d: any) {
    this.height = d["height"];
    this.timestamp = d["timestamp"];
    this.hash = d["hash"];
    this.validator = d["validator"];
    this.totalAmount = d["total_amount"];
    this.totalReward = d["total_reward"];
    this.numberOfTransactions = d["number_of_transactions"];
    this.size = d["size"];
    this.craftTime = d["craft_time"];
    this.prevHash = d["prev_hash"];
    this.chainRefId = d["chain_ref_id"];
    this.merkleRoot = d["merkle_root"];
    this.stateRoot = d["state_root"];
    this.validatorSignature = d["validator_signature"];
    this.totalValidators = d["total_validators"];
    this.version = d["version"];

    const transactions = d["transactions"];

    if (transactions) {
      for (let tx of transactions) {
        this.transactions.push(new Transaction(tx));
      }
    }

    if (d["masternode"]) {
      this.masternode = new Validator(d["masternode"]);
    }
  }

  hashPreview(n: number = 16): string {
    const amount = Math.floor(n / 2);
    return `${this.hash.slice(0, amount)}...${this.hash.slice(-amount)}`;
  }

  validatorPreview(n: number = 16): string {
    const amount = Math.floor(n / 2);
    return `${this.validator.slice(0, amount)}...${this.validator.slice(
      -amount
    )}`;
  }

  get timestampDate(): Date {
    return new Date(this.timestamp * 1000);
  }

  get timestampLabel(): string {
    if (isToday(this.timestampDate)) {
      return this.timestampDate.toLocaleTimeString();
    }
    return `${this.timestampDate.toLocaleDateString()} ${this.timestampDate.toLocaleTimeString()}`;
  }

  get sizeLabel(): string {
    return formatBytes(this.size);
  }

  get craftTimeLabel(): string {
    return `${numberWithCommas(this.craftTime)}s`;
  }

  get craftTimeAccent(): string {
    if (this.craftTime < 50) {
      return "success";
    }
    if (this.craftTime < 150) {
      return "warning";
    }

    return "danger";
  }
}
