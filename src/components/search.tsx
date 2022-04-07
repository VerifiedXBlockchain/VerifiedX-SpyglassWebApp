import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  initialValue?: string;
}

export const Search = (props: Props) => {
  const [query, setQuery] = useState<string>(props.initialValue ?? "");
  const router = useRouter();

  const handleSearch = () => {
    if (query) {
      router.push(`/search?q=${query}`);
    }
  };

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");
        console.log(query);
        handleSearch();
        event.preventDefault();
        // callMyFunction();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [handleSearch]);

  return (
    // <div className="container">
    <div className="input-group">
      <input
        type="text"
        className="form-control bg-dark text-light"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button
        className="btn btn-secondary"
        type="button"
        disabled={!query}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
    // </div>
  );
};
