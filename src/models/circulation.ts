export class Circulation {
    balance: string;
    feesBurnedSum: number;
    feesBurned: number;
  
    constructor(d: any) {
      this.balance = d["balance"];
      this.feesBurnedSum = d["fees_burned_sum"];
      this.feesBurned = d["fees_burned"];
    }
  }
  