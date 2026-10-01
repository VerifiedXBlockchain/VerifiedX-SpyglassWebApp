import { Block } from "../../models/block";
import { mergeBlocks } from "../blocks";

const block = (height: number, txCount = 0) =>
  new Block({
    height,
    hash: `h${height}`,
    date_crafted: "2026-09-26T12:00:00Z",
    transactions: Array.from({ length: txCount }, (_, i) => ({ hash: `tx${height}-${i}` })),
  });

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

  it("replaces a held block when the incoming copy has more transactions", () => {
    const merged = mergeBlocks([block(10, 1), block(9)], [block(10, 3)]);
    expect(merged.map((b) => b.transactions.length)).toEqual([3, 0]);
  });

  it("keeps the held block when the incoming copy has fewer transactions", () => {
    const existing = [block(10, 3)];
    expect(mergeBlocks(existing, [block(10, 1)])).toBe(existing);
  });
});
