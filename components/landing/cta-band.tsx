import { Container, CtaLink, demoCta, demoHref } from "@/components/ui";

export function CtaBand() {
  return (
    <section className="py-6" aria-labelledby="tagline-heading">
      <Container>
        <div className="rounded-xl bg-cocoa px-6 py-14 text-center sm:px-12 sm:py-16">
          <h2
            id="tagline-heading"
            className="text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cream sm:text-6xl"
          >
            Get found. Get hired.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[18px] leading-[1.6] text-[#c5d0e0]">
            Tell us the trade and the town. The demo takes 20 minutes.
          </p>
          <div className="mt-8">
            <CtaLink href={demoHref}>{demoCta}</CtaLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
