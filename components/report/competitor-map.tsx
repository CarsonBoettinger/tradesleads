"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { CompetitorItem } from "@/lib/report/types";

const COMPETITOR_COLORS = [
  "#1d4ed8",
  "#047857",
  "#7c3aed",
  "#b45309",
  "#0e7490",
  "#be123c",
];

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shortBusinessName(name: string) {
  const cleaned = name
    .replace(/\b(inc\.?|llc\.?|ltd\.?|co\.?|corp\.?)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (cleaned.length <= 18) return cleaned || name;
  const words = cleaned.split(/\s+/).filter(Boolean);
  const two = words.slice(0, 2).join(" ");
  if (two.length <= 18) return two;
  return `${cleaned.slice(0, 16).trimEnd()}…`;
}

function markerHtml(input: {
  label: string;
  color: string;
  yours?: boolean;
}) {
  const size = input.yours ? 16 : 12;
  const label = escapeHtml(input.label);
  return `
    <div class="report-map-pin${input.yours ? " report-map-pin--you" : ""}">
      <span class="report-map-pin__label" style="background:${input.color};color:#fff">${label}</span>
      <span class="report-map-pin__dot" style="background:${input.color};width:${size}px;height:${size}px"></span>
    </div>
  `;
}

export function CompetitorMap({
  lat,
  lng,
  showYou,
  competitors,
  locating,
}: {
  lat: number | null;
  lng: number | null;
  showYou: boolean;
  competitors: CompetitorItem[];
  locating: boolean;
}) {
  const mapId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const youMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const competitorMarkersRef = useRef<Map<string, import("leaflet").Marker>>(
    new Map(),
  );
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || lat == null || lng == null) return;
    const originLat = lat;
    const originLng = lng;
    let cancelled = false;

    async function setup() {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.integrity =
          "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
        link.crossOrigin = "";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false,
      }).setView([originLat, originLng], 12);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "topright" }).addTo(map);
      mapRef.current = map;
      requestAnimationFrame(() => {
        map.invalidateSize();
        if (!cancelled) setMapReady(true);
      });
    }

    void setup();

    return () => {
      cancelled = true;
      setMapReady(false);
      youMarkerRef.current = null;
      competitorMarkersRef.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [lat, lng, mapId]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!mapReady || !map || !L || lat == null || lng == null) return;

    if (!showYou) {
      if (youMarkerRef.current) {
        map.removeLayer(youMarkerRef.current);
        youMarkerRef.current = null;
      }
      return;
    }

    if (youMarkerRef.current) return;

    const icon = L.divIcon({
      className: "report-map-marker",
      html: markerHtml({
        label: "You",
        color: "#c2410c",
        yours: true,
      }),
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    youMarkerRef.current = L.marker([lat, lng], {
      icon,
      zIndexOffset: 1000,
    }).addTo(map);
    map.panTo([lat, lng], { animate: true, duration: 0.6 });
  }, [mapReady, showYou, lat, lng]);

  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!mapReady || !map || !L || lat == null || lng == null) return;

    const visibleIds = new Set(competitors.map((c) => c.placeId));

    for (const [id, marker] of competitorMarkersRef.current) {
      if (!visibleIds.has(id)) {
        map.removeLayer(marker);
        competitorMarkersRef.current.delete(id);
      }
    }

    const bounds: import("leaflet").LatLngExpression[] = [[lat, lng]];

    competitors.forEach((comp, index) => {
      if (comp.lat == null || comp.lng == null) return;
      bounds.push([comp.lat, comp.lng]);

      if (competitorMarkersRef.current.has(comp.placeId)) return;

      const color = COMPETITOR_COLORS[index % COMPETITOR_COLORS.length]!;
      const icon = L.divIcon({
        className: "report-map-marker",
        html: markerHtml({
          label: shortBusinessName(comp.name),
          color,
        }),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      competitorMarkersRef.current.set(
        comp.placeId,
        L.marker([comp.lat, comp.lng], {
          icon,
          zIndexOffset: 100 + index,
        }).addTo(map),
      );
    });

    if (bounds.length > 1 && (showYou || competitors.length > 0)) {
      map.fitBounds(L.latLngBounds(bounds), {
        padding: [48, 48],
        maxZoom: 14,
        animate: true,
      });
    }
  }, [mapReady, competitors, showYou, lat, lng]);

  if (lat == null || lng == null) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-[10px] border border-peach bg-cream text-sm font-bold text-muted">
        Waiting for map coordinates…
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[10px] border border-peach">
      <div
        ref={containerRef}
        id={`competitor-map-${mapId}`}
        className="h-[300px] w-full [&_.leaflet-control-attribution]:text-[10px]"
      />
      {locating ? (
        <div className="absolute inset-0 z-[500] grid place-items-center bg-cream/70 backdrop-blur-[1px]">
          <p className="rounded-md bg-white px-3 py-2 text-sm font-bold text-cocoa shadow-sm">
            Locating your business…
          </p>
        </div>
      ) : null}
    </div>
  );
}
