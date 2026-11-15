import { Container, Eyebrow } from "@/components/ui";

const outcomes = [
  {
    title: "Calls from people who need the work",
    body: "Homeowners with a job in mind, not window shoppers passing through.",
  },
  {
    title: "Quote requests while you are on the tools",
    body: "The website takes the details so you can call them back between jobs.",
  },
  {
    title: "Slow weeks with work you want",
    body: "Show up for the searches that fill the gaps, not only the rush.",
  },
];

const days = [
  { day: "Mon", item: "Quote request", hot: true },
  { day: "Tue", item: "On a job", hot: true },
  { day: "Wed", item: "Open", hot: false },
  { day: "Thu", item: "New review", hot: true },
  { day: "Fri", item: "Call booked", hot: true },
  { day: "Sat", item: "Quote request", hot: true },
  { day: "Sun", item: "Quiet", hot: false },
];

export function Booked() {
  return (
    <section id="booked" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        <Eyebrow>A fuller week</Eyebrow>
        <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <h2 className="max-w-xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
            Turn that search into a booked job
          </h2>
          <p className="max-w-xl text-[18px] leading-[1.6] text-muted sm:text-[19px] lg:pb-1">
            Calls, quotes, and bookings. That is the work a website and a
            Google listing should do for a trade business.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {outcomes.map((outcome) => (
            <li
              key={outcome.title}
              className="rounded-xl border-2 border-peach bg-white p-7 sm:p-8"
            >
              <h3 className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa">
                {outcome.title}
              </h3>
              <p className="mt-3 text-[17px] leading-relaxed text-muted">
                {outcome.body}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border-2 border-peach bg-white p-6 sm:p-8">
          <p className="text-[15px] font-bold tracking-[0.16em] text-muted uppercase">
            A week on the board
          </p>
          <ol className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {days.map((day) => (
              <li
                key={day.day}
                className={`rounded-lg px-3 py-4 ${
                  day.hot ? "bg-peach" : "bg-cream"
                }`}
              >
                <p className="text-sm font-bold tracking-[0.14em] text-muted uppercase">
                  {day.day}
                </p>
                <p className="mt-2 text-[15px] leading-snug font-extrabold tracking-[-0.02em] text-cocoa">
                  {day.item}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
