import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page is missing from the job site. Head home - or try FOREMAN's Toolbox Challenge while you're here.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div>
      <SiteHeader />
      <main id="content">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </div>
  );
}
