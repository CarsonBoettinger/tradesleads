import { Container } from "@/components/ui";

const points = [
  {
    title: "Plain talk",
    body: "Short sentences. The work, the calls, and what shows up on Google. No deck full of jargon.",
  },
  {
    title: "You stay on the tools",
    body: "The website and the listing get looked after. Your day stays on the job.",
  },
  {
    title: "Built for independent crews",
    body: "Plumbers, roofers, electricians, HVAC, contractors, landscapers, and dozens more trades. Not a franchise template.",
  },
];

export function Company() {
  return (
    <section className="bg-cocoa py-20 text-cream sm:py-28" aria-labelledby="company-heading">
      <Container>
        <p className="inline-flex rounded-lg bg-peach px-4 py-2 text-base font-bold text-cocoa">
          Growth for the trades
        </p>
        <h2
          id="company-heading"
          className="mt-6 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance sm:text-5xl"
        >
          A real company for the trades
        </h2>
        <p className="mt-5 max-w-2xl text-[18px] leading-[1.6] text-[#c5d0e0] sm:text-[19px]">
          Not an agency. Not a tech startup. Websites and local search,
          explained the way you would explain a job.
        </p>
        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {points.map((point) => (
            <li key={point.title}>
              <h3 className="text-2xl leading-tight font-extrabold tracking-[-0.02em]">
                {point.title}
              </h3>
              <p className="mt-3 text-[17px] leading-relaxed text-[#c5d0e0]">
                {point.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
