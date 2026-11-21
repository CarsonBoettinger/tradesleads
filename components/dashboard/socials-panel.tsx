"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SOCIAL_FREQUENCY_OPTIONS,
  type SocialConnectionPublic,
  type SocialPlatform,
  type SocialPost,
  type SocialPostFrequency,
  type SocialPostSettings,
} from "@/lib/social/types";

type Props = {
  brandId: string;
};

const HOUR_ROWS = [9, 12, 15, 18, 21];

export function SocialsPanel({ brandId }: Props) {
  const [connections, setConnections] = useState<SocialConnectionPublic[]>([]);
  const [settings, setSettings] = useState<SocialPostSettings | null>(null);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [editing, setEditing] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/dashboard/social/${brandId}`);
    if (!res.ok) {
      setMessage("Could not load social publishing.");
      setLoading(false);
      return;
    }
    const json = (await res.json()) as {
      connections: SocialConnectionPublic[];
      settings: SocialPostSettings;
      posts: SocialPost[];
    };
    setConnections(json.connections);
    setSettings(json.settings);
    setPosts(json.posts);
    setLoading(false);
  }, [brandId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("social_connected");
    const error = params.get("social_error");
    if (connected) {
      setMessage(
        connected === "instagram"
          ? "Instagram connected."
          : "Facebook connected.",
      );
    }
    if (error) setMessage(error);
  }, []);

  const byPlatform = useMemo(() => {
    const map: Partial<Record<SocialPlatform, SocialConnectionPublic>> = {};
    for (const c of connections) map[c.platform] = c;
    return map;
  }, [connections]);

  const selected = posts.find((p) => p.id === selectedId) ?? null;

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const postsByDayHour = useMemo(() => {
    const map = new Map<string, SocialPost[]>();
    for (const post of posts) {
      if (post.status === "rejected") continue;
      const when = new Date(post.scheduledFor);
      const dayKey = dateKey(when);
      const hour = nearestHourRow(when.getHours());
      const key = `${dayKey}:${hour}`;
      const list = map.get(key) ?? [];
      list.push(post);
      map.set(key, list);
    }
    return map;
  }, [posts]);

  async function connect(platform: SocialPlatform) {
    setBusy(`connect-${platform}`);
    setMessage("");
    try {
      const res = await fetch(
        `/api/dashboard/social/meta/start?brandId=${encodeURIComponent(brandId)}&platform=${platform}`,
      );
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setMessage(json.error || "Could not start Meta connect.");
        return;
      }
      window.location.href = json.url;
    } finally {
      setBusy(null);
    }
  }

  async function confirmFrequency(frequency: SocialPostFrequency) {
    setBusy("cadence");
    setMessage("");
    try {
      const res = await fetch(`/api/dashboard/social/${brandId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, cadenceConfirmed: true }),
      });
      const json = (await res.json()) as {
        settings?: SocialPostSettings;
        error?: string;
      };
      if (!res.ok || !json.settings) {
        setMessage(json.error || "Could not save frequency.");
        return;
      }
      setSettings(json.settings);
      setMessage("Saved. You can change this later in Settings.");

      const gen = await fetch(`/api/dashboard/social/${brandId}/generate`, {
        method: "POST",
      });
      if (gen.ok) {
        const genJson = (await gen.json()) as { posts?: SocialPost[] };
        if (genJson.posts) setPosts(genJson.posts);
        else await load();
      } else {
        await load();
      }
    } finally {
      setBusy(null);
    }
  }

  async function postAction(
    postId: string,
    action: "approve" | "reject" | "edit" | "regenerate",
    caption?: string,
  ) {
    setBusy(postId);
    setMessage("");
    try {
      const res = await fetch(
        `/api/dashboard/social/${brandId}/posts/${postId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, caption }),
        },
      );
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMessage(json.error || "Action failed.");
        return;
      }
      setEditing(false);
      await load();
      if (action === "approve") setMessage("Post approved.");
      if (action === "reject") {
        setSelectedId(null);
        setMessage("Post rejected.");
      }
      if (action === "regenerate") {
        setSelectedId(null);
        setMessage("Draft regenerated.");
      }
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-[14px] border border-peach bg-white px-6 py-16 text-center">
        <span
          className="mx-auto size-8 animate-spin rounded-full border-[3px] border-foreman/20 border-t-foreman"
          aria-hidden
        />
        <p className="mt-4 text-sm text-muted">Loading social publishing…</p>
      </section>
    );
  }

  const hasConnection = connections.length > 0;
  const cadenceReady = Boolean(settings?.cadenceConfirmed);

  if (!hasConnection) {
    return (
      <div className="space-y-5">
        {message ? <Banner text={message} /> : null}
        <section className="rounded-[14px] border border-peach bg-white px-6 py-14 text-center">
          <p className="text-lg font-extrabold tracking-tight">
            Connect your social accounts
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Link the business Facebook Page and Instagram so we can draft posts
            for your approval and publish on schedule.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <ConnectButton
              platform="facebook"
              label="Connect Facebook"
              busy={busy === "connect-facebook"}
              disabled={Boolean(busy)}
              onClick={() => void connect("facebook")}
            />
            <ConnectButton
              platform="instagram"
              label="Connect Instagram"
              busy={busy === "connect-instagram"}
              disabled={Boolean(busy)}
              onClick={() => void connect("instagram")}
            />
          </div>
          <p className="mt-6 text-xs text-muted">
            Instagram must be a professional account linked to a Facebook Page.
          </p>
        </section>
      </div>
    );
  }

  if (!cadenceReady) {
    return (
      <div className="space-y-5">
        {message ? <Banner text={message} /> : null}
        <section className="rounded-[14px] border border-peach bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Connected
            {byPlatform.facebook ? " · Facebook" : ""}
            {byPlatform.instagram ? " · Instagram" : ""}
          </p>
          <h3 className="mt-2 text-lg font-extrabold tracking-tight">
            How often would you like to post?
          </h3>
          <p className="mt-1 text-sm text-muted">
            We&apos;ll draft caption + image posts about a week ahead. You can
            change this later in Settings.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {SOCIAL_FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                disabled={busy === "cadence"}
                onClick={() => void confirmFrequency(opt.value)}
                className="rounded-[12px] border-2 border-peach bg-cream/40 px-4 py-3 text-left transition hover:border-foreman disabled:opacity-50"
              >
                <span className="block text-sm font-extrabold">{opt.label}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {opt.hint}
                </span>
              </button>
            ))}
          </div>
          {busy === "cadence" ? (
            <p className="mt-4 text-sm text-muted">Saving and drafting…</p>
          ) : null}
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {message ? <Banner text={message} /> : null}

      <section className="overflow-hidden rounded-[14px] border border-peach bg-[#f3f4f6]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-white px-4 py-3">
          <div>
            <h3 className="font-extrabold">Posting calendar</h3>
            <p className="text-xs text-muted">
              <span className="mr-3 inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500" />
                Approved
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-500" />
                Needs approval
              </span>
            </p>
            {(!byPlatform.facebook || !byPlatform.instagram) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {!byPlatform.facebook ? (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => void connect("facebook")}
                    className="text-xs font-semibold text-foreman hover:underline disabled:opacity-50"
                  >
                    Connect Facebook
                  </button>
                ) : null}
                {!byPlatform.instagram ? (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => void connect("instagram")}
                    className="text-xs font-semibold text-foreman hover:underline disabled:opacity-50"
                  >
                    Connect Instagram
                  </button>
                ) : null}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-[10px] border-2 border-peach bg-white px-2.5 py-1.5 text-sm font-bold hover:border-foreman"
              onClick={() =>
                setWeekStart((prev) => {
                  const d = new Date(prev);
                  d.setDate(d.getDate() - 7);
                  return startOfWeek(d);
                })
              }
              aria-label="Previous week"
            >
              ←
            </button>
            <button
              type="button"
              className="rounded-[10px] border-2 border-peach bg-white px-3 py-1.5 text-sm font-bold hover:border-foreman"
              onClick={() => setWeekStart(startOfWeek(new Date()))}
            >
              Today
            </button>
            <button
              type="button"
              className="rounded-[10px] border-2 border-peach bg-white px-2.5 py-1.5 text-sm font-bold hover:border-foreman"
              onClick={() =>
                setWeekStart((prev) => {
                  const d = new Date(prev);
                  d.setDate(d.getDate() + 7);
                  return startOfWeek(d);
                })
              }
              aria-label="Next week"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className="min-w-[720px] grid"
            style={{
              gridTemplateColumns: `64px repeat(${days.length}, minmax(110px, 1fr))`,
            }}
          >
            <div className="border-b border-black/5 bg-white/80" />
            {days.map((day) => (
              <div
                key={dateKey(day)}
                className="border-b border-l border-black/5 bg-white/80 px-2 py-3 text-center"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                </p>
                <p className="text-lg font-extrabold tabular-nums">
                  {day.getDate()}
                </p>
              </div>
            ))}

            {HOUR_ROWS.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-b border-black/5 px-2 py-3 text-right text-xs font-semibold text-muted">
                  {formatHourLabel(hour)}
                </div>
                {days.map((day) => {
                  const key = `${dateKey(day)}:${hour}`;
                  const cellPosts = postsByDayHour.get(key) ?? [];
                  return (
                    <div
                      key={key}
                      className="min-h-[88px] border-b border-l border-black/5 p-1.5"
                    >
                      <div className="flex flex-col gap-1.5">
                        {cellPosts.map((post) => (
                          <CalendarCard
                            key={post.id}
                            post={post}
                            active={selectedId === post.id}
                            onClick={() => {
                              setSelectedId(post.id);
                              setEditing(false);
                              setEditCaption(post.caption);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {selected ? (
        <PostDetail
          post={selected}
          busy={busy === selected.id}
          editing={editing}
          editCaption={editCaption}
          setEditCaption={setEditCaption}
          onClose={() => {
            setSelectedId(null);
            setEditing(false);
          }}
          onEdit={() => {
            setEditing(true);
            setEditCaption(selected.caption);
          }}
          onCancelEdit={() => setEditing(false)}
          onSaveEdit={() =>
            void postAction(selected.id, "edit", editCaption)
          }
          onApprove={() => void postAction(selected.id, "approve")}
          onReject={() => void postAction(selected.id, "reject")}
          onRegenerate={() => void postAction(selected.id, "regenerate")}
        />
      ) : (
        <p className="text-center text-sm text-muted">
          Click a post on the calendar to approve or edit it. Change posting
          frequency in Settings.
        </p>
      )}
    </div>
  );
}

function CalendarCard({
  post,
  active,
  onClick,
}: {
  post: SocialPost;
  active: boolean;
  onClick: () => void;
}) {
  const needsApproval = post.status === "pending_approval";
  const approved =
    post.status === "scheduled" ||
    post.status === "approved" ||
    post.status === "published" ||
    post.status === "publishing";
  const failed = post.status === "failed";

  const ring = needsApproval
    ? "ring-red-400"
    : approved
      ? "ring-emerald-400"
      : failed
        ? "ring-red-300"
        : "ring-peach";

  const badge = needsApproval
    ? { label: "REVIEW", className: "bg-red-500 text-white" }
    : post.status === "published"
      ? { label: "DONE", className: "bg-stone-200 text-stone-600" }
      : approved
        ? { label: "OK", className: "bg-emerald-500 text-white" }
        : { label: "ERR", className: "bg-red-100 text-red-700" };

  const title =
    post.caption.trim().split(/\n/)[0]?.slice(0, 28) || "Untitled post";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full overflow-hidden rounded-[10px] bg-white text-left shadow-sm ring-2 transition hover:shadow-md ${ring} ${
        active ? "scale-[1.01]" : ""
      }`}
    >
      <div className="flex gap-2 p-1.5">
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl}
            alt=""
            className="size-10 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="size-10 shrink-0 rounded-md bg-cream" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold leading-tight text-cocoa">
            {title}
            {post.caption.trim().length > 28 ? "…" : ""}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-1">
            <span
              className={`size-2 rounded-full ${
                needsApproval
                  ? "bg-red-400"
                  : approved
                    ? "bg-emerald-400"
                    : "bg-amber-400"
              }`}
              aria-hidden
            />
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function PostDetail({
  post,
  busy,
  editing,
  editCaption,
  setEditCaption,
  onClose,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onApprove,
  onReject,
  onRegenerate,
}: {
  post: SocialPost;
  busy: boolean;
  editing: boolean;
  editCaption: string;
  setEditCaption: (v: string) => void;
  onClose: () => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRegenerate: () => void;
}) {
  const needsApproval = post.status === "pending_approval";

  return (
    <section className="rounded-[14px] border border-peach bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {formatWhen(post.scheduledFor)} · {post.status.replaceAll("_", " ")}
          </p>
          <h3 className="mt-1 font-extrabold">Post details</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-semibold text-muted hover:text-cocoa"
        >
          Close
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr]">
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl}
            alt=""
            className="h-40 w-full rounded-[12px] object-cover sm:h-full"
          />
        ) : (
          <div className="flex h-40 items-center justify-center rounded-[12px] bg-cream text-sm text-muted">
            No image
          </div>
        )}
        <div>
          {editing ? (
            <textarea
              className="w-full rounded-[10px] border-2 border-peach bg-white px-3 py-2 text-sm outline-none focus:border-foreman"
              rows={5}
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
            />
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {post.caption}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {editing ? (
              <>
                <ActionButton disabled={busy} onClick={onSaveEdit}>
                  Save caption
                </ActionButton>
                <ActionButton tone="muted" disabled={busy} onClick={onCancelEdit}>
                  Cancel
                </ActionButton>
              </>
            ) : (
              <>
                {needsApproval || post.status === "failed" ? (
                  <ActionButton disabled={busy} onClick={onApprove}>
                    Approve
                  </ActionButton>
                ) : null}
                <ActionButton tone="muted" disabled={busy} onClick={onEdit}>
                  Edit
                </ActionButton>
                {needsApproval ? (
                  <ActionButton
                    tone="muted"
                    disabled={busy}
                    onClick={onRegenerate}
                  >
                    Regenerate
                  </ActionButton>
                ) : null}
                {needsApproval ? (
                  <ActionButton tone="danger" disabled={busy} onClick={onReject}>
                    Reject
                  </ActionButton>
                ) : null}
              </>
            )}
          </div>
          {post.errorMessage ? (
            <p className="mt-3 text-xs text-red-700">{post.errorMessage}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ConnectButton({
  platform,
  label,
  busy,
  disabled,
  onClick,
}: {
  platform: SocialPlatform;
  label: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2.5 rounded-[10px] bg-foreman px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
    >
      {platform === "facebook" ? <IconFacebook /> : <IconInstagram />}
      {busy ? "Opening…" : label}
    </button>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden fill="currentColor">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden fill="currentColor">
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    </svg>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  tone = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  tone?: "primary" | "muted" | "danger";
}) {
  const className =
    tone === "primary"
      ? "bg-foreman text-white hover:opacity-90"
      : tone === "danger"
        ? "border-2 border-red-200 bg-white text-red-700 hover:border-red-400"
        : "border-2 border-peach bg-white hover:border-foreman";
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-[10px] px-3 py-1.5 text-sm font-semibold disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

function Banner({ text }: { text: string }) {
  return (
    <p className="rounded-[10px] bg-cream px-4 py-3 text-sm font-semibold">
      {text}
    </p>
  );
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  return d;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nearestHourRow(hour: number) {
  let best = HOUR_ROWS[0]!;
  let bestDist = Math.abs(hour - best);
  for (const row of HOUR_ROWS) {
    const dist = Math.abs(hour - row);
    if (dist < bestDist) {
      best = row;
      bestDist = dist;
    }
  }
  return best;
}

function formatHourLabel(hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  }).format(d);
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
