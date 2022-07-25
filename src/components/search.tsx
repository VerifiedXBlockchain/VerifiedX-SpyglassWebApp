import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  initialValue?: string;
  placeholder?: string;
  mini?: boolean;
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
        placeholder={props.placeholder || "Search"}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        style={props.mini ? { height: 32, fontSize:12, borderColor: 'rgba(255,255,255,.4)'}: {}}
      />
      <button
        className="btn btn-secondary"
        type="button"
        disabled={!query}
        onClick={handleSearch}
        style={props.mini ? {height: 32, paddingTop: 5, fontSize: 12,}: {}}
      >
        Search
      </button>
    </div>
    // </div>
  );
};
