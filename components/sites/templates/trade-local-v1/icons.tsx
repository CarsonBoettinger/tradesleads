import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function svgProps(className?: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    className: className ?? "size-7",
    "aria-hidden": true as const,
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

export function HouseIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
      <path d="M9.5 21v-6.5h5V21" />
    </svg>
  );
}

export function KitchenIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 8h16v12H4z" />
      <path d="M4 12h16" />
      <path d="M8 8V5.5a1.5 1.5 0 0 1 3 0V8" />
      <path d="M13 8V5.5a1.5 1.5 0 0 1 3 0V8" />
      <path d="M8 15h3v2H8z" />
    </svg>
  );
}

export function DeckIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 14h16" />
      <path d="M6 14v6" />
      <path d="M18 14v6" />
      <path d="M4 18h16" />
      <path d="M8 10c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      <path d="M9 10h6v4H9z" />
    </svg>
  );
}

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M14.7 6.3a4 4 0 0 0-5.6 5.6L4 17l3 3 5.1-5.1a4 4 0 0 0 5.6-5.6l-2.5 2.5-2.5-2.5z" />
    </svg>
  );
}

export function PipeIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 8h7v3H4z" />
      <path d="M11 9.5h3.5a2.5 2.5 0 0 1 2.5 2.5V16h3" />
      <path d="M17 16v4" />
      <path d="M14.5 20h5" />
    </svg>
  );
}

export function FlameIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M12 3c2 3 5 4.5 5 8.5A5 5 0 0 1 7 11.5C7 8.5 9.5 6.5 12 3z" />
      <path d="M12 14.5c1.2 1.2 1.8 2 1.8 3.2A1.8 1.8 0 0 1 12 19.5a1.8 1.8 0 0 1-1.8-1.8c0-1.2.6-2 1.8-3.2z" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M13 2 5 13h6l-1 9 9-12h-6l0-8z" />
    </svg>
  );
}

export function RoofIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M3 12 12 4l9 8" />
      <path d="M5 11v9h14v-9" />
      <path d="M3 12h18" />
    </svg>
  );
}

export function PaintIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M5 4h12a2 2 0 0 1 2 2v3H5V4z" />
      <path d="M7 9v4.5a2.5 2.5 0 0 0 5 0V9" />
      <path d="M14.5 16.5a2 2 0 1 0 2.5 3" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M3 8h11v8H3z" />
      <path d="M14 11h4l3 3v2h-7v-5z" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M12 3 5 6v5c0 4.5 2.8 7.8 7 9 4.2-1.2 7-4.5 7-9V6l-7-3z" />
      <path d="m9.5 12 1.8 1.8 3.7-3.8" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4.5l3 1.5" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="m12 3.5 2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.8 7.2 18.4l.9-5.4L4.2 9.2l5.4-.8L12 3.5z" />
    </svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.2" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="m8.5 12.2 2.3 2.3 4.7-5" />
    </svg>
  );
}

export function ToolsIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M14.5 5.5a3.5 3.5 0 0 0-4.7 4.7L4 16l2.5 2.5 5.8-5.8a3.5 3.5 0 0 0 4.7-4.7L14 10.5 14.5 5.5z" />
      <path d="m16 14 4 4" />
      <path d="m14.5 15.5 2 2" />
    </svg>
  );
}

export function FenceIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M5 8v12" />
      <path d="M10 6v14" />
      <path d="M14 6v14" />
      <path d="M19 8v12" />
      <path d="M4 11h16" />
      <path d="M4 16h16" />
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M5 19c8-1 13-7 14-14-7 1-13 6-14 14z" />
      <path d="M8.5 15.5c2-2.5 4.5-4.5 7.5-5.5" />
    </svg>
  );
}

export function DropletIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M12 3c3.5 4.5 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.5 6-11z" />
    </svg>
  );
}

export function HardHatIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 15h16v2.5H4z" />
      <path d="M6 15a6 6 0 0 1 12 0" />
      <path d="M12 5v4" />
    </svg>
  );
}

export function QuoteIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M8 17H4.5A2.5 2.5 0 0 1 2 14.5V12a4 4 0 0 1 4-4h1v3H5.5v2.5H8V17z" />
      <path d="M20 17h-3.5A2.5 2.5 0 0 1 14 14.5V12a4 4 0 0 1 4-4h1v3h-1.5v2.5H20V17z" />
    </svg>
  );
}

export function CurrencyIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7v10" />
      <path d="M9.5 9.5c.6-1 1.5-1.5 2.5-1.5 1.4 0 2.5.8 2.5 2s-1.1 2-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2c1 0 1.9-.5 2.5-1.5" />
    </svg>
  );
}

export type SiteIconKey =
  | "house"
  | "kitchen"
  | "deck"
  | "fence"
  | "wrench"
  | "pipe"
  | "droplet"
  | "flame"
  | "bolt"
  | "roof"
  | "paint"
  | "truck"
  | "shield"
  | "clock"
  | "star"
  | "mapPin"
  | "check"
  | "tools"
  | "leaf"
  | "hardHat"
  | "quote"
  | "currency";

const ICON_MAP: Record<SiteIconKey, (props: IconProps) => ReactNode> = {
  house: HouseIcon,
  kitchen: KitchenIcon,
  deck: DeckIcon,
  fence: FenceIcon,
  wrench: WrenchIcon,
  pipe: PipeIcon,
  droplet: DropletIcon,
  flame: FlameIcon,
  bolt: BoltIcon,
  roof: RoofIcon,
  paint: PaintIcon,
  truck: TruckIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
  star: StarIcon,
  mapPin: MapPinIcon,
  check: CheckIcon,
  tools: ToolsIcon,
  leaf: LeafIcon,
  hardHat: HardHatIcon,
  quote: QuoteIcon,
  currency: CurrencyIcon,
};

export function SiteIcon({
  name,
  className,
}: {
  name: SiteIconKey;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? ToolsIcon;
  return <Icon className={className} />;
}

type Rule = { key: SiteIconKey; patterns: RegExp[] };

const SERVICE_RULES: Rule[] = [
  {
    key: "kitchen",
    patterns: [/kitchen/, /cabin/, /counter/, /bath/, /remodel/],
  },
  {
    key: "deck",
    patterns: [/deck/, /patio/, /outdoor/, /pergola/, /gazebo/, /porch/],
  },
  { key: "fence", patterns: [/fence/, /railing/, /gate/] },
  {
    key: "house",
    patterns: [
      /renovat/,
      /addition/,
      /custom\s*home/,
      /new\s*home/,
      /home\s*build/,
      /construct/,
      /builder/,
    ],
  },
  {
    key: "pipe",
    patterns: [/plumb/, /drain/, /sewer/, /water\s*heater/, /faucet/],
  },
  { key: "droplet", patterns: [/leak/, /flood/, /water\s*damage/, /moisture/] },
  {
    key: "flame",
    patterns: [/hvac/, /heat/, /furnace/, /boiler/, /gas/, /ac\b/, /air\s*cond/],
  },
  {
    key: "bolt",
    patterns: [/electr/, /wiring/, /panel/, /outlet/, /lighting/],
  },
  { key: "roof", patterns: [/roof/, /shingle/, /gutter/, /siding/] },
  { key: "paint", patterns: [/paint/, /drywall/, /finish/, /stain/] },
  {
    key: "truck",
    patterns: [/haul/, /delivery/, /moving/, /junk/, /demo/, /excav/],
  },
  { key: "leaf", patterns: [/landscap/, /lawn/, /garden/, /tree/, /yard/] },
  {
    key: "hardHat",
    patterns: [/inspect/, /project\s*manag/, /general\s*contract/],
  },
  { key: "wrench", patterns: [/repair/, /fix/, /install/, /mainten/] },
  { key: "shield", patterns: [/warranty/, /protect/, /insur/, /safety/] },
  { key: "clock", patterns: [/emergenc/, /24\s*\/?\s*7/, /same\s*day/] },
];

const WHY_US_RULES: Rule[] = [
  {
    key: "mapPin",
    patterns: [/local/, /nearby/, /reach/, /area/, /community/, /town/],
  },
  {
    key: "star",
    patterns: [/review/, /proof/, /reputation/, /rating/, /testimonial/],
  },
  {
    key: "clock",
    patterns: [/response/, /fast/, /quick/, /timely/, /on\s*time/, /schedul/],
  },
  {
    key: "shield",
    patterns: [/trust/, /licensed/, /insured/, /guaran/, /warranty/, /safe/],
  },
  {
    key: "check",
    patterns: [/quality/, /craft/, /detail/, /straight/, /honest/, /clear/],
  },
  {
    key: "currency",
    patterns: [/price/, /fair/, /value/, /afford/, /quote/, /budget/],
  },
  { key: "hardHat", patterns: [/experience/, /expert/, /pro\b/, /crew/] },
  { key: "leaf", patterns: [/sustain/, /energy/, /efficient/, /green/] },
  { key: "house", patterns: [/home/, /build/, /family/] },
];

function matchRules(text: string, rules: Rule[], fallback: SiteIconKey) {
  const haystack = text.toLowerCase();
  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(haystack))) {
      return rule.key;
    }
  }
  return fallback;
}

export function resolveServiceIcon(name: string): SiteIconKey {
  return matchRules(name, SERVICE_RULES, "tools");
}

export function resolveWhyUsIcon(title: string): SiteIconKey {
  return matchRules(title, WHY_US_RULES, "shield");
}
