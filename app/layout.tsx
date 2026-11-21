import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import {
  defaultTitle,
  organizationJsonLd,
  siteDescriptor,
  siteName,
  websiteJsonLd,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescriptor,
  applicationName: siteName,
  keywords: [
    "websites for plumbers",
    "SEO for plumbers",
    "local SEO for HVAC",
    "websites for roofers",
    "Google Business Profile for contractors",
    "trade business websites",
    "contractor website that gets calls",
    "local SEO for trades",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  category: "business",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: defaultTitle,
    description: siteDescriptor,
    type: "website",
    locale: "en_US",
    siteName,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Kalvez - Built to get you found",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: siteDescriptor,
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/brand/kalvez-icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "geo.region": "US",
  },
};

export const viewport: Viewport = {
  themeColor: "#162A4A",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} antialiased`}
    >
      <body className="min-h-dvh bg-cream font-sans text-cocoa">
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
      </body>
    </html>
  );
}
