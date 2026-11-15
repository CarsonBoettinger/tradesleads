import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

const description =
  "Websites and local search growth for the businesses that build our world. For plumbers, roofers, electricians, HVAC, builders, and landscapers.";

export const metadata: Metadata = {
  title: "FOREMAN - Built to get you found",
  description,
  applicationName: "FOREMAN",
  openGraph: {
    title: "FOREMAN - Built to get you found",
    description,
    type: "website",
    locale: "en_US",
    siteName: "FOREMAN",
  },
  twitter: {
    card: "summary",
    title: "FOREMAN - Built to get you found",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF8F1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream font-sans text-cocoa">{children}</body>
    </html>
  );
}
