import type { ReactNode } from "react";

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern =
    /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[1]) {
      const href = match[3]!;
      const label = match[2]!;
      parts.push(
        <a
          key={`a-${key++}`}
          href={href}
          className="font-bold text-foreman underline decoration-foreman/30 underline-offset-4 hover:decoration-foreman"
        >
          {label}
        </a>,
      );
    } else if (match[4]) {
      parts.push(
        <strong key={`b-${key++}`} className="font-bold text-cocoa">
          {match[5]}
        </strong>,
      );
    } else if (match[6]) {
      parts.push(
        <code
          key={`c-${key++}`}
          className="rounded bg-peach px-1.5 py-0.5 text-[0.95em]"
        >
          {match[7]}
        </code>,
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: "p", text: paragraph.join(" ").trim() });
    paragraph = [];
  };

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push({ type: "ul", items: [...list] });
    list = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      list.push(trimmed.slice(2));
      continue;
    }

    flushList();

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: trimmed.slice(4) });
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: trimmed.slice(3) });
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flushParagraph();
      blocks.push({ type: "h1", text: trimmed.slice(2) });
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "h1") {
          return (
            <h1
              key={index}
              className="text-[2.25rem] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance text-cocoa sm:text-5xl"
            >
              {inline(block.text)}
            </h1>
          );
        }
        if (block.type === "h2") {
          return (
            <h2
              key={index}
              className="pt-4 text-2xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa"
            >
              {inline(block.text)}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={index}
              className="text-xl leading-tight font-extrabold tracking-[-0.02em] text-cocoa"
            >
              {inline(block.text)}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-muted">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{inline(item)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-[18px] leading-[1.65] text-muted">
            {inline(block.text)}
          </p>
        );
      })}
    </div>
  );
}
