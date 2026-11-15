"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { PlaceCandidate } from "@/lib/report/types";

const fieldClass =
  "mt-2 h-[52px] w-full rounded-[10px] border-2 border-peach bg-white px-4 text-[17px] text-cocoa outline-none transition-colors focus:border-foreman";

function cityFromAddress(address: string) {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= 3) return parts[parts.length - 3] ?? parts[1] ?? null;
  if (parts.length === 2) return parts[0] ?? null;
  return null;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle) return <>{text}</>;

  const lowerText = text.toLowerCase();
  const lowerNeedle = needle.toLowerCase();
  const index = lowerText.indexOf(lowerNeedle);

  if (index < 0) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <span className="font-extrabold text-foreman">
        {text.slice(index, index + needle.length)}
      </span>
      {text.slice(index + needle.length)}
    </>
  );
}

export function BusinessAutocomplete({
  value,
  selected,
  onQueryChange,
  onSelect,
  onClearSelection,
}: {
  value: string;
  selected: PlaceCandidate | null;
  onQueryChange: (value: string) => void;
  onSelect: (place: PlaceCandidate) => void;
  onClearSelection: () => void;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceCandidate[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searched, setSearched] = useState(false);
  const requestId = useRef(0);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    const query = value.trim();

    if (selected && selected.name === value) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      setSearched(false);
      return;
    }

    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      setSearched(false);
      return;
    }

    const currentRequest = ++requestId.current;
    const timer = setTimeout(async () => {
      setLoading(true);
      setOpen(true);
      try {
        const response = await fetch("/api/report/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        if (currentRequest !== requestId.current) return;
        if (!response.ok) {
          setSuggestions([]);
          setSearched(true);
          return;
        }
        setSuggestions((data.results as PlaceCandidate[]) ?? []);
        setSearched(true);
        setActiveIndex(-1);
      } catch {
        if (currentRequest !== requestId.current) return;
        setSuggestions([]);
        setSearched(true);
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, selected]);

  function choose(place: PlaceCandidate) {
    onSelect(place);
    setOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        Math.min(index + 1, Math.max(suggestions.length - 1, 0)),
      );
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      choose(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="block text-base font-bold text-cocoa">
        Business name
        <div className="relative">
          <input
            className={`${fieldClass} pr-12`}
            value={value}
            onChange={(event) => {
              onQueryChange(event.target.value);
              if (selected) onClearSelection();
            }}
            onFocus={() => {
              if (value.trim().length >= 3 && !selected) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            placeholder="e.g. Harbor Plumbing"
            autoComplete="off"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
            }
            required
          />
          {loading ? (
            <span
              className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 animate-spin rounded-full border-2 border-peach border-t-foreman"
              aria-hidden="true"
            />
          ) : null}
        </div>
      </label>

      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-[10px] border-2 border-peach bg-white shadow-[0_12px_30px_rgba(42,35,32,0.12)]"
        >
          {loading && !suggestions.length ? (
            <p className="px-4 py-3 text-base text-muted">Searching…</p>
          ) : null}

          {!loading && searched && !suggestions.length ? (
            <p className="px-4 py-3 text-base text-muted">
              No matching businesses. Keep typing or include your town.
            </p>
          ) : null}

          {suggestions.map((place, index) => {
            const city = cityFromAddress(place.address);
            const active = index === activeIndex;
            return (
              <button
                key={place.placeId}
                id={`${listId}-option-${index}`}
                type="button"
                role="option"
                aria-selected={active}
                className={`block w-full border-b border-peach/70 px-4 py-3 text-left last:border-b-0 ${
                  active ? "bg-peach" : "bg-white hover:bg-cream"
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(place)}
              >
                <p className="text-[17px] font-bold text-cocoa">
                  <HighlightMatch text={place.name} query={value} />
                </p>
                <p className="mt-0.5 text-sm text-muted">{place.address}</p>
                {city ? (
                  <p className="mt-0.5 text-sm font-semibold text-foreman/80">
                    {city}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
