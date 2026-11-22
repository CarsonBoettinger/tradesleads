export type ServicePage = {
  slug: string;
  name: string;
  headline: string;
  pageTitle: string;
  description: string;
  summary: string;
  searchExample: string;
  problemHeading: string;
  outcomesHeading: string;
  ctaBody: string;
  pains: Array<{ title: string; body: string }>;
  outcomes: Array<{ title: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
  keywords: string[];
  relatedSlugs: string[];
  featured: boolean;
};

export const services: ServicePage[] = [
  {
    slug: "backlinks",
    name: "Backlinks",
    headline: "Backlinks that help trade businesses rank",
    pageTitle: "Backlinks for trade businesses",
    description:
      "Earn relevant backlinks for your trade business so Google trusts your site and sends more local customers your way.",
    summary:
      "Quality links from real local and trade sites tell Google you are the crew to call. We build backlinks that support your rankings - not spam that gets ignored.",
    searchExample: "plumber near me",
    problemHeading: "Why trade sites stall without real backlinks",
    outcomesHeading: "Backlinks that support booked jobs",
    ctaBody:
      "Tell us your trade and town. We will show how backlinks fit your local growth plan.",
    pains: [
      {
        title: "No one links to you",
        body: "Your site may be solid, but if the web never points to it, Google treats you like a stranger in your own town.",
      },
      {
        title: "Spammy link offers",
        body: "Bought directories and random blog farms can hurt more than help. Trade owners need links that look natural and local.",
      },
      {
        title: "Competitors look stronger",
        body: "Chains and bigger shops often have years of mentions and citations. Catching up takes a clear plan, not hope.",
      },
    ],
    outcomes: [
      {
        title: "Relevant local mentions",
        body: "We pursue links and citations from places that make sense for your trade and service area.",
      },
      {
        title: "Authority that compounds",
        body: "Each solid backlink supports the pages that bring calls - service pages, town pages, and your home page.",
      },
      {
        title: "No black-hat shortcuts",
        body: "We skip schemes that risk penalties. Slow, honest link growth beats a short-lived spike.",
      },
    ],
    faqs: [
      {
        question: "What is a backlink?",
        answer:
          "A backlink is a link from another website to yours. Search engines use quality links as a trust signal when they decide who to show for searches like your trade plus town.",
      },
      {
        question: "Do backlinks help local SEO?",
        answer:
          "Yes. Strong local and trade-related links support Map Pack and organic rankings when your Google Business Profile and site are also solid.",
      },
      {
        question: "How long until backlinks help?",
        answer:
          "Useful links can start helping within weeks, but steady growth over months is what moves rankings for competitive trades.",
      },
      {
        question: "Will you buy links for me?",
        answer:
          "No. We focus on earned mentions and placements that fit your business. Bought junk links are not part of the plan.",
      },
    ],
    keywords: [
      "backlinks for contractors",
      "backlinks for trade businesses",
      "local backlinks",
      "link building for plumbers",
      "SEO backlinks for trades",
    ],
    relatedSlugs: ["seo", "local-seo", "content-marketing", "content-creation"],
    featured: true,
  },
  {
    slug: "content-creation",
    name: "Content creation",
    headline: "Content creation that gets trades found",
    pageTitle: "Content creation for contractors",
    description:
      "Website and local content creation for contractors - clear pages, service copy, and updates that help customers choose you.",
    summary:
      "Empty or stale pages do not win jobs. We create trade-ready content for your site and listings so homeowners understand what you do and why to call.",
    searchExample: "AC repair near me",
    problemHeading: "Why thin content costs booked work",
    outcomesHeading: "Content built for calls, not fluff",
    ctaBody:
      "Bring your trade and service area. We will show what content to create first.",
    pains: [
      {
        title: "Generic filler copy",
        body: "Stock paragraphs about “quality service” do not answer what a homeowner needs fixed today - or why you are the right crew.",
      },
      {
        title: "Nothing to publish",
        body: "Owners on the tools rarely have time to write. Pages stay blank, blogs die, and Google has little to rank.",
      },
      {
        title: "Same words as everyone",
        body: "If every roofer and plumber says the same thing, searchers and AI answers have no reason to pick you.",
      },
    ],
    outcomes: [
      {
        title: "Service and town pages",
        body: "Clear pages for the jobs you actually do and the places you serve - written so people and search engines both get it.",
      },
      {
        title: "Fresh site updates",
        body: "New copy, FAQs, and job-focused posts keep your site alive without you writing after every install.",
      },
      {
        title: "Voice that fits the trades",
        body: "Plain language. No agency fluff. Content a customer would trust before they dial.",
      },
    ],
    faqs: [
      {
        question: "What content do trade businesses need?",
        answer:
          "Start with clear service pages, town or area pages, FAQs, and a simple about page. Then add updates that show real work and answer common job questions.",
      },
      {
        question: "Do I have to write it myself?",
        answer:
          "No. Kalvez creates content from your trade, towns, and services so you stay on the tools while the site stays useful.",
      },
      {
        question: "Is blog content still worth it?",
        answer:
          "Yes when it answers real questions - like when to replace a water heater. Random posts that never match searches waste time.",
      },
      {
        question: "How is this different from content marketing?",
        answer:
          "Content creation is the writing and page building. Content marketing is how that content gets found, shared, and turned into leads over time.",
      },
    ],
    keywords: [
      "content creation for contractors",
      "website content for trades",
      "service page writing",
      "contractor website copy",
      "content creation for plumbers",
    ],
    relatedSlugs: ["content-marketing", "seo", "local-seo", "aeo"],
    featured: true,
  },
  {
    slug: "content-marketing",
    name: "Content marketing",
    headline: "Content marketing that fills the calendar",
    pageTitle: "Content marketing for trades",
    description:
      "Content marketing for trades that turns useful pages and posts into local visibility, trust, and more booked jobs.",
    summary:
      "Publishing is not enough. We help your content show up in search, answer real homeowner questions, and point people toward a call or booking.",
    searchExample: "when to replace water heater",
    problemHeading: "Why content marketing fails for most crews",
    outcomesHeading: "Marketing content that leads to work",
    ctaBody:
      "Tell us your trade. We will map content that supports search and booked jobs.",
    pains: [
      {
        title: "Posts with no purpose",
        body: "Random tips that never match how people search do not bring calls. They clutter the site and waste time.",
      },
      {
        title: "No path to contact",
        body: "Good articles that never ask for the next step leave money on the table. Content should lead somewhere useful.",
      },
      {
        title: "Inconsistent publishing",
        body: "One burst of posts then silence teaches Google and customers that the business went quiet.",
      },
    ],
    outcomes: [
      {
        title: "Topics tied to real searches",
        body: "We plan content around jobs, seasons, and questions people already type before they hire someone like you.",
      },
      {
        title: "Distribution that matters",
        body: "Pages, posts, and updates work together with SEO and your Google profile - not as a side project.",
      },
      {
        title: "Trust before the phone rings",
        body: "Helpful content makes you the familiar name when a homeowner is ready to book.",
      },
    ],
    faqs: [
      {
        question: "What is content marketing for trades?",
        answer:
          "It is using useful website content - service pages, guides, FAQs, and updates - to attract local customers, build trust, and drive calls or bookings.",
      },
      {
        question: "How is it different from ads?",
        answer:
          "Ads stop when you stop paying. Strong content keeps working in search and on your site long after it is published.",
      },
      {
        question: "How often should we publish?",
        answer:
          "Steady and useful beats frequent and empty. A clear monthly cadence for pages and updates usually beats daily fluff.",
      },
      {
        question: "Can content marketing help reviews and referrals?",
        answer:
          "Yes. Clear explanations and proof of work make happy customers more likely to recommend you and leave reviews.",
      },
    ],
    keywords: [
      "content marketing for trades",
      "content marketing for contractors",
      "contractor content strategy",
      "local content marketing",
      "trade business content marketing",
    ],
    relatedSlugs: ["content-creation", "seo", "aeo", "geo"],
    featured: true,
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    headline: "Local SEO that puts you on the map",
    pageTitle: "Local SEO for trades",
    description:
      "Local SEO for trades: Google Business Profile, Map Pack visibility, and town-focused pages that bring nearby customers.",
    summary:
      "When someone searches your trade plus town, you want to show up in the map pack and organic results. Local SEO is how Kalvez gets you found close to home.",
    searchExample: "electrician near me",
    problemHeading: "Why local search is where jobs are won",
    outcomesHeading: "Local SEO built for crews on the tools",
    ctaBody:
      "Tell us your trade and towns. The demo shows where local SEO can unlock more calls.",
    pains: [
      {
        title: "Missing from the map pack",
        body: "If you are not in the top local results, the phone stays quiet while competitors take the emergency and install calls.",
      },
      {
        title: "Messy Google Business Profile",
        body: "Wrong hours, thin categories, weak photos, and ignored reviews tell Google - and customers - you are not ready.",
      },
      {
        title: "One page for every town",
        body: "A single thin homepage cannot compete for every service area. Local pages need real coverage for the places you serve.",
      },
    ],
    outcomes: [
      {
        title: "Profile and map visibility",
        body: "We tighten your Google Business Profile and local signals so nearby searches have a clear reason to show you.",
      },
      {
        title: "Town and service coverage",
        body: "Pages that match how people search - trade, job type, and place - so you rank where you actually work.",
      },
      {
        title: "Reviews and consistency",
        body: "Local SEO works better when reviews, NAP details, and site content stay accurate and active.",
      },
    ],
    faqs: [
      {
        question: "What is local SEO?",
        answer:
          "Local SEO is the work that helps your business show up in Google Maps and local search results when people nearby look for your trade.",
      },
      {
        question: "Is local SEO different from regular SEO?",
        answer:
          "Yes. Local SEO focuses on Google Business Profile, map rankings, reviews, and location pages. Regular SEO also covers broader website ranking factors.",
      },
      {
        question: "How long does local SEO take?",
        answer:
          "Many shops see movement in weeks for easier terms. Competitive trades and towns often need a few months of consistent work.",
      },
      {
        question: "Do I need a website for local SEO?",
        answer:
          "A strong Google profile helps, but a clear website with service and area pages makes local rankings and conversions much stronger.",
      },
    ],
    keywords: [
      "local SEO for trades",
      "local SEO for contractors",
      "Google Business Profile for contractors",
      "Map Pack SEO",
      "local SEO for plumbers",
    ],
    relatedSlugs: ["seo", "review-management", "geo", "backlinks"],
    featured: true,
  },
  {
    slug: "crm",
    name: "CRM",
    headline: "A CRM built around trade customers",
    pageTitle: "CRM for trade businesses",
    description:
      "Customer relationship manager (CRM) for trade businesses - track leads, jobs, and follow-ups so fewer quotes go cold.",
    summary:
      "Leads die in text threads and sticky notes. A simple CRM keeps every inquiry, quote, and follow-up in one place so you book more of the work you already earned.",
    searchExample: "contractor CRM",
    problemHeading: "Why missed follow-ups cost real jobs",
    outcomesHeading: "Customer relationship management that fits the shop",
    ctaBody:
      "See how a trade-focused CRM keeps leads from slipping while you are on the job.",
    pains: [
      {
        title: "Leads live in the phone",
        body: "Missed texts, half-finished quotes, and “I’ll call them later” turn into competitors getting the job.",
      },
      {
        title: "No clear next step",
        body: "Without a simple pipeline, you cannot see who needs a reminder, a quote, or a thank-you after the install.",
      },
      {
        title: "Repeat customers forgotten",
        body: "Seasonal and maintenance work walks away when nobody tracks past jobs or check-in dates.",
      },
    ],
    outcomes: [
      {
        title: "One place for every lead",
        body: "Calls, form fills, and quote requests land where you can see them - even when you are under a sink or on a roof.",
      },
      {
        title: "Follow-ups that actually happen",
        body: "Reminders and status updates keep hot jobs moving without another messy spreadsheet.",
      },
      {
        title: "Relationships that return",
        body: "Past customers stay visible for tune-ups, referrals, and the next big project.",
      },
    ],
    faqs: [
      {
        question: "What is a CRM for trade businesses?",
        answer:
          "A customer relationship manager (CRM) tracks leads, customers, quotes, and follow-ups so your shop does not lose work in the shuffle.",
      },
      {
        question: "Do small crews need a CRM?",
        answer:
          "Yes. Even a two-person crew loses jobs when quotes sit unanswered. A simple CRM pays for itself by catching follow-ups you would miss.",
      },
      {
        question: "Will this replace my job software?",
        answer:
          "Kalvez focuses on growth and customer follow-through. We keep the CRM side practical for leads and relationships - not a full field-ops suite.",
      },
      {
        question: "How does CRM tie to more jobs from Google?",
        answer:
          "Getting found is only half the battle. CRM helps you convert the leads your SEO and site already bring in.",
      },
    ],
    keywords: [
      "CRM for trade businesses",
      "customer relationship manager for contractors",
      "contractor CRM",
      "CRM for plumbers",
      "trade business CRM",
    ],
    relatedSlugs: [
      "appointment-scheduler",
      "review-management",
      "online-payments",
      "content-marketing",
    ],
    featured: true,
  },
  {
    slug: "review-management",
    name: "Review management",
    headline: "Automated review management that builds trust",
    pageTitle: "Automated review management",
    description:
      "Automated review management for trades - ask for reviews after jobs, monitor feedback, and grow the ratings that win local searches.",
    summary:
      "Reviews decide who gets the call. We help you ask at the right time, keep an eye on new feedback, and grow a profile that looks busy and trusted.",
    searchExample: "best HVAC company near me",
    problemHeading: "Why review gaps lose Map Pack jobs",
    outcomesHeading: "Reviews on autopilot after real work",
    ctaBody:
      "Bring your listing. We will show how automated review asks fit your local SEO plan.",
    pains: [
      {
        title: "Happy customers never leave reviews",
        body: "Most people will not post unless you ask. Silence online makes a solid crew look unproven.",
      },
      {
        title: "Asking feels awkward",
        body: "Owners forget to ask after a long day, or ask once and never follow up. Automation removes the awkward silence.",
      },
      {
        title: "One bad review sits unanswered",
        body: "Ignored feedback looks worse than the issue. Timely replies show you still care.",
      },
    ],
    outcomes: [
      {
        title: "Ask after the job",
        body: "Automated review requests go out when the work is done and the customer is most likely to say yes.",
      },
      {
        title: "Monitor what lands",
        body: "New reviews stay visible so you can thank customers or respond without digging through apps.",
      },
      {
        title: "Ratings that support local SEO",
        body: "Fresh, consistent reviews strengthen your Google Business Profile and help you win “near me” searches.",
      },
    ],
    faqs: [
      {
        question: "What is automated review management?",
        answer:
          "It is a system that prompts customers for reviews after jobs, tracks new feedback, and helps you respond - without relying on memory alone.",
      },
      {
        question: "Will this spam my customers?",
        answer:
          "No. Requests should be timely, polite, and limited. The goal is a natural ask after good work - not endless nagging.",
      },
      {
        question: "Do reviews help SEO?",
        answer:
          "Yes. Review volume, freshness, and ratings are important local ranking and conversion signals for Google Business Profile.",
      },
      {
        question: "Can you help with negative reviews?",
        answer:
          "We help you see them quickly and reply professionally. The best defense is also more honest positive reviews from real jobs.",
      },
    ],
    keywords: [
      "automated review management",
      "review management for contractors",
      "Google review requests",
      "review automation for trades",
      "reputation management for plumbers",
    ],
    relatedSlugs: ["local-seo", "crm", "seo", "appointment-scheduler"],
    featured: true,
  },
  {
    slug: "seo",
    name: "SEO",
    headline: "SEO that turns searches into booked jobs",
    pageTitle: "SEO for contractors",
    description:
      "SEO for contractors and trade businesses - technical fixes, keyword-focused pages, and rankings that bring real local traffic.",
    summary:
      "Search engine optimization is how the right customers find you before they call someone else. We fix what blocks rankings and build pages that earn the click.",
    searchExample: "roof repair estimate",
    problemHeading: "Why trade websites stay invisible",
    outcomesHeading: "SEO that serves the shop floor",
    ctaBody:
      "Tell us your trade. We will show the SEO gaps costing you searches and calls.",
    pains: [
      {
        title: "Pages Google cannot use",
        body: "Slow sites, thin copy, and messy structure make it hard to rank - even when the crew does great work.",
      },
      {
        title: "Wrong keywords",
        body: "Ranking for vague terms that never turn into jobs wastes effort. You need the searches that mean someone is ready to hire.",
      },
      {
        title: "Set it and forget it",
        body: "Competitors keep publishing and improving. A site that never changes slowly falls down the list.",
      },
    ],
    outcomes: [
      {
        title: "Site foundations",
        body: "Clear structure, useful titles, and pages built so Google and customers can both understand your services.",
      },
      {
        title: "Keywords tied to jobs",
        body: "We target the phrases that match emergency calls, installs, and quote requests in your trade.",
      },
      {
        title: "Ongoing improvement",
        body: "SEO is steady work - new pages, fixes, and content that keep you competitive month after month.",
      },
    ],
    faqs: [
      {
        question: "What is SEO for contractors?",
        answer:
          "SEO (search engine optimization) is the work that helps your website show up when people search for your trade, services, and town - so they find you instead of a competitor.",
      },
      {
        question: "How is SEO different from local SEO?",
        answer:
          "SEO covers your whole website’s ability to rank. Local SEO zooms in on Maps, Google Business Profile, and nearby searches. Most trades need both.",
      },
      {
        question: "How is SEO different from AEO and GEO?",
        answer:
          "SEO targets classic search results. AEO focuses on answer boxes and AI answers. GEO focuses on being cited in generative search. They work together.",
      },
      {
        question: "When will I see results?",
        answer:
          "Some fixes help quickly. Meaningful ranking gains for competitive trades usually take consistent work over a few months.",
      },
    ],
    keywords: [
      "SEO for contractors",
      "SEO for trades",
      "search engine optimization for plumbers",
      "contractor website SEO",
      "SEO for HVAC companies",
    ],
    relatedSlugs: ["local-seo", "aeo", "geo", "content-creation"],
    featured: true,
  },
  {
    slug: "aeo",
    name: "AEO",
    headline: "AEO so AI answers name your business",
    pageTitle: "Answer engine optimization (AEO)",
    description:
      "Answer engine optimization (AEO) for trades - structure your site so AI answers, featured snippets, and voice results can recommend you.",
    summary:
      "People ask ChatGPT, Google’s AI answers, and voice search who to call. AEO makes your content clear enough to be the answer - not just another blue link.",
    searchExample: "who is the best plumber in my area",
    problemHeading: "Why answer engines skip most trade sites",
    outcomesHeading: "Answer engine optimization that earns mentions",
    ctaBody:
      "See how AEO prepares your trade site for AI answers and featured results.",
    pains: [
      {
        title: "Vague pages AI cannot quote",
        body: "If your site never clearly answers common questions, answer engines skip you and cite a national blog instead.",
      },
      {
        title: "No FAQ structure",
        body: "Owners bury the useful details. Machines - and busy homeowners - need direct questions and direct answers.",
      },
      {
        title: "Invisible to new search habits",
        body: "More people ask AI who to hire. Ranking only for old-style results leaves that demand on the table.",
      },
    ],
    outcomes: [
      {
        title: "Clear answers on key pages",
        body: "We shape FAQs and service copy so answer engines can pull accurate, local-ready statements about your work.",
      },
      {
        title: "Structured for snippets",
        body: "Headings, lists, and Q&A blocks make it easier to win featured snippets and AI overview citations.",
      },
      {
        title: "Aligned with SEO",
        body: "AEO builds on solid SEO. Strong pages help both classic rankings and answer surfaces.",
      },
    ],
    faqs: [
      {
        question: "What is AEO?",
        answer:
          "AEO means answer engine optimization: making your content easy for AI answers, featured snippets, and voice results to understand and cite.",
      },
      {
        question: "How is AEO different from SEO?",
        answer:
          "SEO helps you rank in search results. AEO focuses on being selected as the direct answer inside AI and answer-style results.",
      },
      {
        question: "Do trade businesses need AEO already?",
        answer:
          "Yes. Homeowners already ask AI tools for local recommendations. Clear, quotable content helps you show up in those answers.",
      },
      {
        question: "How does AEO relate to GEO?",
        answer:
          "AEO targets answer boxes and AI replies. GEO targets generative engines that synthesize sources. Both reward clear, trustworthy pages.",
      },
    ],
    keywords: [
      "AEO",
      "answer engine optimization",
      "AEO for contractors",
      "AI search optimization for trades",
      "featured snippet optimization",
    ],
    relatedSlugs: ["geo", "seo", "content-creation", "content-marketing"],
    featured: true,
  },
  {
    slug: "geo",
    name: "GEO",
    headline: "GEO so generative search cites your crew",
    pageTitle: "Generative engine optimization (GEO)",
    description:
      "Generative engine optimization (GEO) for trades - earn citations in AI-generated search results that recommend who to hire.",
    summary:
      "Generative search writes answers from sources it trusts. GEO helps your trade business become one of those sources - so AI-assisted searchers hear your name.",
    searchExample: "recommend a local roofing company",
    problemHeading: "Why generative search overlooks good crews",
    outcomesHeading: "Generative engine optimization for local trades",
    ctaBody:
      "Learn how GEO fits with SEO and AEO so generative search can cite your business.",
    pains: [
      {
        title: "No citable proof online",
        body: "Thin sites with no clear facts give generative engines nothing solid to quote about your services or towns.",
      },
      {
        title: "National brands dominate answers",
        body: "AI often defaults to big names unless local businesses publish clear, consistent, trustworthy information.",
      },
      {
        title: "SEO alone is not enough",
        body: "Ranking a page helps. Being structured and authoritative enough to be synthesized into an AI answer is the next step.",
      },
    ],
    outcomes: [
      {
        title: "Source-ready content",
        body: "We publish clear service facts, area coverage, and proof points generative engines can reuse accurately.",
      },
      {
        title: "Authority signals",
        body: "Reviews, local mentions, and consistent business details help AI systems trust you as a real local option.",
      },
      {
        title: "Stack with SEO and AEO",
        body: "GEO works best when classic SEO and answer optimization are already in place - not as a gimmick on a weak site.",
      },
    ],
    faqs: [
      {
        question: "What is GEO?",
        answer:
          "GEO means generative engine optimization: improving how often and how accurately AI-generated search results mention or recommend your business.",
      },
      {
        question: "How is GEO different from AEO?",
        answer:
          "AEO focuses on direct answers and snippets. GEO focuses on being used as a source inside generative, multi-source AI responses.",
      },
      {
        question: "Is GEO the same as local SEO?",
        answer:
          "No. Local SEO targets Maps and local packs. GEO targets generative AI search. Local proof still helps both.",
      },
      {
        question: "What should trades do first for GEO?",
        answer:
          "Fix the basics: accurate business details, strong service pages, reviews, and clear answers. Generative engines prefer sources that look complete and trustworthy.",
      },
    ],
    keywords: [
      "GEO",
      "generative engine optimization",
      "GEO for contractors",
      "AI search citations",
      "generative SEO for trades",
    ],
    relatedSlugs: ["aeo", "seo", "local-seo", "content-marketing"],
    featured: true,
  },
  {
    slug: "appointment-scheduler",
    name: "Appointment scheduler",
    headline: "An appointment scheduler that fills the day",
    pageTitle: "Appointment scheduler for trades",
    description:
      "Appointment scheduler for trades - let customers book estimates and service windows online so fewer leads go cold after hours.",
    summary:
      "Missed calls after 5 p.m. are missed jobs. An online appointment scheduler lets homeowners pick a time while you stay on the tools - and keeps your calendar fuller.",
    searchExample: "book plumber online",
    problemHeading: "Why phone-tag loses booked work",
    outcomesHeading: "Scheduling that converts website traffic",
    ctaBody:
      "See how an appointment scheduler turns site visits and search leads into on-the-calendar jobs.",
    pains: [
      {
        title: "Leads call once and move on",
        body: "If nobody answers, the next listing gets the job. After-hours traffic needs a way to book without voicemail limbo.",
      },
      {
        title: "Back-and-forth texts",
        body: "Scheduling by text eats evenings and still double-books. A clear calendar cuts the chaos.",
      },
      {
        title: "Website with no next step",
        body: "Rankings and ads mean little if the site only says “call us” and the phone is in a truck.",
      },
    ],
    outcomes: [
      {
        title: "Book while you work",
        body: "Customers pick open windows online. You get the job on the calendar without stopping mid-install.",
      },
      {
        title: "Fewer no-shows",
        body: "Confirmations and clear time slots reduce the “I thought you were coming Thursday” surprises.",
      },
      {
        title: "Tied to your growth stack",
        body: "Scheduling works with SEO traffic, CRM follow-ups, and payments so the path from search to job stays short.",
      },
    ],
    faqs: [
      {
        question: "What is an appointment scheduler for trades?",
        answer:
          "It is an online booking tool that lets customers choose estimate or service times from your real availability instead of playing phone tag.",
      },
      {
        question: "Will customers book the wrong jobs?",
        answer:
          "You control what can be booked - estimates, service calls, or specific job types - so the calendar stays useful for your crew.",
      },
      {
        question: "Does scheduling help SEO?",
        answer:
          "Indirectly. Better conversion from the same traffic means more jobs from the visibility you already earned - and fewer wasted clicks.",
      },
      {
        question: "Can it work with a CRM?",
        answer:
          "Yes. Bookings should land as leads or jobs you can track, follow up on, and turn into reviews after the work is done.",
      },
    ],
    keywords: [
      "appointment scheduler for trades",
      "online booking for contractors",
      "scheduler for plumbers",
      "book appointments online",
      "contractor appointment scheduler",
    ],
    relatedSlugs: ["crm", "online-payments", "review-management", "local-seo"],
    featured: true,
  },
  {
    slug: "online-payments",
    name: "Online payments",
    headline: "Online payments that get you paid faster",
    pageTitle: "Online payments for contractors",
    description:
      "Online payments for contractors - send invoices customers can pay on any device so cash flow keeps up with the work.",
    summary:
      "Chasing checks slows the shop down. Online payments let customers pay deposits and final invoices the same day - without another trip across town.",
    searchExample: "pay contractor invoice online",
    problemHeading: "Why slow payments hurt good crews",
    outcomesHeading: "Get paid without the chase",
    ctaBody:
      "See how online payments fit with booking and follow-up so jobs close cleanly.",
    pains: [
      {
        title: "Checks in the mail",
        body: "Waiting on paper payments stretches cash flow and adds awkward follow-up calls after the job is done.",
      },
      {
        title: "Deposits fall through",
        body: "Without an easy way to collect a deposit, soft bookings cancel and your calendar fills with holes.",
      },
      {
        title: "Frictional checkout",
        body: "If paying is harder than hiring the next guy, customers stall - even when they liked the work.",
      },
    ],
    outcomes: [
      {
        title: "Pay-from-anywhere invoices",
        body: "Customers settle up on their phone after the job. You see payment without hunting for a mailbox.",
      },
      {
        title: "Deposits that stick",
        body: "Collect upfront for estimates that convert so materials and labor are covered before you roll out.",
      },
      {
        title: "Cleaner handoff after the job",
        body: "Paid invoices pair with review asks and CRM follow-up so the customer journey ends strong.",
      },
    ],
    faqs: [
      {
        question: "Why do contractors need online payments?",
        answer:
          "Online payments speed up deposits and final invoices, reduce awkward collection calls, and make it easier for customers to pay on the spot.",
      },
      {
        question: "Can customers pay from their phone?",
        answer:
          "Yes. Modern online payments are built for mobile - so homeowners can pay without a desktop or a paper check.",
      },
      {
        question: "Does this replace my accountant?",
        answer:
          "No. It is a faster way to collect. You still keep your books; you just spend less time chasing money.",
      },
      {
        question: "How do payments tie to reviews and scheduling?",
        answer:
          "After a smooth payment, it is the right moment to ask for a review. Scheduling, CRM, and payments work best as one path from book to paid to rated.",
      },
    ],
    keywords: [
      "online payments for contractors",
      "contractor invoice payments",
      "pay invoice online",
      "online payments for trades",
      "accept payments online plumbing",
    ],
    relatedSlugs: [
      "appointment-scheduler",
      "crm",
      "review-management",
      "content-marketing",
    ],
    featured: true,
  },
];

export const featuredServices = services.filter((service) => service.featured);

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug) ?? null;
}

export function getRelatedServices(slug: string, limit = 6) {
  const current = getServiceBySlug(slug);
  if (!current) return featuredServices.slice(0, limit);

  const related = current.relatedSlugs
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((service): service is ServicePage => Boolean(service));

  if (related.length >= limit) return related.slice(0, limit);

  const extras = featuredServices.filter(
    (service) =>
      service.slug !== slug &&
      !related.some((item) => item.slug === service.slug),
  );
  return [...related, ...extras].slice(0, limit);
}

export function serviceHref(slug: string) {
  return `/services/${slug}`;
}
