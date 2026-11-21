import { Container, Eyebrow } from "@/components/ui";

const steps = [
  {
    step: "01",
    title: "Your trade and your town",
    body: "Start with the work you do and where you do it. That is the whole brief.",
  },
  {
    step: "02",
    title: "A clear look at your Google visibility",
    body: "Where you show up today, how much traffic you get, and where the next customer is looking.",
  },
  {
    step: "03",
    title: "A plan that grows traffic and jobs",
    body: "What to fix first so more of the right people find you, call you, and book the work.",
  },
];

export function How() {
  return (
    <section id="how" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <Container>
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
          From Google visibility to a booked job
        </h2>
        <ol className="mt-12 grid gap-4 lg:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.step}
              className="rounded-xl border-2 border-peach bg-cream p-7 sm:p-9"
            >
              <span className="grid size-12 place-items-center rounded-lg bg-peach text-base font-extrabold text-cocoa">
                {step.step}
              </span>
              <h3 className="mt-6 text-2xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                {step.title}
              </h3>
              <p className="mt-3 text-[17px] leading-relaxed text-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
