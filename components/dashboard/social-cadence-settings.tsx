"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SOCIAL_FREQUENCY_OPTIONS,
  type SocialConnectionPublic,
  type SocialPlatform,
  type SocialPostFrequency,
  type SocialPostSettings,
} from "@/lib/social/types";

const fieldClass =
  "mt-1.5 w-full rounded-[10px] border-2 border-peach bg-white px-3 py-2 text-sm outline-none focus:border-foreman";

export function SocialCadenceSettings({ brandId }: { brandId: string }) {
  const [settings, setSettings] = useState<SocialPostSettings | null>(null);
  const [connections, setConnections] = useState<SocialConnectionPublic[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/dashboard/social/${brandId}`);
    if (!res.ok) return;
    const json = (await res.json()) as {
      settings: SocialPostSettings;
      connections: SocialConnectionPublic[];
    };
    setSettings(json.settings);
    setConnections(json.connections);
  }, [brandId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    try {
      const res = await fetch(`/api/dashboard/social/${brandId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as {
        settings?: SocialPostSettings;
        error?: string;
      };
      if (!res.ok || !json.settings) {
        setMessage(json.error || "Could not save.");
        return;
      }
      setSettings(json.settings);
      setMessage("Posting preferences saved.");
    } finally {
      setBusy(false);
    }
  }

  async function disconnect(platform: SocialPlatform) {
    if (!confirm(`Disconnect ${platform}?`)) return;
    setBusy(true);
    try {
      const res = await fetch(
        `/api/dashboard/social/${brandId}?platform=${platform}`,
        { method: "DELETE" },
      );
      const json = (await res.json()) as {
        connections?: SocialConnectionPublic[];
      };
      if (res.ok && json.connections) setConnections(json.connections);
    } finally {
      setBusy(false);
    }
  }

  if (!settings) {
    return (
      <section className="rounded-[14px] border border-peach bg-white p-5">
        <p className="text-sm text-muted">Loading posting preferences…</p>
      </section>
    );
  }

  const byPlatform = Object.fromEntries(
    connections.map((c) => [c.platform, c]),
  ) as Partial<Record<SocialPlatform, SocialConnectionPublic>>;

  return (
    <section className="rounded-[14px] border border-peach bg-white p-5">
      <h3 className="font-extrabold">Social posting</h3>
      <p className="mt-1 text-sm text-muted">
        How often we draft posts, and which accounts stay connected. Change
        these anytime - the Socials calendar uses them.
      </p>

      {message ? (
        <p className="mt-3 rounded-[10px] bg-cream px-3 py-2 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      <label className="mt-5 block text-sm font-semibold">
        How often should we post?
        <select
          className={fieldClass}
          disabled={busy}
          value={settings.frequency}
          onChange={(e) =>
            void patch({
              frequency: e.target.value as SocialPostFrequency,
              cadenceConfirmed: true,
            })
          }
        >
          {SOCIAL_FREQUENCY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} - {opt.hint}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 block text-sm font-semibold">
        Preferred time
        <select
          className={fieldClass}
          disabled={busy}
          value={settings.preferredHour}
          onChange={(e) =>
            void patch({ preferredHour: Number(e.target.value) })
          }
        >
          {Array.from({ length: 24 }, (_, h) => (
            <option key={h} value={h}>
              {formatHour(h)}
            </option>
          ))}
        </select>
      </label>

      <label className="mt-4 flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={settings.enabled}
          disabled={busy}
          onChange={(e) => void patch({ enabled: e.target.checked })}
        />
        Auto-draft posts for approval
      </label>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {(["facebook", "instagram"] as SocialPlatform[]).map((platform) => {
          const connected = byPlatform[platform];
          return (
            <div
              key={platform}
              className="rounded-[12px] border border-peach bg-cream/40 px-4 py-3"
            >
              <p className="text-sm font-extrabold capitalize">{platform}</p>
              {connected ? (
                <>
                  <p className="mt-1 text-xs text-muted">
                    {connected.pageName || "Connected"}
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void disconnect(platform)}
                    className="mt-2 text-xs font-semibold text-foreman hover:underline disabled:opacity-50"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <p className="mt-1 text-xs text-muted">
                  Connect from the Socials tab.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatHour(hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}
