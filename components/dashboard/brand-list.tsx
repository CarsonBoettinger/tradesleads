"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { brandPreviewUrl } from "@/lib/hosts";
import type { Brand } from "@/lib/sites/types";

function matchesQuery(brand: Brand, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    brand.name,
    brand.trade,
    brand.town,
    brand.status,
    brand.slug,
    brand.address,
    brand.email,
    brand.phone,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function BrandList({
  brands,
  isStaff,
}: {
  brands: Brand[];
  isStaff: boolean;
}) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(
    () => brands.filter((brand) => matchesQuery(brand, deferredQuery)),
    [brands, deferredQuery],
  );

  if (brands.length === 0) {
    return (
      <div className="mt-10 rounded-[14px] border-2 border-dashed border-peach bg-white p-10 text-center">
        <p className="font-semibold">No brands yet</p>
        <p className="mt-2 text-sm text-muted">
          {isStaff
            ? "Add a business from Google to generate its website."
            : "Ask Kalvez staff to assign a brand to your account."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <label className="block text-sm font-semibold">
        Search brands
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, town, trade, status…"
          className="mt-1.5 h-12 w-full rounded-[10px] border-2 border-peach bg-white px-3 outline-none focus:border-foreman sm:max-w-md"
          autoComplete="off"
        />
      </label>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-[14px] border border-peach bg-white p-8 text-center">
          <p className="font-semibold">No matching brands</p>
          <p className="mt-2 text-sm text-muted">
            Try a different name, town, or trade.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4">
          {filtered.map((brand) => (
            <li
              key={brand.id}
              className="rounded-[14px] border border-peach bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Link
                    href={`/dashboard/brands/${brand.id}`}
                    className="text-xl font-extrabold hover:text-foreman"
                  >
                    {brand.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">
                    {[brand.trade, brand.town, brand.status]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {(brand.status === "ready" ||
                    brand.status === "published") && (
                    <a
                      href={brandPreviewUrl(brand.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm font-semibold text-foreman"
                    >
                      Open preview
                    </a>
                  )}
                </div>
                <Link
                  href={`/dashboard/brands/${brand.id}`}
                  className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman"
                >
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
