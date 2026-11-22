import Image from "next/image";
import { Eyebrow } from "@/components/ui";

const checks = [
  {
    title: "Google Map Pack & local pack",
    body: "Whether you appear in the local results for searches like your trade plus town, and how you stack up against nearby competitors.",
  },
  {
    title: "Organic search rankings",
    body: "Where your site shows for high-intent keywords - emergency, repair, install, and service phrases customers actually type.",
  },
  {
    title: "Google Business Profile strength",
    body: "Rating, review volume, categories, and listing completeness signals that influence who gets the call.",
  },
  {
    title: "Website experience",
    body: "Speed, mobile usability, HTTPS, and on-page basics that decide whether a searcher stays long enough to dial.",
  },
  {
    title: "Competitor snapshot",
    body: "A plain look at local peers so you can see who is winning attention in your service area right now.",
  },
  {
    title: "Prioritized score card",
    body: "Overall, search, website, and listings scores with a short summary of what to fix first - not a 40-page PDF nobody reads.",
  },
];

const faqs = [
  {
    question: "What is the free Kalvez digital presence report?",
    answer:
      "It is a scored look at how your trade business shows up online: local search, Google listing strength, website experience, and nearby competitors. You search for your business, watch the scan, then unlock the full score card.",
  },
  {
    question: "Who is the report for?",
    answer:
      "Owners of plumbing, HVAC, electrical, roofing, contracting, landscaping, and other local trade businesses that want more booked jobs from Google - not vanity traffic.",
  },
  {
    question: "Do I need a website to run the report?",
    answer:
      "No. We can still score your Google listing and local visibility. If you have a site, we include website experience checks too.",
  },
  {
    question: "How long does the scan take?",
    answer:
      "Usually a couple of minutes. You pick your listing, we run the checks, then you unlock the report card with your contact details.",
  },
  {
    question: "Is the report really free?",
    answer:
      "Yes. There is no charge to run or unlock the report. After you see your scores, you can book a free demo if you want help fixing the gaps.",
  },
];

export function ReportMarketing() {
  return (
    <div className="mt-16 space-y-20 sm:mt-24 sm:space-y-28">
      <section aria-labelledby="report-checks-heading">
        <Eyebrow>What the report checks</Eyebrow>
        <h2
          id="report-checks-heading"
          className="mt-4 max-w-3xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl"
        >
          Six signals that decide who gets the job
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
          The free report does not guess. It looks at the same places your
          customers look - search results, your listing, your site, and the
          crews competing for the same calls.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checks.map((check) => (
            <li
              key={check.title}
              className="rounded-xl border-2 border-peach bg-white p-6 sm:p-7"
            >
              <h3 className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                {check.title}
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">
                {check.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="report-sample-heading">
        <Eyebrow>Sample report</Eyebrow>
        <h2
          id="report-sample-heading"
          className="mt-4 max-w-3xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl"
        >
          What your score card looks like
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">
          After the scan, you get ring scores for overall presence, search,
          website, and listings - plus keyword ranks and competitor context so
          the next fix is obvious.
        </p>
        <figure className="mt-10 overflow-hidden rounded-xl border-2 border-peach bg-white shadow-[0_24px_60px_-40px_rgba(28,39,58,0.45)]">
          <Image
            src="/images/report/sample-scorecard.jpg"
            alt="Sample Kalvez digital presence report score card showing overall, search, website, and listings scores"
            width={1200}
            height={780}
            className="h-auto w-full"
            priority={false}
          />
          <figcaption className="border-t-2 border-peach bg-cream px-5 py-4 text-[15px] leading-relaxed text-muted sm:px-7">
            Sample score card for a local trade business. Your live report uses
            your listing, site, and market - not this demo artwork.
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="report-faq-heading">
        <Eyebrow>Questions</Eyebrow>
        <h2
          id="report-faq-heading"
          className="mt-4 max-w-3xl text-[2rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-4xl"
        >
          Before you run the report
        </h2>
        <dl className="mt-10 grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border-2 border-peach bg-white p-6 sm:p-7"
            >
              <dt className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                {faq.question}
              </dt>
              <dd className="mt-3 text-[17px] leading-relaxed text-muted">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

export const reportFaqs = faqs;
