import { useEffect, useState } from "react";

/** Current time, re-read every `intervalMs`, for ticking "Ns ago" labels. One subscriber per list, not per row. */
export function useNow(intervalMs: number = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}
