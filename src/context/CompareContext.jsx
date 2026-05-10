import { createContext, useContext, useMemo, useState } from "react";

const CompareContext = createContext(null);
const MAX_COMPARE_ITEMS = 3;

const normalizeItem = (item) => ({
  id: item.id,
  media_type: item.media_type ?? (item.first_air_date ? "tv" : "movie"),
  title: item.title ?? item.name ?? "Untitled",
  poster_path: item.poster_path ?? null,
  vote_average: item.vote_average ?? 0,
  vote_count: item.vote_count ?? 0,
  popularity: item.popularity ?? 0,
  release_date: item.release_date ?? "",
  first_air_date: item.first_air_date ?? "",
  overview: item.overview ?? "",
  original_language: item.original_language ?? "",
});

const keyFor = (item) => `${item.media_type}:${item.id}`;

export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);

  const value = useMemo(() => {
    const isCompared = (item) => {
      const normalized = normalizeItem(item);
      return items.some((x) => keyFor(x) === keyFor(normalized));
    };

    const add = (item) => {
      const normalized = normalizeItem(item);
      setItems((prev) => {
        if (prev.some((x) => keyFor(x) === keyFor(normalized))) return prev;
        if (prev.length >= MAX_COMPARE_ITEMS) return prev;
        return [...prev, normalized];
      });
    };

    const remove = (item) => {
      const normalized = normalizeItem(item);
      setItems((prev) => prev.filter((x) => keyFor(x) !== keyFor(normalized)));
    };

    const toggle = (item) => {
      if (isCompared(item)) {
        remove(item);
      } else {
        add(item);
      }
    };

    const clear = () => setItems([]);

    return {
      items,
      count: items.length,
      maxItems: MAX_COMPARE_ITEMS,
      isCompared,
      add,
      remove,
      toggle,
      clear,
    };
  }, [items]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used inside CompareProvider");
  return ctx;
}
