import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/router";
import { AppHeader } from "../app-header";
import { navigateTo } from "../../../utils/navigate";
import { identityT, mockRouter } from "../../../test-utils/mocks";

jest.mock("next/router", () => ({ useRouter: jest.fn() }));
jest.mock("next-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => identityT(key), i18n: { language: "en" } }),
}));
jest.mock("../../../utils/navigate", () => ({ navigateTo: jest.fn() }));

const useRouterMock = useRouter as jest.Mock;

describe("AppHeader", () => {
  beforeEach(() => {
    useRouterMock.mockReturnValue(mockRouter({ pathname: "/block/[id]", asPath: "/block/123" }));
    (navigateTo as jest.Mock).mockClear();
  });

  it("marks the section that owns the current route as current", () => {
    render(<AppHeader />);
    const nav = screen.getByRole("navigation", { name: "nav.primaryAria", hidden: false });
    const blocks = within(nav).getByRole("link", { name: "nav.blocks" });
    expect(blocks).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "nav.transactions" })).not.toHaveAttribute("aria-current");
  });

  it("treats the home page as the Blocks section", () => {
    useRouterMock.mockReturnValue(mockRouter({ pathname: "/" }));
    render(<AppHeader />);
    const [nav] = screen.getAllByRole("navigation", { name: "nav.primaryAria" });
    expect(within(nav).getByRole("link", { name: "nav.blocks" })).toHaveAttribute("aria-current", "page");
  });

  it("groups the token explorers under a Tokens menu", async () => {
    const user = userEvent.setup();
    render(<AppHeader />);
    const trigger = screen.getByRole("button", { name: "nav.tokens" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    const menu = screen.getByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "nav.vbtc" })).toHaveAttribute("href", "/vbtc-token");
    expect(within(menu).getByRole("menuitem", { name: "nav.fungibleTokens" })).toHaveAttribute("href", "/fungible-token");
    expect(within(menu).getByRole("menuitem", { name: "nav.nfts" })).toHaveAttribute("href", "/nfts");
    // fireEvent (act-wrapped) rather than user.keyboard: the Escape listener lives on document.
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("puts community links behind the More menu, opening in a new tab", async () => {
    const user = userEvent.setup();
    render(<AppHeader />);
    await user.click(screen.getByRole("button", { name: "nav.more" }));
    const docs = screen.getByRole("menuitem", { name: "nav.docs" });
    expect(docs).toHaveAttribute("href", "https://docs.verifiedx.io");
    expect(docs).toHaveAttribute("target", "_blank");
    expect(docs).toHaveAttribute("rel", "noreferrer");
  });

  it("toggles the collapsed drawer and closes it on route change", () => {
    const { rerender } = render(<AppHeader />);
    const drawer = document.getElementById("app-header-drawer") as HTMLElement;
    expect(drawer).toHaveAttribute("hidden");
    fireEvent.click(screen.getByRole("button", { name: "nav.openMenu" }));
    expect(drawer).not.toHaveAttribute("hidden");
    expect(screen.getByRole("button", { name: "nav.closeMenu" })).toHaveAttribute("aria-expanded", "true");

    useRouterMock.mockReturnValue(mockRouter({ pathname: "/validators", asPath: "/validators" }));
    rerender(<AppHeader />);
    expect(drawer).toHaveAttribute("hidden");
  });

  it("prefixes internal links with the active locale", () => {
    useRouterMock.mockReturnValue(mockRouter({ pathname: "/domains", asPath: "/es/domains", locale: "es" }));
    render(<AppHeader />);
    const [nav] = screen.getAllByRole("navigation", { name: "nav.primaryAria" });
    expect(within(nav).getByRole("link", { name: "nav.domains" })).toHaveAttribute("href", "/es/domains");
  });

  it("submits a trimmed, encoded query to the localized search page", async () => {
    const user = userEvent.setup();
    useRouterMock.mockReturnValue(mockRouter({ pathname: "/", locale: "es" }));
    render(<AppHeader />);
    const input = screen.getByRole("textbox", { name: "component.ariaLabel" });
    await user.type(input, "  RRe6 iMqi  {Enter}");
    expect(navigateTo).toHaveBeenCalledWith("/es/search?q=RRe6%20iMqi");
  });

  it("ignores empty searches", async () => {
    const user = userEvent.setup();
    render(<AppHeader />);
    await user.type(screen.getByRole("textbox", { name: "component.ariaLabel" }), "   {Enter}");
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it("focuses search when / is pressed outside a text field", () => {
    render(<AppHeader />);
    const input = screen.getByRole("textbox", { name: "component.ariaLabel" });
    fireEvent.keyDown(document.body, { key: "/" });
    expect(input).toHaveFocus();
  });
});
