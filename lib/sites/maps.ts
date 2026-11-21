/** Build a Google Maps embed URL with a pin for the business location. */
export function googleMapsEmbedUrl(input: {
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  mapsUri?: string | null;
  name?: string | null;
}): string | null {
  if (
    input.lat != null &&
    input.lng != null &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lng)
  ) {
    const q = encodeURIComponent(`${input.lat},${input.lng}`);
    return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  }

  if (input.address?.trim()) {
    const q = encodeURIComponent(
      [input.name, input.address].filter(Boolean).join(", "),
    );
    return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
  }

  if (input.mapsUri?.includes("google.com/maps")) {
    try {
      const url = new URL(input.mapsUri);
      url.searchParams.set("output", "embed");
      return url.toString();
    } catch {
      return null;
    }
  }

  return null;
}
