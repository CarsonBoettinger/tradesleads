import { Container, Eyebrow } from "@/components/ui";

const points = [
  {
    title: "A site that looks like the work",
    body: "Services, photos from your crew, and a clear way to call. It should feel like your business, not a stand-in.",
  },
  {
    title: "A listing that stays true",
    body: "Hours, service area, and photos that match what you actually do this month.",
  },
  {
    title: "The next job, from the last one",
    body: "Past customers can find you again without hunting through old texts.",
  },
];

const kept = [
  { name: "Website", detail: "Services, photos, and a number to call", status: "Live" },
  { name: "Google listing", detail: "Hours, area, and the work you do", status: "Current" },
  { name: "Job photos", detail: "Recent work from your crew", status: "Added" },
  { name: "Review reply", detail: "A thank-you while the job is fresh", status: "Sent" },
  { name: "Service page", detail: "The job people search for most", status: "Up" },
];

export function Remembered() {
  return (
    <section id="remembered" className="scroll-mt-24 bg-peach py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <article className="rounded-xl border-2 border-white bg-white p-6 sm:order-2 sm:p-8 lg:order-1">
            <p className="text-[15px] font-bold tracking-[0.16em] text-muted uppercase">
              Kept current
            </p>
            <ul className="mt-5 divide-y divide-peach">
              {kept.map((item) => (
                <li key={item.name} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-extrabold tracking-[-0.02em] text-cocoa">
                      {item.name}
                    </p>
                    <p className="text-[15px] text-muted">{item.detail}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-peach px-3 py-1.5 text-sm font-bold text-cocoa">
                    {item.status}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <div className="lg:order-2">
            <Eyebrow on="peach">Stay in mind</Eyebrow>
            <h2 className="mt-4 max-w-xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
              Be the name they call next time
            </h2>
            <p className="mt-5 max-w-xl text-[18px] leading-[1.6] text-muted sm:text-[19px]">
              The first search is only half of it. A clear website and a
              current Google listing bring people back for the next job.
            </p>
            <ul className="mt-8 space-y-6">
              {points.map((point) => (
                <li key={point.title}>
                  <h3 className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-[17px] leading-relaxed text-muted">
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
