import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
  LEGAL_EMAIL,
  LegalDocument,
  type LegalSection,
} from "@/components/legal-document";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

const title = "Terms of Service";
const description =
  "Terms for using Kalvez, the free digital presence report, and the free demo. Paid website and local-search work is a separate agreement.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/terms",
  keywords: [
    "Kalvez terms of service",
    "free digital presence report terms",
    "trade business website terms",
  ],
});

const sections: LegalSection[] = [
  {
    id: "summary",
    title: "Short version",
    body: (
      <>
        <p>
          These terms are the agreement between you and Kalvez for kalvez.com,
          the free digital presence report, and the free demo. Please read them.
          The short version is here. The full terms below control if they say
          more.
        </p>
        <ul>
          <li>
            The report and the demo are free. They do not obligate you to buy
            anything, and they do not obligate Kalvez to start paid work.
          </li>
          <li>
            Scores, grades, and dollar ranges in a report are estimates from
            public signals. They are not a promise of rankings, calls, jobs, or
            revenue.
          </li>
          <li>
            Use your own name, email, and phone. Do not abuse the scan tool or
            resell reports.
          </li>
          <li>
            A demo checkbox lets us contact you about that demo only. A report
            checkbox lets us contact you about the report and about local growth
            help.
          </li>
          <li>
            Paid website or local-search work happens only under a separate
            written agreement. That agreement controls price, scope, and timing.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "agreement",
    title: "Agreement to these terms",
    body: (
      <>
        <p>
          These Terms of Service (“Terms”) are a contract between you and
          Kalvez (“Kalvez,” “we,” “us”) covering kalvez.com and the free tools
          on it. By using the site, starting a report, or submitting a form,
          you agree to these Terms and to the{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do
          not use the site and do not submit a form.
        </p>
        <p>
          If you use Kalvez for a business, you confirm that you have authority
          to bind that business, and “you” includes the business. If you are
          accepting only for yourself, you are still responsible for what you
          submit.
        </p>
        <p>
          We may ask you to accept a separate proposal, statement of work, or
          invoice before any paid project. If that document conflicts with
          these Terms on price, scope, schedule, or ownership of paid
          deliverables, the signed document controls for that project. These
          Terms still cover the site, the free report, and the free demo.
        </p>
      </>
    ),
  },
  {
    id: "who",
    title: "Who can use Kalvez",
    body: (
      <>
        <p>
          The site is for people who are at least 18 years old and who are
          owners, operators, or staff of a trade business, or who are otherwise
          asking about that kind of work. It is offered for businesses in the
          United States and Canada.
        </p>
        <p>You agree that:</p>
        <ul>
          <li>you are at least 18;</li>
          <li>
            the name, email, and phone you submit are yours, or you have
            permission from that person to submit them and to have Kalvez
            contact them;
          </li>
          <li>
            you will not impersonate a business owner or pretend that a listing
            is yours when it is not;
          </li>
          <li>
            you will not use the site if the law of your location forbids you
            from doing so.
          </li>
        </ul>
        <p>
          You may look up a publicly listed business, including a competitor,
          because the report uses public listing and website data. Looking up a
          listing is not permission to contact that business, to speak for it,
          or to enter someone else’s contact details in the unlock form.
        </p>
      </>
    ),
  },
  {
    id: "services",
    title: "What Kalvez offers",
    body: (
      <>
        <p>On the site, Kalvez offers:</p>
        <ul>
          <li>
            public pages and a blog about getting a trade business found in
            local search;
          </li>
          <li>
            a free digital presence report that scans a public listing and, when
            one is available, a public website;
          </li>
          <li>a free 20-minute demo you can request;</li>
          <li>
            later, if both sides agree in writing, websites and local-search
            work for trade businesses.
          </li>
        </ul>
        <p>
          Marketing copy on the site describes the kind of work Kalvez does. It
          is not a quote, a bid, or a promise that a particular ranking, call
          volume, or job count will happen. A conversation on a demo is not, by
          itself, a contract to perform paid work.
        </p>
        <p>
          We may change, pause, or remove the free report, the demo form, or
          any public page. We may refuse a scan or a demo request, including
          when a rate limit is hit, a provider is unavailable, or a request
          looks abusive.
        </p>
      </>
    ),
  },
  {
    id: "report",
    title: "The free digital presence report",
    body: (
      <>
        <h3>What the scan does</h3>
        <p>
          You search for a business, confirm the listing, and we scan public
          information. The scan can include Google listing details, public
          reviews, nearby competitors, keyword checks in a local service area,
          and a website scan of the public URL on the listing. The full score
          card stays behind the unlock form until you submit your own contact
          details and consent.
        </p>
        <p>
          Data comes from third parties and from the public website. Google,
          the website, or our providers can be slow, incomplete, or wrong. A
          business with no website, a blocked website, or a thin listing will
          produce a thinner report. Demo mode, if it is ever shown, uses sample
          data and is not a scan of a real listing.
        </p>
        <h3>Scores and dollar figures are estimates</h3>
        <p>
          Grades, ranks, “missed work” ranges, and monthly dollar ranges are
          illustrations. They are built from public signals and from
          assumptions about a typical job in a trade. They are not:
        </p>
        <ul>
          <li>a measurement of your actual revenue or bank balance;</li>
          <li>a forecast Kalvez guarantees;</li>
          <li>a statement that you will gain those dollars if you hire anyone;</li>
          <li>an appraisal, an audit, or a professional opinion you should rely on for a loan, a sale of the business, or a legal filing.</li>
        </ul>
        <p>
          Search results move. A rank shown at the time of the scan can be
          different an hour later. Page speed scores come from a lab-style
          test and can differ from what a customer feels on a particular phone
          or connection.
        </p>
        <h3>How you may use a report</h3>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to
          use the report you unlocked for your own internal business decisions
          and to share it with your staff or a business partner who is helping
          you decide. You may not resell reports, publish them as a lead
          product, scrape many businesses, or present the report as an official
          result from Google.
        </p>
        <p>
          Public listing data remains subject to the terms of the provider that
          supplied it, including Google. Map imagery is subject to the
          OpenStreetMap license. We do not give you ownership of Google’s data
          or of the map tiles.
        </p>
        <h3>Your responsibilities</h3>
        <p>
          You are responsible for the business you select. Confirm the address
          before you start the scan. You are responsible for keeping the report
          link and unlock token private during the visit. We may reuse an
          earlier score if the same contact already unlocked a report for the
          same business, so you are not running a second identical card.
        </p>
      </>
    ),
  },
  {
    id: "demo",
    title: "The free demo",
    body: (
      <>
        <p>
          The demo is a conversation of about 20 minutes about how a trade
          business shows up on Google and, if you have one, on its website. It
          is free. Requesting it does not create a duty to buy, and accepting
          the request does not create a duty for Kalvez to deliver a website,
          a listing rebuild, or any other paid task.
        </p>
        <p>
          We use the details on the form to reach you at the time of day you
          picked. We may ask you to confirm the business and the town. If we
          cannot reach you, we may try again within the scope of the demo
          consent, and then we will stop. The demo is not a standing marketing
          list.
        </p>
        <p>
          Times are not a guaranteed appointment until a person from Kalvez
          confirms them. We may offer a different time if the one you picked is
          full or if we miss each other.
        </p>
      </>
    ),
  },
  {
    id: "paid",
    title: "Paid work",
    body: (
      <>
        <p>
          Website design, build, hosting arrangements, Google Business Profile
          work, and ongoing local-search help are paid services only when you
          and Kalvez agree in writing. Writing can be a proposal or statement
          of work you accept, or an invoice you pay that describes the work.
          An email that clearly says yes to a written scope can be acceptance.
          Silence, a demo, or unlocking a report is not acceptance.
        </p>
        <p>
          Until that agreement exists, neither side has to start paid work, and
          neither side owes a cancellation fee for the free tools. The written
          agreement sets the price, what is included, how many revision rounds
          you get, when payment is due, and what happens if you stop the
          project.
        </p>
        <p>
          If a written agreement does not say who owns the finished site, then
          once the invoices for that work are paid you own the final page
          content Kalvez created for you in that project. Kalvez keeps its
          pre-existing tools, templates, know-how, and anything it had before
          the project or developed separately from your content. Third-party
          materials, stock assets, fonts, and platforms remain under their own
          licenses.
        </p>
        <p>
          You are responsible for the accuracy of business facts, license
          numbers, prices, and claims you ask us to publish. You will review
          drafts. Publishing a site or a listing change does not guarantee a
          rank on Google or a number of booked jobs.
        </p>
      </>
    ),
  },
  {
    id: "submissions",
    title: "Your submissions",
    body: (
      <>
        <p>
          You keep ownership of the contact details and comments you submit.
          You give Kalvez a non-exclusive license to use that information to
          provide the demo or the report, contact you as the checkbox allows,
          keep internal records, and protect the site. This license lasts for
          the retention period in the Privacy Policy, and longer where we must
          keep a suppression record so we do not contact you after you opt out.
        </p>
        <p>You confirm that:</p>
        <ul>
          <li>the contact details are accurate;</li>
          <li>
            you have the right to provide them and to permit the contact the
            checkbox describes;
          </li>
          <li>
            comments you write do not include someone else’s secrets, card
            numbers, or government ID numbers;
          </li>
          <li>
            you will not submit unlawful, defamatory, or infringing material.
          </li>
        </ul>
        <p>
          We may remove a comment from our working notes if we need to, and we
          may refuse a submission that breaks these Terms. We are not obliged
          to store a report or a demo request beyond the retention period in
          the Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "Acceptable use",
    body: (
      <>
        <p>You will not, and you will not help anyone else to:</p>
        <ul>
          <li>
            probe, scan, or overload the site or its APIs, bypass a rate limit,
            or circumvent an unlock token;
          </li>
          <li>
            run the report tool in bulk, by a bot, or as a way to build a
            database of businesses or leads;
          </li>
          <li>
            resell, republish, or white-label Kalvez reports as your own
            product;
          </li>
          <li>
            use a report to harass a competitor, impersonate Kalvez, or misstate
            a score as a guaranteed loss;
          </li>
          <li>
            submit a form with a phone number or email you are not allowed to
            use;
          </li>
          <li>
            interfere with security, attempt to access another person’s lead,
            or upload malware;
          </li>
          <li>
            use the site in violation of law, including laws on telemarketing,
            privacy, and intellectual property.
          </li>
        </ul>
        <p>
          We may block an IP address, discard an automated submission, and stop
          providing the free tools to anyone who breaks these rules. Those
          steps can happen without notice when we need them to protect the
          site or other people.
        </p>
      </>
    ),
  },
  {
    id: "contact-rules",
    title: "Calls and email",
    body: (
      <>
        <p>
          When you check the consent box and submit a form, you agree that
          Kalvez may contact you at the email address and phone number you
          provided, by email or by phone call, about the request you just made.
        </p>
        <ul>
          <li>
            <strong>Demo.</strong> Contact is about scheduling and holding that
            demo. It is not consent to join a general promotional list.
          </li>
          <li>
            <strong>Report.</strong> Contact is about that report and about
            local growth help for the business you asked us to look at.
          </li>
        </ul>
        <p>
          We do not run a recurring promotional text-message program. If we
          ever send a text because it is a practical way to reach you about a
          request you made, you can opt out of texts by replying STOP. Email{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> to opt out of
          calls and email. Opting out does not affect a paid project you still
          want us to finish, but tell us how you prefer to be reached about
          that project.
        </p>
        <p>
          Consent to be contacted is not a condition of buying a paid service.
          The report and the demo are free either way. You are responsible for
          any carrier charges on your phone plan. We try to call at the time of
          day you picked. We do not guarantee a particular minute.
        </p>
      </>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <>
        <p>
          The site, the Kalvez name and logo, page design, trade pages, and
          blog text are owned by Kalvez or its licensors. These Terms do not
          transfer that ownership to you. You may share a link to a public
          page. You may not copy the site design, scrape the blog to train a
          model, or use the Kalvez name in a way that suggests we endorse you
          when we have not said so.
        </p>
        <p>
          Some articles are drafted with the help of an AI writing tool from
          topics Kalvez chooses, and then published by Kalvez. They are general
          information for trade businesses. They are not advice for your
          specific job, bid, or legal question, and they are not a promise of
          results.
        </p>
        <p>
          If you believe something on the site infringes a copyright you own,
          email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with the
          URL, a description of the work, and a way to reach you. We will
          review good-faith notices and remove material when the law requires
          it.
        </p>
      </>
    ),
  },
  {
    id: "feedback",
    title: "Feedback",
    body: (
      <>
        <p>
          If you send ideas, suggestions, or comments about Kalvez outside the
          personal details on a form, you agree we may use them without owing
          you a fee or a duty to keep them confidential. We will not use that
          sentence to claim ownership of your business name, your customer
          list, or a website you already own.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services",
    body: (
      <>
        <p>
          The report depends on services we do not control, including Google
          Places, Google PageSpeed Insights, OpenStreetMap, and our hosting and
          database providers. If one of them is down, rate-limited, or changes
          its results, the report can fail, slow down, or look different. We
          are not responsible for the content of a Google listing, a review
          written by a third party, or a website we did not build.
        </p>
        <p>
          Links to other sites are for convenience. Those sites have their own
          terms. Your use of Google listing data must also comply with Google’s
          terms that apply to that data.
        </p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    body: (
      <>
        <p>
          The <Link href="/privacy">Privacy Policy</Link> describes what we
          collect, why, who receives it, how long we keep it, and how to ask
          for access or deletion. It is part of these Terms by reference. We
          do not sell personal information.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    body: (
      <>
        <p>
          The site, the blog, the free report, and the free demo are provided
          “as is” and “as available.” To the fullest extent the law allows,
          Kalvez disclaims warranties of merchantability, fitness for a
          particular purpose, title, and non-infringement, and any warranty
          that the site will be uninterrupted, error-free, or free of harmful
          components.
        </p>
        <p>Without limiting that, Kalvez does not warrant that:</p>
        <ul>
          <li>a score, rank, or dollar range is accurate or complete;</li>
          <li>
            a listing, review, or website scan reflects the current state of
            the business;
          </li>
          <li>
            using the report or the demo will produce calls, jobs, rankings, or
            revenue;
          </li>
          <li>
            a recommendation discussed on a demo will fit every business or
            every town.
          </li>
        </ul>
        <p>
          Kalvez is not a law firm, an accountant, or a financial advisor.
          Nothing on the site is legal, tax, accounting, or financial advice.
          Rankings and advertising rules belong to the platforms that set them,
          and those rules change.
        </p>
        <p>
          Some jurisdictions do not allow an implied warranty to be disclaimed.
          In those places, the disclaimers apply only as far as the law allows.
          If you are a consumer, you may have rights that these Terms cannot
          waive.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent the law allows, Kalvez and its operators will
          not be liable for indirect, incidental, special, consequential,
          exemplary, or punitive damages, or for lost profits, lost calls, lost
          jobs, lost goodwill, or lost data, whether the claim is in contract,
          tort, or anything else, and whether or not we were warned the loss
          was possible.
        </p>
        <p>
          To the fullest extent the law allows, Kalvez’s total liability for a
          claim arising out of the site, a free report, or a free demo will not
          exceed the greater of (a) the amount you paid Kalvez for the specific
          service that gave rise to the claim during the 12 months before the
          claim or (b) one hundred US dollars (US $100). Most use of the site
          is free, so the cap will often be US $100.
        </p>
        <p>
          For a paid project, liability is limited by the written agreement for
          that project. If that agreement is silent, liability for the project
          is limited to the amount you actually paid Kalvez for that project.
        </p>
        <p>
          These limits do not apply to liability that the law does not allow us
          to limit, including fraud, or death or personal injury caused by
          negligence where a limit is prohibited. Some places do not allow
          certain exclusions. In those places, the limits apply only as far as
          they can.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    body: (
      <>
        <p>
          You will indemnify and hold Kalvez harmless from claims, damages,
          losses, and reasonable legal fees brought by a third party arising
          out of your breach of these Terms, contact details you were not
          allowed to submit, content you asked us to publish that you did not
          have the right to use, or your misuse of a report. We will give you
          notice of the claim when we can. This section does not require you to
          indemnify Kalvez for Kalvez’s own fraud or willful misconduct.
        </p>
        <p>
          If you are a consumer and your local law does not allow this kind of
          indemnity, it applies only as far as that law allows.
        </p>
      </>
    ),
  },
  {
    id: "ending",
    title: "Suspension and ending",
    body: (
      <>
        <p>
          You may stop using the site at any time. You may withdraw contact
          consent as the Privacy Policy describes. We may stop offering the
          free report or the demo, and we may refuse service to anyone who
          breaks these Terms or who creates risk for the site or for another
          person.
        </p>
        <p>
          Sections that should survive by their nature survive the end of your
          use, including intellectual property, disclaimers, limitation of
          liability, indemnity, and disputes.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <>
        <p>
          We may update these Terms by posting a new version on this page and
          changing the date at the top. The new Terms apply to use of the site
          after that date. They do not change a paid statement of work you
          already accepted, except where that document says they do. If you do
          not agree to the new Terms, stop using the site.
        </p>
        <p>
          We will not expand the contact consent you already gave merely by
          updating these Terms. A wider use of your phone number or email
          requires the consent described in the Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "disputes",
    title: "Disputes and governing law",
    body: (
      <>
        <p>
          Email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> before you
          file a claim, and give us 30 days to try to resolve it. Either of us
          may still seek an injunction for misuse of intellectual property, and
          either of us may use small-claims court where the claim qualifies.
        </p>
        <p>
          These Terms are governed by the laws of the United States and the
          state where Kalvez has its principal place of business, without
          regard to conflict-of-law rules. Courts in that place have exclusive
          jurisdiction, except for small claims and except where a consumer
          protection law requires a local forum. If you are a consumer in
          Canada, mandatory rights under the laws of your province still apply.
        </p>
        <p>
          These Terms do not require arbitration, and they do not take away a
          jury or a class action. A court can refuse a section that the law
          does not allow. The rest of these Terms still stand.
        </p>
      </>
    ),
  },
  {
    id: "other",
    title: "Other terms",
    body: (
      <>
        <ul>
          <li>
            <strong>Entire agreement.</strong> These Terms and the Privacy
            Policy are the entire agreement for the site, the free report, and
            the free demo. They replace earlier oral statements about those
            free tools. A later written project agreement is added for that
            project.
          </li>
          <li>
            <strong>Severability.</strong> If a court holds a section
            unenforceable, the rest stays in effect, and the section is applied
            as far as it can be.
          </li>
          <li>
            <strong>No waiver.</strong> Waiting to enforce a right is not a
            waiver. A waiver must be in writing to bind Kalvez.
          </li>
          <li>
            <strong>Assignment.</strong> You may not assign these Terms without
            our consent. We may assign them to a successor of the business, or
            to an affiliate that will honor them. A merger or sale of Kalvez
            does not, by itself, expand how we use your contact details.
          </li>
          <li>
            <strong>Force majeure.</strong> We are not liable for a delay caused
            by events outside our reasonable control, including provider
            outages, changes to Google’s services, and failures of
            telecommunications.
          </li>
          <li>
            <strong>Electronic records.</strong> You agree that forms,
            checkboxes, and email satisfy any requirement that an agreement be
            in writing.
          </li>
          <li>
            <strong>Headings.</strong> Section headings are for convenience.
          </li>
          <li>
            <strong>Language.</strong> These Terms are in English. If we
            provide a translation, the English version controls.
          </li>
          <li>
            <strong>No third-party beneficiaries.</strong> These Terms do not
            give rights to anyone except you and Kalvez, except that our
            operators are protected by the liability limits.
          </li>
          <li>
            <strong>Export and sanctions.</strong> You will not use the site if
            you are barred from doing so under US or Canadian sanctions laws.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>
          Questions about these Terms go to{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. Kalvez operates{" "}
          <a href="https://kalvez.com">kalvez.com</a>. Privacy requests use the
          same address with the subject line “Privacy request,” as described in
          the <Link href="/privacy">Privacy Policy</Link>.
        </p>
        <p>
          To book a demo, use the{" "}
          <Link href="/free-demo">free demo page</Link>. To run a report, use
          the <Link href="/report">free report</Link>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/terms",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/terms" },
        ])}
      />
      <LegalDocument
        kicker="Terms"
        title="Terms of Service"
        lede="The rules for using Kalvez, the free digital presence report, and the free demo. Paid work starts only when you and Kalvez agree in writing."
        sections={sections}
      />
    </div>
  );
}
