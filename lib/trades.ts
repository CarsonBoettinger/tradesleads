export type TradeCategoryId =
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

export const tradeCategories: TradeCategory[] = [
  {
    id: "construction",
    name: "Construction and building",
    description: "From general contracting and framing to roofing, concrete, and outdoor builds."
  },
  {
    id: "mechanical",
    name: "Mechanical and electrical trades",
    description: "Plumbing, HVAC, electrical, welding, solar, and the shops that keep systems running."
  },
  {
    id: "automotive",
    name: "Automotive and heavy equipment",
    description: "Auto repair, body shops, towing, diesel, and mobile service for vehicles and iron."
  },
  {
    id: "cleaning",
    name: "Cleaning and exterior maintenance",
    description: "Pressure washing, soft washing, windows, gutters, and commercial exterior care."
  },
  {
    id: "property",
    name: "Property and outdoor services",
    description: "Landscaping, lawn care, trees, snow, pest, pools, and property maintenance."
  },
  {
    id: "crafts",
    name: "Skilled crafts",
    description: "Carpentry, cabinetry, glass, locksmithing, signs, and the makers behind the finish."
  },
  {
    id: "industrial",
    name: "Industrial and logistics",
    description: "Trucking, moving, warehousing, manufacturing, scrap, and commercial refrigeration."
  },
  {
    id: "primary",
    name: "Primary industries",
    description: "Farming, ranching, logging, fishing, quarrying, and oil field services."
  }
];

export const trades: TradePage[] = [
  {
    slug: "general-contractors",
    name: "General contractors",
    singular: "general contractor",
    article: "a",
    category: "construction",
    featured: true,
    indexable: true,
    pageTitle: "General Contractor Marketing & Local SEO",
    headline: "General Contractor Marketing & Local SEO",
    description: "General Contractor Marketing & Local SEO for general contractors. Show up for renovations, additions, and new builds when customers in your area are ready to hire.",
    blurb: "Projects that start when someone searches for a crew.",
    searchExample: "general contractor near me",
    summary: "General Contractor Marketing & Local SEO helps general contractors get found when a property owner is ready to hire a crew. Projects that start when someone searches for a crew.",
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
        body: "Owners pick the company that looks organized. Local crews lose work they could win.",
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
    slug: "framing",
    name: "Framing contractors",
    singular: "framing contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Framing Contractor Marketing & Local SEO",
    headline: "Framing Contractor Marketing & Local SEO",
    description: "Framing Contractor Marketing & Local SEO for framing contractors. Show up for residential framing, commercial framing, and structural builds when customers in your area are ready to hire.",
    blurb: "Walls, roofs, and the crews GCs call first.",
    searchExample: "framing contractor near me",
    summary: "Framing Contractor Marketing & Local SEO helps framing contractors get found when a builder needs a framing crew that shows up ready. Walls, roofs, and the crews GCs call first.",
    pains: [
      {
        title: "GCs hire who is findable",
        body: "General contractors search when a crew falls through. If you are not online, they call someone else.",
      },
      {
        title: "Specialty framing gets buried",
        body: "People search for specific framing work. A vague listing misses those calls.",
      },
      {
        title: "Proof of past builds is missing",
        body: "Photos and reviews of finished frames win the next bid more than a business card.",
      },
    ],
    outcomes: [
      {
        title: "Rank for framing work in your area",
        body: "Show up for residential framing, commercial framing, and structural work near you.",
      },
      {
        title: "A site builders can trust",
        body: "Clear services and contact paths so a GC can hire you the same day.",
      },
      {
        title: "Reviews after every frame",
        body: "Finished jobs turn into public proof for the next schedule.",
      },
    ],
  },
  {
    slug: "roofers",
    name: "Roofers",
    singular: "roofer",
    article: "a",
    category: "construction",
    featured: true,
    indexable: true,
    pageTitle: "Roofer Marketing & Local SEO",
    headline: "Roofer Marketing & Local SEO",
    description: "Roofer Marketing & Local SEO for roofers. Show up for inspections, repairs, and full replacements when customers in your area are ready to hire.",
    blurb: "Storm searches, inspections, and the jobs they turn into.",
    searchExample: "roofer in your town",
    summary: "Roofer Marketing & Local SEO helps roofers get found when a roof fails or storm season hits. Storm searches, inspections, and the jobs they turn into.",
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
    slug: "masonry",
    name: "Masonry contractors",
    singular: "masonry contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Masonry Contractor Marketing & Local SEO",
    headline: "Masonry Contractor Marketing & Local SEO",
    description: "Masonry Contractor Marketing & Local SEO for masonry contractors. Show up for brick, block, stone, and chimney work when customers in your area are ready to hire.",
    blurb: "Chimneys, walls, and the craft that lasts.",
    searchExample: "masonry contractor near me",
    summary: "Masonry Contractor Marketing & Local SEO helps masonry contractors get found when someone needs masonry that looks right and lasts. Chimneys, walls, and the craft that lasts.",
    pains: [
      {
        title: "Craft does not show up in search",
        body: "People search for masons when a wall fails or a chimney needs work. Invisible crews lose quiet seasons too.",
      },
      {
        title: "Repair jobs go to whoever answers",
        body: "Emergency brick and tuckpointing calls go to the first name on Google.",
      },
      {
        title: "Photos never leave the job site",
        body: "Finished stone and brick stays offline, so the next customer has nothing to judge.",
      },
    ],
    outcomes: [
      {
        title: "Rank for masonry in your town",
        body: "Show up for brick repair, stonework, chimneys, and new masonry builds.",
      },
      {
        title: "A site that shows the craft",
        body: "Clear services and project proof so homeowners and builders trust the hire.",
      },
      {
        title: "Reviews that win the next wall",
        body: "Finished jobs become public reviews while the work is still fresh.",
      },
    ],
  },
  {
    slug: "concrete-foundations",
    name: "Concrete and foundations",
    singular: "concrete contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Concrete Contractor Marketing & Local SEO",
    headline: "Concrete Contractor Marketing & Local SEO",
    description: "Concrete Contractor Marketing & Local SEO for concrete and foundations. Show up for driveways, slabs, patios, and foundation work when customers in your area are ready to hire.",
    blurb: "Driveways, slabs, and foundations that start every build.",
    searchExample: "concrete contractor near me",
    summary: "Concrete Contractor Marketing & Local SEO helps concrete and foundations get found when a pour or foundation repair cannot wait. Driveways, slabs, and foundations that start every build.",
    pains: [
      {
        title: "They search concrete, not your company name",
        body: "People type concrete driveway or foundation repair. If you only rank for your name, you miss the job.",
      },
      {
        title: "Foundation work needs trust fast",
        body: "Owners want a crew that looks established before anyone digs near the house.",
      },
      {
        title: "Bids die without a clear site",
        body: "A thin online presence makes a solid local crew look risky next to bigger names.",
      },
    ],
    outcomes: [
      {
        title: "Found for pours and foundations",
        body: "Rank for concrete driveways, foundations, patios, and flatwork in your area.",
      },
      {
        title: "A site that wins the bid",
        body: "Clear services, photos, and a phone number that stands out on mobile.",
      },
      {
        title: "Reviews after every pour",
        body: "Happy customers leave proof so the next pour starts with confidence.",
      },
    ],
  },
  {
    slug: "drywall",
    name: "Drywall contractors",
    singular: "drywall contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Drywall Contractor Marketing & Local SEO",
    headline: "Drywall Contractor Marketing & Local SEO",
    description: "Drywall Contractor Marketing & Local SEO for drywall contractors. Show up for hanging, taping, finishing, and repairs when customers in your area are ready to hire.",
    blurb: "Hang, tape, and finish work that makes rooms ready.",
    searchExample: "drywall contractor near me",
    summary: "Drywall Contractor Marketing & Local SEO helps drywall contractors get found when a remodel or repair needs walls done right. Hang, tape, and finish work that makes rooms ready.",
    pains: [
      {
        title: "Remodelers hire who they can find",
        body: "GCs and homeowners search when a crew falls behind. Findable drywall companies get the call.",
      },
      {
        title: "Repair searches skip vague listings",
        body: "People search drywall repair and water damage patch. One vague homepage misses them.",
      },
      {
        title: "Finish quality never shows online",
        body: "Smooth finishes live on job sites. Online, the next customer has no proof.",
      },
    ],
    outcomes: [
      {
        title: "Rank for hang and finish work",
        body: "Show up for drywall installation, repair, and finishing in your service area.",
      },
      {
        title: "A site remodelers can book from",
        body: "Clear offers and a simple contact path for homeowners and builders.",
      },
      {
        title: "Reviews that prove the finish",
        body: "Finished rooms turn into public proof for the next remodel.",
      },
    ],
  },
  {
    slug: "painters",
    name: "Painters",
    singular: "painter",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Painter Marketing & Local SEO",
    headline: "Painter Marketing & Local SEO",
    description: "Painter Marketing & Local SEO for painters. Show up for interior painting, exterior painting, and cabinet finishes when customers in your area are ready to hire.",
    blurb: "Interior, exterior, and the jobs that stack each season.",
    searchExample: "painter near me",
    summary: "Painter Marketing & Local SEO helps painters get found when a homeowner or property manager is ready to paint. Interior, exterior, and the jobs that stack each season.",
    pains: [
      {
        title: "Season opens and phones stay quiet",
        body: "Spring and summer fill fast. Crews that are not on Google watch routes go elsewhere.",
      },
      {
        title: "Interior and exterior are different searches",
        body: "People search house painter or interior painting. One generic page misses half the work.",
      },
      {
        title: "Before-and-after never makes it online",
        body: "Great finishes stay on the walls. The next customer has nothing to compare.",
      },
    ],
    outcomes: [
      {
        title: "Rank for the painting jobs you want",
        body: "Show up for interior, exterior, and specialty painting in your town.",
      },
      {
        title: "A site that books the season",
        body: "Clear offers, photos, and a phone number that is easy to tap.",
      },
      {
        title: "Reviews after every coat",
        body: "Finished jobs become reviews while the paint is still fresh.",
      },
    ],
  },
  {
    slug: "flooring-tile",
    name: "Flooring and tile",
    singular: "flooring contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Flooring Contractor Marketing & Local SEO",
    headline: "Flooring Contractor Marketing & Local SEO",
    description: "Flooring Contractor Marketing & Local SEO for flooring and tile. Show up for hardwood, tile, vinyl, and floor refinishing when customers in your area are ready to hire.",
    blurb: "Hardwood, tile, vinyl, and the installs that refresh a home.",
    searchExample: "flooring contractor near me",
    summary: "Flooring Contractor Marketing & Local SEO helps flooring and tile get found when a homeowner is ready to replace or refinish floors. Hardwood, tile, vinyl, and the installs that refresh a home.",
    pains: [
      {
        title: "They search the material, not flooring",
        body: "People type tile installation or hardwood flooring. If you only rank for flooring, you miss the call.",
      },
      {
        title: "Showrooms and big boxes crowd results",
        body: "National retailers fill the map. Local installers get buried without a strong listing.",
      },
      {
        title: "Install quality needs proof",
        body: "Owners want photos and reviews before anyone pulls up the old floor.",
      },
    ],
    outcomes: [
      {
        title: "Found for the floors you install",
        body: "Rank for tile, hardwood, vinyl, and refinishing in your service area.",
      },
      {
        title: "A site that wins the estimate",
        body: "Clear services and a simple path to request a quote.",
      },
      {
        title: "Reviews that sell the next room",
        body: "Finished floors turn into public proof for the next job.",
      },
    ],
  },
  {
    slug: "siding",
    name: "Siding contractors",
    singular: "siding contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Siding Contractor Marketing & Local SEO",
    headline: "Siding Contractor Marketing & Local SEO",
    description: "Siding Contractor Marketing & Local SEO for siding contractors. Show up for siding install, repair, and full replacements when customers in your area are ready to hire.",
    blurb: "Vinyl, fiber cement, and full exterior refreshes.",
    searchExample: "siding contractor near me",
    summary: "Siding Contractor Marketing & Local SEO helps siding contractors get found when curb appeal or weather damage forces a change. Vinyl, fiber cement, and full exterior refreshes.",
    pains: [
      {
        title: "Exterior searches spike after storms",
        body: "Wind and hail send people to Google. Invisible crews miss the rush.",
      },
      {
        title: "Material names win the SERP",
        body: "People search vinyl siding or fiber cement. A vague company page loses those clicks.",
      },
      {
        title: "Quotes need photos to stick",
        body: "Homeowners compare looks online before they ask for a price.",
      },
    ],
    outcomes: [
      {
        title: "Rank for siding install and repair",
        body: "Show up for siding replacement, repair, and exterior upgrades nearby.",
      },
      {
        title: "A site that sells the look",
        body: "Project photos and clear services make a local crew feel established.",
      },
      {
        title: "Reviews that close the estimate",
        body: "Finished exteriors become reviews that win the next block.",
      },
    ],
  },
  {
    slug: "insulation",
    name: "Insulation contractors",
    singular: "insulation contractor",
    article: "an",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Insulation Contractor Marketing & Local SEO",
    headline: "Insulation Contractor Marketing & Local SEO",
    description: "Insulation Contractor Marketing & Local SEO for insulation contractors. Show up for attic, wall, and spray foam insulation when customers in your area are ready to hire.",
    blurb: "Attics, walls, and the upgrades that cut energy bills.",
    searchExample: "insulation contractor near me",
    summary: "Insulation Contractor Marketing & Local SEO helps insulation contractors get found when energy bills rise or a remodel opens the walls. Attics, walls, and the upgrades that cut energy bills.",
    pains: [
      {
        title: "People search the problem, not insulation",
        body: "Homeowners type cold attic or energy efficiency. If you only rank for your company name, you miss them.",
      },
      {
        title: "Retrofit jobs need trust",
        body: "Opening walls feels invasive. Reviews and a clear site make the hire feel safe.",
      },
      {
        title: "Spray foam and blown-in are different searches",
        body: "Each method gets its own search. One vague page leaves money on the table.",
      },
    ],
    outcomes: [
      {
        title: "Found for the insulation you install",
        body: "Rank for attic insulation, spray foam, and retrofit work in your town.",
      },
      {
        title: "A site that explains the upgrade",
        body: "Clear offers and education that turn a search into a booked assessment.",
      },
      {
        title: "Reviews that warm up the next lead",
        body: "Finished jobs leave public proof for energy-conscious homeowners.",
      },
    ],
  },
  {
    slug: "demolition",
    name: "Demolition contractors",
    singular: "demolition contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Demolition Contractor Marketing & Local SEO",
    headline: "Demolition Contractor Marketing & Local SEO",
    description: "Demolition Contractor Marketing & Local SEO for demolition contractors. Show up for interior demo, structural demolition, and site clearing when customers in your area are ready to hire.",
    blurb: "Interior tear-outs, structures, and clean site prep.",
    searchExample: "demolition contractor near me",
    summary: "Demolition Contractor Marketing & Local SEO helps demolition contractors get found when a remodel or rebuild needs a clean start. Interior tear-outs, structures, and clean site prep.",
    pains: [
      {
        title: "Urgent tear-outs go to whoever answers",
        body: "When a project is waiting, people call the first demolition company they find.",
      },
      {
        title: "Permits and disposal raise trust questions",
        body: "Owners want a crew that looks licensed and organized before walls come down.",
      },
      {
        title: "GCs hire findable demo crews",
        body: "Builders search under pressure. Weak listings lose the schedule.",
      },
    ],
    outcomes: [
      {
        title: "Rank for demo work in your area",
        body: "Show up for interior demolition, structure removal, and site clearing.",
      },
      {
        title: "A site that looks job-ready",
        body: "Clear services and contact paths for homeowners and general contractors.",
      },
      {
        title: "Reviews that clear the next site",
        body: "Finished tear-outs turn into proof for the next bid.",
      },
    ],
  },
  {
    slug: "excavation",
    name: "Excavation contractors",
    singular: "excavation contractor",
    article: "an",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Excavation Contractor Marketing & Local SEO",
    headline: "Excavation Contractor Marketing & Local SEO",
    description: "Excavation Contractor Marketing & Local SEO for excavation contractors. Show up for site prep, grading, trenching, and foundations digs when customers in your area are ready to hire.",
    blurb: "Site prep, grading, and the dirt work builds depend on.",
    searchExample: "excavation contractor near me",
    summary: "Excavation Contractor Marketing & Local SEO helps excavation contractors get found when a build needs dirt moved before anything else. Site prep, grading, and the dirt work builds depend on.",
    pains: [
      {
        title: "Builders hire who can start fast",
        body: "Schedules slip when excavation is hard to find. The visible crew wins the day.",
      },
      {
        title: "Equipment lists never make it online",
        body: "Owners and GCs want to see that you have the machines for the job.",
      },
      {
        title: "Specialty digs get separate searches",
        body: "People search trenching, grading, or foundation dig. One vague page misses them.",
      },
    ],
    outcomes: [
      {
        title: "Found for excavation near you",
        body: "Rank for excavation, grading, and site prep in your service area.",
      },
      {
        title: "A site that shows you are ready",
        body: "Clear services and a phone number builders can tap from the field.",
      },
      {
        title: "Reviews that dig up the next job",
        body: "Finished sites become reviews that win the next pour schedule.",
      },
    ],
  },
  {
    slug: "paving",
    name: "Paving contractors",
    singular: "paving contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Paving Contractor Marketing & Local SEO",
    headline: "Paving Contractor Marketing & Local SEO",
    description: "Paving Contractor Marketing & Local SEO for paving contractors. Show up for driveway paving, parking lots, and asphalt repair when customers in your area are ready to hire.",
    blurb: "Driveways, parking lots, and the surface work that lasts.",
    searchExample: "paving contractor near me",
    summary: "Paving Contractor Marketing & Local SEO helps paving contractors get found when cracked asphalt finally forces a call. Driveways, parking lots, and the surface work that lasts.",
    pains: [
      {
        title: "Seasonal paving fills without you",
        body: "Warm months book out. Invisible paving companies watch the season pass.",
      },
      {
        title: "Repair and overlay are different searches",
        body: "People search driveway paving or asphalt repair. One homepage cannot cover both unless it is clear.",
      },
      {
        title: "Commercial lots want proven crews",
        body: "Property managers hire who looks established online, not just who has a truck.",
      },
    ],
    outcomes: [
      {
        title: "Rank for paving in your town",
        body: "Show up for driveway paving, overlays, and parking lot work nearby.",
      },
      {
        title: "A site built for home and commercial",
        body: "Clear offers for residential and commercial so the right jobs find you.",
      },
      {
        title: "Reviews that pave the way",
        body: "Finished surfaces turn into public proof for the next season.",
      },
    ],
  },
  {
    slug: "fencing",
    name: "Fence contractors",
    singular: "fence contractor",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Fence Contractor Marketing & Local SEO",
    headline: "Fence Contractor Marketing & Local SEO",
    description: "Fence Contractor Marketing & Local SEO for fence contractors. Show up for wood, vinyl, chain link, and fence repair when customers in your area are ready to hire.",
    blurb: "Wood, vinyl, chain link, and the installs that define a yard.",
    searchExample: "fence company near me",
    summary: "Fence Contractor Marketing & Local SEO helps fence contractors get found when a homeowner wants privacy, pets contained, or a refresh. Wood, vinyl, chain link, and the installs that define a yard.",
    pains: [
      {
        title: "Fence searches spike every spring",
        body: "When the weather turns, fence searches jump. Weak listings miss the rush.",
      },
      {
        title: "Material type decides who gets the click",
        body: "People search vinyl fence or wood fence install. Generic pages lose those jobs.",
      },
      {
        title: "Quotes need photos to convert",
        body: "Homeowners compare styles online before they ask for a price.",
      },
    ],
    outcomes: [
      {
        title: "Found for the fences you build",
        body: "Rank for fence installation and repair in your service area.",
      },
      {
        title: "A site that shows the styles",
        body: "Clear materials, photos, and a simple path to book an estimate.",
      },
      {
        title: "Reviews that win the next yard",
        body: "Finished fences become reviews neighbours trust.",
      },
    ],
  },
  {
    slug: "deck-building",
    name: "Deck builders",
    singular: "deck builder",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Deck Builder Marketing & Local SEO",
    headline: "Deck Builder Marketing & Local SEO",
    description: "Deck Builder Marketing & Local SEO for deck builders. Show up for new decks, rebuilds, and outdoor living structures when customers in your area are ready to hire.",
    blurb: "Decks, porches, and outdoor spaces people actually use.",
    searchExample: "deck builder near me",
    summary: "Deck Builder Marketing & Local SEO helps deck builders get found when a homeowner is ready to expand outdoors. Decks, porches, and outdoor spaces people actually use.",
    pains: [
      {
        title: "Outdoor projects start with photos online",
        body: "People browse deck ideas then search locally. If you are not there, the dream goes elsewhere.",
      },
      {
        title: "Builders and homeowners search differently",
        body: "Some want a GC, some want a deck specialist. Clear pages catch both.",
      },
      {
        title: "Permits and materials raise trust questions",
        body: "A weak site makes a skilled crew look risky for a big outdoor spend.",
      },
    ],
    outcomes: [
      {
        title: "Rank for decks in your town",
        body: "Show up for deck building, rebuilds, and outdoor structures nearby.",
      },
      {
        title: "A site that sells outdoor living",
        body: "Project galleries and clear contact paths turn browsing into booked estimates.",
      },
      {
        title: "Reviews that book the next build",
        body: "Finished decks leave proof for the next block of homeowners.",
      },
    ],
  },
  {
    slug: "paver-installation",
    name: "Paver installation",
    singular: "paver installer",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Paver Installer Marketing & Local SEO",
    headline: "Paver Installer Marketing & Local SEO",
    description: "Paver Installer Marketing & Local SEO for paver installation. Show up for paver patios, walkways, and driveway accents when customers in your area are ready to hire.",
    blurb: "Patios, walkways, and hardscape that upgrades the yard.",
    searchExample: "paver installation near me",
    summary: "Paver Installer Marketing & Local SEO helps paver installation get found when curb appeal and outdoor dining move up the list. Patios, walkways, and hardscape that upgrades the yard.",
    pains: [
      {
        title: "Hardscape searches skip vague landscapers",
        body: "People search paver patio specifically. A general outdoor page often loses the click.",
      },
      {
        title: "Design proof wins the job",
        body: "Homeowners want to see patterns and finished yards before they book.",
      },
      {
        title: "Seasonal demand punishes weak listings",
        body: "Spring and summer fill calendars. Invisible installers miss the window.",
      },
    ],
    outcomes: [
      {
        title: "Rank for paver work nearby",
        body: "Show up for paver patios, walkways, and hardscape installs in your town.",
      },
      {
        title: "A site that shows the finish",
        body: "Clear photos and services make a local crew feel like the safe choice.",
      },
      {
        title: "Reviews that hardscape the next lead",
        body: "Finished installs become reviews that win the next patio.",
      },
    ],
  },
  {
    slug: "sanding-sealing",
    name: "Sanding and sealing",
    singular: "sanding and sealing company",
    article: "a",
    category: "construction",
    featured: false,
    indexable: true,
    pageTitle: "Sanding and Sealing Company Marketing & Local SEO",
    headline: "Sanding and Sealing Company Marketing & Local SEO",
    description: "Sanding and Sealing Company Marketing & Local SEO for sanding and sealing. Show up for floor sanding, sealing, and hardwood refinishing when customers in your area are ready to hire.",
    blurb: "Hardwood refinishing and protective finishes that restore rooms.",
    searchExample: "floor sanding and sealing near me",
    summary: "Sanding and Sealing Company Marketing & Local SEO helps sanding and sealing get found when worn floors need a restore instead of a replace. Hardwood refinishing and protective finishes that restore rooms.",
    pains: [
      {
        title: "Refinish searches are specific",
        body: "People type floor sanding or hardwood refinishing. Generic flooring pages often miss them.",
      },
      {
        title: "Dust and disruption need trust",
        body: "Owners want a crew that looks careful before machines enter the house.",
      },
      {
        title: "Before-and-after sells the job",
        body: "Without photo proof, quotes feel expensive for work they cannot picture.",
      },
    ],
    outcomes: [
      {
        title: "Found for sanding and sealing",
        body: "Rank for floor sanding, sealing, and hardwood refinishing nearby.",
      },
      {
        title: "A site that proves the restore",
        body: "Clear process pages and photos turn hesitation into a booked date.",
      },
      {
        title: "Reviews that shine for the next room",
        body: "Finished floors become public proof for the next refinish.",
      },
    ],
  },
  {
    slug: "plumbers",
    name: "Plumbers",
    singular: "plumber",
    article: "a",
    category: "mechanical",
    featured: true,
    indexable: true,
    pageTitle: "Plumber Marketing & Local SEO",
    headline: "Plumber Marketing & Local SEO",
    description: "Plumber Marketing & Local SEO for plumbers. Show up for leaks, drains, water heaters, and emergency plumbing when customers in your area are ready to hire.",
    blurb: "Emergency calls, and the repairs that follow them.",
    searchExample: "plumber near me",
    summary: "Plumber Marketing & Local SEO helps plumbers get found when a pipe bursts or a drain will not clear. Emergency calls, and the repairs that follow them.",
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
    slug: "hvac",
    name: "HVAC",
    singular: "HVAC company",
    article: "an",
    category: "mechanical",
    featured: true,
    indexable: true,
    pageTitle: "HVAC Marketing & Local SEO",
    headline: "HVAC Marketing & Local SEO",
    description: "HVAC Marketing & Local SEO for hvac. Show up for AC repair, furnace service, and seasonal tune-ups when customers in your area are ready to hire.",
    blurb: "Breakdowns, tune-ups, and the turn of the season.",
    searchExample: "AC repair near me",
    summary: "HVAC Marketing & Local SEO helps hvac get found when the system fails or the season turns. Breakdowns, tune-ups, and the turn of the season.",
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
    slug: "electricians",
    name: "Electricians",
    singular: "electrician",
    article: "an",
    category: "mechanical",
    featured: true,
    indexable: true,
    pageTitle: "Electrician Marketing & Local SEO",
    headline: "Electrician Marketing & Local SEO",
    description: "Electrician Marketing & Local SEO for electricians. Show up for panel upgrades, rewires, and electrical repair when customers in your area are ready to hire.",
    blurb: "Panels, rewires, and the calls that come in between.",
    searchExample: "electrician near me",
    summary: "Electrician Marketing & Local SEO helps electricians get found when someone needs licensed electrical work nearby. Panels, rewires, and the calls that come in between.",
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
    slug: "welding-fabrication",
    name: "Welding and fabrication",
    singular: "welding and fabrication shop",
    article: "a",
    category: "mechanical",
    featured: false,
    indexable: true,
    pageTitle: "Welding and Fabrication Shop Marketing & Local SEO",
    headline: "Welding and Fabrication Shop Marketing & Local SEO",
    description: "Welding and Fabrication Shop Marketing & Local SEO for welding and fabrication. Show up for welding repair, custom fabrication, and structural metalwork when customers in your area are ready to hire.",
    blurb: "Repairs, custom fab, and the shops local industry relies on.",
    searchExample: "welding shop near me",
    summary: "Welding and Fabrication Shop Marketing & Local SEO helps welding and fabrication get found when a farm, shop, or builder needs metal done right. Repairs, custom fab, and the shops local industry relies on.",
    pains: [
      {
        title: "Urgent repairs go to the first shop",
        body: "Broken equipment cannot wait. The findable welding shop gets the after-hours call.",
      },
      {
        title: "Custom fab needs proof of capability",
        body: "Buyers want to see past builds before they trust a custom job.",
      },
      {
        title: "Industrial buyers search differently",
        body: "Farms, GCs, and plants use different search terms. One vague page misses half of them.",
      },
    ],
    outcomes: [
      {
        title: "Rank for welding near you",
        body: "Show up for welding repair, fabrication, and mobile welding in your area.",
      },
      {
        title: "A site that shows the shop",
        body: "Clear capabilities and contact paths for contractors and equipment owners.",
      },
      {
        title: "Reviews that spark the next job",
        body: "Finished fab work becomes proof for the next custom build.",
      },
    ],
  },
  {
    slug: "machine-shop",
    name: "Machine shops",
    singular: "machine shop",
    article: "a",
    category: "mechanical",
    featured: false,
    indexable: true,
    pageTitle: "Machine Shop Marketing & Local SEO",
    headline: "Machine Shop Marketing & Local SEO",
    description: "Machine Shop Marketing & Local SEO for machine shops. Show up for CNC, lathe work, and precision machining when customers in your area are ready to hire.",
    blurb: "Precision parts, repairs, and the shops local industry dials.",
    searchExample: "machine shop near me",
    summary: "Machine Shop Marketing & Local SEO helps machine shops get found when a broken part stops a line or a prototype needs cutting. Precision parts, repairs, and the shops local industry dials.",
    pains: [
      {
        title: "Buyers search capability, not brand",
        body: "Engineers and maintenance leads Google tolerances and processes. Invisible shops never make the RFQ list.",
      },
      {
        title: "Lead times need a clear first contact",
        body: "A weak site makes even a strong shop look slow to deal with.",
      },
      {
        title: "Specialty machining gets buried",
        body: "People search CNC machining or prototype parts. Generic pages miss those jobs.",
      },
    ],
    outcomes: [
      {
        title: "Found for the machining you do",
        body: "Rank for machine shop and CNC work in your region.",
      },
      {
        title: "A site that wins the RFQ",
        body: "Clear capabilities, materials, and a simple path to request a quote.",
      },
      {
        title: "Reviews and proof that close work",
        body: "Past jobs and reviews make the next buyer feel safe sending drawings.",
      },
    ],
  },
  {
    slug: "sheet-metal",
    name: "Sheet metal",
    singular: "sheet metal contractor",
    article: "a",
    category: "mechanical",
    featured: false,
    indexable: true,
    pageTitle: "Sheet Metal Contractor Marketing & Local SEO",
    headline: "Sheet Metal Contractor Marketing & Local SEO",
    description: "Sheet Metal Contractor Marketing & Local SEO for sheet metal. Show up for ductwork, flashing, and custom sheet metal when customers in your area are ready to hire.",
    blurb: "HVAC duct, flashing, and custom sheet work for builds.",
    searchExample: "sheet metal contractor near me",
    summary: "Sheet Metal Contractor Marketing & Local SEO helps sheet metal get found when a build or HVAC job needs metal that fits. HVAC duct, flashing, and custom sheet work for builds.",
    pains: [
      {
        title: "GCs hire who answers fast",
        body: "Schedules slip when sheet metal is hard to find. Visible shops get the call.",
      },
      {
        title: "Duct and architectural metal differ in search",
        body: "People search duct fabrication or custom flashing separately. Vague pages miss both.",
      },
      {
        title: "Shop capability never shows online",
        body: "Buyers want to see that you can produce what the drawing needs.",
      },
    ],
    outcomes: [
      {
        title: "Rank for sheet metal nearby",
        body: "Show up for sheet metal, ductwork, and custom fabrication in your area.",
      },
      {
        title: "A site builders can book from",
        body: "Clear services and contact paths for HVAC and construction partners.",
      },
      {
        title: "Reviews that form the next job",
        body: "Finished installs become proof for the next bid package.",
      },
    ],
  },
  {
    slug: "elevator-escalator",
    name: "Elevator and escalator service",
    singular: "elevator service company",
    article: "an",
    category: "mechanical",
    featured: false,
    indexable: true,
    pageTitle: "Elevator Service Company Marketing & Local SEO",
    headline: "Elevator Service Company Marketing & Local SEO",
    description: "Elevator Service Company Marketing & Local SEO for elevator and escalator service. Show up for elevator repair, maintenance, and escalator service when customers in your area are ready to hire.",
    blurb: "Maintenance, repair, and the uptime property managers need.",
    searchExample: "elevator service near me",
    summary: "Elevator Service Company Marketing & Local SEO helps elevator and escalator service get found when a building needs reliable vertical transport service. Maintenance, repair, and the uptime property managers need.",
    pains: [
      {
        title: "Property managers hire who looks established",
        body: "Building owners search under pressure. Thin online presence loses to national brands.",
      },
      {
        title: "Emergency callbacks go to the first number",
        body: "When a car is down, they dial whoever Google puts first.",
      },
      {
        title: "Compliance talk needs a clear site",
        body: "Managers want proof you handle inspections and maintenance without drama.",
      },
    ],
    outcomes: [
      {
        title: "Found for elevator service nearby",
        body: "Rank for elevator repair, maintenance, and escalator service in your market.",
      },
      {
        title: "A site that wins the contract",
        body: "Clear service offers and contact paths for property and facility managers.",
      },
      {
        title: "Reviews that lift the next building",
        body: "Reliable work turns into reviews that open the next building.",
      },
    ],
  },
  {
    slug: "appliance-repair",
    name: "Appliance repair",
    singular: "appliance repair technician",
    article: "an",
    category: "mechanical",
    featured: false,
    indexable: true,
    pageTitle: "Appliance Repair Technician Marketing & Local SEO",
    headline: "Appliance Repair Technician Marketing & Local SEO",
    description: "Appliance Repair Technician Marketing & Local SEO for appliance repair. Show up for washer, fridge, oven, and appliance repair when customers in your area are ready to hire.",
    blurb: "Washers, fridges, and same-week repairs people need.",
    searchExample: "appliance repair near me",
    summary: "Appliance Repair Technician Marketing & Local SEO helps appliance repair get found when a household appliance fails mid-week. Washers, fridges, and same-week repairs people need.",
    pains: [
      {
        title: "They search the appliance, not repair",
        body: "People type fridge repair or washer not spinning. Brand-only pages miss those searches.",
      },
      {
        title: "Same-day expectation is the sale",
        body: "Whoever looks available online gets the booking before you even hear about it.",
      },
      {
        title: "Trust matters inside the home",
        body: "Reviews and a clear company story decide who gets invited in.",
      },
    ],
    outcomes: [
      {
        title: "Rank for the appliances you fix",
        body: "Show up for fridge, washer, dryer, and oven repair in your town.",
      },
      {
        title: "A site built to book fast",
        body: "Clear booking paths and phone numbers that stand out on mobile.",
      },
      {
        title: "Reviews after every repair",
        body: "Finished repairs become reviews while relief is still fresh.",
      },
    ],
  },
  {
    slug: "solar-installation",
    name: "Solar installation",
    singular: "solar installer",
    article: "a",
    category: "mechanical",
    featured: false,
    indexable: true,
    pageTitle: "Solar Installer Marketing & Local SEO",
    headline: "Solar Installer Marketing & Local SEO",
    description: "Solar Installer Marketing & Local SEO for solar installation. Show up for home solar, commercial solar, and battery installs when customers in your area are ready to hire.",
    blurb: "Residential and commercial installs that start with a search.",
    searchExample: "solar installation near me",
    summary: "Solar Installer Marketing & Local SEO helps solar installation get found when a property owner is comparing local solar installers. Residential and commercial installs that start with a search.",
    pains: [
      {
        title: "National brands crowd the map",
        body: "Big solar companies dominate ads and maps. Local installers need a strong organic presence.",
      },
      {
        title: "Education and trust close the sale",
        body: "Homeowners research for weeks. A weak site ends the conversation early.",
      },
      {
        title: "Local proof beats generic claims",
        body: "People want local reviews and project photos, not stock images.",
      },
    ],
    outcomes: [
      {
        title: "Rank for solar in your area",
        body: "Show up for solar installation and battery storage near you.",
      },
      {
        title: "A site that builds confidence",
        body: "Clear process pages and local proof turn research into booked consults.",
      },
      {
        title: "Reviews that power the next install",
        body: "Finished installs become public reviews that win the next roof.",
      },
    ],
  },
  {
    slug: "generator-installation",
    name: "Generator installation",
    singular: "generator installer",
    article: "a",
    category: "mechanical",
    featured: false,
    indexable: true,
    pageTitle: "Generator Installer Marketing & Local SEO",
    headline: "Generator Installer Marketing & Local SEO",
    description: "Generator Installer Marketing & Local SEO for generator installation. Show up for standby generators, transfer switches, and installs when customers in your area are ready to hire.",
    blurb: "Standby generators and the installs storms make urgent.",
    searchExample: "generator installation near me",
    summary: "Generator Installer Marketing & Local SEO helps generator installation get found when outages push a homeowner to finally install backup power. Standby generators and the installs storms make urgent.",
    pains: [
      {
        title: "Storm season creates a scramble",
        body: "After outages, generator searches spike. Invisible installers miss the rush.",
      },
      {
        title: "Permits and transfer switches need clarity",
        body: "Owners want a crew that explains the install before they commit.",
      },
      {
        title: "Big box brands look safer online",
        body: "National names fill results. Local electricians lose work they could win.",
      },
    ],
    outcomes: [
      {
        title: "Found for generator installs",
        body: "Rank for generator installation and standby power in your town.",
      },
      {
        title: "A site that explains the job",
        body: "Clear services and contact paths for homeowners ready to protect the house.",
      },
      {
        title: "Reviews that backup the next sale",
        body: "Finished installs leave reviews that sell through the next storm season.",
      },
    ],
  },
  {
    slug: "auto-repair",
    name: "Auto repair",
    singular: "auto repair shop",
    article: "an",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Auto Repair Shop Marketing & Local SEO",
    headline: "Auto Repair Shop Marketing & Local SEO",
    description: "Auto Repair Shop Marketing & Local SEO for auto repair. Show up for brakes, diagnostics, and general auto repair when customers in your area are ready to hire.",
    blurb: "Maintenance, diagnostics, and the shops drivers trust.",
    searchExample: "auto repair near me",
    summary: "Auto Repair Shop Marketing & Local SEO helps auto repair get found when a dashboard light or strange noise forces a search. Maintenance, diagnostics, and the shops drivers trust.",
    pains: [
      {
        title: "They pick the first trusted shop",
        body: "Drivers search under stress. The shop that looks ready online gets the car.",
      },
      {
        title: "Service menus never match the search",
        body: "People search brake repair or check engine light. A vague homepage misses them.",
      },
      {
        title: "Reviews decide who gets the keys",
        body: "Without recent reviews, even a skilled shop feels like a risk.",
      },
    ],
    outcomes: [
      {
        title: "Rank for auto repair nearby",
        body: "Show up for brakes, diagnostics, and general repair in your town.",
      },
      {
        title: "A site that books the bay",
        body: "Clear services and easy contact so drivers can book before work.",
      },
      {
        title: "Reviews after every service",
        body: "Finished jobs turn into reviews that fill the next week.",
      },
    ],
  },
  {
    slug: "body-shop",
    name: "Body shops",
    singular: "body shop",
    article: "a",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Body Shop Marketing & Local SEO",
    headline: "Body Shop Marketing & Local SEO",
    description: "Body Shop Marketing & Local SEO for body shops. Show up for collision repair, paint, and dent removal when customers in your area are ready to hire.",
    blurb: "Collision repair, paint, and insurance work that starts online.",
    searchExample: "auto body shop near me",
    summary: "Body Shop Marketing & Local SEO helps body shops get found when a driver needs collision or cosmetic body work. Collision repair, paint, and insurance work that starts online.",
    pains: [
      {
        title: "Insurance and Direct Repair steer jobs",
        body: "Drivers still search locally. A weak listing loses cash and insurance work.",
      },
      {
        title: "Photo proof wins the estimate",
        body: "People want to see finished paint and panel work before they commit.",
      },
      {
        title: "Paint quality needs public trust",
        body: "Without reviews, even a great booth looks like a gamble.",
      },
    ],
    outcomes: [
      {
        title: "Found for body work nearby",
        body: "Rank for auto body, collision repair, and paint in your area.",
      },
      {
        title: "A site that wins the estimate",
        body: "Clear process pages and galleries that make booking feel safe.",
      },
      {
        title: "Reviews that close the claim",
        body: "Finished repairs become reviews that bring the next car in.",
      },
    ],
  },
  {
    slug: "tire-shop",
    name: "Tire shops",
    singular: "tire shop",
    article: "a",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Tire Shop Marketing & Local SEO",
    headline: "Tire Shop Marketing & Local SEO",
    description: "Tire Shop Marketing & Local SEO for tire shops. Show up for new tires, repairs, mounts, and alignments when customers in your area are ready to hire.",
    blurb: "Mounts, balances, and the seasonal rush that fills the lot.",
    searchExample: "tire shop near me",
    summary: "Tire Shop Marketing & Local SEO helps tire shops get found when weather turns or a tire fails on the road. Mounts, balances, and the seasonal rush that fills the lot.",
    pains: [
      {
        title: "Season spikes punish weak listings",
        body: "Winter and summer tire rushes fill calendars. Invisible shops miss the wave.",
      },
      {
        title: "Price shoppers still need trust",
        body: "People compare options fast. Reviews and clear hours decide the stop.",
      },
      {
        title: "Mobile and shop searches compete",
        body: "Drivers search tire repair and new tires differently. Cover both clearly.",
      },
    ],
    outcomes: [
      {
        title: "Rank for tires in your town",
        body: "Show up for tire shops, mounts, and repairs nearby.",
      },
      {
        title: "A site that gets them in today",
        body: "Clear hours, services, and a phone number that stands out on mobile.",
      },
      {
        title: "Reviews that roll into the next visit",
        body: "Happy drivers leave proof that fills the next seasonal rush.",
      },
    ],
  },
  {
    slug: "towing",
    name: "Towing",
    singular: "towing company",
    article: "a",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Towing Company Marketing & Local SEO",
    headline: "Towing Company Marketing & Local SEO",
    description: "Towing Company Marketing & Local SEO for towing. Show up for light duty towing, roadside help, and recovery when customers in your area are ready to hire.",
    blurb: "Roadside recovery and the calls that cannot wait.",
    searchExample: "towing near me",
    summary: "Towing Company Marketing & Local SEO helps towing get found when a driver needs a tow right now. Roadside recovery and the calls that cannot wait.",
    pains: [
      {
        title: "They call the first number that loads",
        body: "Breakdowns are urgent. If your listing is slow or unclear, the next company gets the hook.",
      },
      {
        title: "Coverage area must be obvious",
        body: "Drivers need to know you serve their road before they dial.",
      },
      {
        title: "Trust matters on the shoulder",
        body: "Reviews and a clear company name beat a random truck with no proof.",
      },
    ],
    outcomes: [
      {
        title: "Found for towing nearby",
        body: "Rank for towing and roadside assistance in your service area.",
      },
      {
        title: "A site built for the emergency call",
        body: "Tap-to-call prominence and clear coverage so stuck drivers choose you.",
      },
      {
        title: "Reviews that win the next dispatch",
        body: "Finished recoveries become reviews that keep the phone ringing.",
      },
    ],
  },
  {
    slug: "diesel-truck-repair",
    name: "Diesel and truck repair",
    singular: "diesel repair shop",
    article: "a",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Diesel Repair Shop Marketing & Local SEO",
    headline: "Diesel Repair Shop Marketing & Local SEO",
    description: "Diesel Repair Shop Marketing & Local SEO for diesel and truck repair. Show up for diesel diagnostics, truck repair, and fleet service when customers in your area are ready to hire.",
    blurb: "Heavy trucks, diesels, and downtime that cannot stretch.",
    searchExample: "diesel repair near me",
    summary: "Diesel Repair Shop Marketing & Local SEO helps diesel and truck repair get found when a truck is down and freight cannot wait. Heavy trucks, diesels, and downtime that cannot stretch.",
    pains: [
      {
        title: "Downtime makes buyers impatient",
        body: "Owner-operators Google under pressure. The shop that looks available wins.",
      },
      {
        title: "Fleet managers hire who looks ready",
        body: "Fleets want a vendor that looks organized online before they send units.",
      },
      {
        title: "Specialty diesel searches are specific",
        body: "People search DEF issues, injectors, or semi repair. Vague pages miss them.",
      },
    ],
    outcomes: [
      {
        title: "Rank for diesel repair nearby",
        body: "Show up for diesel and commercial truck repair in your area.",
      },
      {
        title: "A site fleets can trust",
        body: "Clear capabilities and contact paths for drivers and fleet managers.",
      },
      {
        title: "Reviews that keep the bays full",
        body: "Finished repairs become proof that reduces the next buyer’s risk.",
      },
    ],
  },
  {
    slug: "heavy-equipment-repair",
    name: "Heavy equipment repair",
    singular: "heavy equipment repair company",
    article: "a",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Heavy Equipment Repair Company Marketing & Local SEO",
    headline: "Heavy Equipment Repair Company Marketing & Local SEO",
    description: "Heavy Equipment Repair Company Marketing & Local SEO for heavy equipment repair. Show up for excavator, loader, and heavy equipment repair when customers in your area are ready to hire.",
    blurb: "Field service and shop repair for the machines that earn.",
    searchExample: "heavy equipment repair near me",
    summary: "Heavy Equipment Repair Company Marketing & Local SEO helps heavy equipment repair get found when a machine stops a job site or a farm day. Field service and shop repair for the machines that earn.",
    pains: [
      {
        title: "Field service needs to be findable fast",
        body: "When a machine dies, someone Googles from the cab. Invisible techs lose the callout.",
      },
      {
        title: "OEMs and dealers crowd search",
        body: "Dealer pages dominate. Independent shops need strong local presence to compete.",
      },
      {
        title: "Capability proof wins the callout",
        body: "Buyers want to know you can handle their iron before they wait on you.",
      },
    ],
    outcomes: [
      {
        title: "Found for equipment repair",
        body: "Rank for heavy equipment and mobile machinery repair near you.",
      },
      {
        title: "A site that wins the callout",
        body: "Clear field-service offers and a phone number that stands out.",
      },
      {
        title: "Reviews that keep iron moving",
        body: "Finished repairs leave reviews contractors remember next breakdown.",
      },
    ],
  },
  {
    slug: "auto-detailing",
    name: "Auto detailing",
    singular: "auto detailer",
    article: "an",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Auto Detailer Marketing & Local SEO",
    headline: "Auto Detailer Marketing & Local SEO",
    description: "Auto Detailer Marketing & Local SEO for auto detailing. Show up for full details, ceramic coats, and interior cleans when customers in your area are ready to hire.",
    blurb: "Interior, exterior, and mobile details that start on Google.",
    searchExample: "auto detailing near me",
    summary: "Auto Detailer Marketing & Local SEO helps auto detailing get found when a driver wants the car looking new again. Interior, exterior, and mobile details that start on Google.",
    pains: [
      {
        title: "Photos are the whole sale",
        body: "People judge detailing by galleries. A weak site loses to whoever looks sharper.",
      },
      {
        title: "Mobile vs shop searches split demand",
        body: "Some search mobile detailing, others want a shop. Cover the way you work.",
      },
      {
        title: "Packages need to be clear online",
        body: "Vague pricing and packages create no-shows and price shoppers.",
      },
    ],
    outcomes: [
      {
        title: "Rank for detailing nearby",
        body: "Show up for auto detailing and ceramic coating in your town.",
      },
      {
        title: "A site that sells the finish",
        body: "Clear packages and photos that turn scrolling into booked slots.",
      },
      {
        title: "Reviews that shine for the next booking",
        body: "Finished details become reviews that fill the calendar.",
      },
    ],
  },
  {
    slug: "windshield-replacement",
    name: "Windshield replacement",
    singular: "windshield replacement company",
    article: "a",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Windshield Replacement Company Marketing & Local SEO",
    headline: "Windshield Replacement Company Marketing & Local SEO",
    description: "Windshield Replacement Company Marketing & Local SEO for windshield replacement. Show up for windshield repair, replacement, and ADAS recalibration when customers in your area are ready to hire.",
    blurb: "Chips, cracks, and insurance glass work that starts with a search.",
    searchExample: "windshield replacement near me",
    summary: "Windshield Replacement Company Marketing & Local SEO helps windshield replacement get found when a crack spreads or insurance sends a driver looking. Chips, cracks, and insurance glass work that starts with a search.",
    pains: [
      {
        title: "Insurance networks steer volume",
        body: "Drivers still search locally for faster service. A weak listing loses cash jobs.",
      },
      {
        title: "Same-week availability wins",
        body: "Whoever looks available online gets the booking first.",
      },
      {
        title: "ADAS and OEM glass need clarity",
        body: "Modern cars need clear messaging about recalibration and quality glass.",
      },
    ],
    outcomes: [
      {
        title: "Found for auto glass nearby",
        body: "Rank for windshield repair and replacement in your area.",
      },
      {
        title: "A site built to book fast",
        body: "Tap-to-call and clear scheduling for drivers who need glass now.",
      },
      {
        title: "Reviews that clear the next windshield",
        body: "Finished jobs become reviews that beat the national chains on trust.",
      },
    ],
  },
  {
    slug: "mobile-mechanic",
    name: "Mobile mechanics",
    singular: "mobile mechanic",
    article: "a",
    category: "automotive",
    featured: false,
    indexable: true,
    pageTitle: "Mobile Mechanic Marketing & Local SEO",
    headline: "Mobile Mechanic Marketing & Local SEO",
    description: "Mobile Mechanic Marketing & Local SEO for mobile mechanics. Show up for mobile diagnostics, battery service, and driveway repairs when customers in your area are ready to hire.",
    blurb: "Driveway repairs and on-site diagnostics that skip the tow.",
    searchExample: "mobile mechanic near me",
    summary: "Mobile Mechanic Marketing & Local SEO helps mobile mechanics get found when a car will not move and a tow feels like overkill. Driveway repairs and on-site diagnostics that skip the tow.",
    pains: [
      {
        title: "Mobile intent is specific",
        body: "People type mobile mechanic on purpose. Generic auto repair pages often lose the click.",
      },
      {
        title: "Trust is harder without a shop front",
        body: "Coming to a driveway requires reviews and a clear company identity.",
      },
      {
        title: "Service radius must be obvious",
        body: "Drivers need to know you cover their street before they wait on you.",
      },
    ],
    outcomes: [
      {
        title: "Rank for mobile repair nearby",
        body: "Show up for mobile mechanic and on-site auto repair in your area.",
      },
      {
        title: "A site that books the visit",
        body: "Clear services, coverage, and booking paths that feel safe.",
      },
      {
        title: "Reviews that roll to the next driveway",
        body: "Finished visits become reviews that keep the van busy.",
      },
    ],
  },
  {
    slug: "pressure-washing",
    name: "Pressure washing",
    singular: "pressure washing company",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Pressure Washing Company Marketing & Local SEO",
    headline: "Pressure Washing Company Marketing & Local SEO",
    description: "Pressure Washing Company Marketing & Local SEO for pressure washing. Show up for driveways, patios, walkways, decks, and fences when customers in your area are ready to hire.",
    blurb: "Driveways, decks, fences, and the washes that restore curb appeal.",
    searchExample: "pressure washing near me",
    summary: "Pressure Washing Company Marketing & Local SEO helps pressure washing get found when curb appeal or spring cleaning finally forces a call. Driveways, decks, fences, and the washes that restore curb appeal.",
    pains: [
      {
        title: "Season opens and routes fill elsewhere",
        body: "Spring searches spike. Invisible wash companies watch neighbours book someone else.",
      },
      {
        title: "Surface-specific searches win",
        body: "People search driveway cleaning or deck washing. One vague page misses them.",
      },
      {
        title: "Before-and-after is the sale",
        body: "Without photo proof, quotes feel expensive for work they cannot picture.",
      },
    ],
    outcomes: [
      {
        title: "Found for the surfaces you wash",
        body: "Rank for pressure washing on driveways, patios, decks, and fences nearby.",
      },
      {
        title: "A site that books the route",
        body: "Clear offers and galleries that turn a search into a booked wash.",
      },
      {
        title: "Reviews that clean up the next lead",
        body: "Finished jobs become reviews that fill the next neighbourhood.",
      },
    ],
  },
  {
    slug: "soft-washing",
    name: "Soft washing",
    singular: "soft washing company",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Soft Washing Company Marketing & Local SEO",
    headline: "Soft Washing Company Marketing & Local SEO",
    description: "Soft Washing Company Marketing & Local SEO for soft washing. Show up for house siding, roofs, and moss removal when customers in your area are ready to hire.",
    blurb: "House washes, roofs, and moss removal without the damage.",
    searchExample: "soft wash near me",
    summary: "Soft Washing Company Marketing & Local SEO helps soft washing get found when algae and moss make a house look older than it is. House washes, roofs, and moss removal without the damage.",
    pains: [
      {
        title: "Homeowners fear pressure damage",
        body: "People worry high pressure will hurt siding. Clear soft-wash messaging wins trust.",
      },
      {
        title: "Roof and siding are different searches",
        body: "Roof moss and house washing get separate searches. Cover both if you offer them.",
      },
      {
        title: "Soft wash education closes the sale",
        body: "A weak site makes a careful method look like any cheap wash.",
      },
    ],
    outcomes: [
      {
        title: "Rank for soft washing nearby",
        body: "Show up for soft washing, house washing, and moss removal in your town.",
      },
      {
        title: "A site that explains the method",
        body: "Clear education and photos that make homeowners feel safe booking.",
      },
      {
        title: "Reviews that grow the next route",
        body: "Finished washes become reviews that sell the next block.",
      },
    ],
  },
  {
    slug: "commercial-washing",
    name: "Commercial washing",
    singular: "commercial washing company",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Commercial Washing Company Marketing & Local SEO",
    headline: "Commercial Washing Company Marketing & Local SEO",
    description: "Commercial Washing Company Marketing & Local SEO for commercial washing. Show up for parking lots, storefronts, dumpster pads, and fleets when customers in your area are ready to hire.",
    blurb: "Parking lots, dumpster pads, storefronts, and fleet washing.",
    searchExample: "commercial pressure washing near me",
    summary: "Commercial Washing Company Marketing & Local SEO helps commercial washing get found when a property or fleet manager needs exterior cleaning on schedule. Parking lots, dumpster pads, storefronts, and fleet washing.",
    pains: [
      {
        title: "Managers hire who looks commercial-ready",
        body: "Property managers search under time pressure. Thin consumer sites lose to crews that look commercial.",
      },
      {
        title: "Recurring contracts need proof",
        body: "Repeat work goes to vendors with reviews and a clear process.",
      },
      {
        title: "Night and fleet work must be clear",
        body: "If fleet or after-hours washing is hidden, those jobs never call.",
      },
    ],
    outcomes: [
      {
        title: "Found for commercial wash work",
        body: "Rank for commercial washing, lot cleaning, and fleet washing nearby.",
      },
      {
        title: "A site built for managers",
        body: "Clear commercial offers and contact paths for property and fleet managers.",
      },
      {
        title: "Reviews that renew the contract",
        body: "Reliable routes turn into reviews that open the next account.",
      },
    ],
  },
  {
    slug: "window-cleaning",
    name: "Window cleaning",
    singular: "window cleaner",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Window Cleaner Marketing & Local SEO",
    headline: "Window Cleaner Marketing & Local SEO",
    description: "Window Cleaner Marketing & Local SEO for window cleaning. Show up for residential, storefront, high-rise, and post-construction glass when customers in your area are ready to hire.",
    blurb: "Homes, storefronts, high-rise, and post-construction glass.",
    searchExample: "window cleaning near me",
    summary: "Window Cleaner Marketing & Local SEO helps window cleaning get found when streaked glass finally becomes the priority. Homes, storefronts, high-rise, and post-construction glass.",
    pains: [
      {
        title: "Residential and commercial split search",
        body: "Homeowners and storefront managers search differently. One vague page misses half the work.",
      },
      {
        title: "Post-construction needs specialty proof",
        body: "Builders need a crew that looks ready for new construction glass.",
      },
      {
        title: "Recurring routes need reviews",
        body: "Without reviews, even a careful cleaner loses recurring routes.",
      },
    ],
    outcomes: [
      {
        title: "Rank for window cleaning nearby",
        body: "Show up for residential, commercial, and post-construction window cleaning.",
      },
      {
        title: "A site that covers how you work",
        body: "Clear service pages that match how customers describe the job.",
      },
      {
        title: "Reviews that keep the glass booked",
        body: "Finished cleans become reviews that fill the next route.",
      },
    ],
  },
  {
    slug: "solar-panel-cleaning",
    name: "Solar panel cleaning",
    singular: "solar panel cleaning company",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Solar Panel Cleaning Company Marketing & Local SEO",
    headline: "Solar Panel Cleaning Company Marketing & Local SEO",
    description: "Solar Panel Cleaning Company Marketing & Local SEO for solar panel cleaning. Show up for residential and commercial solar panel cleaning when customers in your area are ready to hire.",
    blurb: "Panel washes that restore output for homes and commercial arrays.",
    searchExample: "solar panel cleaning near me",
    summary: "Solar Panel Cleaning Company Marketing & Local SEO helps solar panel cleaning get found when output drops and dirt is the easy fix. Panel washes that restore output for homes and commercial arrays.",
    pains: [
      {
        title: "Solar owners search a niche term",
        body: "People type solar panel cleaning specifically. General wash pages often lose the click.",
      },
      {
        title: "Roof safety needs trust",
        body: "Homeowners want a crew that looks careful on the roof.",
      },
      {
        title: "Output proof helps the sale",
        body: "Clear before-and-after and process pages make the service feel worth it.",
      },
    ],
    outcomes: [
      {
        title: "Rank for panel cleaning nearby",
        body: "Show up for solar panel cleaning in your service area.",
      },
      {
        title: "A site that feels roof-safe",
        body: "Clear method and safety messaging that turns research into booked washes.",
      },
      {
        title: "Reviews that power the next array",
        body: "Finished cleans become reviews for the next solar neighbourhood.",
      },
    ],
  },
  {
    slug: "gutter-cleaning",
    name: "Gutter cleaning",
    singular: "gutter cleaner",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Gutter Cleaner Marketing & Local SEO",
    headline: "Gutter Cleaner Marketing & Local SEO",
    description: "Gutter Cleaner Marketing & Local SEO for gutter cleaning. Show up for gutter cleaning, downspout clearing, and maintenance when customers in your area are ready to hire.",
    blurb: "Clogged gutters, downspouts, and the seasonal rush that follows storms.",
    searchExample: "gutter cleaning near me",
    summary: "Gutter Cleaner Marketing & Local SEO helps gutter cleaning get found when overflow stains or storm season forces a cleanout. Clogged gutters, downspouts, and the seasonal rush that follows storms.",
    pains: [
      {
        title: "Seasonal spikes fill calendars fast",
        body: "Fall and spring searches jump. Invisible cleaners miss the rush.",
      },
      {
        title: "Trust matters on the roof edge",
        body: "Homeowners want reviews before anyone climbs near the eaves.",
      },
      {
        title: "Add-on guards need clear pages",
        body: "People searching gutter cleaning may also want guards. Make both easy to find.",
      },
    ],
    outcomes: [
      {
        title: "Found for gutter cleaning nearby",
        body: "Rank for gutter cleaning in your town.",
      },
      {
        title: "A site that books the season",
        body: "Clear seasonal offers and tap-to-call for homeowners ready now.",
      },
      {
        title: "Reviews that clear the next block",
        body: "Finished cleanouts become reviews that fill the next storm week.",
      },
    ],
  },
  {
    slug: "gutter-guard-installation",
    name: "Gutter guard installation",
    singular: "gutter guard installer",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Gutter Guard Installer Marketing & Local SEO",
    headline: "Gutter Guard Installer Marketing & Local SEO",
    description: "Gutter Guard Installer Marketing & Local SEO for gutter guard installation. Show up for gutter guard install and leaf protection systems when customers in your area are ready to hire.",
    blurb: "Guards and covers that turn one-time cleans into lasting upgrades.",
    searchExample: "gutter guards near me",
    summary: "Gutter Guard Installer Marketing & Local SEO helps gutter guard installation get found when repeated clogging finally pushes a lasting fix. Guards and covers that turn one-time cleans into lasting upgrades.",
    pains: [
      {
        title: "National guard brands crowd ads",
        body: "Big brands dominate paid search. Local installers need strong organic pages.",
      },
      {
        title: "Local install proof wins trust",
        body: "Homeowners want to see real installs, not brochure claims.",
      },
      {
        title: "Cleaning customers never see the upsell online",
        body: "If guards are buried on a cleaning site, the upgrade sale never starts.",
      },
    ],
    outcomes: [
      {
        title: "Rank for gutter guards nearby",
        body: "Show up for gutter guard installation in your service area.",
      },
      {
        title: "A site that sells the upgrade",
        body: "Clear product and install pages that turn frustration into a booked consult.",
      },
      {
        title: "Reviews that protect the next roof",
        body: "Finished installs become reviews that win the next leaf season.",
      },
    ],
  },
  {
    slug: "graffiti-removal",
    name: "Graffiti removal",
    singular: "graffiti removal company",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Graffiti Removal Company Marketing & Local SEO",
    headline: "Graffiti Removal Company Marketing & Local SEO",
    description: "Graffiti Removal Company Marketing & Local SEO for graffiti removal. Show up for graffiti removal on brick, metal, and painted surfaces when customers in your area are ready to hire.",
    blurb: "Fast removal for property managers, cities, and storefronts.",
    searchExample: "graffiti removal near me",
    summary: "Graffiti Removal Company Marketing & Local SEO helps graffiti removal get found when a tagged wall needs a fast, professional clean. Fast removal for property managers, cities, and storefronts.",
    pains: [
      {
        title: "Speed is the whole sale",
        body: "Managers want it gone now. The findable crew gets the dispatch.",
      },
      {
        title: "Surface-safe methods need trust",
        body: "Wrong methods damage surfaces. Clear process messaging wins the job.",
      },
      {
        title: "Commercial buyers search under pressure",
        body: "Cities and property teams hire who looks established online.",
      },
    ],
    outcomes: [
      {
        title: "Found for graffiti removal",
        body: "Rank for graffiti removal in your market.",
      },
      {
        title: "A site built for urgent commercial work",
        body: "Clear commercial contact paths and response messaging.",
      },
      {
        title: "Reviews that clear the next wall",
        body: "Finished removals become proof for the next property account.",
      },
    ],
  },
  {
    slug: "awning-sign-cleaning",
    name: "Awning and sign cleaning",
    singular: "awning and sign cleaning company",
    article: "an",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Awning and Sign Cleaning Company Marketing & Local SEO",
    headline: "Awning and Sign Cleaning Company Marketing & Local SEO",
    description: "Awning and Sign Cleaning Company Marketing & Local SEO for awning and sign cleaning. Show up for awning cleaning, sign washing, and storefront refresh when customers in your area are ready to hire.",
    blurb: "Awnings, signs, and the exterior brand assets customers notice.",
    searchExample: "awning cleaning near me",
    summary: "Awning and Sign Cleaning Company Marketing & Local SEO helps awning and sign cleaning get found when a faded awning or dirty sign starts costing walk-ins. Awnings, signs, and the exterior brand assets customers notice.",
    pains: [
      {
        title: "Niche search intent is easy to miss",
        body: "People search awning cleaning specifically. General pressure-wash pages often lose.",
      },
      {
        title: "Retail managers want recurring proof",
        body: "Store owners hire vendors who look reliable for repeat exterior care.",
      },
      {
        title: "Photos of clean brand assets sell",
        body: "Before-and-after of signs and awnings makes the value obvious.",
      },
    ],
    outcomes: [
      {
        title: "Rank for awning and sign cleaning",
        body: "Show up for awning and sign cleaning in your town.",
      },
      {
        title: "A site retailers can book from",
        body: "Clear commercial offers and galleries that win storefront accounts.",
      },
      {
        title: "Reviews that refresh the next block",
        body: "Finished cleans become reviews that open the next retail strip.",
      },
    ],
  },
  {
    slug: "holiday-light-installation",
    name: "Holiday light installation",
    singular: "holiday light installer",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Holiday Light Installer Marketing & Local SEO",
    headline: "Holiday Light Installer Marketing & Local SEO",
    description: "Holiday Light Installer Marketing & Local SEO for holiday light installation. Show up for residential and commercial holiday light installation when customers in your area are ready to hire.",
    blurb: "Professional installs that balance spring and summer wash work.",
    searchExample: "holiday light installation near me",
    summary: "Holiday Light Installer Marketing & Local SEO helps holiday light installation get found when a homeowner or business wants lights without the ladder. Professional installs that balance spring and summer wash work.",
    pains: [
      {
        title: "Bookings start early each fall",
        body: "People plan displays weeks ahead. Invisible installers miss the season.",
      },
      {
        title: "Design photos win the job",
        body: "Customers choose crews with galleries that look finished and safe.",
      },
      {
        title: "Take-down service needs to be clear",
        body: "If removal and storage are unclear, the sale stalls.",
      },
    ],
    outcomes: [
      {
        title: "Found for holiday lights nearby",
        body: "Rank for holiday light installation in your service area.",
      },
      {
        title: "A site that sells the display",
        body: "Clear packages, photos, and booking paths for homes and businesses.",
      },
      {
        title: "Reviews that light up next year",
        body: "Finished displays become reviews that refill next winter.",
      },
    ],
  },
  {
    slug: "commercial-industrial-cleaning",
    name: "Commercial and industrial cleaning",
    singular: "commercial cleaning company",
    article: "a",
    category: "cleaning",
    featured: false,
    indexable: true,
    pageTitle: "Commercial Cleaning Company Marketing & Local SEO",
    headline: "Commercial Cleaning Company Marketing & Local SEO",
    description: "Commercial Cleaning Company Marketing & Local SEO for commercial and industrial cleaning. Show up for office, industrial, and facility cleaning when customers in your area are ready to hire.",
    blurb: "Offices, industrial spaces, and the contracts that renew.",
    searchExample: "commercial cleaning near me",
    summary: "Commercial Cleaning Company Marketing & Local SEO helps commercial and industrial cleaning get found when a facility manager needs dependable cleaning coverage. Offices, industrial spaces, and the contracts that renew.",
    pains: [
      {
        title: "RFPs go to companies that look established",
        body: "Managers Google vendors under deadline. A weak site never makes the shortlist.",
      },
      {
        title: "Niche facility needs get buried",
        body: "Industrial, medical, and office searches differ. Vague pages miss contracts.",
      },
      {
        title: "Trust and consistency win renewals",
        body: "Without reviews and clear process, even good crews look risky.",
      },
    ],
    outcomes: [
      {
        title: "Found for commercial cleaning",
        body: "Rank for commercial and industrial cleaning in your market.",
      },
      {
        title: "A site built for facility managers",
        body: "Clear service lines and contact paths for managers ready to hire.",
      },
      {
        title: "Reviews that renew the contract",
        body: "Reliable work turns into reviews that open the next building.",
      },
    ],
  },
  {
    slug: "landscapers",
    name: "Landscapers",
    singular: "landscaper",
    article: "a",
    category: "property",
    featured: true,
    indexable: true,
    pageTitle: "Landscaper Marketing & Local SEO",
    headline: "Landscaper Marketing & Local SEO",
    description: "Landscaper Marketing & Local SEO for landscapers. Show up for landscaping, cleanups, and outdoor projects when customers in your area are ready to hire.",
    blurb: "Yards, seasons, and the customers who come back.",
    searchExample: "landscaper near me",
    summary: "Landscaper Marketing & Local SEO helps landscapers get found when neighbours need outdoor work done right. Yards, seasons, and the customers who come back.",
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
  {
    slug: "lawn-care",
    name: "Lawn care",
    singular: "lawn care company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Lawn Care Company Marketing & Local SEO",
    headline: "Lawn Care Company Marketing & Local SEO",
    description: "Lawn Care Company Marketing & Local SEO for lawn care. Show up for mowing, fertilization, and lawn maintenance when customers in your area are ready to hire.",
    blurb: "Mowing, fertilization, and the recurring yards that pay.",
    searchExample: "lawn care near me",
    summary: "Lawn Care Company Marketing & Local SEO helps lawn care get found when a homeowner wants the yard handled every week. Mowing, fertilization, and the recurring yards that pay.",
    pains: [
      {
        title: "Recurring routes go to whoever is findable",
        body: "Spring searches decide who owns the block. Invisible companies miss the season.",
      },
      {
        title: "Service menus need to be clear",
        body: "People want mowing, fert, and weed control spelled out before they call.",
      },
      {
        title: "Neighbourhood proof wins the street",
        body: "Reviews from nearby homes beat a vague promise every time.",
      },
    ],
    outcomes: [
      {
        title: "Rank for lawn care nearby",
        body: "Show up for lawn care and yard maintenance in your town.",
      },
      {
        title: "A site that books the route",
        body: "Clear packages and easy booking for homeowners ready to hand off the yard.",
      },
      {
        title: "Reviews that grow the next street",
        body: "Finished seasons become reviews that fill the next neighbourhood.",
      },
    ],
  },
  {
    slug: "tree-service",
    name: "Tree service",
    singular: "tree service company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Tree Service Company Marketing & Local SEO",
    headline: "Tree Service Company Marketing & Local SEO",
    description: "Tree Service Company Marketing & Local SEO for tree service. Show up for tree trimming, removal, and stump grinding when customers in your area are ready to hire.",
    blurb: "Trimming, removal, and storm work that starts with a search.",
    searchExample: "tree service near me",
    summary: "Tree Service Company Marketing & Local SEO helps tree service get found when a tree becomes a risk or a storm leaves damage. Trimming, removal, and storm work that starts with a search.",
    pains: [
      {
        title: "Storm work is a race",
        body: "After wind events, people dial the first tree service that looks ready.",
      },
      {
        title: "Removal and trimming are different searches",
        body: "Homeowners search tree removal and tree trimming separately. Cover both.",
      },
      {
        title: "Insurance and safety need trust",
        body: "A weak site makes even a certified crew look risky near the house.",
      },
    ],
    outcomes: [
      {
        title: "Found for tree work nearby",
        body: "Rank for tree trimming, removal, and storm cleanup in your area.",
      },
      {
        title: "A site that wins the estimate",
        body: "Clear services and safety messaging that turn urgency into a booked crew.",
      },
      {
        title: "Reviews that clear the next canopy",
        body: "Finished jobs become reviews that win the next block.",
      },
    ],
  },
  {
    slug: "snow-removal",
    name: "Snow removal",
    singular: "snow removal company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Snow Removal Company Marketing & Local SEO",
    headline: "Snow Removal Company Marketing & Local SEO",
    description: "Snow Removal Company Marketing & Local SEO for snow removal. Show up for residential snow removal and commercial lot clearing when customers in your area are ready to hire.",
    blurb: "Driveways, lots, and contracts that book before winter.",
    searchExample: "snow removal near me",
    summary: "Snow Removal Company Marketing & Local SEO helps snow removal get found when property owners lock in winter coverage. Driveways, lots, and contracts that book before winter.",
    pains: [
      {
        title: "Contracts close before the snow",
        body: "Smart buyers hire in fall. Invisible plow companies miss the contracts.",
      },
      {
        title: "Commercial and residential split demand",
        body: "Homeowners and property managers search differently. Cover both clearly.",
      },
      {
        title: "Reliability proof wins the season",
        body: "Reviews about showing up after storms beat a cheap quote.",
      },
    ],
    outcomes: [
      {
        title: "Found for snow removal nearby",
        body: "Rank for snow removal and lot clearing in your service area.",
      },
      {
        title: "A site that books before winter",
        body: "Clear seasonal offers for homes and commercial properties.",
      },
      {
        title: "Reviews that plow the next season",
        body: "Reliable winters become reviews that refill next year’s list.",
      },
    ],
  },
  {
    slug: "pest-control",
    name: "Pest control",
    singular: "pest control company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Pest Control Company Marketing & Local SEO",
    headline: "Pest Control Company Marketing & Local SEO",
    description: "Pest Control Company Marketing & Local SEO for pest control. Show up for residential pest control, rodents, and recurring treatments when customers in your area are ready to hire.",
    blurb: "Ants, rodents, and the treatments people search in a hurry.",
    searchExample: "pest control near me",
    summary: "Pest Control Company Marketing & Local SEO helps pest control get found when pests show up and homeowners want them gone now. Ants, rodents, and the treatments people search in a hurry.",
    pains: [
      {
        title: "They search the pest, not pest control",
        body: "People type ant control or mouse exterminator. Brand-only pages miss those jobs.",
      },
      {
        title: "Trust decides who enters the home",
        body: "Reviews and a clear company story matter before anyone sprays inside.",
      },
      {
        title: "Recurring plans need clear offers",
        body: "If maintenance plans are hidden, you stay stuck in one-off emergency work.",
      },
    ],
    outcomes: [
      {
        title: "Rank for the pests you treat",
        body: "Show up for pest control and exterminator searches in your town.",
      },
      {
        title: "A site that books fast",
        body: "Clear services and tap-to-call for homeowners who need help now.",
      },
      {
        title: "Reviews that keep the route full",
        body: "Finished treatments become reviews that win the next neighbourhood.",
      },
    ],
  },
  {
    slug: "pool-service",
    name: "Pool service",
    singular: "pool service company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Pool Service Company Marketing & Local SEO",
    headline: "Pool Service Company Marketing & Local SEO",
    description: "Pool Service Company Marketing & Local SEO for pool service. Show up for pool cleaning, openings, closings, and repairs when customers in your area are ready to hire.",
    blurb: "Cleaning, chemicals, and openings that keep water ready.",
    searchExample: "pool service near me",
    summary: "Pool Service Company Marketing & Local SEO helps pool service get found when a pool owner wants clear water without doing it themselves. Cleaning, chemicals, and openings that keep water ready.",
    pains: [
      {
        title: "Seasonal demand books early",
        body: "Owners hire before swim season. Invisible companies miss the routes.",
      },
      {
        title: "Repair and weekly service differ in search",
        body: "People search pool cleaning and pool repair separately. Cover both.",
      },
      {
        title: "Green pool emergencies go to whoever answers",
        body: "When water turns, they dial the first service that looks available.",
      },
    ],
    outcomes: [
      {
        title: "Found for pool service nearby",
        body: "Rank for pool cleaning and pool service in your area.",
      },
      {
        title: "A site that books the season",
        body: "Clear weekly and repair offers with an easy path to book.",
      },
      {
        title: "Reviews that keep the water clear",
        body: "Happy pool owners leave reviews that fill the next street.",
      },
    ],
  },
  {
    slug: "septic-service",
    name: "Septic service",
    singular: "septic service company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Septic Service Company Marketing & Local SEO",
    headline: "Septic Service Company Marketing & Local SEO",
    description: "Septic Service Company Marketing & Local SEO for septic service. Show up for septic pumping, inspections, and system repair when customers in your area are ready to hire.",
    blurb: "Pumping, inspections, and repairs rural properties depend on.",
    searchExample: "septic service near me",
    summary: "Septic Service Company Marketing & Local SEO helps septic service get found when a system is due for service or starting to fail. Pumping, inspections, and repairs rural properties depend on.",
    pains: [
      {
        title: "Emergency backups punish weak listings",
        body: "When a system backs up, people call the first septic company Google shows.",
      },
      {
        title: "Maintenance reminders never find you",
        body: "Routine pump jobs go to crews that are easy to find and book.",
      },
      {
        title: "Trust matters for underground work",
        body: "Owners want reviews before anyone opens the tank.",
      },
    ],
    outcomes: [
      {
        title: "Rank for septic service nearby",
        body: "Show up for septic pumping, inspection, and repair in your area.",
      },
      {
        title: "A site that books pump-outs",
        body: "Clear services and contact paths for homeowners who need help now.",
      },
      {
        title: "Reviews that clear the next tank",
        body: "Finished jobs become reviews that win the next rural route.",
      },
    ],
  },
  {
    slug: "junk-removal",
    name: "Junk removal",
    singular: "junk removal company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Junk Removal Company Marketing & Local SEO",
    headline: "Junk Removal Company Marketing & Local SEO",
    description: "Junk Removal Company Marketing & Local SEO for junk removal. Show up for home cleanouts, furniture haul-away, and debris removal when customers in your area are ready to hire.",
    blurb: "Cleanouts, hauling, and same-week removals people search for.",
    searchExample: "junk removal near me",
    summary: "Junk Removal Company Marketing & Local SEO helps junk removal get found when a garage, basement, or rental needs a fast clear-out. Cleanouts, hauling, and same-week removals people search for.",
    pains: [
      {
        title: "Same-week availability wins",
        body: "People want it gone this week. The findable crew gets the booking.",
      },
      {
        title: "Pricing clarity reduces no-calls",
        body: "Vague quotes create tire-kickers. Clear offers convert better.",
      },
      {
        title: "Estate and rental cleanouts need trust",
        body: "Sensitive cleanouts need reviews and a professional-looking company.",
      },
    ],
    outcomes: [
      {
        title: "Found for junk removal nearby",
        body: "Rank for junk removal and cleanouts in your town.",
      },
      {
        title: "A site that books the haul",
        body: "Clear services and easy booking for homeowners and property managers.",
      },
      {
        title: "Reviews that clear the next pile",
        body: "Finished hauls become reviews that keep the trucks busy.",
      },
    ],
  },
  {
    slug: "dumpster-rental",
    name: "Dumpster rental",
    singular: "dumpster rental company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Dumpster Rental Company Marketing & Local SEO",
    headline: "Dumpster Rental Company Marketing & Local SEO",
    description: "Dumpster Rental Company Marketing & Local SEO for dumpster rental. Show up for residential and construction dumpster rental when customers in your area are ready to hire.",
    blurb: "Roll-offs for remodels, cleanouts, and job sites.",
    searchExample: "dumpster rental near me",
    summary: "Dumpster Rental Company Marketing & Local SEO helps dumpster rental get found when a project needs a bin before debris piles up. Roll-offs for remodels, cleanouts, and job sites.",
    pains: [
      {
        title: "Size and delivery questions kill bookings",
        body: "People bounce when sizes and pricing are confusing online.",
      },
      {
        title: "Contractors hire who is easy to reach",
        body: "GCs and homeowners book the company that answers and looks ready.",
      },
      {
        title: "Local delivery radius must be clear",
        body: "If service area is unclear, the call goes to someone closer on the map.",
      },
    ],
    outcomes: [
      {
        title: "Rank for dumpster rental nearby",
        body: "Show up for dumpster rental in your service area.",
      },
      {
        title: "A site that books the drop",
        body: "Clear sizes, delivery info, and a simple path to reserve a bin.",
      },
      {
        title: "Reviews that roll to the next job",
        body: "Finished rentals become reviews that win the next remodel.",
      },
    ],
  },
  {
    slug: "property-maintenance",
    name: "Property maintenance",
    singular: "property maintenance company",
    article: "a",
    category: "property",
    featured: false,
    indexable: true,
    pageTitle: "Property Maintenance Company Marketing & Local SEO",
    headline: "Property Maintenance Company Marketing & Local SEO",
    description: "Property Maintenance Company Marketing & Local SEO for property maintenance. Show up for handyman repairs, turnovers, and facility upkeep when customers in your area are ready to hire.",
    blurb: "Repairs, turnovers, and the odd jobs managers need handled.",
    searchExample: "property maintenance near me",
    summary: "Property Maintenance Company Marketing & Local SEO helps property maintenance get found when a landlord or manager needs reliable maintenance coverage. Repairs, turnovers, and the odd jobs managers need handled.",
    pains: [
      {
        title: "Managers hire who looks dependable",
        body: "Property managers search under pressure. Thin sites lose to crews that look organized.",
      },
      {
        title: "One-off jobs never become contracts",
        body: "Without a clear offer and reviews, you stay stuck in random calls.",
      },
      {
        title: "Service range must be obvious",
        body: "People need to know what you handle before they send the work order.",
      },
    ],
    outcomes: [
      {
        title: "Found for property maintenance",
        body: "Rank for property maintenance and handyman work in your area.",
      },
      {
        title: "A site built for managers",
        body: "Clear commercial and residential offers with easy contact paths.",
      },
      {
        title: "Reviews that renew the account",
        body: "Reliable work turns into reviews that open the next building.",
      },
    ],
  },
  {
    slug: "carpentry",
    name: "Carpentry",
    singular: "carpenter",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: true,
    pageTitle: "Carpenter Marketing & Local SEO",
    headline: "Carpenter Marketing & Local SEO",
    description: "Carpenter Marketing & Local SEO for carpentry. Show up for finish carpentry, custom builds, and repairs when customers in your area are ready to hire.",
    blurb: "Trim, framing finish, and custom woodwork people search for.",
    searchExample: "carpenter near me",
    summary: "Carpenter Marketing & Local SEO helps carpentry get found when a homeowner or builder needs woodwork done right. Trim, framing finish, and custom woodwork people search for.",
    pains: [
      {
        title: "Craft gets buried under GCs online",
        body: "People searching carpenter often want a specialist, not a full remodel firm.",
      },
      {
        title: "Specialty carpentry needs its own pages",
        body: "Trim, custom built-ins, and repairs are different searches. Cover what you do.",
      },
      {
        title: "Portfolio proof wins the hire",
        body: "Without photos, skilled hands look like every other listing.",
      },
    ],
    outcomes: [
      {
        title: "Rank for carpentry nearby",
        body: "Show up for carpenter and finish carpentry searches in your town.",
      },
      {
        title: "A site that shows the craft",
        body: "Clear services and project proof that make booking feel safe.",
      },
      {
        title: "Reviews that build the next job",
        body: "Finished work becomes reviews that win the next custom build.",
      },
    ],
  },
  {
    slug: "cabinetry",
    name: "Cabinetry",
    singular: "cabinet maker",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: true,
    pageTitle: "Cabinet Maker Marketing & Local SEO",
    headline: "Cabinet Maker Marketing & Local SEO",
    description: "Cabinet Maker Marketing & Local SEO for cabinetry. Show up for custom cabinets, built-ins, and cabinet refinishing when customers in your area are ready to hire.",
    blurb: "Custom cabinets, built-ins, and the shops remodelers call.",
    searchExample: "cabinet maker near me",
    summary: "Cabinet Maker Marketing & Local SEO helps cabinetry get found when a kitchen or office needs storage built to fit. Custom cabinets, built-ins, and the shops remodelers call.",
    pains: [
      {
        title: "Big box and national brands crowd results",
        body: "Homeowners compare local makers to chains. A weak site loses before the consult.",
      },
      {
        title: "Design photos are the sale",
        body: "People choose cabinets with their eyes. Galleries matter more than slogans.",
      },
      {
        title: "Remodelers hire findable shops",
        body: "GCs search when a shop falls through. Visibility wins the schedule.",
      },
    ],
    outcomes: [
      {
        title: "Found for cabinetry nearby",
        body: "Rank for custom cabinets and cabinet makers in your area.",
      },
      {
        title: "A site that sells the shop",
        body: "Clear process and portfolio pages that turn browsing into booked consults.",
      },
      {
        title: "Reviews that fill the next kitchen",
        body: "Finished kitchens become reviews that win the next remodel.",
      },
    ],
  },
  {
    slug: "furniture-making",
    name: "Furniture making",
    singular: "furniture maker",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: false,
    pageTitle: "Furniture Maker Marketing & Local SEO",
    headline: "Furniture Maker Marketing & Local SEO",
    description: "Furniture Maker Marketing & Local SEO for furniture making. Show up for custom furniture, commissions, and repairs when customers in your area are ready to hire.",
    blurb: "Custom pieces and commissions that start with a local search.",
    searchExample: "custom furniture maker near me",
    summary: "Furniture Maker Marketing & Local SEO helps furniture making get found when someone wants a piece built to their space. Custom pieces and commissions that start with a local search.",
    pains: [
      {
        title: "Custom buyers research hard",
        body: "People compare makers for weeks. A thin site ends the conversation early.",
      },
      {
        title: "Style proof has to be online",
        body: "Without a portfolio, even excellent craft looks unproven.",
      },
      {
        title: "Local maker intent is specific",
        body: "Searches for custom furniture maker are deliberate. Match that intent.",
      },
    ],
    outcomes: [
      {
        title: "Rank for custom furniture nearby",
        body: "Show up for custom furniture and local maker searches in your area.",
      },
      {
        title: "A site that shows your style",
        body: "Portfolio-led pages that turn inspiration into inquiries.",
      },
      {
        title: "Reviews that commission the next piece",
        body: "Finished commissions become proof for the next buyer.",
      },
    ],
  },
  {
    slug: "upholstery",
    name: "Upholstery",
    singular: "upholsterer",
    article: "an",
    category: "crafts",
    featured: false,
    indexable: false,
    pageTitle: "Upholsterer Marketing & Local SEO",
    headline: "Upholsterer Marketing & Local SEO",
    description: "Upholsterer Marketing & Local SEO for upholstery. Show up for furniture upholstery, recover, and restorations when customers in your area are ready to hire.",
    blurb: "Furniture recover, boat seats, and the crafts people still seek.",
    searchExample: "upholstery near me",
    summary: "Upholsterer Marketing & Local SEO helps upholstery get found when a piece is too good to replace. Furniture recover, boat seats, and the crafts people still seek.",
    pains: [
      {
        title: "People do not know who still does this",
        body: "Upholstery is a search of last resort. If you are not findable, the piece goes to the curb.",
      },
      {
        title: "Fabric and finish proof sells",
        body: "Customers need to see recovered work before they trust the sofa.",
      },
      {
        title: "Auto and furniture searches differ",
        body: "Furniture and automotive upholstery get different queries. Cover what you offer.",
      },
    ],
    outcomes: [
      {
        title: "Found for upholstery nearby",
        body: "Rank for upholstery and furniture recover in your town.",
      },
      {
        title: "A site that proves the restore",
        body: "Clear galleries and contact paths for customers ready to save a piece.",
      },
      {
        title: "Reviews that recover the next piece",
        body: "Finished recovers become reviews that keep the shop booked.",
      },
    ],
  },
  {
    slug: "blacksmithing",
    name: "Blacksmithing",
    singular: "blacksmith",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: false,
    pageTitle: "Blacksmith Marketing & Local SEO",
    headline: "Blacksmith Marketing & Local SEO",
    description: "Blacksmith Marketing & Local SEO for blacksmithing. Show up for custom ironwork, gates, and forged hardware when customers in your area are ready to hire.",
    blurb: "Custom iron, gates, and forged pieces that start with a search.",
    searchExample: "blacksmith near me",
    summary: "Blacksmith Marketing & Local SEO helps blacksmithing get found when a buyer wants forged metal made locally. Custom iron, gates, and forged pieces that start with a search.",
    pains: [
      {
        title: "Artisan searches are rare but intent-rich",
        body: "People who search blacksmith are ready to talk. Missing online means missing the commission.",
      },
      {
        title: "Photos are the entire pitch",
        body: "Without a gallery, the craft never gets a chance.",
      },
      {
        title: "Custom lead times need clarity",
        body: "Buyers want to know process and timeline before they inquire.",
      },
    ],
    outcomes: [
      {
        title: "Rank for blacksmith work nearby",
        body: "Show up for blacksmith and custom ironwork searches in your area.",
      },
      {
        title: "A site that shows the forge",
        body: "Portfolio-led pages that turn curiosity into serious inquiries.",
      },
      {
        title: "Reviews that spark the next commission",
        body: "Finished pieces become proof for the next custom gate or rail.",
      },
    ],
  },
  {
    slug: "stonework",
    name: "Stonework",
    singular: "stonework contractor",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: true,
    pageTitle: "Stonework Contractor Marketing & Local SEO",
    headline: "Stonework Contractor Marketing & Local SEO",
    description: "Stonework Contractor Marketing & Local SEO for stonework. Show up for stone walls, veneers, and custom stone installs when customers in your area are ready to hire.",
    blurb: "Stone walls, veneers, and the craft that defines a property.",
    searchExample: "stonework contractor near me",
    summary: "Stonework Contractor Marketing & Local SEO helps stonework get found when a project needs stone that looks built to last. Stone walls, veneers, and the craft that defines a property.",
    pains: [
      {
        title: "Masonry and stone searches overlap",
        body: "People searching stone work want a specialist look. Vague contractor pages lose.",
      },
      {
        title: "Material and pattern proof win bids",
        body: "Homeowners choose with their eyes. Finished stone photos matter.",
      },
      {
        title: "Builders hire visible specialists",
        body: "GCs under deadline call the crew that is easy to find and trust.",
      },
    ],
    outcomes: [
      {
        title: "Found for stonework nearby",
        body: "Rank for stonework and stone installation in your service area.",
      },
      {
        title: "A site that shows the craft",
        body: "Clear project galleries and contact paths for homeowners and builders.",
      },
      {
        title: "Reviews that set the next wall",
        body: "Finished installs become reviews that win the next property.",
      },
    ],
  },
  {
    slug: "glazing-glass",
    name: "Glazing and glass",
    singular: "glazier",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: true,
    pageTitle: "Glazier Marketing & Local SEO",
    headline: "Glazier Marketing & Local SEO",
    description: "Glazier Marketing & Local SEO for glazing and glass. Show up for glass repair, storefront glazing, and custom glass when customers in your area are ready to hire.",
    blurb: "Window glass, storefronts, and custom glazing that cannot wait.",
    searchExample: "glass repair near me",
    summary: "Glazier Marketing & Local SEO helps glazing and glass get found when broken glass or a new opening needs a glazier. Window glass, storefronts, and custom glazing that cannot wait.",
    pains: [
      {
        title: "Broken glass is an urgent search",
        body: "When glass breaks, people dial the first local glazier that looks ready.",
      },
      {
        title: "Commercial and residential differ",
        body: "Storefront managers and homeowners search differently. Cover both.",
      },
      {
        title: "Custom shower and mirror work needs pages",
        body: "Specialty glass jobs get their own queries. A vague homepage misses them.",
      },
    ],
    outcomes: [
      {
        title: "Rank for glazing nearby",
        body: "Show up for glass repair, glazing, and storefront glass in your town.",
      },
      {
        title: "A site built for urgent and custom work",
        body: "Clear services and tap-to-call for urgent replacements.",
      },
      {
        title: "Reviews that clear the next pane",
        body: "Finished installs become reviews that win the next commercial account.",
      },
    ],
  },
  {
    slug: "locksmithing",
    name: "Locksmiths",
    singular: "locksmith",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: true,
    pageTitle: "Locksmith Marketing & Local SEO",
    headline: "Locksmith Marketing & Local SEO",
    description: "Locksmith Marketing & Local SEO for locksmiths. Show up for lockouts, rekeys, and lock installation when customers in your area are ready to hire.",
    blurb: "Lockouts, rekeys, and security work that starts on Google.",
    searchExample: "locksmith near me",
    summary: "Locksmith Marketing & Local SEO helps locksmiths get found when a homeowner or driver needs a locksmith right away. Lockouts, rekeys, and security work that starts on Google.",
    pains: [
      {
        title: "Emergency intent is winner-take-most",
        body: "Locked-out customers call the first number that looks real.",
      },
      {
        title: "Scammy listings crowd results",
        body: "Lead mills and fake listings fill the map. Clean local presence wins trust.",
      },
      {
        title: "Trust and local proof matter",
        body: "Reviews and a clear company identity beat anonymous emergency ads.",
      },
    ],
    outcomes: [
      {
        title: "Found for locksmith work nearby",
        body: "Rank for locksmith and lockout services in your area.",
      },
      {
        title: "A site that gets the emergency call",
        body: "Tap-to-call prominence and clear local identity that feel safe.",
      },
      {
        title: "Reviews that unlock the next job",
        body: "Finished calls become reviews that beat the spam listings.",
      },
    ],
  },
  {
    slug: "shoe-repair",
    name: "Shoe repair",
    singular: "shoe repair shop",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: false,
    pageTitle: "Shoe Repair Shop Marketing & Local SEO",
    headline: "Shoe Repair Shop Marketing & Local SEO",
    description: "Shoe Repair Shop Marketing & Local SEO for shoe repair. Show up for shoe repair, resoling, and leather fixes when customers in your area are ready to hire.",
    blurb: "Resoles, zips, and the neighbourhood shops worth keeping.",
    searchExample: "shoe repair near me",
    summary: "Shoe Repair Shop Marketing & Local SEO helps shoe repair get found when a favourite pair is worth saving. Resoles, zips, and the neighbourhood shops worth keeping.",
    pains: [
      {
        title: "People assume no one is left",
        body: "Many searchers are not sure a local shop still exists. Visibility is the whole game.",
      },
      {
        title: "Hours and turnaround must be clear",
        body: "Vague hours and process create abandoned visits.",
      },
      {
        title: "Trust decides who gets the shoes",
        body: "Reviews make a small shop feel reliable for quality footwear.",
      },
    ],
    outcomes: [
      {
        title: "Rank for shoe repair nearby",
        body: "Show up for shoe repair and cobbler searches in your town.",
      },
      {
        title: "A site that brings them in",
        body: "Clear services, hours, and contact paths that make dropping off easy.",
      },
      {
        title: "Reviews that keep the bench busy",
        body: "Finished repairs become reviews that save the next pair.",
      },
    ],
  },
  {
    slug: "tailoring",
    name: "Tailoring",
    singular: "tailor",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: false,
    pageTitle: "Tailor Marketing & Local SEO",
    headline: "Tailor Marketing & Local SEO",
    description: "Tailor Marketing & Local SEO for tailoring. Show up for alterations, hemming, and custom tailoring when customers in your area are ready to hire.",
    blurb: "Alterations, fittings, and the rush jobs calendars create.",
    searchExample: "tailor near me",
    summary: "Tailor Marketing & Local SEO helps tailoring get found when a garment needs to fit before a deadline. Alterations, fittings, and the rush jobs calendars create.",
    pains: [
      {
        title: "Event deadlines create urgent searches",
        body: "Weddings and interviews send people to Google. Invisible shops miss the rush.",
      },
      {
        title: "Service menus need to be obvious",
        body: "People want hemming, zippers, and suits listed clearly before they visit.",
      },
      {
        title: "Trust matters for formal wear",
        body: "Reviews decide who gets the expensive garment.",
      },
    ],
    outcomes: [
      {
        title: "Found for tailoring nearby",
        body: "Rank for tailor and alterations searches in your area.",
      },
      {
        title: "A site that books the fitting",
        body: "Clear services and turnaround messaging that convert rushed shoppers.",
      },
      {
        title: "Reviews that fit the next client",
        body: "Finished fittings become reviews that fill the next season.",
      },
    ],
  },
  {
    slug: "leatherwork",
    name: "Leatherwork",
    singular: "leatherworker",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: false,
    pageTitle: "Leatherworker Marketing & Local SEO",
    headline: "Leatherworker Marketing & Local SEO",
    description: "Leatherworker Marketing & Local SEO for leatherwork. Show up for leather repair, custom goods, and restorations when customers in your area are ready to hire.",
    blurb: "Repairs, custom goods, and the craft buyers still seek locally.",
    searchExample: "leather repair near me",
    summary: "Leatherworker Marketing & Local SEO helps leatherwork get found when someone wants leather repaired or made to order. Repairs, custom goods, and the craft buyers still seek locally.",
    pains: [
      {
        title: "Repair and custom are different searches",
        body: "People searching leather repair are not always looking for custom goods. Cover both if you offer them.",
      },
      {
        title: "Craft proof has to be visual",
        body: "Without photos, the craft never gets considered.",
      },
      {
        title: "Local maker intent is high-value",
        body: "Intentional buyers will contact a findable local maker before ordering overseas.",
      },
    ],
    outcomes: [
      {
        title: "Rank for leatherwork nearby",
        body: "Show up for leather repair and custom leather searches in your town.",
      },
      {
        title: "A site that shows the craft",
        body: "Portfolio and service pages that turn browsers into customers.",
      },
      {
        title: "Reviews that stitch the next order",
        body: "Finished work becomes proof for the next commission.",
      },
    ],
  },
  {
    slug: "sign-making",
    name: "Sign making",
    singular: "sign maker",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: true,
    pageTitle: "Sign Maker Marketing & Local SEO",
    headline: "Sign Maker Marketing & Local SEO",
    description: "Sign Maker Marketing & Local SEO for sign making. Show up for storefront signs, vehicle wraps, and custom signage when customers in your area are ready to hire.",
    blurb: "Channel letters, vehicle wraps, and the signs that open a business.",
    searchExample: "sign shop near me",
    summary: "Sign Maker Marketing & Local SEO helps sign making get found when a business needs to look open and findable. Channel letters, vehicle wraps, and the signs that open a business.",
    pains: [
      {
        title: "Business owners hire under deadline",
        body: "Grand openings and rebrands cannot wait. Findable shops get the job.",
      },
      {
        title: "Sign types need separate clarity",
        body: "People search vehicle wraps, channel letters, or yard signs differently.",
      },
      {
        title: "Portfolio proof wins the brand",
        body: "Without a gallery, even a capable shop looks like a gamble for the brand.",
      },
    ],
    outcomes: [
      {
        title: "Found for sign making nearby",
        body: "Rank for sign shops and custom signage in your area.",
      },
      {
        title: "A site that sells the shop",
        body: "Clear product lines and galleries that turn business owners into buyers.",
      },
      {
        title: "Reviews that brand the next client",
        body: "Finished installs become reviews that open the next account.",
      },
    ],
  },
  {
    slug: "millwork",
    name: "Millwork",
    singular: "millwork shop",
    article: "a",
    category: "crafts",
    featured: false,
    indexable: false,
    pageTitle: "Millwork Shop Marketing & Local SEO",
    headline: "Millwork Shop Marketing & Local SEO",
    description: "Millwork Shop Marketing & Local SEO for millwork. Show up for custom millwork, doors, and architectural wood packages when customers in your area are ready to hire.",
    blurb: "Doors, trim packages, and custom millwork builders specify.",
    searchExample: "millwork shop near me",
    summary: "Millwork Shop Marketing & Local SEO helps millwork get found when a project needs millwork that matches the drawings. Doors, trim packages, and custom millwork builders specify.",
    pains: [
      {
        title: "Architects and GCs search capability",
        body: "Specs go to shops that are easy to find and look established.",
      },
      {
        title: "Shop capacity must look real online",
        body: "A weak site makes a strong mill look like a risk for the schedule.",
      },
      {
        title: "Specialty profiles need proof",
        body: "Buyers want to see similar work before they send the package.",
      },
    ],
    outcomes: [
      {
        title: "Rank for millwork nearby",
        body: "Show up for millwork and architectural woodwork in your region.",
      },
      {
        title: "A site that wins the package",
        body: "Clear capabilities and contact paths for builders and designers.",
      },
      {
        title: "Reviews that finish the next build",
        body: "Finished packages become proof for the next bid.",
      },
    ],
  },
  {
    slug: "trucking-freight",
    name: "Trucking and freight",
    singular: "trucking company",
    article: "a",
    category: "industrial",
    featured: false,
    indexable: true,
    pageTitle: "Trucking Company Marketing & Local SEO",
    headline: "Trucking Company Marketing & Local SEO",
    description: "Trucking Company Marketing & Local SEO for trucking and freight. Show up for local freight, regional trucking, and dedicated hauls when customers in your area are ready to hire.",
    blurb: "Local freight, regional hauls, and the carriers businesses trust.",
    searchExample: "trucking company near me",
    summary: "Trucking Company Marketing & Local SEO helps trucking and freight get found when a shipper needs capacity they can count on. Local freight, regional hauls, and the carriers businesses trust.",
    pains: [
      {
        title: "Shippers hire who looks established",
        body: "Dispatchers and owners Google under deadline. Thin sites never make the shortlist.",
      },
      {
        title: "Lane and equipment clarity wins loads",
        body: "If equipment and coverage are unclear, the load goes elsewhere.",
      },
      {
        title: "Trust beats the cheapest rate",
        body: "Reviews and a professional presence beat anonymous brokers and fly-by-night carriers.",
      },
    ],
    outcomes: [
      {
        title: "Found for trucking nearby",
        body: "Rank for trucking and freight services in your market.",
      },
      {
        title: "A site that wins the load",
        body: "Clear equipment, lanes, and contact paths for shippers ready to book.",
      },
      {
        title: "Reviews that haul the next account",
        body: "Reliable hauls become reviews that open the next account.",
      },
    ],
  },
  {
    slug: "moving-company",
    name: "Moving companies",
    singular: "moving company",
    article: "a",
    category: "industrial",
    featured: false,
    indexable: true,
    pageTitle: "Moving Company Marketing & Local SEO",
    headline: "Moving Company Marketing & Local SEO",
    description: "Moving Company Marketing & Local SEO for moving companies. Show up for local moves, packing, and residential moving when customers in your area are ready to hire.",
    blurb: "Local moves, long distance, and the crews people trust with a home.",
    searchExample: "movers near me",
    summary: "Moving Company Marketing & Local SEO helps moving companies get found when a household or office needs movers they can trust. Local moves, long distance, and the crews people trust with a home.",
    pains: [
      {
        title: "Reviews decide the whole sale",
        body: "Moving is high stress. People pick the company with clear reviews and a real site.",
      },
      {
        title: "Scammy movers crowd search",
        body: "Lead mills and fake listings fill results. Clean local presence wins trust.",
      },
      {
        title: "Local vs long-distance intent splits",
        body: "Customers search local movers and long distance differently. Cover what you offer.",
      },
    ],
    outcomes: [
      {
        title: "Found for movers nearby",
        body: "Show up for moving companies and local movers in your area.",
      },
      {
        title: "A site that books the move",
        body: "Clear services and booking paths that feel safe for homeowners.",
      },
      {
        title: "Reviews that pack the next job",
        body: "Finished moves become reviews that beat the spam listings.",
      },
    ],
  },
  {
    slug: "courier",
    name: "Couriers",
    singular: "courier service",
    article: "a",
    category: "industrial",
    featured: false,
    indexable: true,
    pageTitle: "Courier Service Marketing & Local SEO",
    headline: "Courier Service Marketing & Local SEO",
    description: "Courier Service Marketing & Local SEO for couriers. Show up for same-day courier, local delivery, and urgent runs when customers in your area are ready to hire.",
    blurb: "Same-day runs, medical, and the urgent deliveries local businesses need.",
    searchExample: "courier service near me",
    summary: "Courier Service Marketing & Local SEO helps couriers get found when a business needs something across town today. Same-day runs, medical, and the urgent deliveries local businesses need.",
    pains: [
      {
        title: "Urgent intent is winner-take-fast",
        body: "When a package has to move now, they dial the first courier that looks ready.",
      },
      {
        title: "Coverage and hours must be obvious",
        body: "If service area and hours are unclear, the job goes to someone else.",
      },
      {
        title: "Business accounts need professionalism",
        body: "Offices hire vendors that look reliable online, not just available.",
      },
    ],
    outcomes: [
      {
        title: "Rank for courier service nearby",
        body: "Show up for courier and same-day delivery searches in your town.",
      },
      {
        title: "A site built for urgent booking",
        body: "Clear coverage and tap-to-call for businesses that need a run now.",
      },
      {
        title: "Reviews that deliver the next account",
        body: "Finished deliveries become reviews that open recurring accounts.",
      },
    ],
  },
  {
    slug: "warehousing",
    name: "Warehousing",
    singular: "warehousing company",
    article: "a",
    category: "industrial",
    featured: false,
    indexable: true,
    pageTitle: "Warehousing Company Marketing & Local SEO",
    headline: "Warehousing Company Marketing & Local SEO",
    description: "Warehousing Company Marketing & Local SEO for warehousing. Show up for storage, fulfillment, and distribution space when customers in your area are ready to hire.",
    blurb: "Storage, fulfillment, and the space growing businesses outgrow.",
    searchExample: "warehousing near me",
    summary: "Warehousing Company Marketing & Local SEO helps warehousing get found when a business needs warehouse capacity nearby. Storage, fulfillment, and the space growing businesses outgrow.",
    pains: [
      {
        title: "B2B buyers research before they call",
        body: "Operations leads shortlist vendors online. A weak site never gets the tour.",
      },
      {
        title: "Capabilities must be spelled out",
        body: "If racking, fulfillment, or dock details are missing, buyers bounce.",
      },
      {
        title: "Trust and security win contracts",
        body: "Reviews and a clear company story reduce perceived risk for inventory.",
      },
    ],
    outcomes: [
      {
        title: "Found for warehousing nearby",
        body: "Rank for warehousing and fulfillment in your market.",
      },
      {
        title: "A site that wins the tour",
        body: "Clear capability pages and contact paths for operations buyers.",
      },
      {
        title: "Reviews that store the next account",
        body: "Reliable service becomes proof that opens the next contract.",
      },
    ],
  },
  {
    slug: "manufacturing-machining",
    name: "Manufacturing and machining",
    singular: "manufacturing company",
    article: "a",
    category: "industrial",
    featured: false,
    indexable: true,
    pageTitle: "Manufacturing Company Marketing & Local SEO",
    headline: "Manufacturing Company Marketing & Local SEO",
    description: "Manufacturing Company Marketing & Local SEO for manufacturing and machining. Show up for manufacturing, machining, and production support when customers in your area are ready to hire.",
    blurb: "Production, machining, and the shops regional buyers need.",
    searchExample: "manufacturing company near me",
    summary: "Manufacturing Company Marketing & Local SEO helps manufacturing and machining get found when a buyer needs a local manufacturer they can visit. Production, machining, and the shops regional buyers need.",
    pains: [
      {
        title: "Capability pages win RFQs",
        body: "Engineers Google processes and tolerances. Invisible shops never see the drawing.",
      },
      {
        title: "Certifications need to be visible",
        body: "ISO and quality claims only help if they are easy to find.",
      },
      {
        title: "Generic sites lose to clear specialists",
        body: "Buyers skip vague manufacturer pages for shops that spell out what they make.",
      },
    ],
    outcomes: [
      {
        title: "Found for manufacturing nearby",
        body: "Show up for manufacturing and machining searches in your region.",
      },
      {
        title: "A site that wins the RFQ",
        body: "Clear capabilities and contact paths for buyers ready to send prints.",
      },
      {
        title: "Reviews and proof that close work",
        body: "Past work and reviews make the next RFQ feel lower risk.",
      },
    ],
  },
  {
    slug: "scrap-metal-recycling",
    name: "Scrap metal and recycling",
    singular: "scrap metal yard",
    article: "a",
    category: "industrial",
    featured: false,
    indexable: true,
    pageTitle: "Scrap Metal Yard Marketing & Local SEO",
    headline: "Scrap Metal Yard Marketing & Local SEO",
    description: "Scrap Metal Yard Marketing & Local SEO for scrap metal and recycling. Show up for scrap metal buy, pickup, and recycling when customers in your area are ready to hire.",
    blurb: "Yards, pickup, and recycling for contractors and the public.",
    searchExample: "scrap metal near me",
    summary: "Scrap Metal Yard Marketing & Local SEO helps scrap metal and recycling get found when a job site or property has metal that needs to go. Yards, pickup, and recycling for contractors and the public.",
    pains: [
      {
        title: "Price and hours decide the visit",
        body: "People compare yards fast. Clear hours and accepted materials win the drop.",
      },
      {
        title: "Pickup service must be obvious",
        body: "If pickup is buried on the site, those higher-value jobs never call.",
      },
      {
        title: "Contractors hire who is easy to deal with",
        body: "GCs and remodelers choose yards that look organized online.",
      },
    ],
    outcomes: [
      {
        title: "Rank for scrap metal nearby",
        body: "Show up for scrap metal and recycling in your area.",
      },
      {
        title: "A site that gets the drop or pickup",
        body: "Clear accepted materials, hours, and pickup offers.",
      },
      {
        title: "Reviews that recycle the next load",
        body: "Reliable service becomes reviews that keep the yard busy.",
      },
    ],
  },
  {
    slug: "commercial-refrigeration",
    name: "Commercial refrigeration",
    singular: "commercial refrigeration technician",
    article: "a",
    category: "industrial",
    featured: false,
    indexable: true,
    pageTitle: "Commercial Refrigeration Technician Marketing & Local SEO",
    headline: "Commercial Refrigeration Technician Marketing & Local SEO",
    description: "Commercial Refrigeration Technician Marketing & Local SEO for commercial refrigeration. Show up for walk-in repair, case service, and commercial refrigeration when customers in your area are ready to hire.",
    blurb: "Walk-ins, cases, and the service restaurants and stores depend on.",
    searchExample: "commercial refrigeration repair near me",
    summary: "Commercial Refrigeration Technician Marketing & Local SEO helps commercial refrigeration get found when a cooler fails and product is at risk. Walk-ins, cases, and the service restaurants and stores depend on.",
    pains: [
      {
        title: "Emergency downtime is expensive",
        body: "When a walk-in fails, they dial the first refrigeration company that looks ready.",
      },
      {
        title: "Food businesses need trust fast",
        body: "Restaurants and stores want reviews before they trust the repair.",
      },
      {
        title: "Maintenance contracts need visibility",
        body: "If preventive service is hidden, you stay stuck in emergency-only work.",
      },
    ],
    outcomes: [
      {
        title: "Found for commercial refrigeration",
        body: "Rank for commercial refrigeration repair in your market.",
      },
      {
        title: "A site built for urgent service",
        body: "Clear emergency and maintenance offers with tap-to-call prominence.",
      },
      {
        title: "Reviews that cool the next account",
        body: "Finished repairs become reviews that open the next kitchen.",
      },
    ],
  },
  {
    slug: "farming",
    name: "Farming",
    singular: "farming business",
    article: "a",
    category: "primary",
    featured: false,
    indexable: false,
    pageTitle: "Farming Business Marketing & Local SEO",
    headline: "Farming Business Marketing & Local SEO",
    description: "Farming Business Marketing & Local SEO for farming. Show up for farm products, CSA, and local agriculture services when customers in your area are ready to hire.",
    blurb: "Local farms that need a clearer path from field to customer.",
    searchExample: "farm near me",
    summary: "Farming Business Marketing & Local SEO helps farming get found when buyers look for a local farm they can trust. Local farms that need a clearer path from field to customer.",
    pains: [
      {
        title: "Local food buyers start on Google",
        body: "People search for farms, stands, and local producers. Invisible operations miss them.",
      },
      {
        title: "What you grow never shows online",
        body: "Great harvests stay offline, so new customers never learn you exist.",
      },
      {
        title: "Wholesale and retail need different clarity",
        body: "Restaurants and families search differently. Clear pages catch both.",
      },
    ],
    outcomes: [
      {
        title: "Found for local farm searches",
        body: "Show up for farm and local produce searches in your area.",
      },
      {
        title: "A site that sells what you grow",
        body: "Clear offerings and contact paths for families and wholesale buyers.",
      },
      {
        title: "Reviews that bring the next visit",
        body: "Happy customers leave proof that grows the next season.",
      },
    ],
  },
  {
    slug: "ranching",
    name: "Ranching",
    singular: "ranch",
    article: "a",
    category: "primary",
    featured: false,
    indexable: false,
    pageTitle: "Ranch Marketing & Local SEO",
    headline: "Ranch Marketing & Local SEO",
    description: "Ranch Marketing & Local SEO for ranching. Show up for livestock, ranch services, and land-based operations when customers in your area are ready to hire.",
    blurb: "Ranches that need visibility for sales, services, and partners.",
    searchExample: "ranch near me",
    summary: "Ranch Marketing & Local SEO helps ranching get found when buyers or partners look for a local ranch operation. Ranches that need visibility for sales, services, and partners.",
    pains: [
      {
        title: "Buyers cannot find you when they search",
        body: "People searching for ranch products or services never see an invisible operation.",
      },
      {
        title: "Services stay word of mouth only",
        body: "Custom grazing, sales, or services stay stuck in local networks alone.",
      },
      {
        title: "Trust still starts online",
        body: "A clear site and reviews make a serious ranch look easy to work with.",
      },
    ],
    outcomes: [
      {
        title: "Rank for ranch searches nearby",
        body: "Show up for ranch and livestock-related searches in your region.",
      },
      {
        title: "A site that explains the operation",
        body: "Clear offerings and contact paths for buyers and partners.",
      },
      {
        title: "Reviews that open the next deal",
        body: "Finished work and sales become public proof for the next relationship.",
      },
    ],
  },
  {
    slug: "logging",
    name: "Logging",
    singular: "logging company",
    article: "a",
    category: "primary",
    featured: false,
    indexable: false,
    pageTitle: "Logging Company Marketing & Local SEO",
    headline: "Logging Company Marketing & Local SEO",
    description: "Logging Company Marketing & Local SEO for logging. Show up for logging, timber harvest, and land clearing when customers in your area are ready to hire.",
    blurb: "Timber harvest, land clearing, and the crews landowners need.",
    searchExample: "logging company near me",
    summary: "Logging Company Marketing & Local SEO helps logging get found when a landowner needs trees harvested or land cleared. Timber harvest, land clearing, and the crews landowners need.",
    pains: [
      {
        title: "Landowners hire who looks established",
        body: "Property owners Google under pressure. Thin sites lose to bigger-looking crews.",
      },
      {
        title: "Insurance and capability need to be visible",
        body: "People want proof you can handle the job safely before anyone cuts.",
      },
      {
        title: "Specialty clearing gets separate searches",
        body: "Selective harvest and land clearing are different intents. Cover what you do.",
      },
    ],
    outcomes: [
      {
        title: "Found for logging nearby",
        body: "Rank for logging and land clearing in your area.",
      },
      {
        title: "A site that wins the property",
        body: "Clear services and contact paths for landowners ready to hire.",
      },
      {
        title: "Reviews that clear the next tract",
        body: "Finished jobs become reviews that open the next property.",
      },
    ],
  },
  {
    slug: "fishing",
    name: "Fishing",
    singular: "fishing business",
    article: "a",
    category: "primary",
    featured: false,
    indexable: false,
    pageTitle: "Fishing Business Marketing & Local SEO",
    headline: "Fishing Business Marketing & Local SEO",
    description: "Fishing Business Marketing & Local SEO for fishing. Show up for charters, seafood sales, and fishing services when customers in your area are ready to hire.",
    blurb: "Commercial fishing and charters that need a clearer customer path.",
    searchExample: "fishing charter near me",
    summary: "Fishing Business Marketing & Local SEO helps fishing get found when customers look for local fish or a boat to book. Commercial fishing and charters that need a clearer customer path.",
    pains: [
      {
        title: "Seasonal demand is search-driven",
        body: "Tourists and locals search when the season opens. Invisible operators miss the wave.",
      },
      {
        title: "What you offer never shows clearly",
        body: "Charters, direct seafood, and services need clear pages to convert.",
      },
      {
        title: "Trust and availability win the booking",
        body: "Reviews and easy booking beat a phone number on a faded sign.",
      },
    ],
    outcomes: [
      {
        title: "Found for local fishing searches",
        body: "Show up for fishing charter and local seafood searches in your area.",
      },
      {
        title: "A site that books the trip or sale",
        body: "Clear offerings and booking paths that turn interest into revenue.",
      },
      {
        title: "Reviews that fill the next season",
        body: "Happy customers leave proof that fills next season’s calendar.",
      },
    ],
  },
  {
    slug: "quarrying",
    name: "Quarrying",
    singular: "quarry",
    article: "a",
    category: "primary",
    featured: false,
    indexable: false,
    pageTitle: "Quarry Marketing & Local SEO",
    headline: "Quarry Marketing & Local SEO",
    description: "Quarry Marketing & Local SEO for quarrying. Show up for aggregate, gravel, and quarry materials when customers in your area are ready to hire.",
    blurb: "Stone, gravel, and the materials local builds depend on.",
    searchExample: "quarry near me",
    summary: "Quarry Marketing & Local SEO helps quarrying get found when a contractor needs material and a yard that can deliver. Stone, gravel, and the materials local builds depend on.",
    pains: [
      {
        title: "Contractors search under schedule pressure",
        body: "GCs and landscapers Google when a pour or base layer is waiting.",
      },
      {
        title: "Materials and delivery must be clear",
        body: "If products and delivery are vague, they call a competitor.",
      },
      {
        title: "Commercial buyers want an easy vendor",
        body: "A professional site makes a local quarry easier to put on the vendor list.",
      },
    ],
    outcomes: [
      {
        title: "Rank for quarry searches nearby",
        body: "Show up for quarry and aggregate searches in your region.",
      },
      {
        title: "A site that wins the order",
        body: "Clear materials, delivery info, and contact paths for contractors.",
      },
      {
        title: "Reviews that haul the next load",
        body: "Reliable loads become reviews that keep the yard busy.",
      },
    ],
  },
  {
    slug: "oil-field-services",
    name: "Oil field services",
    singular: "oil field services company",
    article: "an",
    category: "primary",
    featured: false,
    indexable: false,
    pageTitle: "Oil Field Services Company Marketing & Local SEO",
    headline: "Oil Field Services Company Marketing & Local SEO",
    description: "Oil Field Services Company Marketing & Local SEO for oil field services. Show up for oil field support, maintenance, and specialty field services when customers in your area are ready to hire.",
    blurb: "Field services and support that operators need nearby.",
    searchExample: "oilfield services near me",
    summary: "Oil Field Services Company Marketing & Local SEO helps oil field services get found when an operator needs a local service partner fast. Field services and support that operators need nearby.",
    pains: [
      {
        title: "Procurement still Googles locally",
        body: "When something breaks in the field, findable vendors get the first call.",
      },
      {
        title: "Capabilities and safety need to be visible",
        body: "Safety and service lines buried on a weak site lose the opportunity.",
      },
      {
        title: "Trust wins callouts",
        body: "Operators hire partners that look established before they send a crew.",
      },
    ],
    outcomes: [
      {
        title: "Found for oil field services",
        body: "Rank for oil field and energy support services in your market.",
      },
      {
        title: "A site that wins the vendor slot",
        body: "Clear capabilities and contact paths for operators and procurement.",
      },
      {
        title: "Reviews that open the next callout",
        body: "Reliable work becomes proof that opens the next job.",
      },
    ],
  }
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
  return `/trades/${slug}`;
}
