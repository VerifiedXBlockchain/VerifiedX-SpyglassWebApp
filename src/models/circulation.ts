export class Circulation {
  balance: number;
  lifetimeSupply: number;
  feesBurnedSum: number;
  feesBurned: number;
  totalStaked: number;
  activeMasterNodes: number;
  totalMasterNodes: number;
  cliVersion: string;
  totalAddresses: number;
  totalTransactions: number;

  constructor(d: any) {
    this.balance = d["balance"];
    this.lifetimeSupply = d["lifetime_supply"] || 372000000;
    this.feesBurnedSum = d["fees_burned_sum"];
    this.feesBurned = d["fees_burned"];
    this.totalStaked = d["total_staked"];
    this.activeMasterNodes = d["active_master_nodes"];
    this.totalMasterNodes = d["total_master_nodes"];
    this.cliVersion = d["cli_version"];
    this.totalAddresses = d["total_addresses"];
    this.totalTransactions = d["total_transactions"];
  }
}
