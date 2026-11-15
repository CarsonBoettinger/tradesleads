import { CtaLink, Container, demoCta, demoHref } from "@/components/ui";

const notes = [
  { title: "Quote request", detail: "Panel upgrade" },
  { title: "New job booked", detail: "Water heater · Tuesday" },
  { title: "New 5-star review", detail: "From a finished job" },
];

export function Hero() {
  return (
    <section className="overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <Container>
        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div>
            <p className="inline-flex rounded-lg bg-peach px-4 py-2 text-base font-bold text-cocoa">
              Growth for the trades
            </p>
            <h1 className="mt-6 max-w-xl text-[2.75rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-6xl lg:text-7xl">
              Built to get you found.
            </h1>
            <p className="mt-6 max-w-xl text-[19px] leading-[1.6] text-muted sm:text-[21px]">
              Websites and local search growth for the businesses that build
              our world. When someone in your town searches for the work, your
              name is the one they can call.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaLink href={demoHref}>{demoCta}</CtaLink>
              <CtaLink href="#how" variant="ghost">
                See how it works
              </CtaLink>
            </div>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              A 20-minute look at your website and how you show up on Google.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <article className="rounded-xl border-2 border-peach bg-white p-6 sm:p-7">
              <p className="text-[15px] font-bold tracking-[0.16em] text-muted uppercase">
                Example listing
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-peach">
                  <Pin className="size-6 text-foreman" />
                </span>
                <div>
                  <p className="text-xl leading-none font-extrabold tracking-[-0.02em]">
                    Your business
                  </p>
                  <p className="mt-1 text-[15px] text-muted">
                    Plumber · your town
                  </p>
                </div>
              </div>
              <Map />
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="What the listing shows">
                {["Call", "Quote", "Directions"].map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-peach px-3 py-1.5 text-sm font-bold text-cocoa"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[17px] leading-snug font-bold text-cocoa">
                The spot neighbours check before they call.
              </p>
            </article>

            <ul className="flex flex-col items-stretch gap-3 sm:items-end">
              {notes.map((note, index) => (
                <li
                  key={note.title}
                  className={`note-loop note-loop-${index + 1} flex w-full max-w-md items-center gap-3 rounded-xl border-2 border-peach bg-white py-2.5 pr-5 pl-2.5`}
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-peach text-cocoa">
                    <Dot />
                  </span>
                  <span>
                    <span className="block text-[15px] leading-tight font-extrabold text-cocoa">
                      {note.title}
                    </span>
                    <span className="mt-0.5 block text-[14px] text-muted">
                      {note.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Map() {
  return (
    <svg
      viewBox="0 0 360 168"
      className="mt-5 h-40 w-full rounded-lg"
      role="img"
      aria-label="A simple map with your business marked in orange"
    >
      <rect width="360" height="168" fill="#FFE9D6" />
      <path
        d="M0 118c48-28 72 18 128-4s78-46 122-18 70 8 110-16v88H0Z"
        fill="#FFF8F1"
      />
      <path
        d="M-10 78h390"
        stroke="#F58A3C"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M188-10v200"
        stroke="#F58A3C"
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="78" cy="48" r="7" fill="#2A2320" />
      <circle cx="286" cy="112" r="7" fill="#2A2320" />
      <circle cx="214" cy="58" r="11" fill="#C2410C" />
      <circle cx="214" cy="58" r="4" fill="#FFF8F1" />
    </svg>
  );
}

function Pin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.5a6.5 6.5 0 0 0-6.5 6.5c0 4.7 6.5 12.5 6.5 12.5s6.5-7.8 6.5-12.5A6.5 6.5 0 0 0 12 2.5Zm0 8.8a2.3 2.3 0 1 1 0-4.6 2.3 2.3 0 0 1 0 4.6Z"
      />
    </svg>
  );
}

function Dot() {
  return <span className="size-2.5 rounded-full bg-foreman" aria-hidden="true" />;
}
