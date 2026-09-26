import { act, render, screen } from "@testing-library/react";
import { PaginatedResponse } from "../../models/paginated-response";
import { usePagedList } from "../usePagedList";

interface Item {
  id: string;
}

const page = (items: string[], pageNumber: number, numPages: number) => new PaginatedResponse<Item>(items.length, pageNumber, numPages, items.map((id) => ({ id })));

const Harness = ({ fetchPage, pollMs = 0 }: { fetchPage: (page: number) => Promise<PaginatedResponse<Item>>; pollMs?: number }) => {
  const { items, loadMore, canLoadMore, loaded } = usePagedList(fetchPage, (item) => item.id, { pollMs });
  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.id}</li>
        ))}
      </ul>
      <button onClick={() => loadMore(2)}>more</button>
      <output data-testid="state">{`${loaded ? "loaded" : "loading"}:${canLoadMore ? "more" : "end"}`}</output>
    </div>
  );
};

describe("usePagedList", () => {
  it("appends pages without duplicates and reports when the last page is reached", async () => {
    const fetchPage = jest.fn(async (p: number) => (p === 1 ? page(["a", "b"], 1, 2) : page(["b", "c"], 2, 2)));
    render(<Harness fetchPage={fetchPage} />);
    // The harness does not auto-load; drive it explicitly.
    await act(async () => {
      screen.getByText("more").click();
    });
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["b", "c"]);
    expect(screen.getByTestId("state")).toHaveTextContent("loaded:end");
  });

  it("prepends new items found by polling and keeps existing order", async () => {
    jest.useFakeTimers();
    let poll = 0;
    const fetchPage = jest.fn(async (p: number) => {
      if (p === 2) return page(["b", "c"], 2, 3);
      poll += 1;
      return poll === 1 ? page(["a", "b"], 1, 3) : page(["z", "a", "b"], 1, 3);
    });
    render(<Harness fetchPage={fetchPage} pollMs={1000} />);
    await act(async () => {
      screen.getByText("more").click();
    });
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });
    expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["z", "a", "b", "c"]);
    jest.useRealTimers();
  });

  it("stops paging and logs when a fetch fails", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const fetchPage = jest.fn(async () => {
      throw new Error("boom");
    });
    render(<Harness fetchPage={fetchPage} />);
    await act(async () => {
      screen.getByText("more").click();
    });
    expect(screen.getByTestId("state")).toHaveTextContent("loaded:end");
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
