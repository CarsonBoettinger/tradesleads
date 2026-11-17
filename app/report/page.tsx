import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { ReportFlow } from "@/components/report/report-flow";
import { Container } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

const title = "Free digital presence report";
const description =
  "Free digital presence report for trade businesses - search results, website experience, and local listings.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/report",
  keywords: [
    "free local SEO report",
    "Google Business Profile report",
    "contractor website audit",
    "trade business digital presence",
  ],
});

export default function ReportPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/report",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Free report", path: "/report" },
        ])}
      />
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
