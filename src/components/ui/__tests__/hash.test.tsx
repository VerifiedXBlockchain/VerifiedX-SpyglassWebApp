import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hash } from "../hash";
import { identityT } from "../../../test-utils/mocks";

jest.mock("next-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => identityT(key) }),
}));

const HASH = "e9ece09fc19865d3dd8b8c797d6a4ad69191325a79efafc3a5d9473328e2effa";

describe("Hash", () => {
  it("shows a middle-truncated value with the full hash on hover", () => {
    render(<Hash value={HASH} copy={false} />);
    const text = screen.getByTitle(HASH);
    expect(text).toHaveTextContent(`${HASH.slice(0, 8)}…${HASH.slice(-8)}`);
  });

  it("renders a link when given an href", () => {
    render(<Hash value={HASH} href="/block/1" copy={false} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/block/1");
  });

  it("copies the full value and confirms", async () => {
    // user-event installs its own navigator.clipboard stub for the test.
    const user = userEvent.setup();
    render(<Hash value={HASH} />);
    await act(async () => {
      await user.click(screen.getByRole("button", { name: "action.copy" }));
    });
    expect(await navigator.clipboard.readText()).toBe(HASH);
    expect(screen.getByRole("button", { name: "action.copied" })).toBeInTheDocument();
  });
});
