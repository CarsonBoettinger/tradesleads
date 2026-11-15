export type TradePage = {
  slug: string;
  name: string;
  singular: string;
  article: "a" | "an";
  headline: string;
  description: string;
  blurb: string;
  searchExample: string;
  summary: string;
  pains: Array<{ title: string; body: string }>;
  outcomes: Array<{ title: string; body: string }>;
};

export const trades: TradePage[] = [
  {
    slug: "plumbers",
    name: "Plumbers",
    singular: "plumber",
    article: "a",
    headline: "Get found when the water stops",
    description:
      "Websites and local search growth for plumbers. Show up when someone in your town needs a leak fixed, a drain cleared, or a water heater replaced.",
    blurb: "Emergency calls, and the repairs that follow them.",
    searchExample: "plumber near me",
    summary:
      "Emergency calls, and the repairs that follow them. Foreman helps plumbing businesses show up on Google and on a site that turns a search into a phone call.",
    pains: [
      {
        title: "They call whoever is first",
        body: "When a pipe bursts, people search and dial. If your name is not there, the job goes elsewhere.",
      },
      {
        title: "Your site does not convert",
        body: "A homepage that looks unfinished loses the call before they even read the services.",
      },
      {
        title: "Reviews are hard to collect",
        body: "Happy customers leave the job site and forget. The next searcher never sees the proof.",
      },
    ],
    outcomes: [
      {
        title: "Rank for the work you do",
        body: "Show up for emergency plumbing, water heaters, drain cleaning, and the jobs you want.",
      },
      {
        title: "A site built to get the call",
        body: "Clear services, a phone number that stands out, and pages that match how people search.",
      },
      {
        title: "More reviews after the job",
        body: "An easy path for finished customers to leave a 5-star review while the work is still fresh.",
      },
    ],
  },
  {
    slug: "roofers",
    name: "Roofers",
    singular: "roofer",
    article: "a",
    headline: "Show up when the storm ends",
    description:
      "Websites and local search growth for roofers. Be the crew homeowners find for inspections, repairs, and full replacements in your town.",
    blurb: "Storm searches, inspections, and the jobs they turn into.",
    searchExample: "roofer in your town",
    summary:
      "Storm searches, inspections, and the jobs they turn into. Foreman helps roofing businesses earn a spot when neighbours look for a crew they can trust.",
    pains: [
      {
        title: "Storm season is a race",
        body: "After bad weather, everyone searches at once. The crews that show up first get the inspections.",
      },
      {
        title: "Big brands crowd the results",
        body: "National names and lead mills fill the map. Local crews get buried unless the listing is strong.",
      },
      {
        title: "Quotes die without proof",
        body: "Homeowners want photos, reviews, and a clear next step. A weak site loses the job after the inspection.",
      },
    ],
    outcomes: [
      {
        title: "Found for repairs and replacements",
        body: "Rank for roof repair, storm damage, and full roof replacement in your service area.",
      },
      {
        title: "Look as solid as the big guys",
        body: "A clean site and Google listing that make a local crew feel established.",
      },
      {
        title: "Turn inspections into booked work",
        body: "Make it easy to call, request a quote, and leave a review after the job.",
      },
    ],
  },
  {
    slug: "electricians",
    name: "Electricians",
    singular: "electrician",
    article: "an",
    headline: "Get the call for panels, wiring, and more",
    description:
      "Websites and local search growth for electricians. Show up when someone needs a panel upgrade, a rewire, or a licensed electrician nearby.",
    blurb: "Panels, rewires, and the calls that come in between.",
    searchExample: "electrician near me",
    summary:
      "Panels, rewires, and the calls that come in between. Foreman helps electrical contractors get found by people who are ready to hire.",
    pains: [
      {
        title: "Licensed matters, but search decides",
        body: "Homeowners look for a licensed electrician first on Google. If you are not listed well, they never check your ticket.",
      },
      {
        title: "Service pages are missing",
        body: "Panel upgrades, EV chargers, and lighting each get their own search. One vague homepage misses them.",
      },
      {
        title: "Trust is the whole sale",
        body: "People want reviews and a clear company story before they let anyone into the panel.",
      },
    ],
    outcomes: [
      {
        title: "Rank for the jobs you want",
        body: "Show up for electrical repair, panel upgrades, and the specialty work you take on.",
      },
      {
        title: "A site that answers the search",
        body: "Pages that match how people describe the work, with a phone number they can tap.",
      },
      {
        title: "Reviews that build trust",
        body: "Finished jobs turn into public proof so the next customer feels safe calling you.",
      },
    ],
  },
  {
    slug: "hvac",
    name: "HVAC",
    singular: "HVAC company",
    article: "an",
    headline: "Be ready before the first heat wave",
    description:
      "Websites and local search growth for HVAC companies. Get found for AC repair, furnace service, and seasonal tune-ups in your town.",
    blurb: "Breakdowns, tune-ups, and the turn of the season.",
    searchExample: "AC repair near me",
    summary:
      "Breakdowns, tune-ups, and the turn of the season. Foreman helps HVAC businesses show up when the system fails and when people plan ahead.",
    pains: [
      {
        title: "They search the machine, not HVAC",
        body: "People type AC repair or furnace repair. If you only rank for HVAC, you miss the call.",
      },
      {
        title: "Season spikes punish weak listings",
        body: "When the weather turns, search volume jumps. Thin Google profiles lose to whoever looks ready.",
      },
      {
        title: "Maintenance gets forgotten",
        body: "Tune-up customers are easier to win when your site and reviews make booking simple.",
      },
    ],
    outcomes: [
      {
        title: "Found for heat and cool",
        body: "Rank for AC repair, furnace service, and the seasonal searches that fill the calendar.",
      },
      {
        title: "A site built for the season",
        body: "Clear offers for repair, install, and maintenance, with a path to call right away.",
      },
      {
        title: "Reviews after every service call",
        body: "Happy customers leave proof while the job is still fresh in their mind.",
      },
    ],
  },
  {
    slug: "builders",
    name: "Builders",
    singular: "builder",
    article: "a",
    headline: "Win the project when someone starts searching",
    description:
      "Websites and local search growth for builders. Show up when homeowners and property owners look for a local crew for renovations and new work.",
    blurb: "Projects that start when someone searches for a crew.",
    searchExample: "builder in your town",
    summary:
      "Projects that start when someone searches for a crew. Foreman helps builders look established online so the right jobs find you.",
    pains: [
      {
        title: "Projects start with a search",
        body: "Before they ask for referrals, people look you up. A weak presence ends the conversation early.",
      },
      {
        title: "Portfolio is hard to show",
        body: "Good work stays on phones and job sites. Online, it looks like you have nothing to show.",
      },
      {
        title: "Bigger firms look safer",
        body: "Homeowners pick the company that looks organized. Local builders lose work they could win.",
      },
    ],
    outcomes: [
      {
        title: "Found for the work you build",
        body: "Show up for renovations, additions, and the project types you actually take on.",
      },
      {
        title: "A site that shows the craft",
        body: "Clear services, a simple contact path, and space for the projects that win trust.",
      },
      {
        title: "Reviews that close the gap",
        body: "Past clients leave public proof so the next project starts with confidence.",
      },
    ],
  },
  {
    slug: "landscapers",
    name: "Landscapers",
    singular: "landscaper",
    article: "a",
    headline: "Get booked for the yards that need you",
    description:
      "Websites and local search growth for landscapers. Be findable for lawn care, cleanups, and outdoor projects in your service area.",
    blurb: "Yards, seasons, and the customers who come back.",
    searchExample: "landscaper near me",
    summary:
      "Yards, seasons, and the customers who come back. Foreman helps landscaping businesses get found when neighbours need outdoor work done right.",
    pains: [
      {
        title: "Season opens and phones go quiet",
        body: "If you are not on Google when people start planning, the routes fill with someone else.",
      },
      {
        title: "One-off jobs do not become routes",
        body: "Without a clear site and reviews, spring cleanups never turn into recurring customers.",
      },
      {
        title: "Photos live on the phone",
        body: "Great yards never make it online. The next customer has nothing to judge you by.",
      },
    ],
    outcomes: [
      {
        title: "Rank for the outdoor work you do",
        body: "Show up for landscaping, lawn care, cleanups, and the services you want more of.",
      },
      {
        title: "A site that books the season",
        body: "Clear offers, a phone number that stands out, and pages that match local searches.",
      },
      {
        title: "Reviews that bring the next yard",
        body: "Finished jobs turn into public proof so neighbours feel good calling you.",
      },
    ],
  },
];

export function getTradeBySlug(slug: string) {
  return trades.find((trade) => trade.slug === slug) ?? null;
}

export function tradeHref(slug: string) {
  return `/trades/${slug}`;
}
