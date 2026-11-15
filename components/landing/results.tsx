import { Container, Eyebrow } from "@/components/ui";

const figures = [
  { trade: "Plumbing", metric: "Calls from Google" },
  { trade: "Roofing", metric: "Quote requests" },
  { trade: "Electrical", metric: "Website visits" },
  { trade: "HVAC", metric: "Jobs booked" },
  { trade: "Building", metric: "Searches you showed up for" },
  { trade: "Landscaping", metric: "New reviews" },
];

export function Results() {
  return (
    <section id="results" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <Eyebrow>Results</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
          The figures that belong to you
        </h2>
        <p className="mt-5 max-w-2xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
          Calls, visits, quotes, bookings, reviews. Real numbers go in these
          boxes. Nothing on this page is made up.
        </p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {figures.map((figure) => (
            <li
              key={figure.trade}
              className="rounded-xl border-2 border-dashed border-peach bg-white p-7 sm:p-8"
            >
              <p className="text-[15px] font-bold tracking-[0.16em] text-muted uppercase">
                {figure.trade}
              </p>
              <p className="mt-6 text-[1.65rem] leading-none font-extrabold tracking-[-0.02em] text-cocoa sm:text-[1.85rem]">
                [PLACEHOLDER]
              </p>
              <p className="mt-4 text-[17px] leading-snug text-muted">
                {figure.metric}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
