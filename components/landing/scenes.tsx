import { Container, Eyebrow } from "@/components/ui";

const scenes = [
  {
    label: "After hours",
    body: "A homeowner searches after dinner. Your business is the one they can call.",
  },
  {
    label: "On the tools",
    body: "You are on a roof. The website answers the questions you cannot take right then.",
  },
  {
    label: "After the job",
    body: "The work is done. The review ask goes out while it is still fresh.",
  },
];

export function Scenes() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="scenes-heading">
      <Container>
        <Eyebrow>On a normal week</Eyebrow>
        <h2
          id="scenes-heading"
          className="mt-4 max-w-3xl text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl"
        >
          The phone rings for the right reasons
        </h2>
        <ul className="mt-12 grid gap-4 lg:grid-cols-3">
          {scenes.map((scene) => (
            <li
              key={scene.label}
              className="flex min-h-56 flex-col justify-between rounded-xl border-2 border-peach bg-white p-7 sm:p-9"
            >
              <p className="text-base font-bold tracking-[0.16em] text-foreman uppercase">
                {scene.label}
              </p>
              <p className="mt-8 text-[22px] leading-snug font-extrabold tracking-[-0.02em] text-cocoa">
                {scene.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
