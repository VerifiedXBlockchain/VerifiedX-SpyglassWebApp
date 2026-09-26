import { formatRelativeTime } from "../relative-time";

const NOW = new Date("2026-09-26T12:00:00Z").getTime();
const secondsAgo = (s: number) => new Date(NOW - s * 1000);

describe("formatRelativeTime", () => {
  it("uses seconds under a minute", () => {
    expect(formatRelativeTime(secondsAgo(14), NOW, "en")).toMatch(/^14\s?s(ec\.?)? ago$/);
  });

  it("never says zero seconds for a block that just arrived", () => {
    expect(formatRelativeTime(secondsAgo(0.3), NOW, "en")).toMatch(/^1\s?s(ec\.?)? ago$/);
    expect(formatRelativeTime(secondsAgo(0), NOW, "en")).toMatch(/^1\s?s(ec\.?)? ago$/);
  });

  it("steps up through minutes, hours and days", () => {
    expect(formatRelativeTime(secondsAgo(95), NOW, "en")).toMatch(/^2\s?m/);
    expect(formatRelativeTime(secondsAgo(3 * 3600), NOW, "en")).toMatch(/^3\s?h/);
    expect(formatRelativeTime(secondsAgo(2 * 86400), NOW, "en")).toMatch(/^2\s?d/);
  });

  it("formats for the requested locale", () => {
    expect(formatRelativeTime(secondsAgo(14), NOW, "es")).toMatch(/^hace 14/);
  });

  it("accepts a Date for now", () => {
    expect(formatRelativeTime(secondsAgo(30), new Date(NOW), "en")).toMatch(/^30/);
  });
});
