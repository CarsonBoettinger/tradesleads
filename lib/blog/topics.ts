import type { BlogTopic } from "./types";

/**
 * Owner-facing tip topics - same job as SpotHopper’s restaurant blog,
 * for trades: useful how-tos that help shops get found, booked, and paid.
 * Keywords stay in the background for SEO; the article must teach something useful.
 */
export const BLOG_TOPICS: BlogTopic[] = [
  {
    id: "not-on-google",
    trade: "general",
    primaryKeyword: "why my business is not showing up on Google",
    secondaryKeywords: ["Google Business Profile for contractors", "local SEO for trades"],
    title: "Why your trade business isn’t showing up on Google (and how to fix it)",
    angle:
      "Owners who can’t afford to lose another call. Plain fixes for listing, site, and reviews.",
    outline: [
      "What Google shows first when someone needs a pro",
      "The listing mistakes that hide you",
      "Why a weak website quietly costs you the click",
      "Reviews as the tie-breaker",
      "A one-hour fix list you can do this week",
    ],
  },
  {
    id: "traffic-no-calls",
    trade: "general",
    primaryKeyword: "website gets traffic but no calls",
    secondaryKeywords: ["contractor website that gets calls", "trade website conversion"],
    title: "Why your website gets visits but not phone calls",
    angle:
      "Traffic without calls usually means the page confuses people. Fix the path to the phone.",
    outline: [
      "What a homeowner does in the first five seconds",
      "Missing service names and towns",
      "Call buttons that are hard to tap",
      "Forms that ask for too much",
      "A simple homepage checklist",
    ],
  },
  {
    id: "google-listing-weekly",
    trade: "general",
    primaryKeyword: "Google Business Profile for contractors",
    secondaryKeywords: ["manage Google listing trade business", "Google photos for contractors"],
    title: "A weekly Google listing habit that keeps jobs coming in",
    angle:
      "Ten quiet minutes a week beats a once-a-year scramble. Keep the listing alive.",
    outline: [
      "Check name, hours, and phone on your own phone",
      "Add one real job photo",
      "Reply to every new review",
      "Update services when you add work",
      "What to ignore so you stay consistent",
    ],
  },
  {
    id: "ask-for-reviews",
    trade: "general",
    primaryKeyword: "how to get more Google reviews",
    secondaryKeywords: ["contractor reviews", "ask customers for reviews"],
    title: "How to ask for reviews without feeling awkward",
    angle:
      "Happy customers will help if you make it easy. Timing and a short ask matter more than scripts.",
    outline: [
      "When the ask feels natural",
      "What to say in one or two sentences",
      "Send a direct review link",
      "How to reply so the next person trusts you",
      "What never to do with reviews",
    ],
  },
  {
    id: "phone-that-books",
    trade: "general",
    primaryKeyword: "how to book more service calls",
    secondaryKeywords: ["answer phone trade business", "turn inquiries into jobs"],
    title: "How to answer the phone so more calls become jobs",
    angle:
      "Marketing only works if someone picks up and books the visit. Train the first minute.",
    outline: [
      "Pick up like you want the work",
      "Three questions that qualify fast",
      "How to quote a next step without stalling",
      "Missed-call texts that save the lead",
      "What to track for a week",
    ],
  },
  {
    id: "photos-that-win",
    trade: "general",
    primaryKeyword: "job site photos for marketing",
    secondaryKeywords: ["contractor website photos", "Google listing photos trades"],
    title: "Job photos that help you get hired (phone camera is enough)",
    angle:
      "Clear before-and-after shots beat stock images. Show the work people are buying.",
    outline: [
      "What to shoot on every finished job",
      "Lighting and angles that read on a phone",
      "Where to post: site, listing, and reviews",
      "Privacy and permission basics",
      "A simple photo routine for the crew",
    ],
  },
  {
    id: "slow-season-pipeline",
    trade: "general",
    primaryKeyword: "how trades get work in the slow season",
    secondaryKeywords: ["fill the calendar contractors", "maintenance plans marketing"],
    title: "How to keep the phone ringing in the slow season",
    angle:
      "Slow months are when owners who stay visible pull ahead. Plan before it gets quiet.",
    outline: [
      "Offer the work people still need year-round",
      "Reach past customers first",
      "Use your listing and site for maintenance, not only emergencies",
      "Light paid boosts only after the basics are solid",
      "A 30-day slow-season plan",
    ],
  },
  {
    id: "plumber-not-found",
    trade: "plumbing",
    primaryKeyword: "plumber near me",
    secondaryKeywords: ["plumbing marketing tips", "get more plumbing calls"],
    title: "Plumbing marketing basics when you can’t afford to lose another call",
    angle:
      "Quick moves for busy owners: listing, site, reviews, and answering the phone.",
    outline: [
      "Show up when people search for a plumber",
      "Make emergency and drain work easy to find on your site",
      "Reviews that mention real jobs",
      "Same-day call habits",
      "What to fix first if time is short",
    ],
  },
  {
    id: "emergency-ready",
    trade: "plumbing",
    primaryKeyword: "emergency plumber",
    secondaryKeywords: ["24 hour plumber marketing", "urgent plumbing calls"],
    title: "How to win urgent plumbing calls without living on the phone",
    angle:
      "Emergency searches want speed and clarity. Set expectations you can keep.",
    outline: [
      "Say what hours you really cover",
      "Put the phone first on mobile",
      "A short emergency page that answers the panic questions",
      "After-hours text or voicemail that still helps",
      "Follow-up that turns a one-time call into a regular customer",
    ],
  },
  {
    id: "hvac-season-ready",
    trade: "hvac",
    primaryKeyword: "ac repair near me",
    secondaryKeywords: ["furnace repair near me", "HVAC marketing tips"],
    title: "Get ready for HVAC season before the first heat wave (or cold snap)",
    angle:
      "People search for the machine that failed. Be findable for AC and furnace, not only “HVAC.”",
    outline: [
      "Update the listing before peak season",
      "Name AC and furnace work the way customers say it",
      "Maintenance visits that fill the shoulder months",
      "Reviews that mention seasonal jobs",
      "A two-week pre-season checklist",
    ],
  },
  {
    id: "hvac-no-show",
    trade: "hvac",
    primaryKeyword: "why HVAC company not on Google",
    secondaryKeywords: ["HVAC Google listing", "furnace repair marketing"],
    title: "Why homeowners can’t find your HVAC company on Google",
    angle:
      "If you’re buried under bigger shops, start with listing health, service pages, and proof.",
    outline: [
      "Categories and service areas that match the work",
      "Separate pages for repair vs install",
      "Photos of real equipment work",
      "Response time to reviews and messages",
      "What to measure: calls, not vanity rankings",
    ],
  },
  {
    id: "electrician-trust",
    trade: "electrical",
    primaryKeyword: "electrician near me",
    secondaryKeywords: ["electrical contractor marketing", "get more electrician jobs"],
    title: "What makes a homeowner pick your electrical company online",
    angle:
      "Trust is the product before the visit. Show license cues, clear services, and real reviews.",
    outline: [
      "Lead with the jobs people actually call about",
      "License and insurance without a wall of fine print",
      "Emergency vs planned work on the site",
      "Photos of panels and finished installs",
      "A simple path from search to booked visit",
    ],
  },
  {
    id: "roofer-compare",
    trade: "roofing",
    primaryKeyword: "roofing companies near me",
    secondaryKeywords: ["roof repair marketing", "how roofers get hired online"],
    title: "How homeowners compare roofers online (and how to win the shortlist)",
    angle:
      "They open three tabs. Reviews, photos, and a clear next step decide who gets the estimate.",
    outline: [
      "What they scan in under a minute",
      "Storm damage talk without scare tactics",
      "Repair vs replace explained simply",
      "Project photos from real roofs in your towns",
      "How to make booking the estimate easy",
    ],
  },
  {
    id: "landscaper-spring",
    trade: "landscaping",
    primaryKeyword: "landscaping near me",
    secondaryKeywords: ["landscaping marketing tips", "book spring landscaping jobs"],
    title: "Book spring landscaping work before your competitors wake up",
    angle:
      "Seasonal shops win early. Use winter and early spring to show work and collect interest.",
    outline: [
      "Refresh photos and service list now",
      "Separate lawn, cleanups, and hardscape",
      "Reach last year’s customers first",
      "A simple “reserve your spring spot” offer you can keep",
      "Listing posts that show you are booking",
    ],
  },
  {
    id: "builder-proof",
    trade: "building",
    primaryKeyword: "websites for builders",
    secondaryKeywords: ["contractor website tips", "builder marketing basics"],
    title: "What a builder’s website needs when the sale takes months",
    angle:
      "Longer decisions need proof and process, not only a phone number in the header.",
    outline: [
      "Project pages that show scope, not just pretty photos",
      "How you work, in plain steps",
      "Service areas and project types you actually take",
      "Reviews and referrals online",
      "Keeping the site current between jobs",
    ],
  },
  {
    id: "service-list-plain",
    trade: "general",
    primaryKeyword: "trade business website services page",
    secondaryKeywords: ["list services on contractor website", "plumber services page"],
    title: "List your services the way customers ask for them",
    angle:
      "Internal nicknames hide jobs. Write the words people say on the phone.",
    outline: [
      "Pull names from real call notes",
      "Group without burying the money jobs",
      "One clear page per major service when demand is high",
      "Tie each service to towns you serve",
      "Keep the list short enough to scan on a phone",
    ],
  },
  {
    id: "missed-calls",
    trade: "general",
    primaryKeyword: "missed calls trade business",
    secondaryKeywords: ["after hours plumber leads", "text back service leads"],
    title: "Stop losing jobs to missed calls",
    angle:
      "Every unanswered ring is someone calling the next shop. Build a simple catch system.",
    outline: [
      "How many calls you miss in a normal week",
      "Voicemail that sounds human and useful",
      "Same-day text-backs",
      "Who owns the follow-up on the crew",
      "Tools that help without replacing answering the phone",
    ],
  },
  {
    id: "website-first-screen",
    trade: "general",
    primaryKeyword: "contractor website homepage tips",
    secondaryKeywords: ["mobile website for plumbers", "trade website above the fold"],
    title: "What to put on the first screen of your trade website",
    angle:
      "One job for the first screen: name the trade, show you’re real, make calling easy.",
    outline: [
      "Headline that says who you help",
      "One primary call-to-action",
      "Proof a stranger can trust in one glance",
      "What not to pile into the hero",
      "Check it on your own phone tonight",
    ],
  },
  {
    id: "past-customers",
    trade: "general",
    primaryKeyword: "get repeat business contractors",
    secondaryKeywords: ["customer retention trades", "remind past plumbing customers"],
    title: "How to stay in mind with past customers (without being annoying)",
    angle:
      "The cheapest job is often a return call. Stay useful between emergencies.",
    outline: [
      "Who to reach and how often",
      "Seasonal reminders that help, not spam",
      "Maintenance and tune-up offers",
      "Ask for referrals after a good job",
      "Keep contact details clean",
    ],
  },
  {
    id: "paid-vs-organic",
    trade: "general",
    primaryKeyword: "Google ads vs SEO for contractors",
    secondaryKeywords: ["should plumbers buy Google ads", "local SEO before ads"],
    title: "Should you buy Google ads before your listing and website are ready?",
    angle:
      "Ads amplify whatever you already are. Fix the basics first, then spend with a purpose.",
    outline: [
      "What ads cannot fix",
      "When organic and the Map Pack are enough to start",
      "A fair test budget mindset",
      "Landing pages that match the ad",
      "How to know the spend is working",
    ],
  },
  {
    id: "team-online-presence",
    trade: "general",
    primaryKeyword: "small contractor marketing checklist",
    secondaryKeywords: ["owner operator marketing trades", "marketing for one truck business"],
    title: "A marketing checklist for one-truck and small crews",
    angle:
      "You do not need a marketing department. You need a short list you can keep.",
    outline: [
      "Listing, website, reviews: the three pillars",
      "Who on the crew owns photos and review asks",
      "Thirty minutes a week is enough if it is consistent",
      "What to skip until you are busier",
      "When it is time to get help",
    ],
  },
];

export function topicById(id: string) {
  return BLOG_TOPICS.find((topic) => topic.id === id) ?? null;
}

export function pickTopicForDay(date = new Date(), usedIds: string[] = []) {
  const unused = BLOG_TOPICS.filter((topic) => !usedIds.includes(topic.id));
  const pool = unused.length > 0 ? unused : BLOG_TOPICS;
  const index =
    Math.abs(
      date.getUTCFullYear() * 372 + date.getUTCMonth() * 31 + date.getUTCDate(),
    ) % pool.length;
  return pool[index]!;
}
