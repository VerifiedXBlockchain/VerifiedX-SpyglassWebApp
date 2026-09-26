import { truncateMiddle } from "../formatting";

describe("truncateMiddle", () => {
  const hash = "e9ece09fc19865d3dd8b8c797d6a4ad69191325a79efafc3a5d9473328e2effa";

  it("keeps the requested number of characters at each end", () => {
    expect(truncateMiddle(hash, 8)).toBe(`${hash.slice(0, 8)}…${hash.slice(-8)}`);
    expect(truncateMiddle(hash, 4)).toBe("e9ec…effa");
  });

  it("leaves short values alone", () => {
    expect(truncateMiddle("RBXabc", 8)).toBe("RBXabc");
    expect(truncateMiddle("12345678901234567", 8)).toBe("12345678901234567");
  });

  it("returns an empty string for empty input", () => {
    expect(truncateMiddle("", 8)).toBe("");
  });
});
