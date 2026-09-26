import { Block } from "../../models/block";
import { blockTiming } from "../blocks";

const NOW = Date.parse("2026-09-26T12:00:00Z");
const block = (height: number, secondsAgo: number) => new Block({ height, hash: `h${height}`, date_crafted: new Date(NOW - secondsAgo * 1000).toISOString(), transactions: [] });

describe("blockTiming", () => {
  it("averages the interval across the sample and reports the newest gap", () => {
    const timing = blockTiming([block(5, 0), block(4, 10), block(3, 25), block(2, 30)]);
    expect(timing.sampleSize).toBe(4);
    expect(timing.averageSeconds).toBe(10);
    expect(timing.lastDelaySeconds).toBe(10);
  });

  it("needs at least two blocks", () => {
    expect(blockTiming([])).toEqual({ sampleSize: 0 });
    expect(blockTiming([block(1, 0)])).toEqual({ sampleSize: 1 });
  });

  it("ignores blocks with unparseable dates and caps the sample at 30", () => {
    const blocks = Array.from({ length: 40 }, (_, i) => block(100 - i, i * 12));
    blocks.push(new Block({ height: 1, hash: "bad", date_crafted: "not-a-date", transactions: [] }));
    const timing = blockTiming(blocks);
    expect(timing.sampleSize).toBe(30);
    expect(timing.averageSeconds).toBe(12);
  });
});
