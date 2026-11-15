import { BLOG_TOPICS, pickTopicForDay, topicById } from "./topics";
import type { BlogPostInput, BlogTopic } from "./types";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function excerptFrom(body: string, fallback: string) {
  const plain = body
    .replace(/^#.+$/gm, "")
    .replace(/[*_`\[\]]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (!plain) return fallback;
  return plain.length > 160 ? `${plain.slice(0, 157).trim()}…` : plain;
}

function renderArticle(topic: BlogTopic) {
  const sections = topic.outline
    .map((heading, index) => {
      const paragraphs = paragraphFor(topic, heading, index);
      return `## ${heading}\n\n${paragraphs}`;
    })
    .join("\n\n");

  return `# ${topic.title}

${topic.angle}

This is a practical guide for busy ${tradeLabelFor(topic.trade)} - the kind of tip you can use this week, not a lecture.

${sections}

## One next step

Pick one fix from this article and do it today. Then look at your Google listing and homepage on your phone the way a stranger would.

Want a plain look at where you show up? [Book a free demo](/free-demo).
`;
}

function paragraphFor(topic: BlogTopic, heading: string, index: number) {
  const tradeLabel = tradeLabelFor(topic.trade);
  const keyword = topic.primaryKeyword;

  const blocks = [
    `Owners lose jobs when the basics are fuzzy. For ${tradeLabel}, start with the problem behind **${keyword}**: someone needed help and could not find a clear next step.`,
    `Make the next action obvious. A large call button, a short form, or a same-day text-back. If a homeowner took the time to look you up, do not make them hunt.`,
    `Proof beats promises. Recent job photos, towns you serve, and reviews that mention the real work help a stranger choose you over the next listing.`,
    `Keep the advice short enough to use on a lunch break. Name the service, the area, and what happens after they contact you. Skip agency words.`,
    `Tie the website, the Google listing, and the phone together. Same business name, honest hours, matching services, and a human who answers or follows up fast.`,
  ];

  const extras = [
    `If you only have an hour this week, spend it on the first broken piece of that chain.`,
    `Write it down as a crew habit so it still happens when you are on a job.`,
    `Check the result on your own phone before you call it done.`,
    `Then move to the next item on the list instead of starting five projects at once.`,
    `When the basics are solid, paid ads and bigger campaigns finally have something worth amplifying.`,
  ];

  return `${blocks[index % blocks.length]}\n\n${extras[index % extras.length]}`;
}

function tradeLabelFor(trade: string) {
  switch (trade) {
    case "plumbing":
      return "plumbing businesses";
    case "hvac":
      return "HVAC businesses";
    case "electrical":
      return "electrical businesses";
    case "roofing":
      return "roofing businesses";
    case "landscaping":
      return "landscaping businesses";
    case "building":
      return "builders";
    default:
      return "trade businesses";
  }
}

async function generateWithOpenAI(topic: BlogTopic): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_BLOG_MODEL ?? "gpt-4.1-mini";
  const system = `You write blog posts for FOREMAN, which helps trade businesses (plumbers, roofers, electricians, HVAC, builders, landscapers) get found online and get more booked jobs.

Tone model: useful owner tips like SpotHopper’s restaurant marketing blog - practical, scannable, problem-solving. Teach something an owner can do this week.

Voice: friendly, plain, trade-smart. Short sentences. Active verbs. Speak to "you". No exclamation marks in headlines. No invented statistics, testimonials, or client names. No agency jargon (synergy, funnel, omnichannel, unlock, disrupt).

Format: markdown with one H1 matching the title, H2 sections from the outline, and a closing CTA to [Book a free demo](/free-demo).

SEO: weave the primary keyword naturally a few times. Do not keyword stuff. The article must feel like helpful advice first.`;

  const user = `Write a complete markdown tip article for trade owners.

Title: ${topic.title}
Primary keyword (use lightly): ${topic.primaryKeyword}
Related phrases: ${topic.secondaryKeywords.join(", ")}
Trade focus: ${topic.trade}
Angle: ${topic.angle}
Outline headings:
${topic.outline.map((item) => `- ${item}`).join("\n")}

Aim for roughly 700-900 words. Lead with the owner’s problem. Give concrete steps. End with one clear next action plus the demo CTA.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI blog generation failed: ${response.status} ${detail}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = json.choices?.[0]?.message?.content?.trim();
  return content || null;
}

export async function generateBlogPost(options?: {
  topicId?: string;
  date?: Date;
  usedTopicIds?: string[];
}): Promise<BlogPostInput> {
  const topic =
    (options?.topicId ? topicById(options.topicId) : null) ??
    pickTopicForDay(options?.date ?? new Date(), options?.usedTopicIds ?? []);

  let body = "";
  try {
    body = (await generateWithOpenAI(topic)) ?? renderArticle(topic);
  } catch {
    body = renderArticle(topic);
  }

  const slugBase = slugify(topic.title);
  const day = (options?.date ?? new Date()).toISOString().slice(0, 10);
  const slug = `${slugBase}-${day}`;

  const excerpt = excerptFrom(body, topic.angle);

  return {
    slug,
    title: topic.title,
    excerpt,
    body_md: body,
    trade: topic.trade,
    primary_keyword: topic.primaryKeyword,
    secondary_keywords: topic.secondaryKeywords,
    meta_title: `${topic.title} | FOREMAN`,
    meta_description: excerpt,
    status: "published",
    source: "agent",
    published_at: new Date().toISOString(),
  };
}

export function topicIdFromKeywords(post: {
  primary_keyword?: string | null;
  title: string;
}) {
  const match = BLOG_TOPICS.find(
    (topic) =>
      topic.primaryKeyword === post.primary_keyword ||
      topic.title === post.title,
  );
  return match?.id ?? null;
}
