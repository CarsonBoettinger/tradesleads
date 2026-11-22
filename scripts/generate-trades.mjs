/**
 * One-shot generator for lib/trades.ts SEO catalog.
 * Run: node scripts/generate-trades.mjs
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @typedef {{
 *  slug: string;
 *  name: string;
 *  singular: string;
 *  article: "a" | "an";
 *  category: string;
 *  featured?: boolean;
 *  indexable?: boolean; // false = noindex until real long-form content exists
 *  headline: string;
 *  searchExample: string;
 *  blurb: string;
 *  jobs: string;
 *  moment: string;
 *  pains: [string, string, string];
 *  painBodies: [string, string, string];
 *  outcomes: [string, string, string];
 *  outcomeBodies: [string, string, string];
 * }} Seed */

/** Long-tail crafts / primary pages kept live but noindexed until they have real content. */
const NOINDEX_SLUGS = new Set([
  "blacksmithing",
  "shoe-repair",
  "tailoring",
  "leatherwork",
  "furniture-making",
  "upholstery",
  "millwork",
  "farming",
  "ranching",
  "logging",
  "fishing",
  "quarrying",
  "oil-field-services",
]);

const SMALL_TITLE_WORDS = new Set(["and", "or", "of", "the", "a", "an", "for"]);

function titleCaseWords(value) {
  return value
    .split(/\s+/)
    .map((word, index) => {
      if (!word) return word;
      const lower = word.toLowerCase();
      if (index > 0 && SMALL_TITLE_WORDS.has(lower)) return lower;
      if (word.toUpperCase() === word && word.length <= 4) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/** Search-intent titles like "Plumber Marketing & Local SEO". */
function marketingPageTitle(seed) {
  if (seed.name === "HVAC" || seed.singular.toLowerCase().startsWith("hvac")) {
    return "HVAC Marketing & Local SEO";
  }
  return `${titleCaseWords(seed.singular)} Marketing & Local SEO`;
}

/** @type {Seed[]} */
const seeds = [
  // Construction and building
  {
    slug: "general-contractors",
    name: "General contractors",
    singular: "general contractor",
    article: "a",
    category: "construction",
    featured: true,
    headline: "Win the project when someone starts searching",
    searchExample: "general contractor near me",
    blurb: "Projects that start when someone searches for a crew.",
    jobs: "renovations, additions, and new builds",
    moment: "when a property owner is ready to hire a crew",
    pains: [
      "Projects start with a search",
      "Portfolio is hard to show",
      "Bigger firms look safer",
    ],
    painBodies: [
      "Before they ask for referrals, people look you up. A weak presence ends the conversation early.",
      "Good work stays on phones and job sites. Online, it looks like you have nothing to show.",
      "Owners pick the company that looks organized. Local crews lose work they could win.",
    ],
    outcomes: [
      "Found for the work you build",
      "A site that shows the craft",
      "Reviews that close the gap",
    ],
    outcomeBodies: [
      "Show up for renovations, additions, and the project types you actually take on.",
      "Clear services, a simple contact path, and space for the projects that win trust.",
      "Past clients leave public proof so the next project starts with confidence.",
    ],
  },
  {
    slug: "framing",
    name: "Framing contractors",
    singular: "framing contractor",
    article: "a",
    category: "construction",
    headline: "Get the framing jobs before the schedule fills",
    searchExample: "framing contractor near me",
    blurb: "Walls, roofs, and the crews GCs call first.",
    jobs: "residential framing, commercial framing, and structural builds",
    moment: "when a builder needs a framing crew that shows up ready",
    pains: [
      "GCs hire who is findable",
      "Specialty framing gets buried",
      "Proof of past builds is missing",
    ],
    painBodies: [
      "General contractors search when a crew falls through. If you are not online, they call someone else.",
      "People search for specific framing work. A vague listing misses those calls.",
      "Photos and reviews of finished frames win the next bid more than a business card.",
    ],
    outcomes: [
      "Rank for framing work in your area",
      "A site builders can trust",
      "Reviews after every frame",
    ],
    outcomeBodies: [
      "Show up for residential framing, commercial framing, and structural work near you.",
      "Clear services and contact paths so a GC can hire you the same day.",
      "Finished jobs turn into public proof for the next schedule.",
    ],
  },
  {
    slug: "roofers",
    name: "Roofers",
    singular: "roofer",
    article: "a",
    category: "construction",
    featured: true,
    headline: "Show up when the storm ends",
    searchExample: "roofer in your town",
    blurb: "Storm searches, inspections, and the jobs they turn into.",
    jobs: "inspections, repairs, and full replacements",
    moment: "when a roof fails or storm season hits",
    pains: [
      "Storm season is a race",
      "Big brands crowd the results",
      "Quotes die without proof",
    ],
    painBodies: [
      "After bad weather, everyone searches at once. The crews that show up first get the inspections.",
      "National names and lead mills fill the map. Local crews get buried unless the listing is strong.",
      "Homeowners want photos, reviews, and a clear next step. A weak site loses the job after the inspection.",
    ],
    outcomes: [
      "Found for repairs and replacements",
      "Look as solid as the big guys",
      "Turn inspections into booked work",
    ],
    outcomeBodies: [
      "Rank for roof repair, storm damage, and full roof replacement in your service area.",
      "A clean site and Google listing that make a local crew feel established.",
      "Make it easy to call, request a quote, and leave a review after the job.",
    ],
  },
  {
    slug: "masonry",
    name: "Masonry contractors",
    singular: "masonry contractor",
    article: "a",
    category: "construction",
    headline: "Get found for brick, block, and stone work",
    searchExample: "masonry contractor near me",
    blurb: "Chimneys, walls, and the craft that lasts.",
    jobs: "brick, block, stone, and chimney work",
    moment: "when someone needs masonry that looks right and lasts",
    pains: [
      "Craft does not show up in search",
      "Repair jobs go to whoever answers",
      "Photos never leave the job site",
    ],
    painBodies: [
      "People search for masons when a wall fails or a chimney needs work. Invisible crews lose quiet seasons too.",
      "Emergency brick and tuckpointing calls go to the first name on Google.",
      "Finished stone and brick stays offline, so the next customer has nothing to judge.",
    ],
    outcomes: [
      "Rank for masonry in your town",
      "A site that shows the craft",
      "Reviews that win the next wall",
    ],
    outcomeBodies: [
      "Show up for brick repair, stonework, chimneys, and new masonry builds.",
      "Clear services and project proof so homeowners and builders trust the hire.",
      "Finished jobs become public reviews while the work is still fresh.",
    ],
  },
  {
    slug: "concrete-foundations",
    name: "Concrete and foundations",
    singular: "concrete contractor",
    article: "a",
    category: "construction",
    headline: "Be the crew for pours that have to be right",
    searchExample: "concrete contractor near me",
    blurb: "Driveways, slabs, and foundations that start every build.",
    jobs: "driveways, slabs, patios, and foundation work",
    moment: "when a pour or foundation repair cannot wait",
    pains: [
      "They search concrete, not your company name",
      "Foundation work needs trust fast",
      "Bids die without a clear site",
    ],
    painBodies: [
      "People type concrete driveway or foundation repair. If you only rank for your name, you miss the job.",
      "Owners want a crew that looks established before anyone digs near the house.",
      "A thin online presence makes a solid local crew look risky next to bigger names.",
    ],
    outcomes: [
      "Found for pours and foundations",
      "A site that wins the bid",
      "Reviews after every pour",
    ],
    outcomeBodies: [
      "Rank for concrete driveways, foundations, patios, and flatwork in your area.",
      "Clear services, photos, and a phone number that stands out on mobile.",
      "Happy customers leave proof so the next pour starts with confidence.",
    ],
  },
  {
    slug: "drywall",
    name: "Drywall contractors",
    singular: "drywall contractor",
    article: "a",
    category: "construction",
    headline: "Get the hang and finish calls in your town",
    searchExample: "drywall contractor near me",
    blurb: "Hang, tape, and finish work that makes rooms ready.",
    jobs: "hanging, taping, finishing, and repairs",
    moment: "when a remodel or repair needs walls done right",
    pains: [
      "Remodelers hire who they can find",
      "Repair searches skip vague listings",
      "Finish quality never shows online",
    ],
    painBodies: [
      "GCs and homeowners search when a crew falls behind. Findable drywall companies get the call.",
      "People search drywall repair and water damage patch. One vague homepage misses them.",
      "Smooth finishes live on job sites. Online, the next customer has no proof.",
    ],
    outcomes: [
      "Rank for hang and finish work",
      "A site remodelers can book from",
      "Reviews that prove the finish",
    ],
    outcomeBodies: [
      "Show up for drywall installation, repair, and finishing in your service area.",
      "Clear offers and a simple contact path for homeowners and builders.",
      "Finished rooms turn into public proof for the next remodel.",
    ],
  },
  {
    slug: "painters",
    name: "Painters",
    singular: "painter",
    article: "a",
    category: "construction",
    headline: "Get booked before the season fills up",
    searchExample: "painter near me",
    blurb: "Interior, exterior, and the jobs that stack each season.",
    jobs: "interior painting, exterior painting, and cabinet finishes",
    moment: "when a homeowner or property manager is ready to paint",
    pains: [
      "Season opens and phones stay quiet",
      "Interior and exterior are different searches",
      "Before-and-after never makes it online",
    ],
    painBodies: [
      "Spring and summer fill fast. Crews that are not on Google watch routes go elsewhere.",
      "People search house painter or interior painting. One generic page misses half the work.",
      "Great finishes stay on the walls. The next customer has nothing to compare.",
    ],
    outcomes: [
      "Rank for the painting jobs you want",
      "A site that books the season",
      "Reviews after every coat",
    ],
    outcomeBodies: [
      "Show up for interior, exterior, and specialty painting in your town.",
      "Clear offers, photos, and a phone number that is easy to tap.",
      "Finished jobs become reviews while the paint is still fresh.",
    ],
  },
  {
    slug: "flooring-tile",
    name: "Flooring and tile",
    singular: "flooring contractor",
    article: "a",
    category: "construction",
    headline: "Show up when someone is ready for new floors",
    searchExample: "flooring contractor near me",
    blurb: "Hardwood, tile, vinyl, and the installs that refresh a home.",
    jobs: "hardwood, tile, vinyl, and floor refinishing",
    moment: "when a homeowner is ready to replace or refinish floors",
    pains: [
      "They search the material, not flooring",
      "Showrooms and big boxes crowd results",
      "Install quality needs proof",
    ],
    painBodies: [
      "People type tile installation or hardwood flooring. If you only rank for flooring, you miss the call.",
      "National retailers fill the map. Local installers get buried without a strong listing.",
      "Owners want photos and reviews before anyone pulls up the old floor.",
    ],
    outcomes: [
      "Found for the floors you install",
      "A site that wins the estimate",
      "Reviews that sell the next room",
    ],
    outcomeBodies: [
      "Rank for tile, hardwood, vinyl, and refinishing in your service area.",
      "Clear services and a simple path to request a quote.",
      "Finished floors turn into public proof for the next job.",
    ],
  },
  {
    slug: "siding",
    name: "Siding contractors",
    singular: "siding contractor",
    article: "a",
    category: "construction",
    headline: "Get found when the exterior needs a refresh",
    searchExample: "siding contractor near me",
    blurb: "Vinyl, fiber cement, and full exterior refreshes.",
    jobs: "siding install, repair, and full replacements",
    moment: "when curb appeal or weather damage forces a change",
    pains: [
      "Exterior searches spike after storms",
      "Material names win the SERP",
      "Quotes need photos to stick",
    ],
    painBodies: [
      "Wind and hail send people to Google. Invisible crews miss the rush.",
      "People search vinyl siding or fiber cement. A vague company page loses those clicks.",
      "Homeowners compare looks online before they ask for a price.",
    ],
    outcomes: [
      "Rank for siding install and repair",
      "A site that sells the look",
      "Reviews that close the estimate",
    ],
    outcomeBodies: [
      "Show up for siding replacement, repair, and exterior upgrades nearby.",
      "Project photos and clear services make a local crew feel established.",
      "Finished exteriors become reviews that win the next block.",
    ],
  },
  {
    slug: "insulation",
    name: "Insulation contractors",
    singular: "insulation contractor",
    article: "an",
    category: "construction",
    headline: "Get the comfort and efficiency calls",
    searchExample: "insulation contractor near me",
    blurb: "Attics, walls, and the upgrades that cut energy bills.",
    jobs: "attic, wall, and spray foam insulation",
    moment: "when energy bills rise or a remodel opens the walls",
    pains: [
      "People search the problem, not insulation",
      "Retrofit jobs need trust",
      "Spray foam and blown-in are different searches",
    ],
    painBodies: [
      "Homeowners type cold attic or energy efficiency. If you only rank for your company name, you miss them.",
      "Opening walls feels invasive. Reviews and a clear site make the hire feel safe.",
      "Each method gets its own search. One vague page leaves money on the table.",
    ],
    outcomes: [
      "Found for the insulation you install",
      "A site that explains the upgrade",
      "Reviews that warm up the next lead",
    ],
    outcomeBodies: [
      "Rank for attic insulation, spray foam, and retrofit work in your town.",
      "Clear offers and education that turn a search into a booked assessment.",
      "Finished jobs leave public proof for energy-conscious homeowners.",
    ],
  },
  {
    slug: "demolition",
    name: "Demolition contractors",
    singular: "demolition contractor",
    article: "a",
    category: "construction",
    headline: "Be first when something has to come down",
    searchExample: "demolition contractor near me",
    blurb: "Interior tear-outs, structures, and clean site prep.",
    jobs: "interior demo, structural demolition, and site clearing",
    moment: "when a remodel or rebuild needs a clean start",
    pains: [
      "Urgent tear-outs go to whoever answers",
      "Permits and disposal raise trust questions",
      "GCs hire findable demo crews",
    ],
    painBodies: [
      "When a project is waiting, people call the first demolition company they find.",
      "Owners want a crew that looks licensed and organized before walls come down.",
      "Builders search under pressure. Weak listings lose the schedule.",
    ],
    outcomes: [
      "Rank for demo work in your area",
      "A site that looks job-ready",
      "Reviews that clear the next site",
    ],
    outcomeBodies: [
      "Show up for interior demolition, structure removal, and site clearing.",
      "Clear services and contact paths for homeowners and general contractors.",
      "Finished tear-outs turn into proof for the next bid.",
    ],
  },
  {
    slug: "excavation",
    name: "Excavation contractors",
    singular: "excavation contractor",
    article: "an",
    category: "construction",
    headline: "Get the digs that start every project",
    searchExample: "excavation contractor near me",
    blurb: "Site prep, grading, and the dirt work builds depend on.",
    jobs: "site prep, grading, trenching, and foundations digs",
    moment: "when a build needs dirt moved before anything else",
    pains: [
      "Builders hire who can start fast",
      "Equipment lists never make it online",
      "Specialty digs get separate searches",
    ],
    painBodies: [
      "Schedules slip when excavation is hard to find. The visible crew wins the day.",
      "Owners and GCs want to see that you have the machines for the job.",
      "People search trenching, grading, or foundation dig. One vague page misses them.",
    ],
    outcomes: [
      "Found for excavation near you",
      "A site that shows you are ready",
      "Reviews that dig up the next job",
    ],
    outcomeBodies: [
      "Rank for excavation, grading, and site prep in your service area.",
      "Clear services and a phone number builders can tap from the field.",
      "Finished sites become reviews that win the next pour schedule.",
    ],
  },
  {
    slug: "paving",
    name: "Paving contractors",
    singular: "paving contractor",
    article: "a",
    category: "construction",
    headline: "Get found for driveways and lots that need asphalt",
    searchExample: "paving contractor near me",
    blurb: "Driveways, parking lots, and the surface work that lasts.",
    jobs: "driveway paving, parking lots, and asphalt repair",
    moment: "when cracked asphalt finally forces a call",
    pains: [
      "Seasonal paving fills without you",
      "Repair and overlay are different searches",
      "Commercial lots want proven crews",
    ],
    painBodies: [
      "Warm months book out. Invisible paving companies watch the season pass.",
      "People search driveway paving or asphalt repair. One homepage cannot cover both unless it is clear.",
      "Property managers hire who looks established online, not just who has a truck.",
    ],
    outcomes: [
      "Rank for paving in your town",
      "A site built for home and commercial",
      "Reviews that pave the way",
    ],
    outcomeBodies: [
      "Show up for driveway paving, overlays, and parking lot work nearby.",
      "Clear offers for residential and commercial so the right jobs find you.",
      "Finished surfaces turn into public proof for the next season.",
    ],
  },
  {
    slug: "fencing",
    name: "Fence contractors",
    singular: "fence contractor",
    article: "a",
    category: "construction",
    headline: "Get booked when privacy and property lines matter",
    searchExample: "fence company near me",
    blurb: "Wood, vinyl, chain link, and the installs that define a yard.",
    jobs: "wood, vinyl, chain link, and fence repair",
    moment: "when a homeowner wants privacy, pets contained, or a refresh",
    pains: [
      "Fence searches spike every spring",
      "Material type decides who gets the click",
      "Quotes need photos to convert",
    ],
    painBodies: [
      "When the weather turns, fence searches jump. Weak listings miss the rush.",
      "People search vinyl fence or wood fence install. Generic pages lose those jobs.",
      "Homeowners compare styles online before they ask for a price.",
    ],
    outcomes: [
      "Found for the fences you build",
      "A site that shows the styles",
      "Reviews that win the next yard",
    ],
    outcomeBodies: [
      "Rank for fence installation and repair in your service area.",
      "Clear materials, photos, and a simple path to book an estimate.",
      "Finished fences become reviews neighbours trust.",
    ],
  },
  {
    slug: "deck-building",
    name: "Deck builders",
    singular: "deck builder",
    article: "a",
    category: "construction",
    headline: "Show up when outdoor living is on the list",
    searchExample: "deck builder near me",
    blurb: "Decks, porches, and outdoor spaces people actually use.",
    jobs: "new decks, rebuilds, and outdoor living structures",
    moment: "when a homeowner is ready to expand outdoors",
    pains: [
      "Outdoor projects start with photos online",
      "Builders and homeowners search differently",
      "Permits and materials raise trust questions",
    ],
    painBodies: [
      "People browse deck ideas then search locally. If you are not there, the dream goes elsewhere.",
      "Some want a GC, some want a deck specialist. Clear pages catch both.",
      "A weak site makes a skilled crew look risky for a big outdoor spend.",
    ],
    outcomes: [
      "Rank for decks in your town",
      "A site that sells outdoor living",
      "Reviews that book the next build",
    ],
    outcomeBodies: [
      "Show up for deck building, rebuilds, and outdoor structures nearby.",
      "Project galleries and clear contact paths turn browsing into booked estimates.",
      "Finished decks leave proof for the next block of homeowners.",
    ],
  },
  {
    slug: "paver-installation",
    name: "Paver installation",
    singular: "paver installer",
    article: "a",
    category: "construction",
    headline: "Get found for patios and walkways that last",
    searchExample: "paver installation near me",
    blurb: "Patios, walkways, and hardscape that upgrades the yard.",
    jobs: "paver patios, walkways, and driveway accents",
    moment: "when curb appeal and outdoor dining move up the list",
    pains: [
      "Hardscape searches skip vague landscapers",
      "Design proof wins the job",
      "Seasonal demand punishes weak listings",
    ],
    painBodies: [
      "People search paver patio specifically. A general outdoor page often loses the click.",
      "Homeowners want to see patterns and finished yards before they book.",
      "Spring and summer fill calendars. Invisible installers miss the window.",
    ],
    outcomes: [
      "Rank for paver work nearby",
      "A site that shows the finish",
      "Reviews that hardscape the next lead",
    ],
    outcomeBodies: [
      "Show up for paver patios, walkways, and hardscape installs in your town.",
      "Clear photos and services make a local crew feel like the safe choice.",
      "Finished installs become reviews that win the next patio.",
    ],
  },
  {
    slug: "sanding-sealing",
    name: "Sanding and sealing",
    singular: "sanding and sealing company",
    article: "a",
    category: "construction",
    headline: "Get the refinish calls before floors fail",
    searchExample: "floor sanding and sealing near me",
    blurb: "Hardwood refinishing and protective finishes that restore rooms.",
    jobs: "floor sanding, sealing, and hardwood refinishing",
    moment: "when worn floors need a restore instead of a replace",
    pains: [
      "Refinish searches are specific",
      "Dust and disruption need trust",
      "Before-and-after sells the job",
    ],
    painBodies: [
      "People type floor sanding or hardwood refinishing. Generic flooring pages often miss them.",
      "Owners want a crew that looks careful before machines enter the house.",
      "Without photo proof, quotes feel expensive for work they cannot picture.",
    ],
    outcomes: [
      "Found for sanding and sealing",
      "A site that proves the restore",
      "Reviews that shine for the next room",
    ],
    outcomeBodies: [
      "Rank for floor sanding, sealing, and hardwood refinishing nearby.",
      "Clear process pages and photos turn hesitation into a booked date.",
      "Finished floors become public proof for the next refinish.",
    ],
  },

  // Mechanical and electrical
  {
    slug: "plumbers",
    name: "Plumbers",
    singular: "plumber",
    article: "a",
    category: "mechanical",
    featured: true,
    headline: "Get found when the water stops",
    searchExample: "plumber near me",
    blurb: "Emergency calls, and the repairs that follow them.",
    jobs: "leaks, drains, water heaters, and emergency plumbing",
    moment: "when a pipe bursts or a drain will not clear",
    pains: [
      "They call whoever is first",
      "Your site does not convert",
      "Reviews are hard to collect",
    ],
    painBodies: [
      "When a pipe bursts, people search and dial. If your name is not there, the job goes elsewhere.",
      "A homepage that looks unfinished loses the call before they even read the services.",
      "Happy customers leave the job site and forget. The next searcher never sees the proof.",
    ],
    outcomes: [
      "Rank for the work you do",
      "A site built to get the call",
      "More reviews after the job",
    ],
    outcomeBodies: [
      "Show up for emergency plumbing, water heaters, drain cleaning, and the jobs you want.",
      "Clear services, a phone number that stands out, and pages that match how people search.",
      "An easy path for finished customers to leave a 5-star review while the work is still fresh.",
    ],
  },
  {
    slug: "hvac",
    name: "HVAC",
    singular: "HVAC company",
    article: "an",
    category: "mechanical",
    featured: true,
    headline: "Be ready before the first heat wave",
    searchExample: "AC repair near me",
    blurb: "Breakdowns, tune-ups, and the turn of the season.",
    jobs: "AC repair, furnace service, and seasonal tune-ups",
    moment: "when the system fails or the season turns",
    pains: [
      "They search the machine, not HVAC",
      "Season spikes punish weak listings",
      "Maintenance gets forgotten",
    ],
    painBodies: [
      "People type AC repair or furnace repair. If you only rank for HVAC, you miss the call.",
      "When the weather turns, search volume jumps. Thin Google profiles lose to whoever looks ready.",
      "Tune-up customers are easier to win when your site and reviews make booking simple.",
    ],
    outcomes: [
      "Found for heat and cool",
      "A site built for the season",
      "Reviews after every service call",
    ],
    outcomeBodies: [
      "Rank for AC repair, furnace service, and the seasonal searches that fill the calendar.",
      "Clear offers for repair, install, and maintenance, with a path to call right away.",
      "Happy customers leave proof while the job is still fresh in their mind.",
    ],
  },
  {
    slug: "electricians",
    name: "Electricians",
    singular: "electrician",
    article: "an",
    category: "mechanical",
    featured: true,
    headline: "Get the call for panels, wiring, and more",
    searchExample: "electrician near me",
    blurb: "Panels, rewires, and the calls that come in between.",
    jobs: "panel upgrades, rewires, and electrical repair",
    moment: "when someone needs licensed electrical work nearby",
    pains: [
      "Licensed matters, but search decides",
      "Service pages are missing",
      "Trust is the whole sale",
    ],
    painBodies: [
      "Homeowners look for a licensed electrician first on Google. If you are not listed well, they never check your ticket.",
      "Panel upgrades, EV chargers, and lighting each get their own search. One vague homepage misses them.",
      "People want reviews and a clear company story before they let anyone into the panel.",
    ],
    outcomes: [
      "Rank for the jobs you want",
      "A site that answers the search",
      "Reviews that build trust",
    ],
    outcomeBodies: [
      "Show up for electrical repair, panel upgrades, and the specialty work you take on.",
      "Pages that match how people describe the work, with a phone number they can tap.",
      "Finished jobs turn into public proof so the next customer feels safe calling you.",
    ],
  },
  {
    slug: "welding-fabrication",
    name: "Welding and fabrication",
    singular: "welding and fabrication shop",
    article: "a",
    category: "mechanical",
    headline: "Get the custom metal work that finds you",
    searchExample: "welding shop near me",
    blurb: "Repairs, custom fab, and the shops local industry relies on.",
    jobs: "welding repair, custom fabrication, and structural metalwork",
    moment: "when a farm, shop, or builder needs metal done right",
    pains: [
      "Urgent repairs go to the first shop",
      "Custom fab needs proof of capability",
      "Industrial buyers search differently",
    ],
    painBodies: [
      "Broken equipment cannot wait. The findable welding shop gets the after-hours call.",
      "Buyers want to see past builds before they trust a custom job.",
      "Farms, GCs, and plants use different search terms. One vague page misses half of them.",
    ],
    outcomes: [
      "Rank for welding near you",
      "A site that shows the shop",
      "Reviews that spark the next job",
    ],
    outcomeBodies: [
      "Show up for welding repair, fabrication, and mobile welding in your area.",
      "Clear capabilities and contact paths for contractors and equipment owners.",
      "Finished fab work becomes proof for the next custom build.",
    ],
  },
  {
    slug: "machine-shop",
    name: "Machine shops",
    singular: "machine shop",
    article: "a",
    category: "mechanical",
    headline: "Get found by the plants and shops that need parts",
    searchExample: "machine shop near me",
    blurb: "Precision parts, repairs, and the shops local industry dials.",
    jobs: "CNC, lathe work, and precision machining",
    moment: "when a broken part stops a line or a prototype needs cutting",
    pains: [
      "Buyers search capability, not brand",
      "Lead times need a clear first contact",
      "Specialty machining gets buried",
    ],
    painBodies: [
      "Engineers and maintenance leads Google tolerances and processes. Invisible shops never make the RFQ list.",
      "A weak site makes even a strong shop look slow to deal with.",
      "People search CNC machining or prototype parts. Generic pages miss those jobs.",
    ],
    outcomes: [
      "Found for the machining you do",
      "A site that wins the RFQ",
      "Reviews and proof that close work",
    ],
    outcomeBodies: [
      "Rank for machine shop and CNC work in your region.",
      "Clear capabilities, materials, and a simple path to request a quote.",
      "Past jobs and reviews make the next buyer feel safe sending drawings.",
    ],
  },
  {
    slug: "sheet-metal",
    name: "Sheet metal",
    singular: "sheet metal contractor",
    article: "a",
    category: "mechanical",
    headline: "Show up for duct, flashing, and custom metal",
    searchExample: "sheet metal contractor near me",
    blurb: "HVAC duct, flashing, and custom sheet work for builds.",
    jobs: "ductwork, flashing, and custom sheet metal",
    moment: "when a build or HVAC job needs metal that fits",
    pains: [
      "GCs hire who answers fast",
      "Duct and architectural metal differ in search",
      "Shop capability never shows online",
    ],
    painBodies: [
      "Schedules slip when sheet metal is hard to find. Visible shops get the call.",
      "People search duct fabrication or custom flashing separately. Vague pages miss both.",
      "Buyers want to see that you can produce what the drawing needs.",
    ],
    outcomes: [
      "Rank for sheet metal nearby",
      "A site builders can book from",
      "Reviews that form the next job",
    ],
    outcomeBodies: [
      "Show up for sheet metal, ductwork, and custom fabrication in your area.",
      "Clear services and contact paths for HVAC and construction partners.",
      "Finished installs become proof for the next bid package.",
    ],
  },
  {
    slug: "elevator-escalator",
    name: "Elevator and escalator service",
    singular: "elevator service company",
    article: "an",
    category: "mechanical",
    headline: "Get the service contracts buildings rely on",
    searchExample: "elevator service near me",
    blurb: "Maintenance, repair, and the uptime property managers need.",
    jobs: "elevator repair, maintenance, and escalator service",
    moment: "when a building needs reliable vertical transport service",
    pains: [
      "Property managers hire who looks established",
      "Emergency callbacks go to the first number",
      "Compliance talk needs a clear site",
    ],
    painBodies: [
      "Building owners search under pressure. Thin online presence loses to national brands.",
      "When a car is down, they dial whoever Google puts first.",
      "Managers want proof you handle inspections and maintenance without drama.",
    ],
    outcomes: [
      "Found for elevator service nearby",
      "A site that wins the contract",
      "Reviews that lift the next building",
    ],
    outcomeBodies: [
      "Rank for elevator repair, maintenance, and escalator service in your market.",
      "Clear service offers and contact paths for property and facility managers.",
      "Reliable work turns into reviews that open the next building.",
    ],
  },
  {
    slug: "appliance-repair",
    name: "Appliance repair",
    singular: "appliance repair technician",
    article: "an",
    category: "mechanical",
    headline: "Get the call when the machine dies",
    searchExample: "appliance repair near me",
    blurb: "Washers, fridges, and same-week repairs people need.",
    jobs: "washer, fridge, oven, and appliance repair",
    moment: "when a household appliance fails mid-week",
    pains: [
      "They search the appliance, not repair",
      "Same-day expectation is the sale",
      "Trust matters inside the home",
    ],
    painBodies: [
      "People type fridge repair or washer not spinning. Brand-only pages miss those searches.",
      "Whoever looks available online gets the booking before you even hear about it.",
      "Reviews and a clear company story decide who gets invited in.",
    ],
    outcomes: [
      "Rank for the appliances you fix",
      "A site built to book fast",
      "Reviews after every repair",
    ],
    outcomeBodies: [
      "Show up for fridge, washer, dryer, and oven repair in your town.",
      "Clear booking paths and phone numbers that stand out on mobile.",
      "Finished repairs become reviews while relief is still fresh.",
    ],
  },
  {
    slug: "solar-installation",
    name: "Solar installation",
    singular: "solar installer",
    article: "a",
    category: "mechanical",
    headline: "Get found when homeowners are ready to go solar",
    searchExample: "solar installation near me",
    blurb: "Residential and commercial installs that start with a search.",
    jobs: "home solar, commercial solar, and battery installs",
    moment: "when a property owner is comparing local solar installers",
    pains: [
      "National brands crowd the map",
      "Education and trust close the sale",
      "Local proof beats generic claims",
    ],
    painBodies: [
      "Big solar companies dominate ads and maps. Local installers need a strong organic presence.",
      "Homeowners research for weeks. A weak site ends the conversation early.",
      "People want local reviews and project photos, not stock images.",
    ],
    outcomes: [
      "Rank for solar in your area",
      "A site that builds confidence",
      "Reviews that power the next install",
    ],
    outcomeBodies: [
      "Show up for solar installation and battery storage near you.",
      "Clear process pages and local proof turn research into booked consults.",
      "Finished installs become public reviews that win the next roof.",
    ],
  },
  {
    slug: "generator-installation",
    name: "Generator installation",
    singular: "generator installer",
    article: "a",
    category: "mechanical",
    headline: "Show up before the next outage",
    searchExample: "generator installation near me",
    blurb: "Standby generators and the installs storms make urgent.",
    jobs: "standby generators, transfer switches, and installs",
    moment: "when outages push a homeowner to finally install backup power",
    pains: [
      "Storm season creates a scramble",
      "Permits and transfer switches need clarity",
      "Big box brands look safer online",
    ],
    painBodies: [
      "After outages, generator searches spike. Invisible installers miss the rush.",
      "Owners want a crew that explains the install before they commit.",
      "National names fill results. Local electricians lose work they could win.",
    ],
    outcomes: [
      "Found for generator installs",
      "A site that explains the job",
      "Reviews that backup the next sale",
    ],
    outcomeBodies: [
      "Rank for generator installation and standby power in your town.",
      "Clear services and contact paths for homeowners ready to protect the house.",
      "Finished installs leave reviews that sell through the next storm season.",
    ],
  },

  // Automotive and heavy equipment
  {
    slug: "auto-repair",
    name: "Auto repair",
    singular: "auto repair shop",
    article: "an",
    category: "automotive",
    headline: "Get the bay filled by people who searched first",
    searchExample: "auto repair near me",
    blurb: "Maintenance, diagnostics, and the shops drivers trust.",
    jobs: "brakes, diagnostics, and general auto repair",
    moment: "when a dashboard light or strange noise forces a search",
    pains: [
      "They pick the first trusted shop",
      "Service menus never match the search",
      "Reviews decide who gets the keys",
    ],
    painBodies: [
      "Drivers search under stress. The shop that looks ready online gets the car.",
      "People search brake repair or check engine light. A vague homepage misses them.",
      "Without recent reviews, even a skilled shop feels like a risk.",
    ],
    outcomes: [
      "Rank for auto repair nearby",
      "A site that books the bay",
      "Reviews after every service",
    ],
    outcomeBodies: [
      "Show up for brakes, diagnostics, and general repair in your town.",
      "Clear services and easy contact so drivers can book before work.",
      "Finished jobs turn into reviews that fill the next week.",
    ],
  },
  {
    slug: "body-shop",
    name: "Body shops",
    singular: "body shop",
    article: "a",
    category: "automotive",
    headline: "Get found after the dent, scrape, or claim",
    searchExample: "auto body shop near me",
    blurb: "Collision repair, paint, and insurance work that starts online.",
    jobs: "collision repair, paint, and dent removal",
    moment: "when a driver needs collision or cosmetic body work",
    pains: [
      "Insurance and Direct Repair steer jobs",
      "Photo proof wins the estimate",
      "Paint quality needs public trust",
    ],
    painBodies: [
      "Drivers still search locally. A weak listing loses cash and insurance work.",
      "People want to see finished paint and panel work before they commit.",
      "Without reviews, even a great booth looks like a gamble.",
    ],
    outcomes: [
      "Found for body work nearby",
      "A site that wins the estimate",
      "Reviews that close the claim",
    ],
    outcomeBodies: [
      "Rank for auto body, collision repair, and paint in your area.",
      "Clear process pages and galleries that make booking feel safe.",
      "Finished repairs become reviews that bring the next car in.",
    ],
  },
  {
    slug: "tire-shop",
    name: "Tire shops",
    singular: "tire shop",
    article: "a",
    category: "automotive",
    headline: "Be ready when the season or a flat forces a stop",
    searchExample: "tire shop near me",
    blurb: "Mounts, balances, and the seasonal rush that fills the lot.",
    jobs: "new tires, repairs, mounts, and alignments",
    moment: "when weather turns or a tire fails on the road",
    pains: [
      "Season spikes punish weak listings",
      "Price shoppers still need trust",
      "Mobile and shop searches compete",
    ],
    painBodies: [
      "Winter and summer tire rushes fill calendars. Invisible shops miss the wave.",
      "People compare options fast. Reviews and clear hours decide the stop.",
      "Drivers search tire repair and new tires differently. Cover both clearly.",
    ],
    outcomes: [
      "Rank for tires in your town",
      "A site that gets them in today",
      "Reviews that roll into the next visit",
    ],
    outcomeBodies: [
      "Show up for tire shops, mounts, and repairs nearby.",
      "Clear hours, services, and a phone number that stands out on mobile.",
      "Happy drivers leave proof that fills the next seasonal rush.",
    ],
  },
  {
    slug: "towing",
    name: "Towing",
    singular: "towing company",
    article: "a",
    category: "automotive",
    headline: "Get the dispatch when someone is stuck",
    searchExample: "towing near me",
    blurb: "Roadside recovery and the calls that cannot wait.",
    jobs: "light duty towing, roadside help, and recovery",
    moment: "when a driver needs a tow right now",
    pains: [
      "They call the first number that loads",
      "Coverage area must be obvious",
      "Trust matters on the shoulder",
    ],
    painBodies: [
      "Breakdowns are urgent. If your listing is slow or unclear, the next company gets the hook.",
      "Drivers need to know you serve their road before they dial.",
      "Reviews and a clear company name beat a random truck with no proof.",
    ],
    outcomes: [
      "Found for towing nearby",
      "A site built for the emergency call",
      "Reviews that win the next dispatch",
    ],
    outcomeBodies: [
      "Rank for towing and roadside assistance in your service area.",
      "Tap-to-call prominence and clear coverage so stuck drivers choose you.",
      "Finished recoveries become reviews that keep the phone ringing.",
    ],
  },
  {
    slug: "diesel-truck-repair",
    name: "Diesel and truck repair",
    singular: "diesel repair shop",
    article: "a",
    category: "automotive",
    headline: "Get the fleet and owner-operator work that searches",
    searchExample: "diesel repair near me",
    blurb: "Heavy trucks, diesels, and downtime that cannot stretch.",
    jobs: "diesel diagnostics, truck repair, and fleet service",
    moment: "when a truck is down and freight cannot wait",
    pains: [
      "Downtime makes buyers impatient",
      "Fleet managers hire who looks ready",
      "Specialty diesel searches are specific",
    ],
    painBodies: [
      "Owner-operators Google under pressure. The shop that looks available wins.",
      "Fleets want a vendor that looks organized online before they send units.",
      "People search DEF issues, injectors, or semi repair. Vague pages miss them.",
    ],
    outcomes: [
      "Rank for diesel repair nearby",
      "A site fleets can trust",
      "Reviews that keep the bays full",
    ],
    outcomeBodies: [
      "Show up for diesel and commercial truck repair in your area.",
      "Clear capabilities and contact paths for drivers and fleet managers.",
      "Finished repairs become proof that reduces the next buyer’s risk.",
    ],
  },
  {
    slug: "heavy-equipment-repair",
    name: "Heavy equipment repair",
    singular: "heavy equipment repair company",
    article: "a",
    category: "automotive",
    headline: "Get found when iron is down on the job",
    searchExample: "heavy equipment repair near me",
    blurb: "Field service and shop repair for the machines that earn.",
    jobs: "excavator, loader, and heavy equipment repair",
    moment: "when a machine stops a job site or a farm day",
    pains: [
      "Field service needs to be findable fast",
      "OEMs and dealers crowd search",
      "Capability proof wins the callout",
    ],
    painBodies: [
      "When a machine dies, someone Googles from the cab. Invisible techs lose the callout.",
      "Dealer pages dominate. Independent shops need strong local presence to compete.",
      "Buyers want to know you can handle their iron before they wait on you.",
    ],
    outcomes: [
      "Found for equipment repair",
      "A site that wins the callout",
      "Reviews that keep iron moving",
    ],
    outcomeBodies: [
      "Rank for heavy equipment and mobile machinery repair near you.",
      "Clear field-service offers and a phone number that stands out.",
      "Finished repairs leave reviews contractors remember next breakdown.",
    ],
  },
  {
    slug: "auto-detailing",
    name: "Auto detailing",
    singular: "auto detailer",
    article: "an",
    category: "automotive",
    headline: "Get booked for the detail people plan ahead for",
    searchExample: "auto detailing near me",
    blurb: "Interior, exterior, and mobile details that start on Google.",
    jobs: "full details, ceramic coats, and interior cleans",
    moment: "when a driver wants the car looking new again",
    pains: [
      "Photos are the whole sale",
      "Mobile vs shop searches split demand",
      "Packages need to be clear online",
    ],
    painBodies: [
      "People judge detailing by galleries. A weak site loses to whoever looks sharper.",
      "Some search mobile detailing, others want a shop. Cover the way you work.",
      "Vague pricing and packages create no-shows and price shoppers.",
    ],
    outcomes: [
      "Rank for detailing nearby",
      "A site that sells the finish",
      "Reviews that shine for the next booking",
    ],
    outcomeBodies: [
      "Show up for auto detailing and ceramic coating in your town.",
      "Clear packages and photos that turn scrolling into booked slots.",
      "Finished details become reviews that fill the calendar.",
    ],
  },
  {
    slug: "windshield-replacement",
    name: "Windshield replacement",
    singular: "windshield replacement company",
    article: "a",
    category: "automotive",
    headline: "Get the glass calls after the crack spreads",
    searchExample: "windshield replacement near me",
    blurb: "Chips, cracks, and insurance glass work that starts with a search.",
    jobs: "windshield repair, replacement, and ADAS recalibration",
    moment: "when a crack spreads or insurance sends a driver looking",
    pains: [
      "Insurance networks steer volume",
      "Same-week availability wins",
      "ADAS and OEM glass need clarity",
    ],
    painBodies: [
      "Drivers still search locally for faster service. A weak listing loses cash jobs.",
      "Whoever looks available online gets the booking first.",
      "Modern cars need clear messaging about recalibration and quality glass.",
    ],
    outcomes: [
      "Found for auto glass nearby",
      "A site built to book fast",
      "Reviews that clear the next windshield",
    ],
    outcomeBodies: [
      "Rank for windshield repair and replacement in your area.",
      "Tap-to-call and clear scheduling for drivers who need glass now.",
      "Finished jobs become reviews that beat the national chains on trust.",
    ],
  },
  {
    slug: "mobile-mechanic",
    name: "Mobile mechanics",
    singular: "mobile mechanic",
    article: "a",
    category: "automotive",
    headline: "Get found by drivers who want the shop to come to them",
    searchExample: "mobile mechanic near me",
    blurb: "Driveway repairs and on-site diagnostics that skip the tow.",
    jobs: "mobile diagnostics, battery service, and driveway repairs",
    moment: "when a car will not move and a tow feels like overkill",
    pains: [
      "Mobile intent is specific",
      "Trust is harder without a shop front",
      "Service radius must be obvious",
    ],
    painBodies: [
      "People type mobile mechanic on purpose. Generic auto repair pages often lose the click.",
      "Coming to a driveway requires reviews and a clear company identity.",
      "Drivers need to know you cover their street before they wait on you.",
    ],
    outcomes: [
      "Rank for mobile repair nearby",
      "A site that books the visit",
      "Reviews that roll to the next driveway",
    ],
    outcomeBodies: [
      "Show up for mobile mechanic and on-site auto repair in your area.",
      "Clear services, coverage, and booking paths that feel safe.",
      "Finished visits become reviews that keep the van busy.",
    ],
  },

  // Cleaning and exterior maintenance
  {
    slug: "pressure-washing",
    name: "Pressure washing",
    singular: "pressure washing company",
    article: "a",
    category: "cleaning",
    headline: "Get booked for driveways, patios, and dirty exteriors",
    searchExample: "pressure washing near me",
    blurb: "Driveways, decks, fences, and the washes that restore curb appeal.",
    jobs: "driveways, patios, walkways, decks, and fences",
    moment: "when curb appeal or spring cleaning finally forces a call",
    pains: [
      "Season opens and routes fill elsewhere",
      "Surface-specific searches win",
      "Before-and-after is the sale",
    ],
    painBodies: [
      "Spring searches spike. Invisible wash companies watch neighbours book someone else.",
      "People search driveway cleaning or deck washing. One vague page misses them.",
      "Without photo proof, quotes feel expensive for work they cannot picture.",
    ],
    outcomes: [
      "Found for the surfaces you wash",
      "A site that books the route",
      "Reviews that clean up the next lead",
    ],
    outcomeBodies: [
      "Rank for pressure washing on driveways, patios, decks, and fences nearby.",
      "Clear offers and galleries that turn a search into a booked wash.",
      "Finished jobs become reviews that fill the next neighbourhood.",
    ],
  },
  {
    slug: "soft-washing",
    name: "Soft washing",
    singular: "soft washing company",
    article: "a",
    category: "cleaning",
    headline: "Get found for siding, roofs, and moss done safely",
    searchExample: "soft wash near me",
    blurb: "House washes, roofs, and moss removal without the damage.",
    jobs: "house siding, roofs, and moss removal",
    moment: "when algae and moss make a house look older than it is",
    pains: [
      "Homeowners fear pressure damage",
      "Roof and siding are different searches",
      "Soft wash education closes the sale",
    ],
    painBodies: [
      "People worry high pressure will hurt siding. Clear soft-wash messaging wins trust.",
      "Roof moss and house washing get separate searches. Cover both if you offer them.",
      "A weak site makes a careful method look like any cheap wash.",
    ],
    outcomes: [
      "Rank for soft washing nearby",
      "A site that explains the method",
      "Reviews that grow the next route",
    ],
    outcomeBodies: [
      "Show up for soft washing, house washing, and moss removal in your town.",
      "Clear education and photos that make homeowners feel safe booking.",
      "Finished washes become reviews that sell the next block.",
    ],
  },
  {
    slug: "commercial-washing",
    name: "Commercial washing",
    singular: "commercial washing company",
    article: "a",
    category: "cleaning",
    headline: "Win the lots, storefronts, and fleet washes on repeat",
    searchExample: "commercial pressure washing near me",
    blurb: "Parking lots, dumpster pads, storefronts, and fleet washing.",
    jobs: "parking lots, storefronts, dumpster pads, and fleets",
    moment: "when a property or fleet manager needs exterior cleaning on schedule",
    pains: [
      "Managers hire who looks commercial-ready",
      "Recurring contracts need proof",
      "Night and fleet work must be clear",
    ],
    painBodies: [
      "Property managers search under time pressure. Thin consumer sites lose to crews that look commercial.",
      "Repeat work goes to vendors with reviews and a clear process.",
      "If fleet or after-hours washing is hidden, those jobs never call.",
    ],
    outcomes: [
      "Found for commercial wash work",
      "A site built for managers",
      "Reviews that renew the contract",
    ],
    outcomeBodies: [
      "Rank for commercial washing, lot cleaning, and fleet washing nearby.",
      "Clear commercial offers and contact paths for property and fleet managers.",
      "Reliable routes turn into reviews that open the next account.",
    ],
  },
  {
    slug: "window-cleaning",
    name: "Window cleaning",
    singular: "window cleaner",
    article: "a",
    category: "cleaning",
    headline: "Get the residential and storefront glass that searches",
    searchExample: "window cleaning near me",
    blurb: "Homes, storefronts, high-rise, and post-construction glass.",
    jobs: "residential, storefront, high-rise, and post-construction glass",
    moment: "when streaked glass finally becomes the priority",
    pains: [
      "Residential and commercial split search",
      "Post-construction needs specialty proof",
      "Recurring routes need reviews",
    ],
    painBodies: [
      "Homeowners and storefront managers search differently. One vague page misses half the work.",
      "Builders need a crew that looks ready for new construction glass.",
      "Without reviews, even a careful cleaner loses recurring routes.",
    ],
    outcomes: [
      "Rank for window cleaning nearby",
      "A site that covers how you work",
      "Reviews that keep the glass booked",
    ],
    outcomeBodies: [
      "Show up for residential, commercial, and post-construction window cleaning.",
      "Clear service pages that match how customers describe the job.",
      "Finished cleans become reviews that fill the next route.",
    ],
  },
  {
    slug: "solar-panel-cleaning",
    name: "Solar panel cleaning",
    singular: "solar panel cleaning company",
    article: "a",
    category: "cleaning",
    headline: "Get found when dirty panels cost production",
    searchExample: "solar panel cleaning near me",
    blurb: "Panel washes that restore output for homes and commercial arrays.",
    jobs: "residential and commercial solar panel cleaning",
    moment: "when output drops and dirt is the easy fix",
    pains: [
      "Solar owners search a niche term",
      "Roof safety needs trust",
      "Output proof helps the sale",
    ],
    painBodies: [
      "People type solar panel cleaning specifically. General wash pages often lose the click.",
      "Homeowners want a crew that looks careful on the roof.",
      "Clear before-and-after and process pages make the service feel worth it.",
    ],
    outcomes: [
      "Rank for panel cleaning nearby",
      "A site that feels roof-safe",
      "Reviews that power the next array",
    ],
    outcomeBodies: [
      "Show up for solar panel cleaning in your service area.",
      "Clear method and safety messaging that turns research into booked washes.",
      "Finished cleans become reviews for the next solar neighbourhood.",
    ],
  },
  {
    slug: "gutter-cleaning",
    name: "Gutter cleaning",
    singular: "gutter cleaner",
    article: "a",
    category: "cleaning",
    headline: "Get booked before the next overflow",
    searchExample: "gutter cleaning near me",
    blurb: "Clogged gutters, downspouts, and the seasonal rush that follows storms.",
    jobs: "gutter cleaning, downspout clearing, and maintenance",
    moment: "when overflow stains or storm season forces a cleanout",
    pains: [
      "Seasonal spikes fill calendars fast",
      "Trust matters on the roof edge",
      "Add-on guards need clear pages",
    ],
    painBodies: [
      "Fall and spring searches jump. Invisible cleaners miss the rush.",
      "Homeowners want reviews before anyone climbs near the eaves.",
      "People searching gutter cleaning may also want guards. Make both easy to find.",
    ],
    outcomes: [
      "Found for gutter cleaning nearby",
      "A site that books the season",
      "Reviews that clear the next block",
    ],
    outcomeBodies: [
      "Rank for gutter cleaning in your town.",
      "Clear seasonal offers and tap-to-call for homeowners ready now.",
      "Finished cleanouts become reviews that fill the next storm week.",
    ],
  },
  {
    slug: "gutter-guard-installation",
    name: "Gutter guard installation",
    singular: "gutter guard installer",
    article: "a",
    category: "cleaning",
    headline: "Show up when homeowners are done cleaning gutters",
    searchExample: "gutter guards near me",
    blurb: "Guards and covers that turn one-time cleans into lasting upgrades.",
    jobs: "gutter guard install and leaf protection systems",
    moment: "when repeated clogging finally pushes a lasting fix",
    pains: [
      "National guard brands crowd ads",
      "Local install proof wins trust",
      "Cleaning customers never see the upsell online",
    ],
    painBodies: [
      "Big brands dominate paid search. Local installers need strong organic pages.",
      "Homeowners want to see real installs, not brochure claims.",
      "If guards are buried on a cleaning site, the upgrade sale never starts.",
    ],
    outcomes: [
      "Rank for gutter guards nearby",
      "A site that sells the upgrade",
      "Reviews that protect the next roof",
    ],
    outcomeBodies: [
      "Show up for gutter guard installation in your service area.",
      "Clear product and install pages that turn frustration into a booked consult.",
      "Finished installs become reviews that win the next leaf season.",
    ],
  },
  {
    slug: "graffiti-removal",
    name: "Graffiti removal",
    singular: "graffiti removal company",
    article: "a",
    category: "cleaning",
    headline: "Get the call when a wall needs to look right again",
    searchExample: "graffiti removal near me",
    blurb: "Fast removal for property managers, cities, and storefronts.",
    jobs: "graffiti removal on brick, metal, and painted surfaces",
    moment: "when a tagged wall needs a fast, professional clean",
    pains: [
      "Speed is the whole sale",
      "Surface-safe methods need trust",
      "Commercial buyers search under pressure",
    ],
    painBodies: [
      "Managers want it gone now. The findable crew gets the dispatch.",
      "Wrong methods damage surfaces. Clear process messaging wins the job.",
      "Cities and property teams hire who looks established online.",
    ],
    outcomes: [
      "Found for graffiti removal",
      "A site built for urgent commercial work",
      "Reviews that clear the next wall",
    ],
    outcomeBodies: [
      "Rank for graffiti removal in your market.",
      "Clear commercial contact paths and response messaging.",
      "Finished removals become proof for the next property account.",
    ],
  },
  {
    slug: "awning-sign-cleaning",
    name: "Awning and sign cleaning",
    singular: "awning and sign cleaning company",
    article: "an",
    category: "cleaning",
    headline: "Keep storefronts looking open for business",
    searchExample: "awning cleaning near me",
    blurb: "Awnings, signs, and the exterior brand assets customers notice.",
    jobs: "awning cleaning, sign washing, and storefront refresh",
    moment: "when a faded awning or dirty sign starts costing walk-ins",
    pains: [
      "Niche search intent is easy to miss",
      "Retail managers want recurring proof",
      "Photos of clean brand assets sell",
    ],
    painBodies: [
      "People search awning cleaning specifically. General pressure-wash pages often lose.",
      "Store owners hire vendors who look reliable for repeat exterior care.",
      "Before-and-after of signs and awnings makes the value obvious.",
    ],
    outcomes: [
      "Rank for awning and sign cleaning",
      "A site retailers can book from",
      "Reviews that refresh the next block",
    ],
    outcomeBodies: [
      "Show up for awning and sign cleaning in your town.",
      "Clear commercial offers and galleries that win storefront accounts.",
      "Finished cleans become reviews that open the next retail strip.",
    ],
  },
  {
    slug: "holiday-light-installation",
    name: "Holiday light installation",
    singular: "holiday light installer",
    article: "a",
    category: "cleaning",
    headline: "Fill the winter calendar when wash season slows",
    searchExample: "holiday light installation near me",
    blurb: "Professional installs that balance spring and summer wash work.",
    jobs: "residential and commercial holiday light installation",
    moment: "when a homeowner or business wants lights without the ladder",
    pains: [
      "Bookings start early each fall",
      "Design photos win the job",
      "Take-down service needs to be clear",
    ],
    painBodies: [
      "People plan displays weeks ahead. Invisible installers miss the season.",
      "Customers choose crews with galleries that look finished and safe.",
      "If removal and storage are unclear, the sale stalls.",
    ],
    outcomes: [
      "Found for holiday lights nearby",
      "A site that sells the display",
      "Reviews that light up next year",
    ],
    outcomeBodies: [
      "Rank for holiday light installation in your service area.",
      "Clear packages, photos, and booking paths for homes and businesses.",
      "Finished displays become reviews that refill next winter.",
    ],
  },
  {
    slug: "commercial-industrial-cleaning",
    name: "Commercial and industrial cleaning",
    singular: "commercial cleaning company",
    article: "a",
    category: "cleaning",
    headline: "Win the facilities that need a reliable cleaning partner",
    searchExample: "commercial cleaning near me",
    blurb: "Offices, industrial spaces, and the contracts that renew.",
    jobs: "office, industrial, and facility cleaning",
    moment: "when a facility manager needs dependable cleaning coverage",
    pains: [
      "RFPs go to companies that look established",
      "Niche facility needs get buried",
      "Trust and consistency win renewals",
    ],
    painBodies: [
      "Managers Google vendors under deadline. A weak site never makes the shortlist.",
      "Industrial, medical, and office searches differ. Vague pages miss contracts.",
      "Without reviews and clear process, even good crews look risky.",
    ],
    outcomes: [
      "Found for commercial cleaning",
      "A site built for facility managers",
      "Reviews that renew the contract",
    ],
    outcomeBodies: [
      "Rank for commercial and industrial cleaning in your market.",
      "Clear service lines and contact paths for managers ready to hire.",
      "Reliable work turns into reviews that open the next building.",
    ],
  },

  // Property and outdoor services
  {
    slug: "landscapers",
    name: "Landscapers",
    singular: "landscaper",
    article: "a",
    category: "property",
    featured: true,
    headline: "Get booked for the yards that need you",
    searchExample: "landscaper near me",
    blurb: "Yards, seasons, and the customers who come back.",
    jobs: "landscaping, cleanups, and outdoor projects",
    moment: "when neighbours need outdoor work done right",
    pains: [
      "Season opens and phones go quiet",
      "One-off jobs do not become routes",
      "Photos live on the phone",
    ],
    painBodies: [
      "If you are not on Google when people start planning, the routes fill with someone else.",
      "Without a clear site and reviews, spring cleanups never turn into recurring customers.",
      "Great yards never make it online. The next customer has nothing to judge you by.",
    ],
    outcomes: [
      "Rank for the outdoor work you do",
      "A site that books the season",
      "Reviews that bring the next yard",
    ],
    outcomeBodies: [
      "Show up for landscaping, lawn care, cleanups, and the services you want more of.",
      "Clear offers, a phone number that stands out, and pages that match local searches.",
      "Finished jobs turn into public proof so neighbours feel good calling you.",
    ],
  },
  {
    slug: "lawn-care",
    name: "Lawn care",
    singular: "lawn care company",
    article: "a",
    category: "property",
    headline: "Fill the weekly routes when mowing season starts",
    searchExample: "lawn care near me",
    blurb: "Mowing, fertilization, and the recurring yards that pay.",
    jobs: "mowing, fertilization, and lawn maintenance",
    moment: "when a homeowner wants the yard handled every week",
    pains: [
      "Recurring routes go to whoever is findable",
      "Service menus need to be clear",
      "Neighbourhood proof wins the street",
    ],
    painBodies: [
      "Spring searches decide who owns the block. Invisible companies miss the season.",
      "People want mowing, fert, and weed control spelled out before they call.",
      "Reviews from nearby homes beat a vague promise every time.",
    ],
    outcomes: [
      "Rank for lawn care nearby",
      "A site that books the route",
      "Reviews that grow the next street",
    ],
    outcomeBodies: [
      "Show up for lawn care and yard maintenance in your town.",
      "Clear packages and easy booking for homeowners ready to hand off the yard.",
      "Finished seasons become reviews that fill the next neighbourhood.",
    ],
  },
  {
    slug: "tree-service",
    name: "Tree service",
    singular: "tree service company",
    article: "a",
    category: "property",
    headline: "Get the call before the next limb comes down",
    searchExample: "tree service near me",
    blurb: "Trimming, removal, and storm work that starts with a search.",
    jobs: "tree trimming, removal, and stump grinding",
    moment: "when a tree becomes a risk or a storm leaves damage",
    pains: [
      "Storm work is a race",
      "Removal and trimming are different searches",
      "Insurance and safety need trust",
    ],
    painBodies: [
      "After wind events, people dial the first tree service that looks ready.",
      "Homeowners search tree removal and tree trimming separately. Cover both.",
      "A weak site makes even a certified crew look risky near the house.",
    ],
    outcomes: [
      "Found for tree work nearby",
      "A site that wins the estimate",
      "Reviews that clear the next canopy",
    ],
    outcomeBodies: [
      "Rank for tree trimming, removal, and storm cleanup in your area.",
      "Clear services and safety messaging that turn urgency into a booked crew.",
      "Finished jobs become reviews that win the next block.",
    ],
  },
  {
    slug: "snow-removal",
    name: "Snow removal",
    singular: "snow removal company",
    article: "a",
    category: "property",
    headline: "Be on the list before the first storm hits",
    searchExample: "snow removal near me",
    blurb: "Driveways, lots, and contracts that book before winter.",
    jobs: "residential snow removal and commercial lot clearing",
    moment: "when property owners lock in winter coverage",
    pains: [
      "Contracts close before the snow",
      "Commercial and residential split demand",
      "Reliability proof wins the season",
    ],
    painBodies: [
      "Smart buyers hire in fall. Invisible plow companies miss the contracts.",
      "Homeowners and property managers search differently. Cover both clearly.",
      "Reviews about showing up after storms beat a cheap quote.",
    ],
    outcomes: [
      "Found for snow removal nearby",
      "A site that books before winter",
      "Reviews that plow the next season",
    ],
    outcomeBodies: [
      "Rank for snow removal and lot clearing in your service area.",
      "Clear seasonal offers for homes and commercial properties.",
      "Reliable winters become reviews that refill next year’s list.",
    ],
  },
  {
    slug: "pest-control",
    name: "Pest control",
    singular: "pest control company",
    article: "a",
    category: "property",
    headline: "Get found when the infestation will not wait",
    searchExample: "pest control near me",
    blurb: "Ants, rodents, and the treatments people search in a hurry.",
    jobs: "residential pest control, rodents, and recurring treatments",
    moment: "when pests show up and homeowners want them gone now",
    pains: [
      "They search the pest, not pest control",
      "Trust decides who enters the home",
      "Recurring plans need clear offers",
    ],
    painBodies: [
      "People type ant control or mouse exterminator. Brand-only pages miss those jobs.",
      "Reviews and a clear company story matter before anyone sprays inside.",
      "If maintenance plans are hidden, you stay stuck in one-off emergency work.",
    ],
    outcomes: [
      "Rank for the pests you treat",
      "A site that books fast",
      "Reviews that keep the route full",
    ],
    outcomeBodies: [
      "Show up for pest control and exterminator searches in your town.",
      "Clear services and tap-to-call for homeowners who need help now.",
      "Finished treatments become reviews that win the next neighbourhood.",
    ],
  },
  {
    slug: "pool-service",
    name: "Pool service",
    singular: "pool service company",
    article: "a",
    category: "property",
    headline: "Fill the weekly pool routes before summer peaks",
    searchExample: "pool service near me",
    blurb: "Cleaning, chemicals, and openings that keep water ready.",
    jobs: "pool cleaning, openings, closings, and repairs",
    moment: "when a pool owner wants clear water without doing it themselves",
    pains: [
      "Seasonal demand books early",
      "Repair and weekly service differ in search",
      "Green pool emergencies go to whoever answers",
    ],
    painBodies: [
      "Owners hire before swim season. Invisible companies miss the routes.",
      "People search pool cleaning and pool repair separately. Cover both.",
      "When water turns, they dial the first service that looks available.",
    ],
    outcomes: [
      "Found for pool service nearby",
      "A site that books the season",
      "Reviews that keep the water clear",
    ],
    outcomeBodies: [
      "Rank for pool cleaning and pool service in your area.",
      "Clear weekly and repair offers with an easy path to book.",
      "Happy pool owners leave reviews that fill the next street.",
    ],
  },
  {
    slug: "septic-service",
    name: "Septic service",
    singular: "septic service company",
    article: "a",
    category: "property",
    headline: "Get the pump and repair calls before backups hit",
    searchExample: "septic service near me",
    blurb: "Pumping, inspections, and repairs rural properties depend on.",
    jobs: "septic pumping, inspections, and system repair",
    moment: "when a system is due for service or starting to fail",
    pains: [
      "Emergency backups punish weak listings",
      "Maintenance reminders never find you",
      "Trust matters for underground work",
    ],
    painBodies: [
      "When a system backs up, people call the first septic company Google shows.",
      "Routine pump jobs go to crews that are easy to find and book.",
      "Owners want reviews before anyone opens the tank.",
    ],
    outcomes: [
      "Rank for septic service nearby",
      "A site that books pump-outs",
      "Reviews that clear the next tank",
    ],
    outcomeBodies: [
      "Show up for septic pumping, inspection, and repair in your area.",
      "Clear services and contact paths for homeowners who need help now.",
      "Finished jobs become reviews that win the next rural route.",
    ],
  },
  {
    slug: "junk-removal",
    name: "Junk removal",
    singular: "junk removal company",
    article: "a",
    category: "property",
    headline: "Get booked when the pile finally has to go",
    searchExample: "junk removal near me",
    blurb: "Cleanouts, hauling, and same-week removals people search for.",
    jobs: "home cleanouts, furniture haul-away, and debris removal",
    moment: "when a garage, basement, or rental needs a fast clear-out",
    pains: [
      "Same-week availability wins",
      "Pricing clarity reduces no-calls",
      "Estate and rental cleanouts need trust",
    ],
    painBodies: [
      "People want it gone this week. The findable crew gets the booking.",
      "Vague quotes create tire-kickers. Clear offers convert better.",
      "Sensitive cleanouts need reviews and a professional-looking company.",
    ],
    outcomes: [
      "Found for junk removal nearby",
      "A site that books the haul",
      "Reviews that clear the next pile",
    ],
    outcomeBodies: [
      "Rank for junk removal and cleanouts in your town.",
      "Clear services and easy booking for homeowners and property managers.",
      "Finished hauls become reviews that keep the trucks busy.",
    ],
  },
  {
    slug: "dumpster-rental",
    name: "Dumpster rental",
    singular: "dumpster rental company",
    article: "a",
    category: "property",
    headline: "Get the roll-off booked before the remodel starts",
    searchExample: "dumpster rental near me",
    blurb: "Roll-offs for remodels, cleanouts, and job sites.",
    jobs: "residential and construction dumpster rental",
    moment: "when a project needs a bin before debris piles up",
    pains: [
      "Size and delivery questions kill bookings",
      "Contractors hire who is easy to reach",
      "Local delivery radius must be clear",
    ],
    painBodies: [
      "People bounce when sizes and pricing are confusing online.",
      "GCs and homeowners book the company that answers and looks ready.",
      "If service area is unclear, the call goes to someone closer on the map.",
    ],
    outcomes: [
      "Rank for dumpster rental nearby",
      "A site that books the drop",
      "Reviews that roll to the next job",
    ],
    outcomeBodies: [
      "Show up for dumpster rental in your service area.",
      "Clear sizes, delivery info, and a simple path to reserve a bin.",
      "Finished rentals become reviews that win the next remodel.",
    ],
  },
  {
    slug: "property-maintenance",
    name: "Property maintenance",
    singular: "property maintenance company",
    article: "a",
    category: "property",
    headline: "Win the handyman contracts properties renew",
    searchExample: "property maintenance near me",
    blurb: "Repairs, turnovers, and the odd jobs managers need handled.",
    jobs: "handyman repairs, turnovers, and facility upkeep",
    moment: "when a landlord or manager needs reliable maintenance coverage",
    pains: [
      "Managers hire who looks dependable",
      "One-off jobs never become contracts",
      "Service range must be obvious",
    ],
    painBodies: [
      "Property managers search under pressure. Thin sites lose to crews that look organized.",
      "Without a clear offer and reviews, you stay stuck in random calls.",
      "People need to know what you handle before they send the work order.",
    ],
    outcomes: [
      "Found for property maintenance",
      "A site built for managers",
      "Reviews that renew the account",
    ],
    outcomeBodies: [
      "Rank for property maintenance and handyman work in your area.",
      "Clear commercial and residential offers with easy contact paths.",
      "Reliable work turns into reviews that open the next building.",
    ],
  },

  // Skilled crafts
  {
    slug: "carpentry",
    name: "Carpentry",
    singular: "carpenter",
    article: "a",
    category: "crafts",
    headline: "Get found for the builds that need real craft",
    searchExample: "carpenter near me",
    blurb: "Trim, framing finish, and custom woodwork people search for.",
    jobs: "finish carpentry, custom builds, and repairs",
    moment: "when a homeowner or builder needs woodwork done right",
    pains: [
      "Craft gets buried under GCs online",
      "Specialty carpentry needs its own pages",
      "Portfolio proof wins the hire",
    ],
    painBodies: [
      "People searching carpenter often want a specialist, not a full remodel firm.",
      "Trim, custom built-ins, and repairs are different searches. Cover what you do.",
      "Without photos, skilled hands look like every other listing.",
    ],
    outcomes: [
      "Rank for carpentry nearby",
      "A site that shows the craft",
      "Reviews that build the next job",
    ],
    outcomeBodies: [
      "Show up for carpenter and finish carpentry searches in your town.",
      "Clear services and project proof that make booking feel safe.",
      "Finished work becomes reviews that win the next custom build.",
    ],
  },
  {
    slug: "cabinetry",
    name: "Cabinetry",
    singular: "cabinet maker",
    article: "a",
    category: "crafts",
    headline: "Show up when kitchens and built-ins are on the board",
    searchExample: "cabinet maker near me",
    blurb: "Custom cabinets, built-ins, and the shops remodelers call.",
    jobs: "custom cabinets, built-ins, and cabinet refinishing",
    moment: "when a kitchen or office needs storage built to fit",
    pains: [
      "Big box and national brands crowd results",
      "Design photos are the sale",
      "Remodelers hire findable shops",
    ],
    painBodies: [
      "Homeowners compare local makers to chains. A weak site loses before the consult.",
      "People choose cabinets with their eyes. Galleries matter more than slogans.",
      "GCs search when a shop falls through. Visibility wins the schedule.",
    ],
    outcomes: [
      "Found for cabinetry nearby",
      "A site that sells the shop",
      "Reviews that fill the next kitchen",
    ],
    outcomeBodies: [
      "Rank for custom cabinets and cabinet makers in your area.",
      "Clear process and portfolio pages that turn browsing into booked consults.",
      "Finished kitchens become reviews that win the next remodel.",
    ],
  },
  {
    slug: "furniture-making",
    name: "Furniture making",
    singular: "furniture maker",
    article: "a",
    category: "crafts",
    headline: "Get found by buyers who want custom, not catalog",
    searchExample: "custom furniture maker near me",
    blurb: "Custom pieces and commissions that start with a local search.",
    jobs: "custom furniture, commissions, and repairs",
    moment: "when someone wants a piece built to their space",
    pains: [
      "Custom buyers research hard",
      "Style proof has to be online",
      "Local maker intent is specific",
    ],
    painBodies: [
      "People compare makers for weeks. A thin site ends the conversation early.",
      "Without a portfolio, even excellent craft looks unproven.",
      "Searches for custom furniture maker are deliberate. Match that intent.",
    ],
    outcomes: [
      "Rank for custom furniture nearby",
      "A site that shows your style",
      "Reviews that commission the next piece",
    ],
    outcomeBodies: [
      "Show up for custom furniture and local maker searches in your area.",
      "Portfolio-led pages that turn inspiration into inquiries.",
      "Finished commissions become proof for the next buyer.",
    ],
  },
  {
    slug: "upholstery",
    name: "Upholstery",
    singular: "upholsterer",
    article: "an",
    category: "crafts",
    headline: "Get the recover and restore jobs worth saving",
    searchExample: "upholstery near me",
    blurb: "Furniture recover, boat seats, and the crafts people still seek.",
    jobs: "furniture upholstery, recover, and restorations",
    moment: "when a piece is too good to replace",
    pains: [
      "People do not know who still does this",
      "Fabric and finish proof sells",
      "Auto and furniture searches differ",
    ],
    painBodies: [
      "Upholstery is a search of last resort. If you are not findable, the piece goes to the curb.",
      "Customers need to see recovered work before they trust the sofa.",
      "Furniture and automotive upholstery get different queries. Cover what you offer.",
    ],
    outcomes: [
      "Found for upholstery nearby",
      "A site that proves the restore",
      "Reviews that recover the next piece",
    ],
    outcomeBodies: [
      "Rank for upholstery and furniture recover in your town.",
      "Clear galleries and contact paths for customers ready to save a piece.",
      "Finished recovers become reviews that keep the shop booked.",
    ],
  },
  {
    slug: "blacksmithing",
    name: "Blacksmithing",
    singular: "blacksmith",
    article: "a",
    category: "crafts",
    headline: "Get found for forged work that catalogs cannot match",
    searchExample: "blacksmith near me",
    blurb: "Custom iron, gates, and forged pieces that start with a search.",
    jobs: "custom ironwork, gates, and forged hardware",
    moment: "when a buyer wants forged metal made locally",
    pains: [
      "Artisan searches are rare but intent-rich",
      "Photos are the entire pitch",
      "Custom lead times need clarity",
    ],
    painBodies: [
      "People who search blacksmith are ready to talk. Missing online means missing the commission.",
      "Without a gallery, the craft never gets a chance.",
      "Buyers want to know process and timeline before they inquire.",
    ],
    outcomes: [
      "Rank for blacksmith work nearby",
      "A site that shows the forge",
      "Reviews that spark the next commission",
    ],
    outcomeBodies: [
      "Show up for blacksmith and custom ironwork searches in your area.",
      "Portfolio-led pages that turn curiosity into serious inquiries.",
      "Finished pieces become proof for the next custom gate or rail.",
    ],
  },
  {
    slug: "stonework",
    name: "Stonework",
    singular: "stonework contractor",
    article: "a",
    category: "crafts",
    headline: "Get booked for stone that has to look permanent",
    searchExample: "stonework contractor near me",
    blurb: "Stone walls, veneers, and the craft that defines a property.",
    jobs: "stone walls, veneers, and custom stone installs",
    moment: "when a project needs stone that looks built to last",
    pains: [
      "Masonry and stone searches overlap",
      "Material and pattern proof win bids",
      "Builders hire visible specialists",
    ],
    painBodies: [
      "People searching stone work want a specialist look. Vague contractor pages lose.",
      "Homeowners choose with their eyes. Finished stone photos matter.",
      "GCs under deadline call the crew that is easy to find and trust.",
    ],
    outcomes: [
      "Found for stonework nearby",
      "A site that shows the craft",
      "Reviews that set the next wall",
    ],
    outcomeBodies: [
      "Rank for stonework and stone installation in your service area.",
      "Clear project galleries and contact paths for homeowners and builders.",
      "Finished installs become reviews that win the next property.",
    ],
  },
  {
    slug: "glazing-glass",
    name: "Glazing and glass",
    singular: "glazier",
    article: "a",
    category: "crafts",
    headline: "Get the glass calls for homes and storefronts",
    searchExample: "glass repair near me",
    blurb: "Window glass, storefronts, and custom glazing that cannot wait.",
    jobs: "glass repair, storefront glazing, and custom glass",
    moment: "when broken glass or a new opening needs a glazier",
    pains: [
      "Broken glass is an urgent search",
      "Commercial and residential differ",
      "Custom shower and mirror work needs pages",
    ],
    painBodies: [
      "When glass breaks, people dial the first local glazier that looks ready.",
      "Storefront managers and homeowners search differently. Cover both.",
      "Specialty glass jobs get their own queries. A vague homepage misses them.",
    ],
    outcomes: [
      "Rank for glazing nearby",
      "A site built for urgent and custom work",
      "Reviews that clear the next pane",
    ],
    outcomeBodies: [
      "Show up for glass repair, glazing, and storefront glass in your town.",
      "Clear services and tap-to-call for urgent replacements.",
      "Finished installs become reviews that win the next commercial account.",
    ],
  },
  {
    slug: "locksmithing",
    name: "Locksmiths",
    singular: "locksmith",
    article: "a",
    category: "crafts",
    headline: "Get the call when someone is locked out",
    searchExample: "locksmith near me",
    blurb: "Lockouts, rekeys, and security work that starts on Google.",
    jobs: "lockouts, rekeys, and lock installation",
    moment: "when a homeowner or driver needs a locksmith right away",
    pains: [
      "Emergency intent is winner-take-most",
      "Scammy listings crowd results",
      "Trust and local proof matter",
    ],
    painBodies: [
      "Locked-out customers call the first number that looks real.",
      "Lead mills and fake listings fill the map. Clean local presence wins trust.",
      "Reviews and a clear company identity beat anonymous emergency ads.",
    ],
    outcomes: [
      "Found for locksmith work nearby",
      "A site that gets the emergency call",
      "Reviews that unlock the next job",
    ],
    outcomeBodies: [
      "Rank for locksmith and lockout services in your area.",
      "Tap-to-call prominence and clear local identity that feel safe.",
      "Finished calls become reviews that beat the spam listings.",
    ],
  },
  {
    slug: "shoe-repair",
    name: "Shoe repair",
    singular: "shoe repair shop",
    article: "a",
    category: "crafts",
    headline: "Get found by people who still fix what they own",
    searchExample: "shoe repair near me",
    blurb: "Resoles, zips, and the neighbourhood shops worth keeping.",
    jobs: "shoe repair, resoling, and leather fixes",
    moment: "when a favourite pair is worth saving",
    pains: [
      "People assume no one is left",
      "Hours and turnaround must be clear",
      "Trust decides who gets the shoes",
    ],
    painBodies: [
      "Many searchers are not sure a local shop still exists. Visibility is the whole game.",
      "Vague hours and process create abandoned visits.",
      "Reviews make a small shop feel reliable for quality footwear.",
    ],
    outcomes: [
      "Rank for shoe repair nearby",
      "A site that brings them in",
      "Reviews that keep the bench busy",
    ],
    outcomeBodies: [
      "Show up for shoe repair and cobbler searches in your town.",
      "Clear services, hours, and contact paths that make dropping off easy.",
      "Finished repairs become reviews that save the next pair.",
    ],
  },
  {
    slug: "tailoring",
    name: "Tailoring",
    singular: "tailor",
    article: "a",
    category: "crafts",
    headline: "Get the alterations people search before the event",
    searchExample: "tailor near me",
    blurb: "Alterations, fittings, and the rush jobs calendars create.",
    jobs: "alterations, hemming, and custom tailoring",
    moment: "when a garment needs to fit before a deadline",
    pains: [
      "Event deadlines create urgent searches",
      "Service menus need to be obvious",
      "Trust matters for formal wear",
    ],
    painBodies: [
      "Weddings and interviews send people to Google. Invisible shops miss the rush.",
      "People want hemming, zippers, and suits listed clearly before they visit.",
      "Reviews decide who gets the expensive garment.",
    ],
    outcomes: [
      "Found for tailoring nearby",
      "A site that books the fitting",
      "Reviews that fit the next client",
    ],
    outcomeBodies: [
      "Rank for tailor and alterations searches in your area.",
      "Clear services and turnaround messaging that convert rushed shoppers.",
      "Finished fittings become reviews that fill the next season.",
    ],
  },
  {
    slug: "leatherwork",
    name: "Leatherwork",
    singular: "leatherworker",
    article: "a",
    category: "crafts",
    headline: "Get found for custom leather that lasts",
    searchExample: "leather repair near me",
    blurb: "Repairs, custom goods, and the craft buyers still seek locally.",
    jobs: "leather repair, custom goods, and restorations",
    moment: "when someone wants leather repaired or made to order",
    pains: [
      "Repair and custom are different searches",
      "Craft proof has to be visual",
      "Local maker intent is high-value",
    ],
    painBodies: [
      "People searching leather repair are not always looking for custom goods. Cover both if you offer them.",
      "Without photos, the craft never gets considered.",
      "Intentional buyers will contact a findable local maker before ordering overseas.",
    ],
    outcomes: [
      "Rank for leatherwork nearby",
      "A site that shows the craft",
      "Reviews that stitch the next order",
    ],
    outcomeBodies: [
      "Show up for leather repair and custom leather searches in your town.",
      "Portfolio and service pages that turn browsers into customers.",
      "Finished work becomes proof for the next commission.",
    ],
  },
  {
    slug: "sign-making",
    name: "Sign making",
    singular: "sign maker",
    article: "a",
    category: "crafts",
    headline: "Get the storefront and vehicle signs businesses need",
    searchExample: "sign shop near me",
    blurb: "Channel letters, vehicle wraps, and the signs that open a business.",
    jobs: "storefront signs, vehicle wraps, and custom signage",
    moment: "when a business needs to look open and findable",
    pains: [
      "Business owners hire under deadline",
      "Sign types need separate clarity",
      "Portfolio proof wins the brand",
    ],
    painBodies: [
      "Grand openings and rebrands cannot wait. Findable shops get the job.",
      "People search vehicle wraps, channel letters, or yard signs differently.",
      "Without a gallery, even a capable shop looks like a gamble for the brand.",
    ],
    outcomes: [
      "Found for sign making nearby",
      "A site that sells the shop",
      "Reviews that brand the next client",
    ],
    outcomeBodies: [
      "Rank for sign shops and custom signage in your area.",
      "Clear product lines and galleries that turn business owners into buyers.",
      "Finished installs become reviews that open the next account.",
    ],
  },
  {
    slug: "millwork",
    name: "Millwork",
    singular: "millwork shop",
    article: "a",
    category: "crafts",
    headline: "Get found for architectural wood that finishes the build",
    searchExample: "millwork shop near me",
    blurb: "Doors, trim packages, and custom millwork builders specify.",
    jobs: "custom millwork, doors, and architectural wood packages",
    moment: "when a project needs millwork that matches the drawings",
    pains: [
      "Architects and GCs search capability",
      "Shop capacity must look real online",
      "Specialty profiles need proof",
    ],
    painBodies: [
      "Specs go to shops that are easy to find and look established.",
      "A weak site makes a strong mill look like a risk for the schedule.",
      "Buyers want to see similar work before they send the package.",
    ],
    outcomes: [
      "Rank for millwork nearby",
      "A site that wins the package",
      "Reviews that finish the next build",
    ],
    outcomeBodies: [
      "Show up for millwork and architectural woodwork in your region.",
      "Clear capabilities and contact paths for builders and designers.",
      "Finished packages become proof for the next bid.",
    ],
  },

  // Industrial and logistics
  {
    slug: "trucking-freight",
    name: "Trucking and freight",
    singular: "trucking company",
    article: "a",
    category: "industrial",
    headline: "Get found by shippers who need a reliable carrier",
    searchExample: "trucking company near me",
    blurb: "Local freight, regional hauls, and the carriers businesses trust.",
    jobs: "local freight, regional trucking, and dedicated hauls",
    moment: "when a shipper needs capacity they can count on",
    pains: [
      "Shippers hire who looks established",
      "Lane and equipment clarity wins loads",
      "Trust beats the cheapest rate",
    ],
    painBodies: [
      "Dispatchers and owners Google under deadline. Thin sites never make the shortlist.",
      "If equipment and coverage are unclear, the load goes elsewhere.",
      "Reviews and a professional presence beat anonymous brokers and fly-by-night carriers.",
    ],
    outcomes: [
      "Found for trucking nearby",
      "A site that wins the load",
      "Reviews that haul the next account",
    ],
    outcomeBodies: [
      "Rank for trucking and freight services in your market.",
      "Clear equipment, lanes, and contact paths for shippers ready to book.",
      "Reliable hauls become reviews that open the next account.",
    ],
  },
  {
    slug: "moving-company",
    name: "Moving companies",
    singular: "moving company",
    article: "a",
    category: "industrial",
    headline: "Get booked when someone is ready to move",
    searchExample: "movers near me",
    blurb: "Local moves, long distance, and the crews people trust with a home.",
    jobs: "local moves, packing, and residential moving",
    moment: "when a household or office needs movers they can trust",
    pains: [
      "Reviews decide the whole sale",
      "Scammy movers crowd search",
      "Local vs long-distance intent splits",
    ],
    painBodies: [
      "Moving is high stress. People pick the company with clear reviews and a real site.",
      "Lead mills and fake listings fill results. Clean local presence wins trust.",
      "Customers search local movers and long distance differently. Cover what you offer.",
    ],
    outcomes: [
      "Found for movers nearby",
      "A site that books the move",
      "Reviews that pack the next job",
    ],
    outcomeBodies: [
      "Show up for moving companies and local movers in your area.",
      "Clear services and booking paths that feel safe for homeowners.",
      "Finished moves become reviews that beat the spam listings.",
    ],
  },
  {
    slug: "courier",
    name: "Couriers",
    singular: "courier service",
    article: "a",
    category: "industrial",
    headline: "Get the same-day deliveries businesses cannot wait on",
    searchExample: "courier service near me",
    blurb: "Same-day runs, medical, and the urgent deliveries local businesses need.",
    jobs: "same-day courier, local delivery, and urgent runs",
    moment: "when a business needs something across town today",
    pains: [
      "Urgent intent is winner-take-fast",
      "Coverage and hours must be obvious",
      "Business accounts need professionalism",
    ],
    painBodies: [
      "When a package has to move now, they dial the first courier that looks ready.",
      "If service area and hours are unclear, the job goes to someone else.",
      "Offices hire vendors that look reliable online, not just available.",
    ],
    outcomes: [
      "Rank for courier service nearby",
      "A site built for urgent booking",
      "Reviews that deliver the next account",
    ],
    outcomeBodies: [
      "Show up for courier and same-day delivery searches in your town.",
      "Clear coverage and tap-to-call for businesses that need a run now.",
      "Finished deliveries become reviews that open recurring accounts.",
    ],
  },
  {
    slug: "warehousing",
    name: "Warehousing",
    singular: "warehousing company",
    article: "a",
    category: "industrial",
    headline: "Get found by brands that need space and fulfillment",
    searchExample: "warehousing near me",
    blurb: "Storage, fulfillment, and the space growing businesses outgrow.",
    jobs: "storage, fulfillment, and distribution space",
    moment: "when a business needs warehouse capacity nearby",
    pains: [
      "B2B buyers research before they call",
      "Capabilities must be spelled out",
      "Trust and security win contracts",
    ],
    painBodies: [
      "Operations leads shortlist vendors online. A weak site never gets the tour.",
      "If racking, fulfillment, or dock details are missing, buyers bounce.",
      "Reviews and a clear company story reduce perceived risk for inventory.",
    ],
    outcomes: [
      "Found for warehousing nearby",
      "A site that wins the tour",
      "Reviews that store the next account",
    ],
    outcomeBodies: [
      "Rank for warehousing and fulfillment in your market.",
      "Clear capability pages and contact paths for operations buyers.",
      "Reliable service becomes proof that opens the next contract.",
    ],
  },
  {
    slug: "manufacturing-machining",
    name: "Manufacturing and machining",
    singular: "manufacturing company",
    article: "a",
    category: "industrial",
    headline: "Get on the RFQ list when buyers search locally",
    searchExample: "manufacturing company near me",
    blurb: "Production, machining, and the shops regional buyers need.",
    jobs: "manufacturing, machining, and production support",
    moment: "when a buyer needs a local manufacturer they can visit",
    pains: [
      "Capability pages win RFQs",
      "Certifications need to be visible",
      "Generic sites lose to clear specialists",
    ],
    painBodies: [
      "Engineers Google processes and tolerances. Invisible shops never see the drawing.",
      "ISO and quality claims only help if they are easy to find.",
      "Buyers skip vague manufacturer pages for shops that spell out what they make.",
    ],
    outcomes: [
      "Found for manufacturing nearby",
      "A site that wins the RFQ",
      "Reviews and proof that close work",
    ],
    outcomeBodies: [
      "Show up for manufacturing and machining searches in your region.",
      "Clear capabilities and contact paths for buyers ready to send prints.",
      "Past work and reviews make the next RFQ feel lower risk.",
    ],
  },
  {
    slug: "scrap-metal-recycling",
    name: "Scrap metal and recycling",
    singular: "scrap metal yard",
    article: "a",
    category: "industrial",
    headline: "Get found when metal needs to move today",
    searchExample: "scrap metal near me",
    blurb: "Yards, pickup, and recycling for contractors and the public.",
    jobs: "scrap metal buy, pickup, and recycling",
    moment: "when a job site or property has metal that needs to go",
    pains: [
      "Price and hours decide the visit",
      "Pickup service must be obvious",
      "Contractors hire who is easy to deal with",
    ],
    painBodies: [
      "People compare yards fast. Clear hours and accepted materials win the drop.",
      "If pickup is buried on the site, those higher-value jobs never call.",
      "GCs and remodelers choose yards that look organized online.",
    ],
    outcomes: [
      "Rank for scrap metal nearby",
      "A site that gets the drop or pickup",
      "Reviews that recycle the next load",
    ],
    outcomeBodies: [
      "Show up for scrap metal and recycling in your area.",
      "Clear accepted materials, hours, and pickup offers.",
      "Reliable service becomes reviews that keep the yard busy.",
    ],
  },
  {
    slug: "commercial-refrigeration",
    name: "Commercial refrigeration",
    singular: "commercial refrigeration technician",
    article: "a",
    category: "industrial",
    headline: "Get the call when cold storage cannot go down",
    searchExample: "commercial refrigeration repair near me",
    blurb: "Walk-ins, cases, and the service restaurants and stores depend on.",
    jobs: "walk-in repair, case service, and commercial refrigeration",
    moment: "when a cooler fails and product is at risk",
    pains: [
      "Emergency downtime is expensive",
      "Food businesses need trust fast",
      "Maintenance contracts need visibility",
    ],
    painBodies: [
      "When a walk-in fails, they dial the first refrigeration company that looks ready.",
      "Restaurants and stores want reviews before they trust the repair.",
      "If preventive service is hidden, you stay stuck in emergency-only work.",
    ],
    outcomes: [
      "Found for commercial refrigeration",
      "A site built for urgent service",
      "Reviews that cool the next account",
    ],
    outcomeBodies: [
      "Rank for commercial refrigeration repair in your market.",
      "Clear emergency and maintenance offers with tap-to-call prominence.",
      "Finished repairs become reviews that open the next kitchen.",
    ],
  },

  // Primary industries
  {
    slug: "farming",
    name: "Farming",
    singular: "farming business",
    article: "a",
    category: "primary",
    headline: "Get found by buyers, partners, and the next generation of customers",
    searchExample: "farm near me",
    blurb: "Local farms that need a clearer path from field to customer.",
    jobs: "farm products, CSA, and local agriculture services",
    moment: "when buyers look for a local farm they can trust",
    pains: [
      "Local food buyers start on Google",
      "What you grow never shows online",
      "Wholesale and retail need different clarity",
    ],
    painBodies: [
      "People search for farms, stands, and local producers. Invisible operations miss them.",
      "Great harvests stay offline, so new customers never learn you exist.",
      "Restaurants and families search differently. Clear pages catch both.",
    ],
    outcomes: [
      "Found for local farm searches",
      "A site that sells what you grow",
      "Reviews that bring the next visit",
    ],
    outcomeBodies: [
      "Show up for farm and local produce searches in your area.",
      "Clear offerings and contact paths for families and wholesale buyers.",
      "Happy customers leave proof that grows the next season.",
    ],
  },
  {
    slug: "ranching",
    name: "Ranching",
    singular: "ranch",
    article: "a",
    category: "primary",
    headline: "Get found for livestock, land, and ranch services",
    searchExample: "ranch near me",
    blurb: "Ranches that need visibility for sales, services, and partners.",
    jobs: "livestock, ranch services, and land-based operations",
    moment: "when buyers or partners look for a local ranch operation",
    pains: [
      "Buyers cannot find you when they search",
      "Services stay word of mouth only",
      "Trust still starts online",
    ],
    painBodies: [
      "People searching for ranch products or services never see an invisible operation.",
      "Custom grazing, sales, or services stay stuck in local networks alone.",
      "A clear site and reviews make a serious ranch look easy to work with.",
    ],
    outcomes: [
      "Rank for ranch searches nearby",
      "A site that explains the operation",
      "Reviews that open the next deal",
    ],
    outcomeBodies: [
      "Show up for ranch and livestock-related searches in your region.",
      "Clear offerings and contact paths for buyers and partners.",
      "Finished work and sales become public proof for the next relationship.",
    ],
  },
  {
    slug: "logging",
    name: "Logging",
    singular: "logging company",
    article: "a",
    category: "primary",
    headline: "Get the timber and land-clearing work that searches",
    searchExample: "logging company near me",
    blurb: "Timber harvest, land clearing, and the crews landowners need.",
    jobs: "logging, timber harvest, and land clearing",
    moment: "when a landowner needs trees harvested or land cleared",
    pains: [
      "Landowners hire who looks established",
      "Insurance and capability need to be visible",
      "Specialty clearing gets separate searches",
    ],
    painBodies: [
      "Property owners Google under pressure. Thin sites lose to bigger-looking crews.",
      "People want proof you can handle the job safely before anyone cuts.",
      "Selective harvest and land clearing are different intents. Cover what you do.",
    ],
    outcomes: [
      "Found for logging nearby",
      "A site that wins the property",
      "Reviews that clear the next tract",
    ],
    outcomeBodies: [
      "Rank for logging and land clearing in your area.",
      "Clear services and contact paths for landowners ready to hire.",
      "Finished jobs become reviews that open the next property.",
    ],
  },
  {
    slug: "fishing",
    name: "Fishing",
    singular: "fishing business",
    article: "a",
    category: "primary",
    headline: "Get found by buyers and charters looking local",
    searchExample: "fishing charter near me",
    blurb: "Commercial fishing and charters that need a clearer customer path.",
    jobs: "charters, seafood sales, and fishing services",
    moment: "when customers look for local fish or a boat to book",
    pains: [
      "Seasonal demand is search-driven",
      "What you offer never shows clearly",
      "Trust and availability win the booking",
    ],
    painBodies: [
      "Tourists and locals search when the season opens. Invisible operators miss the wave.",
      "Charters, direct seafood, and services need clear pages to convert.",
      "Reviews and easy booking beat a phone number on a faded sign.",
    ],
    outcomes: [
      "Found for local fishing searches",
      "A site that books the trip or sale",
      "Reviews that fill the next season",
    ],
    outcomeBodies: [
      "Show up for fishing charter and local seafood searches in your area.",
      "Clear offerings and booking paths that turn interest into revenue.",
      "Happy customers leave proof that fills next season’s calendar.",
    ],
  },
  {
    slug: "quarrying",
    name: "Quarrying",
    singular: "quarry",
    article: "a",
    category: "primary",
    headline: "Get found by the contractors who need aggregate",
    searchExample: "quarry near me",
    blurb: "Stone, gravel, and the materials local builds depend on.",
    jobs: "aggregate, gravel, and quarry materials",
    moment: "when a contractor needs material and a yard that can deliver",
    pains: [
      "Contractors search under schedule pressure",
      "Materials and delivery must be clear",
      "Commercial buyers want an easy vendor",
    ],
    painBodies: [
      "GCs and landscapers Google when a pour or base layer is waiting.",
      "If products and delivery are vague, they call a competitor.",
      "A professional site makes a local quarry easier to put on the vendor list.",
    ],
    outcomes: [
      "Rank for quarry searches nearby",
      "A site that wins the order",
      "Reviews that haul the next load",
    ],
    outcomeBodies: [
      "Show up for quarry and aggregate searches in your region.",
      "Clear materials, delivery info, and contact paths for contractors.",
      "Reliable loads become reviews that keep the yard busy.",
    ],
  },
  {
    slug: "oil-field-services",
    name: "Oil field services",
    singular: "oil field services company",
    article: "an",
    category: "primary",
    headline: "Get on the vendor list when operators search locally",
    searchExample: "oilfield services near me",
    blurb: "Field services and support that operators need nearby.",
    jobs: "oil field support, maintenance, and specialty field services",
    moment: "when an operator needs a local service partner fast",
    pains: [
      "Procurement still Googles locally",
      "Capabilities and safety need to be visible",
      "Trust wins callouts",
    ],
    painBodies: [
      "When something breaks in the field, findable vendors get the first call.",
      "Safety and service lines buried on a weak site lose the opportunity.",
      "Operators hire partners that look established before they send a crew.",
    ],
    outcomes: [
      "Found for oil field services",
      "A site that wins the vendor slot",
      "Reviews that open the next callout",
    ],
    outcomeBodies: [
      "Rank for oil field and energy support services in your market.",
      "Clear capabilities and contact paths for operators and procurement.",
      "Reliable work becomes proof that opens the next job.",
    ],
  },
];

const categories = [
  {
    id: "construction",
    name: "Construction and building",
    description:
      "From general contracting and framing to roofing, concrete, and outdoor builds.",
  },
  {
    id: "mechanical",
    name: "Mechanical and electrical trades",
    description:
      "Plumbing, HVAC, electrical, welding, solar, and the shops that keep systems running.",
  },
  {
    id: "automotive",
    name: "Automotive and heavy equipment",
    description:
      "Auto repair, body shops, towing, diesel, and mobile service for vehicles and iron.",
  },
  {
    id: "cleaning",
    name: "Cleaning and exterior maintenance",
    description:
      "Pressure washing, soft washing, windows, gutters, and commercial exterior care.",
  },
  {
    id: "property",
    name: "Property and outdoor services",
    description:
      "Landscaping, lawn care, trees, snow, pest, pools, and property maintenance.",
  },
  {
    id: "crafts",
    name: "Skilled crafts",
    description:
      "Carpentry, cabinetry, glass, locksmithing, signs, and the makers behind the finish.",
  },
  {
    id: "industrial",
    name: "Industrial and logistics",
    description:
      "Trucking, moving, warehousing, manufacturing, scrap, and commercial refrigeration.",
  },
  {
    id: "primary",
    name: "Primary industries",
    description:
      "Farming, ranching, logging, fishing, quarrying, and oil field services.",
  },
];

const slugs = new Set();
for (const seed of seeds) {
  if (slugs.has(seed.slug)) {
    throw new Error(`Duplicate slug: ${seed.slug}`);
  }
  slugs.add(seed.slug);
}

function esc(value) {
  return value.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function tradeObject(seed) {
  const pageTitle = marketingPageTitle(seed);
  const indexable =
    seed.indexable !== false && !NOINDEX_SLUGS.has(seed.slug);
  const description = `${pageTitle} for ${seed.name.toLowerCase()}. Show up for ${seed.jobs} when customers in your area are ready to hire.`;
  const summary = `${pageTitle} helps ${seed.name.toLowerCase()} get found ${seed.moment}. ${seed.blurb}`;

  return `  {
    slug: "${seed.slug}",
    name: "${esc(seed.name)}",
    singular: "${esc(seed.singular)}",
    article: "${seed.article}",
    category: "${seed.category}",
    featured: ${seed.featured ? "true" : "false"},
    indexable: ${indexable ? "true" : "false"},
    pageTitle: "${esc(pageTitle)}",
    headline: "${esc(pageTitle)}",
    description: "${esc(description)}",
    blurb: "${esc(seed.blurb)}",
    searchExample: "${esc(seed.searchExample)}",
    summary: "${esc(summary)}",
    pains: [
      {
        title: "${esc(seed.pains[0])}",
        body: "${esc(seed.painBodies[0])}",
      },
      {
        title: "${esc(seed.pains[1])}",
        body: "${esc(seed.painBodies[1])}",
      },
      {
        title: "${esc(seed.pains[2])}",
        body: "${esc(seed.painBodies[2])}",
      },
    ],
    outcomes: [
      {
        title: "${esc(seed.outcomes[0])}",
        body: "${esc(seed.outcomeBodies[0])}",
      },
      {
        title: "${esc(seed.outcomes[1])}",
        body: "${esc(seed.outcomeBodies[1])}",
      },
      {
        title: "${esc(seed.outcomes[2])}",
        body: "${esc(seed.outcomeBodies[2])}",
      },
    ],
  }`;
}

const header = `export type TradeCategoryId =
  | "construction"
  | "mechanical"
  | "automotive"
  | "cleaning"
  | "property"
  | "crafts"
  | "industrial"
  | "primary";

export type TradeCategory = {
  id: TradeCategoryId;
  name: string;
  description: string;
};

export type TradePage = {
  slug: string;
  name: string;
  singular: string;
  article: "a" | "an";
  category: TradeCategoryId;
  featured: boolean;
  /** False = robots noindex until the page has real long-form content. */
  indexable: boolean;
  /** Search-intent title used for <title>, H1, and intro (e.g. Plumber Marketing & Local SEO). */
  pageTitle: string;
  headline: string;
  description: string;
  blurb: string;
  searchExample: string;
  summary: string;
  pains: Array<{ title: string; body: string }>;
  outcomes: Array<{ title: string; body: string }>;
};

export const tradeCategories: TradeCategory[] = ${JSON.stringify(categories, null, 2).replace(/"([^"]+)":/g, "$1:")};

export const trades: TradePage[] = [
${seeds.map(tradeObject).join(",\n")}
];

export const featuredTrades = trades.filter((trade) => trade.featured);

export function getTradeBySlug(slug: string) {
  return trades.find((trade) => trade.slug === slug) ?? null;
}

export function getTradesByCategory(category: TradeCategoryId) {
  return trades.filter((trade) => trade.category === category);
}

export function getRelatedTrades(slug: string, limit = 6) {
  const current = getTradeBySlug(slug);
  if (!current) return featuredTrades.slice(0, limit);

  const sameCategory = trades.filter(
    (trade) => trade.category === current.category && trade.slug !== slug,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const extras = featuredTrades.filter(
    (trade) =>
      trade.slug !== slug &&
      !sameCategory.some((item) => item.slug === trade.slug),
  );
  return [...sameCategory, ...extras].slice(0, limit);
}

export function tradeHref(slug: string) {
  return \`/trades/\${slug}\`;
}
`;

const outPath = join(__dirname, "../lib/trades.ts");
writeFileSync(outPath, header);
console.log(`Wrote ${seeds.length} trades to ${outPath}`);
