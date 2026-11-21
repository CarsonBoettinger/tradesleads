import {
  Container,
  CtaLink,
  Eyebrow,
  reportCta,
  reportHref,
} from "@/components/ui";

export function Audit() {
  return (
    <section className="bg-peach py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow on="peach">Free digital presence report</Eyebrow>
          <h2 className="mt-4 text-[2.25rem] leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl">
            See where you could be missing jobs
          </h2>
          <p className="mt-5 text-[18px] leading-[1.6] text-muted sm:text-[19px]">
            A clear look at your Google visibility, local traffic, and listings,
            then a report card on what those gaps may cost in booked work.
          </p>
          <div className="mt-8">
            <CtaLink href={reportHref}>{reportCta}</CtaLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
