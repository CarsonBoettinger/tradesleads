import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Audit } from "@/components/landing/audit";
import { Booked } from "@/components/landing/booked";
import { Company } from "@/components/landing/company";
import { CtaBand } from "@/components/landing/cta-band";
import { Found } from "@/components/landing/found";
import { Hero } from "@/components/landing/hero";
import { How } from "@/components/landing/how";
import { Remembered } from "@/components/landing/remembered";
import { Scenes } from "@/components/landing/scenes";
import { Trades } from "@/components/landing/trades";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  buildPageMetadata,
  defaultTitle,
  siteDescriptor,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: { absolute: defaultTitle },
  description: siteDescriptor,
  path: "/",
});

export default function Home() {
  return (
    <div id="top">
      <JsonLd
        data={webPageJsonLd({
          name: defaultTitle,
          description: siteDescriptor,
          path: "/",
        })}
      />
      <SiteHeader />
      <main id="content">
        <Hero />
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
