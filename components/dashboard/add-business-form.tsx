"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BusinessAutocomplete } from "@/components/report/business-autocomplete";
import type { PlaceCandidate } from "@/lib/report/types";

export function AddBusinessForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PlaceCandidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onGenerate() {
    if (!selected) {
      setError("Select a business from Google first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId: selected.placeId,
          name: selected.name,
          address: selected.address,
          lat: selected.lat,
          lng: selected.lng,
          types: selected.types,
          generate: true,
        }),
      });
      const json = (await response.json()) as {
        brand?: { id: string };
        error?: string;
      };
      if (!response.ok || !json.brand) {
        throw new Error(json.error ?? "Could not create brand.");
      }
      router.push(`/dashboard/brands/${json.brand.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[16px] border border-peach bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-extrabold tracking-tight">Add Business</h1>
      <p className="mt-2 text-muted">
        Search Google Business Profile, select the correct listing, then generate
        the website.
      </p>

      <div className="mt-8">
        <label className="text-sm font-semibold">Business search</label>
        <BusinessAutocomplete
          value={query}
          selected={selected}
          onQueryChange={setQuery}
          onSelect={(place) => {
            setSelected(place);
            setQuery(place.name);
          }}
          onClearSelection={() => setSelected(null)}
        />
      </div>

      {selected ? (
        <div className="mt-4 rounded-[12px] bg-cream p-4 text-sm">
          <p className="font-bold">{selected.name}</p>
          <p className="mt-1 text-muted">{selected.address}</p>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        onClick={onGenerate}
        disabled={loading || !selected}
        className="mt-6 rounded-[10px] bg-foreman px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {loading ? "Starting generation…" : "Generate Website"}
      </button>
    </div>
  );
}
