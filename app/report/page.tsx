import type { Metadata } from "next";
import { ReportFlow } from "@/components/report/report-flow";
import { Container } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl } from "@/lib/site";

const description =
  "Free digital presence report for trade businesses - search results, website experience, and local listings.";

export const metadata: Metadata = {
  title: "Free digital presence report",
  description,
  alternates: { canonical: absoluteUrl("/report") },
  openGraph: {
    title: "Free digital presence report | Kalvez",
    description,
    type: "website",
    locale: "en_US",
    siteName: "Kalvez",
    url: absoluteUrl("/report"),
  },
};

export default function ReportPage() {
  return (
    <div>
      <SiteHeader />
      <main id="content" className="pb-20 pt-10 sm:pb-28 sm:pt-14">
        <Container>
          <ReportFlow />
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
