import { Block } from "../../models/block";
import { mergeBlocks } from "../blocks";

const block = (height: number) => new Block({ height, hash: `h${height}`, date_crafted: "2026-09-26T12:00:00Z", transactions: [] });

describe("mergeBlocks", () => {
  it("adds unseen blocks and keeps the list newest first", () => {
    const merged = mergeBlocks([block(10), block(9)], [block(11), block(8)]);
    expect(merged.map((b) => b.height)).toEqual([11, 10, 9, 8]);
  });

  it("drops duplicates by height", () => {
    const merged = mergeBlocks([block(10), block(9)], [block(10), block(9)]);
    expect(merged.map((b) => b.height)).toEqual([10, 9]);
  });

  it("returns the same array when nothing changed, so React can skip a render", () => {
    const existing = [block(10), block(9)];
    expect(mergeBlocks(existing, [block(9)])).toBe(existing);
    expect(mergeBlocks(existing, [])).toBe(existing);
  });
});
