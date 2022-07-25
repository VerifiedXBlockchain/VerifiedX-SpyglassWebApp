export class Circulation {
    balance: number;
    feesBurnedSum: number;
    feesBurned: number;
    totalStaked: number;
  
    constructor(d: any) {
      this.balance = d["balance"];
      this.feesBurnedSum = d["fees_burned_sum"];
      this.feesBurned = d["fees_burned"];
      this.totalStaked = d["total_staked"];
    }
  }
  