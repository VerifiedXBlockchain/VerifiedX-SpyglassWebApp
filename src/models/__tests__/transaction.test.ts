import { Transaction } from "../transaction";

const tx = (type: number, data: unknown = null) =>
  new Transaction({ hash: "h", transaction_type: type, data: data == null ? null : JSON.stringify(data) });

describe("Transaction.transactionTypeLabel", () => {
  it("names the vBTC bridge types 39 to 42", () => {
    expect(tx(39).transactionTypeLabel).toBe("vBTC Bridge Pool Unlock");
    expect(tx(40).transactionTypeLabel).toBe("vBTC Bridge Exit to BTC");
    expect(tx(41).transactionTypeLabel).toBe("vBTC Bridge Exit to BTC Complete");
    expect(tx(42).transactionTypeLabel).toBe("vBTC Bridge Exit to BTC Failed");
  });

  it("names the Bitcoin attestation types 43, 45 and 46", () => {
    expect(tx(43).transactionTypeLabel).toBe("Bitcoin Report");
    expect(tx(45).transactionTypeLabel).toBe("Bitcoin Reorg");
    expect(tx(46).transactionTypeLabel).toBe("vBTC Vault Rekey");
  });

  it("names a type 44 by its function", () => {
    expect(tx(44, { Function: "VBTCWithdrawalFeeBump()" }).transactionTypeLabel).toBe("vBTC Withdrawal Fee Raise");
    expect(tx(44, { Function: "VBTCWithdrawalRelease()" }).transactionTypeLabel).toBe("vBTC Withdrawal Release");
  });

  it("gives a type 44 with missing or unreadable data the neutral name", () => {
    expect(tx(44).transactionTypeLabel).toBe("vBTC Withdrawal Pin");
    expect(tx(44, { Function: "Other()" }).transactionTypeLabel).toBe("vBTC Withdrawal Pin");
    const broken = new Transaction({ hash: "h", transaction_type: 44, data: "{not json" });
    expect(broken.transactionTypeLabel).toBe("vBTC Withdrawal Pin");
  });
});
