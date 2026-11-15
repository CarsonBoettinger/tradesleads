import type { Metadata } from "next";
import { Audit } from "@/components/landing/audit";
import { Booked } from "@/components/landing/booked";
import { Company } from "@/components/landing/company";
import { CtaBand } from "@/components/landing/cta-band";
import { Found } from "@/components/landing/found";
import { Hero } from "@/components/landing/hero";
import { How } from "@/components/landing/how";
import { Remembered } from "@/components/landing/remembered";
import { Scenes } from "@/components/landing/scenes";
import { TradeStrip } from "@/components/landing/trade-strip";
import { Trades } from "@/components/landing/trades";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { defaultTitle, siteDescriptor } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: defaultTitle },
  description: siteDescriptor,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: defaultTitle,
    description: siteDescriptor,
    url: absoluteUrl("/"),
  },
};

export default function Home() {
  return (
    <div id="top">
      <SiteHeader />
      <main id="content">
        <Hero />
        <TradeStrip />
        <Found />
        <Remembered />
        <Booked />
        <Company />
        <How />
        <CtaBand />
        <Scenes />
        <Trades />
        <Audit />
      </main>
      <SiteFooter />
    </div>
  );
}
