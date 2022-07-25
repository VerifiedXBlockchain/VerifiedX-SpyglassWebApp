import { isToday } from "../utils/dates";
import { formatBytes, numberWithCommas } from "../utils/formatting";
import { Transaction } from "./transaction";
import { Validator } from "./validator";

export class Block {
  height: number;
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
  dateCrafted: Date;

  constructor(d: any) {
    this.height = d["height"];
    if (d["master_node"]) {
      this.masternode = new Validator(d["master_node"]);
    }

    this.hash = d["hash"];
    this.prevHash = d["prev_hash"];
    this.validator = d["validator_address"];
    this.validatorSignature = d["validator_signature"];
    this.chainRefId = d["chain_ref_id"];
    this.merkleRoot = d["merkle_root"];
    this.stateRoot = d["state_root"];
    this.totalReward = d["total_reward"];
    this.totalAmount = d["total_amount"];
    this.totalValidators = d["total_validators"];
    this.version = d["version"];
    this.size = d["size"];
    this.craftTime = d["craft_time"];
    this.dateCrafted = new Date(d["date_crafted"]);

    const transactions = d["transactions"];
    this.numberOfTransactions = transactions?.length || 0;

    if (transactions) {
      for (let tx of transactions) {
        this.transactions.push(new Transaction(tx));
      }

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


  get timestampLabel(): string {
    if (isToday(this.dateCrafted)) {
      return this.dateCrafted.toLocaleTimeString();
    }
    return `${this.dateCrafted.toLocaleDateString()} ${this.dateCrafted.toLocaleTimeString()}`;
  }

  get sizeLabel(): string {
    return formatBytes(this.size);
  }

  get craftTimeLabel(): string {
    return `${numberWithCommas(this.craftTime)}s`;
  }

  get craftTimeAccent(): string {
    if (this.craftTime < 1000) {
      return "success";
    }
    if (this.craftTime < 2000) {
      return "warning";
    }

    return "danger";
  }
}
