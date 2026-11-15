import { Container, Eyebrow } from "@/components/ui";

const benefits = [
  {
    title: "Rank higher on Google",
    body: "Show up when people search for your trade in your town.",
  },
  {
    title: "Earn more 5-star reviews",
    body: "Happy customers get an easy way to review you while the job is still fresh.",
  },
  {
    title: "Beat the big guys",
    body: "Look as established as the national brands. Keep the work local.",
  },
];

const rows = [
  { place: "1", name: "Your business", note: "The top spot", featured: true },
  { place: "2", name: "National chain", note: "Bigger budget", featured: false },
  { place: "3", name: "Another crew", note: "Also local", featured: false },
];

export function Found() {
  return (
    <section id="found" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow>Get the call</Eyebrow>
            <h2 className="mt-4 max-w-xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              Show up when someone is ready to hire
            </h2>
            <p className="mt-5 max-w-xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              People search, look at a few names, and call. Foreman is how
              your business earns a place in that short list.
            </p>
            <ul className="mt-8 space-y-6">
              {benefits.map((benefit, index) => (
                <li key={benefit.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-peach text-base font-extrabold text-cocoa">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-[17px] leading-relaxed text-muted">
                      {benefit.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href="#how"
              className="mt-8 inline-flex min-h-11 items-center text-base font-bold text-foreman underline decoration-foreman/30 underline-offset-4 hover:decoration-foreman focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreman"
            >
              See how it works
            </a>
          </div>

          <article className="rounded-xl border-2 border-peach bg-white p-6 sm:p-8">
            <p className="text-[15px] font-bold tracking-[0.16em] text-muted uppercase">
              Local search
            </p>
            <p className="mt-3 text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] text-cocoa sm:text-3xl">
              roofer in your town
            </p>
            <ol className="mt-6 space-y-3">
              {rows.map((row) => (
                <li
                  key={row.place}
                  className={`flex items-center gap-4 rounded-lg border-2 px-4 py-3 ${
                    row.featured
                      ? "border-peach bg-peach"
                      : "border-peach bg-cream"
                  }`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-md text-base font-extrabold ${
                      row.featured
                        ? "bg-foreman text-cream"
                        : "bg-white text-cocoa"
                    }`}
                  >
                    {row.place}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-extrabold tracking-[-0.02em] text-cocoa">
                      {row.name}
                    </span>
                    <span className="block text-[15px] text-muted">{row.note}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              An example of the list. Not your rank today.
            </p>
          </article>
        </div>
      </Container>
    </section>
  );
}
