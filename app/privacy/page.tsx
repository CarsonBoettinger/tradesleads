import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import {
  LEGAL_EMAIL,
  LEGAL_UPDATED,
  LegalDocument,
  type LegalSection,
} from "@/components/legal-document";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  webPageJsonLd,
} from "@/lib/seo";

const title = "Privacy Policy";
const description =
  "How Kalvez collects, uses, shares, and keeps information when you book a demo, unlock a free report, or browse kalvez.com.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/privacy",
  keywords: [
    "Kalvez privacy policy",
    "trade business lead privacy",
    "digital presence report privacy",
  ],
});

const sections: LegalSection[] = [
  {
    id: "summary",
    title: "Short version",
    body: (
      <>
        <p>
          Kalvez builds websites and local search for trade businesses. This
          policy explains what we collect when you use kalvez.com, book a free
          demo, or unlock a free digital presence report.
        </p>
        <ul>
          <li>
            If you fill in a form, we keep the name, email, phone, and business
            details you typed, and we contact you only within the consent box
            you checked.
          </li>
          <li>
            A demo request is about that demo. It is not a standing marketing
            list. A report unlock lets us contact you about that report and
            about local growth help for the business you named.
          </li>
          <li>
            The report reads public business information: a Google listing, the
            public website, nearby competitors, and public reviews. We do not
            send your name, email, or phone to Google for that scan.
          </li>
          <li>
            We do not sell personal information. We do not run advertising
            cookies or cross-site tracking.
          </li>
          <li>
            Email{" "}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> to access,
            correct, delete, or stop contact. Put “Privacy request” in the
            subject line.
          </li>
        </ul>
        <p>
          The rest of this policy is the full notice. If a short line and a
          later section ever read differently, the later section controls.
        </p>
      </>
    ),
  },
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <p>
          Kalvez (“Kalvez,” “we,” “us”) operates{" "}
          <a href="https://kalvez.com">kalvez.com</a> and provides websites and
          local search growth for independent trade businesses. The site
          includes a public blog, trade pages, a free 20-minute demo, and a
          free digital presence report.
        </p>
        <p>
          For privacy requests, Kalvez is the organization responsible for the
          contact details you submit. Email{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. That inbox is
          the privacy contact for the United States, Canada, and, where those
          laws apply, the European Economic Area and the United Kingdom.
        </p>
        <p>
          This policy is written for the product as it works on {LEGAL_UPDATED}.
          We do not offer user accounts, a newsletter, or checkout on the site.
          Paid work, if you and Kalvez later agree to it, is covered by a
          separate agreement and by this policy for any personal information
          that work involves.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    title: "What this policy covers",
    body: (
      <>
        <p>This policy applies to personal information we handle when you:</p>
        <ul>
          <li>browse kalvez.com, including the blog and trade pages;</li>
          <li>search for a business and run a free digital presence report;</li>
          <li>unlock a report or book a free demo;</li>
          <li>talk with us by phone or email after one of those requests;</li>
          <li>
            later hire Kalvez for a website or local-search project that uses
            the same contact record.
          </li>
        </ul>
        <p>
          It does not control Google, OpenStreetMap, your own website host, or
          any other site we link to. Their rules apply when you deal with them
          directly.
        </p>
        <p>
          The site is meant for trade-business owners and people who work for
          them in the United States and Canada. If you contact us from
          somewhere else, we still handle the information you send as this
          policy describes.
        </p>
      </>
    ),
  },
  {
    id: "notice",
    title: "Notice at collection",
    body: (
      <>
        <p>
          This section is the notice we give at or before we collect personal
          information, including for the California Consumer Privacy Act as
          amended by the CPRA, and for similar US state laws.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-[15px] leading-relaxed">
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples we actually collect</th>
                <th>Sold or shared for ads</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Identifiers</td>
                <td>
                  First and last name, email address, phone number, and an IP
                  address used briefly to limit abusive requests.
                </td>
                <td>No</td>
              </tr>
              <tr>
                <td>Customer records</td>
                <td>
                  Business name, town, trade, best time to call, how you heard
                  about Kalvez, and comments you choose to write.
                </td>
                <td>No</td>
              </tr>
              <tr>
                <td>Commercial information</td>
                <td>
                  Which free offer you requested (demo or report). We do not
                  take payment card numbers on this site.
                </td>
                <td>No</td>
              </tr>
              <tr>
                <td>Internet or network activity</td>
                <td>
                  Hosting logs of page and API requests, the business name you
                  search, and report status checks during that visit.
                </td>
                <td>No</td>
              </tr>
              <tr>
                <td>Geolocation</td>
                <td>
                  The map coordinates of a public business listing. A host may
                  infer a coarse location from an IP address. We do not read
                  GPS from your phone or browser.
                </td>
                <td>No</td>
              </tr>
              <tr>
                <td>Professional information</td>
                <td>
                  Trade, business name, town, and public listing details such as
                  address, website, rating, and review count.
                </td>
                <td>No</td>
              </tr>
              <tr>
                <td>Inferences</td>
                <td>
                  Scores and rough estimates about a business’s public online
                  presence. These describe the listing and the website, not a
                  consumer profile for advertising.
                </td>
                <td>No</td>
              </tr>
              <tr>
                <td>Sensitive personal information</td>
                <td>
                  We do not ask for government IDs, precise GPS, health data,
                  biometrics, or financial account numbers. Do not put them in
                  the comments box.
                </td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We use these categories to provide the demo and the report, contact
          you as you consented, keep the site secure, and keep internal
          records. We keep contact details for up to 24 months after our last
          meaningful contact about that request, unless a longer period is
          required for an active project, a legal claim, security, or an
          opt-out record. Retention is described in full below.
        </p>
        <p>
          We do not sell personal information, and we do not share it for
          cross-context behavioral advertising.
        </p>
      </>
    ),
  },
  {
    id: "you-give",
    title: "Information you give us",
    body: (
      <>
        <h3>Free demo</h3>
        <p>
          The demo form asks for your first name, last name, email, mobile
          number, business name, town, trade, and the best time to reach you.
          You can also tell us how you heard about Kalvez and leave comments or
          questions. You must check the box agreeing to be contacted about that
          demo. The form states that this consent is about the demo, not a
          standing list. We store that choice with the lead.
        </p>
        <p>
          If you submit the demo form again with the same email address, we
          update the existing lead instead of creating a second record. We may
          also match a phone number so the same person is not saved twice.
        </p>
        <h3>Free report unlock</h3>
        <p>
          Before the full score is shown, the report asks for your first name,
          last name, email, and phone, and for a checkbox. That checkbox is
          consent for Kalvez to contact you about the report and about local
          growth help. We save those contact details on the report and as a
          lead. The lead is tagged as a presence-report request, separate from
          a demo request.
        </p>
        <p>
          If we already have a lead for the same email or phone, we update that
          lead and attach the report. If that lead already unlocked a report
          for the same business, we may show the earlier score card again.
        </p>
        <h3>What we do not ask for</h3>
        <p>
          We do not ask you to create a password, upload a photo of yourself,
          or enter a payment card. Comments are free text. If you type extra
          details there, we will treat them as information you chose to send so
          we can prepare for the conversation. Please leave out government ID
          numbers, card numbers, and health information.
        </p>
      </>
    ),
  },
  {
    id: "business-scan",
    title: "Information about a business",
    body: (
      <>
        <p>
          The report is a scan of public business information. You can look up
          a business by name. That search text is sent to our server and then
          to Google Places so we can show matching listings. Choosing a listing
          sends us the place id, business name, address, place types, and map
          coordinates returned for that listing.
        </p>
        <p>For the business you select, the scan may store and display:</p>
        <ul>
          <li>
            public listing details from Google, such as name, formatted
            address, town, website, the listing’s phone number, star rating,
            review count, maps link, and place types;
          </li>
          <li>
            public reviews Google returns, including the reviewer’s display
            name, star rating, review text, and relative time;
          </li>
          <li>
            nearby competitors on the map, with their public name, address,
            rating, review count, and coordinates;
          </li>
          <li>
            keyword checks for how the listing shows up for trade searches in
            the service area;
          </li>
          <li>
            a website scan of the public URL on the listing, including
            performance, accessibility, best-practices, and SEO signals,
            whether the site uses HTTPS, a rough load time, on-page checks, and
            a screenshot of the public page when the scan provides one;
          </li>
          <li>
            scores and rough estimates, including a grade and an illustrated
            range of missed work. Those figures are estimates, not a measure of
            your bank account or your actual revenue.
          </li>
        </ul>
        <p>
          We use the listing’s coordinates to ask OpenStreetMap Nominatim for
          nearby town names so keyword checks can cover a realistic service
          area. That request does not include your name, email, or phone.
        </p>
        <p>
          We do not contact the reviewers shown on a report. A phone number
          that arrives from the public listing is stored as listing data. It is
          separate from the phone number you type into the unlock form, and we
          do not treat the listing number as consent to call that business.
        </p>
        <p>
          Public listing data can be wrong or out of date because it comes from
          Google and from the website itself. Asking Kalvez to correct your
          contact details does not change the Google listing. Listing edits are
          made in the Google Business Profile account for that business.
        </p>
      </>
    ),
  },
  {
    id: "automatic",
    title: "Information collected automatically",
    body: (
      <>
        <p>
          The site does not use Google Analytics, a Meta pixel, advertising
          cookies, or a tag manager. We do not build a browsing profile of you
          for ads.
        </p>
        <ul>
          <li>
            <strong>Rate limits.</strong> When you submit a form or start a
            scan, the server reads the IP address from the request (including
            common forwarding headers) and keeps a short counter in memory.
            The counter expires within minutes to about an hour, depending on
            the route, and it is not written into your lead record. It exists
            to slow abuse.
          </li>
          <li>
            <strong>Hosting logs.</strong> Netlify, which hosts the site, may
            log IP address, user agent, URL, time, and status code for security
            and operations. We do not use those logs to advertise to you.
          </li>
          <li>
            <strong>Spam check.</strong> Forms include a hidden field people
            are not meant to fill in. If that field is filled, we treat the
            submission as automated and discard it. We do not save a lead from
            it.
          </li>
          <li>
            <strong>Report credential.</strong> Starting a scan creates a
            report id and a secret unlock token. They stay in the page while
            you use the report. We do not store them in a cookie. Refreshing or
            closing the page drops them from the browser. The report itself
            remains on our server. Anyone with both values could request that
            report, so do not post them publicly.
          </li>
          <li>
            <strong>Map tiles.</strong> If a competitor map is shown, your
            browser loads map images from OpenStreetMap and a stylesheet from
            the unpkg content network. Those services see your IP address.
            We do not send them your name, email, or phone.
          </li>
        </ul>
        <p>
          Type used on the site is delivered from our own hosting. We do not
          set analytics cookies, and we do not use local storage for tracking.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use information",
    body: (
      <>
        <p>We use personal information to:</p>
        <ul>
          <li>book and run the demo you asked for, at the time you picked;</li>
          <li>
            build, show, and explain the digital presence report you asked for;
          </li>
          <li>
            contact you by phone or email within the consent you gave, as
            described in “Calls and email” in our{" "}
            <Link href="/terms">Terms of Service</Link>;
          </li>
          <li>
            recognize a repeat submission so we do not create duplicate leads;
          </li>
          <li>
            send an internal alert to Kalvez when a new lead is saved, so a
            person can follow up;
          </li>
          <li>
            protect the site, investigate abuse, and enforce rate limits;
          </li>
          <li>
            keep records of a request, a consent choice, and an opt-out;
          </li>
          <li>
            comply with law, respond to lawful requests, and establish or
            defend a legal claim;
          </li>
          <li>
            run a later project you and Kalvez agree to in writing, using the
            contact details already on the lead.
          </li>
        </ul>
        <p>
          We do not use your contact details to train public AI models. Blog
          posts are drafted from topics Kalvez chooses. Those drafts are not
          built from demo forms, report contact details, or customer comments.
        </p>
        <p>
          Report scores are produced automatically from public signals so we
          can show you the report you requested. They are not used to decide
          credit, housing, employment, insurance, or anything else with a legal
          or similarly serious effect on you. You can ignore the report, and
          you can ask us which of the main inputs (search, website, listings)
          drove the score.
        </p>
      </>
    ),
  },
  {
    id: "bases",
    title: "Why we are allowed to do this",
    body: (
      <>
        <p>
          Where a law requires a legal basis, we rely on the following. More
          than one can apply to the same activity.
        </p>
        <ul>
          <li>
            <strong>Consent.</strong> The checkbox on the demo form, and the
            checkbox on the report form. You can withdraw consent at any time.
            Withdrawal does not undo contact that already happened.
          </li>
          <li>
            <strong>Steps you asked us to take.</strong> Preparing the demo or
            the report before any paid contract exists.
          </li>
          <li>
            <strong>Contract.</strong> If you later hire Kalvez, we use contact
            and project details to perform that agreement.
          </li>
          <li>
            <strong>Legitimate interests.</strong> Running the site, securing
            it, measuring abuse, keeping a record of consent and opt-out, and
            understanding public business listings that a visitor asked us to
            scan. We do not treat those interests as a reason to send unrelated
            marketing.
          </li>
          <li>
            <strong>Legal obligation.</strong> Keeping or disclosing information
            when the law requires it.
          </li>
        </ul>
        <p>
          A demo checkbox is consent to be contacted about that demo. It is not
          consent to join a general mailing list. A report checkbox is consent
          to be contacted about that report and about local growth help for the
          business. If we ever want to use contact details for a new purpose
          that the checkbox did not cover, we will ask you first.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar tools",
    body: (
      <>
        <p>
          Kalvez does not set advertising or analytics cookies. We do not use
          the report unlock token as a cookie. A host or a security tool in
          front of the site may set a strictly necessary cookie to deliver the
          site or block abuse. Those cookies are not used to follow you across
          other companies’ sites.
        </p>
        <p>
          We do not respond to “Do Not Track” browser signals with a special
          behavior, because we do not track you across third-party sites. A
          Global Privacy Control signal is treated as a request not to sell or
          share personal information. We already do not sell or share it. The
          signal does not delete a lead you chose to submit. Email us if you
          also want deletion or an opt-out of contact.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who receives information",
    body: (
      <>
        <p>
          We do not sell leads. We share personal information with service
          providers who process it for us, and with the internal channel we use
          to answer requests. We may also share information if we sell or
          reorganize the business, if a law requires it, or if it is needed to
          investigate abuse or protect someone from harm.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-[15px] leading-relaxed">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Why</th>
                <th>What they get</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Supabase</td>
                <td>
                  Database for leads and reports, and the function that alerts
                  us to a new lead.
                </td>
                <td>
                  The lead and report records described in this policy,
                  including contact details after a form is submitted.
                </td>
              </tr>
              <tr>
                <td>Netlify</td>
                <td>Hosting for the website and its API routes.</td>
                <td>
                  Request logs, which can include IP address, user agent, and
                  the URL requested.
                </td>
              </tr>
              <tr>
                <td>Google Places and PageSpeed Insights</td>
                <td>
                  Business search, public listing details, and the public
                  website scan.
                </td>
                <td>
                  The business search text, place id, and the public website
                  URL. Not your name, email, or the phone number you typed.
                </td>
              </tr>
              <tr>
                <td>OpenStreetMap (Nominatim and map tiles)</td>
                <td>
                  Nearby town names for the scan, and the map you see in the
                  browser.
                </td>
                <td>
                  Our server sends listing coordinates to Nominatim. Your
                  browser loads map tiles, so OpenStreetMap sees the IP address
                  of that browser. Not your name, email, or phone.
                </td>
              </tr>
              <tr>
                <td>unpkg</td>
                <td>Stylesheet for the map library.</td>
                <td>
                  Your browser’s IP address when the map loads. Not your form
                  details.
                </td>
              </tr>
              <tr>
                <td>Telegram</td>
                <td>
                  A private operations chat so Kalvez can see a new lead and
                  call you back.
                </td>
                <td>
                  Name, phone, email, business, town, trade, best time, how you
                  heard about us, comments, and an internal tag for demo or
                  report.
                </td>
              </tr>
              <tr>
                <td>OpenAI</td>
                <td>Drafting blog articles from topics we choose.</td>
                <td>
                  Editorial prompts. We do not send demo forms, report contact
                  details, or customer comments to OpenAI for this.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Staff and contractors who answer leads can see the lead record for
          that purpose. They are not a separate marketing list. If a provider
          on this list changes, we will update this policy when the new
          provider handles personal information in a materially different way.
        </p>
      </>
    ),
  },
  {
    id: "no-sale",
    title: "We do not sell personal information",
    body: (
      <>
        <p>
          We do not sell personal information for money. We do not share it for
          cross-context behavioral advertising. We do not allow third parties
          to use demo or report contact details for their own direct marketing.
        </p>
        <p>
          A service provider who hosts data or delivers a message for us is not
          a sale. An internal Telegram alert to Kalvez is not a sale. If that
          ever changed, we would say so in this policy and provide a way to opt
          out before the new use started.
        </p>
        <p>
          California’s “Shine the Light” law and Nevada’s sale opt-out both
          concern disclosure for third-party direct marketing or a sale. We do
          not do either. You may still email{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> and we will
          confirm that.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    body: (
      <>
        <p>
          We keep personal information only as long as we need it for the
          purpose you were told about, and then we delete it or strip the
          fields that identify you.
        </p>
        <ul>
          <li>
            <strong>Demo and report contact details.</strong> For up to 24
            months after our last meaningful contact about that request, unless
            you are in an active project with Kalvez or we need the record for
            a legal claim.
          </li>
          <li>
            <strong>Consent and opt-out.</strong> We keep the fact of your
            consent, and if you opt out we keep the minimum needed (typically
            the email or phone number and the date) so we do not contact you
            again by mistake.
          </li>
          <li>
            <strong>Report scans.</strong> Scores, public listing fields, and a
            website screenshot can remain with the report record for the same
            period. On a deletion request we remove your name, email, and phone
            from that record. You can also ask us to delete the report record
            tied to you. Public facts that do not identify you may remain in
            backups until those backups age out.
          </li>
          <li>
            <strong>Rate-limit counters.</strong> Minutes, in server memory, not
            a permanent file.
          </li>
          <li>
            <strong>Hosting logs.</strong> A short security window. We do not
            keep them as a marketing history. A typical window is up to 90
            days unless a longer copy is needed to investigate abuse.
          </li>
          <li>
            <strong>Backups.</strong> Deleted records can persist in encrypted
            backups until the backup cycle overwrites them. We do not restore a
            deleted lead in order to contact you.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect information",
    body: (
      <>
        <p>
          The site is served over HTTPS. Database credentials stay on the
          server and are not shipped to the browser. Forms are rate-limited,
          checked for a spam field, and rejected when sent from an unexpected
          origin. Report scores stay behind the unlock step and a secret token.
        </p>
        <p>
          Access to lead records is limited to the people and providers who
          need them to run Kalvez. No method of storage or transmission is
          perfect. We cannot promise that a breach will never happen. If a
          breach of your contact details requires notice, we will notify you as
          the law requires.
        </p>
      </>
    ),
  },
  {
    id: "choices",
    title: "Your choices",
    body: (
      <>
        <ul>
          <li>
            <strong>Do not submit a form.</strong> You can read the site, the
            blog, and the trade pages without giving us your name or phone. The
            full report score and the demo booking require the form.
          </li>
          <li>
            <strong>Withdraw consent.</strong> Email{" "}
            <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> and we will stop
            contacting you for the purpose you withdraw. A demo opt-out stops
            demo follow-up. A report opt-out stops contact about that report
            and about local growth help.
          </li>
          <li>
            <strong>Texts.</strong> We do not run a recurring promotional text
            program. If you ever receive a text from us about a request you
            made, reply STOP to end texts. Message and data rates from your
            carrier may apply.
          </li>
          <li>
            <strong>Access, correction, deletion.</strong> Use the request
            process in the next section. You can correct a name, email, phone,
            town, or trade that you submitted. We cannot edit Google’s copy of
            a public listing.
          </li>
          <li>
            <strong>Appeals.</strong> If we deny a privacy request, reply to
            that decision and we will review it again.
          </li>
        </ul>
        <p>
          We will not deny a demo, a report, or later work, and we will not
          charge a different price, because you exercised a privacy right. If
          we cannot complete a request without the detail you asked us to
          delete, we will say so.
        </p>
      </>
    ),
  },
  {
    id: "us-rights",
    title: "United States privacy rights",
    body: (
      <>
        <p>
          Depending on where you live, state privacy laws may give you the
          right to know, access, correct, delete, and obtain a portable copy of
          personal information, and the right to opt out of sale, sharing, and
          targeted advertising. Some of those laws apply only after a business
          crosses a size or revenue threshold. We honor the requests in this
          section even when a statute does not force us to.
        </p>
        <p>To make a request:</p>
        <ol>
          <li>
            Email <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> with the
            subject line “Privacy request.”
          </li>
          <li>
            Say whether you want access, correction, deletion, a copy, or to
            opt out of contact. Include the email address or phone number on
            the lead so we can find the right record.
          </li>
          <li>
            We may ask a follow-up question to confirm the request comes from
            the person on the lead, or from someone that person authorized. We
            will not ask you to create an account to do this.
          </li>
        </ol>
        <p>
          An authorized agent may submit a request with proof of authority. We
          may still ask the person on the lead to confirm the agent may act.
        </p>
        <p>
          We aim to respond within 45 days. If a request is complex, we may
          take another 45 days and will tell you why. If we deny the request,
          we will explain the reason and how to appeal. Appeals are answered
          within 45 days. If an appeal is denied and your state offers a
          regulator complaint, we will say how to reach that regulator.
        </p>
        <p>
          We do not use sensitive personal information to infer characteristics
          about you, and we do not sell or share personal information, so there
          is no separate “limit the use of sensitive information” or “opt out of
          sale” switch to turn off. The email above still works if you want
          that confirmed in writing.
        </p>
      </>
    ),
  },
  {
    id: "canada",
    title: "Canada",
    body: (
      <>
        <p>
          If Canadian personal-information law applies, including PIPEDA, we
          collect, use, and disclose personal information for the purposes in
          this policy and with the consent the form records. You may withdraw
          consent, ask for access, and ask us to correct information you
          submitted, subject to the limits those laws allow (for example, a
          record we must keep for a legal claim).
        </p>
        <p>
          Our database, host, and operations chat may process information in
          the United States or another country where those providers operate.
          Those countries may not give the same privacy rights as your
          province. We use the providers listed in this policy for the purposes
          listed here.
        </p>
        <p>
          The privacy contact for a Canadian request is{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. If you are in
          Quebec, that address is also the person responsible for personal
          information under this policy. You may lodge a complaint with the
          Office of the Privacy Commissioner of Canada, or with your provincial
          commissioner where one has authority.
        </p>
      </>
    ),
  },
  {
    id: "europe",
    title: "Europe and the United Kingdom",
    body: (
      <>
        <p>
          The site is directed at trade businesses in the United States and
          Canada. We do not offer the service in a way that targets the
          European Economic Area or the United Kingdom. If you still send us
          personal information from there, Kalvez is the controller of the
          contact details you submit, and we process them as this policy
          describes.
        </p>
        <p>
          Our bases are consent, steps you asked us to take before a contract,
          performance of a contract if you hire us, legitimate interests in
          security and in answering the request you made, and legal obligation.
          You can ask for access, correction, deletion, restriction, or a copy,
          and you can object to processing based on legitimate interests. You
          can withdraw consent at any time. You can also complain to your local
          data protection authority. We have not appointed an EU or UK
          representative because we do not target those markets.
        </p>
        <p>
          Providers in the United States may handle the information. Where a
          transfer tool is required and we do not have one in place for a given
          provider, do not submit the form from the EEA or the UK. Email us
          first and we will tell you whether we can take the request.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <>
        <p>
          Kalvez is a business service for trade operators. It is not directed
          at children, and we do not knowingly collect personal information from
          anyone under 18. The forms are for people who can bind themselves to
          the consent they check. If you believe a child gave us personal
          information, email{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a> and we will delete
          it.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Where information is processed",
    body: (
      <>
        <p>
          We operate from the United States and serve trade businesses in the
          United States and Canada. Supabase, Netlify, Google, Telegram, and
          OpenAI may process information in the United States and in other
          countries where they run their services. OpenStreetMap and unpkg may
          receive the technical data described above from those same kinds of
          locations.
        </p>
        <p>
          Those countries may have privacy laws that differ from the laws where
          you live. We share only what this policy describes, and only for the
          purposes this policy describes.
        </p>
      </>
    ),
  },
  {
    id: "other-sites",
    title: "Other sites and public pages",
    body: (
      <>
        <p>
          The report may link to a Google listing, a business website, or a map.
          Blog posts may link to outside sources. If you follow those links,
          you leave Kalvez and the other site’s policy applies. A website
          screenshot in a report is a copy of a public page at the time of the
          scan. It can include whatever that page showed, such as a customer
          quote the business published. We use it to show the scan result, not
          to build a consumer marketing profile.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <>
        <p>
          If we change this policy, we will post the new version on this page
          and change the “last updated” date. If a change would use contact
          details for a purpose the checkbox did not cover, we will ask for
          consent before that new use. Continuing to browse public pages after
          a new date does not, by itself, expand the consent you already gave
          on a form.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact us",
    body: (
      <>
        <p>
          Privacy questions and requests go to{" "}
          <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. Use the subject
          line “Privacy request” so we can route it. You can also start from
          the <Link href="/free-demo">demo form</Link> and write “Privacy
          request” in the comments, but email is faster and does not require
          you to book a demo.
        </p>
        <p>
          The <Link href="/terms">Terms of Service</Link> cover use of the
          site, the report, the demo, and the limits on what the free tools
          promise. This privacy policy covers how we handle personal
          information. Both apply.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <JsonLd
        data={webPageJsonLd({
          name: title,
          description,
          path: "/privacy",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <LegalDocument
        kicker="Privacy"
        title="Privacy Policy"
        lede="What Kalvez collects when you browse the site, book a free demo, or unlock a free digital presence report, and what we do with it."
        sections={sections}
      />
    </div>
  );
}
