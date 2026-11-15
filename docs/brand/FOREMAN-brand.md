# FOREMAN Brand Guidelines (Agent Reference)

Use this file as the source of truth when writing copy, designing pages, or producing any asset for FOREMAN. If a request conflicts with it, follow the request and flag the conflict.

## 1. Who we are

- **Name:** FOREMAN (always uppercase in the wordmark; "Foreman" in running text)
- **Descriptor:** Growth for the trades
- **Primary line:** Built to get you found.
- **Boilerplate:** Websites and local search growth for the businesses that build our world.
- **Audience:** Owners of trade businesses: plumbers, roofers, electricians, HVAC, builders, landscapers. Busy, practical, skeptical of agencies.
- **Positioning:** A real company for the trades, not an SEO agency and not a tech startup.

### Approved taglines

- Built for more business.
- Lead your local market.
- Get found. Get hired.
- Your business deserves the top spot.
- The next job starts here.

Use one tagline per asset. Do not invent new taglines without asking.

## 2. Voice

**Friendly, plain, trade-smart.** Talk like a good neighbour who knows the work.

- Short sentences. Active verbs.
- Describe results in the customer's terms: calls, jobs, bookings, reviews, top of Google.
- Speak to "you" and "your business". Refer to ourselves as "we" sparingly.
- Confident, never hypey. No exclamation marks in headlines.

**Avoid:** agency jargon (synergy, leverage, omnichannel, funnel, ROI-driven), startup language (disrupt, scale, platform, unlock), vague promises, and invented statistics, testimonials or client names. Use `[PLACEHOLDER]` when real numbers are missing.

| Instead of | Write |
| --- | --- |
| Optimize your digital presence | Show up when people search for you |
| Drive qualified leads | Get more calls from people who need the work |
| Leverage local SEO | Rank higher on Google in your area |

## 3. Visual identity

Soft, warm and roomy. Rounded corners, generous spacing, orange used sparingly. Not harsh, not neon, not industrial.

### Colour

| Name | Hex | Use |
| --- | --- | --- |
| Foreman Orange | `#C2410C` | Logo, primary buttons, key links. Cream text on it only |
| Sunrise | `#F58A3C` | Accents and fills. Cocoa text on it only |
| Peach | `#FFE9D6` | Cards, chips, soft sections |
| Cream | `#FFF8F1` | Page background |
| Cocoa | `#2A2320` | Body text and headlines |
| Secondary text | `#5F524A` | Captions and supporting copy |

Rules:

- Orange is never body text on cream. It is fine for large headings or labels at 16px bold or above only on `#FFF8F1` or white.
- No pure black backgrounds. No bright yellow. No hazard stripes.
- Keep text contrast at 4.5:1 or better.

### Typography

- **Font:** Plus Jakarta Sans (Google Fonts), with a system sans-serif fallback.
- **Headlines:** 800 weight, sentence case, tight tracking (-0.02em), line height about 1.05.
- **Body:** 400 or 500 weight, 17 to 22px, line height 1.5 to 1.6.
- **Small labels:** 700 weight, uppercase, wide tracking (0.14 to 0.2em), 14 to 16px.
- **Wordmark only:** FOREMAN in 800 weight, uppercase, 0.06em tracking.

### Shape and layout

- Cards: 20 to 32px radius, Peach fill or white with a 2px Peach border.
- Buttons: pill shape (fully rounded), 52px tall, Foreman Orange fill, cream text, 700 weight.
- Chips: pill, Peach fill, 700 weight.
- Generous padding (28 to 36px in cards). One idea per section.
- Touch targets at least 44px.

### Logo

- **Mark:** Rounded square tile (12/48 radius) in Foreman Orange with two stacked upward chevrons in Cream. The chevrons are a foreman's rank stripes and a climb to the top spot.
- **Lockup:** Mark followed by the FOREMAN wordmark, gap about 0.3x mark width.
- **Clear space:** One chevron height on all sides.
- **Do not:** recolour, stretch, add shadows or outlines, or place on busy images.

SVG for the mark:

```svg
<svg width="56" height="56" viewBox="0 0 48 48" aria-hidden="true">
  <rect width="48" height="48" rx="12" fill="#C2410C"/>
  <path d="M11 24 24 12l13 12v6L24 18 11 30zM11 34l13-12 13 12v4L24 26 11 38z" fill="#FFF8F1"/>
</svg>
```

### Imagery and UI patterns

- Real trade work, real crews, real vehicles. Warm natural light. No stock handshakes.
- Show results as small notification-style cards: "New job booked", "New 5-star review", "Quote request".
- Benefit trio on landing pages: Rank higher on Google, Earn more 5-star reviews, Beat the big guys.
- Primary CTA wording: "Get my free local audit".

## 4. CSS tokens

```css
:root {
  --foreman-orange: #C2410C;
  --sunrise: #F58A3C;
  --peach: #FFE9D6;
  --cream: #FFF8F1;
  --cocoa: #2A2320;
  --text-secondary: #5F524A;
  --radius-card: 24px;
  --radius-pill: 999px;
  --font: 'Plus Jakarta Sans', system-ui, sans-serif;
}
```

## 5. Before external launch

"Foreman" is a common dictionary word. Before investing further in the brand, check:

1. Domain availability, including close variants.
2. Existing businesses operating as Foreman, especially in construction software and trades marketing.
3. Trademark conflicts in the relevant classes and jurisdictions.

Do not claim ownership of the name or present it as registered until this is cleared.

## 6. Checklist before delivering any asset

- Uses only approved colours and Plus Jakarta Sans.
- One approved tagline at most.
- Copy is plain, trade-focused and free of jargon.
- No invented stats, clients or quotes.
- Orange text and button contrast are within the rules above.
