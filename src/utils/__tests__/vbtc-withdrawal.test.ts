import { VbtcWithdrawal } from "../../models/vbtc-token";
import { withdrawalStage } from "../vbtc-withdrawal";

const stage = (status: string, extra: Record<string, unknown> = {}) => withdrawalStage(new VbtcWithdrawal({ status, ...extra }));

describe("withdrawalStage", () => {
  it("maps Spyglass's statuses to stages", () => {
    expect(stage("requested")).toBe("open");
    expect(stage("pending_btc")).toBe("bitcoinPending");
    expect(stage("cancellation_requested")).toBe("cancelRequested");
    expect(stage("completed")).toBe("paid");
    expect(stage("cancelled")).toBe("closed");
  });

  it("reads an open watched request's pin state", () => {
    expect(stage("requested", { pin_state: "Waiting" })).toBe("waiting");
    expect(stage("requested", { pin_state: "Pinned" })).toBe("pinned");
    expect(stage("requested", { pin_state: "Pinned", releasing: true })).toBe("releasing");
  });

  it("reads why a closed request closed", () => {
    expect(stage("cancelled", { closed_because: "Cancelled" })).toBe("cancelled");
    expect(stage("cancelled", { closed_because: "Released" })).toBe("released");
    expect(stage("cancelled", { closed_because: "Expired" })).toBe("expired");
    expect(stage("cancelled", { closed_because: "Void" })).toBe("void");
    expect(stage("cancelled", { closed_because: "Something" })).toBe("closed");
  });

  it("ignores a pin state on a closed or paid request", () => {
    expect(stage("completed", { pin_state: "Pinned" })).toBe("paid");
    expect(stage("cancelled", { pin_state: "Waiting" })).toBe("closed");
  });

  it("treats an unknown status as open rather than settled", () => {
    expect(stage("")).toBe("open");
    expect(stage("something_new")).toBe("open");
  });
});
