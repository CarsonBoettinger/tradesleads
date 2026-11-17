import { ImageResponse } from "next/og";

export const ogSize = {
  width: 1200,
  height: 630,
} as const;

export const ogContentType = "image/png";

type OgCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function renderOgImage({
  eyebrow = "Kalvez",
  title,
  description,
}: OgCardProps) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #162A4A 0%, #1F3A63 55%, #243F6B 100%)",
          color: "#F5F7FB",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#EF7230",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            K
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: "#E8EEF6",
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: title.length > 48 ? 56 : 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              maxWidth: "980px",
            }}
          >
            {title}
          </div>
          {description ? (
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                color: "#C5D0E0",
                maxWidth: "900px",
              }}
            >
              {description}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#C5D0E0",
          }}
        >
          <span>Built to get you found.</span>
          <span style={{ color: "#EF7230", fontWeight: 700 }}>kalvez.com</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
