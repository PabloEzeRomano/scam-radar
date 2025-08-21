"use client";
import { useEffect, useState } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.matchMedia(query);
    const handler = () => setMatches(m.matches);
    handler();
    m.addEventListener?.("change", handler);
    return () => m.removeEventListener?.("change", handler);
  }, [query]);
  return matches;
}

export function useVisibleCount() {
  const isLg = useMediaQuery("(min-width: 1024px)"); // lg
  const isMd = useMediaQuery("(min-width: 768px)");  // md
  if (isLg) return 3;
  if (isMd) return 2;
  return 1;
}
