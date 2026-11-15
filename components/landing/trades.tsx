import { Container, Eyebrow } from "@/components/ui";

const trades = [
  {
    name: "Plumbers",
    body: "Emergency calls, and the repairs that follow them.",
  },
  {
    name: "Roofers",
    body: "Storm searches, inspections, and the jobs they turn into.",
  },
  {
    name: "Electricians",
    body: "Panels, rewires, and the calls that come in between.",
  },
  {
    name: "HVAC",
    body: "Breakdowns, tune-ups, and the turn of the season.",
  },
  {
    name: "Builders",
    body: "Projects that start when someone searches for a crew.",
  },
  {
    name: "Landscapers",
    body: "Yards, seasons, and the customers who come back.",
  },
];

export function Trades() {
  return (
    <section id="trades" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <Container>
        <Eyebrow>Who it is for</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
          For the owners on the tools
        </h2>
        <p className="mt-5 max-w-2xl text-[18px] leading-[1.6] text-muted">
          Busy, practical, and tired of agencies that talk past the work.
        </p>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trades.map((trade) => (
            <li
              key={trade.name}
              className="rounded-xl border-2 border-peach bg-cream p-7 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 sm:p-8"
            >
              <h3 className="text-2xl leading-none font-extrabold tracking-[-0.02em] text-cocoa">
                {trade.name}
              </h3>
              <p className="mt-4 text-[17px] leading-relaxed text-muted">
                {trade.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
