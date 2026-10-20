import { VbtcWithdrawal } from "../../models/vbtc-token";
import { withdrawalStage } from "../vbtc-withdrawal";

const stage = (status: string) => withdrawalStage(new VbtcWithdrawal({ status }));

describe("withdrawalStage", () => {
  it("maps Spyglass's statuses to stages", () => {
    expect(stage("requested")).toBe("open");
    expect(stage("pending_btc")).toBe("bitcoinPending");
    expect(stage("cancellation_requested")).toBe("cancelRequested");
    expect(stage("completed")).toBe("paid");
    expect(stage("cancelled")).toBe("closed");
  });

  it("treats an unknown status as open rather than settled", () => {
    expect(stage("")).toBe("open");
    expect(stage("something_new")).toBe("open");
  });
});
