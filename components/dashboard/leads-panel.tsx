"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CHECKLIST_KEYS,
  CHECKLIST_LABELS,
  LEAD_STATUSES,
  STATUS_LABELS,
  channelLabel,
  type BrandLead,
  type BrandLeadStatus,
  type ChecklistKey,
  type LeadActivity,
} from "@/lib/leads/crm-types";

type Props = {
  brandId: string;
};

type StatusFilter = BrandLeadStatus | "all";

export function LeadsPanel({ brandId }: Props) {
  const [leads, setLeads] = useState<BrandLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [note, setNote] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addComments, setAddComments] = useState("");

  const load = useCallback(async () => {
    const params =
      statusFilter === "all" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
    const res = await fetch(`/api/dashboard/leads/${brandId}${params}`);
    if (!res.ok) {
      setMessage("Could not load leads.");
      setLoading(false);
      return;
    }
    const json = (await res.json()) as { leads: BrandLead[] };
    setLeads(json.leads);
    setLoading(false);
  }, [brandId, statusFilter]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const selected = useMemo(
    () => leads.find((lead) => lead.id === selectedId) ?? null,
    [leads, selectedId],
  );

  useEffect(() => {
    if (!selectedId) {
      setActivities([]);
      return;
    }
    let cancelled = false;
    setActivitiesLoading(true);
    void (async () => {
      const res = await fetch(
        `/api/dashboard/leads/${brandId}/${selectedId}/activities`,
      );
      if (cancelled) return;
      if (!res.ok) {
        setActivities([]);
        setActivitiesLoading(false);
        return;
      }
      const json = (await res.json()) as { activities: LeadActivity[] };
      setActivities(json.activities);
      setActivitiesLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [brandId, selectedId]);

  useEffect(() => {
    if (selectedId && !leads.some((lead) => lead.id === selectedId)) {
      setSelectedId(null);
    }
  }, [leads, selectedId]);

  async function createLead(event: React.FormEvent) {
    event.preventDefault();
    setBusy("create");
    setMessage("");
    try {
      const res = await fetch(`/api/dashboard/leads/${brandId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addName,
          phone: addPhone,
          email: addEmail || undefined,
          comments: addComments || undefined,
        }),
      });
      const json = (await res.json()) as { lead?: BrandLead; error?: string };
      if (!res.ok || !json.lead) {
        setMessage(json.error || "Could not add lead.");
        return;
      }
      setAddName("");
      setAddPhone("");
      setAddEmail("");
      setAddComments("");
      setShowAdd(false);
      setStatusFilter("all");
      setSelectedId(json.lead.id);
      setMessage("Phone lead added.");
      await load();
    } catch {
      setMessage("Could not add lead.");
    } finally {
      setBusy(null);
    }
  }

  async function patchLead(
    leadId: string,
    body: { status?: BrandLeadStatus; checklist?: Partial<Record<ChecklistKey, boolean>> },
  ) {
    setBusy(`patch-${leadId}`);
    setMessage("");
    try {
      const res = await fetch(`/api/dashboard/leads/${brandId}/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { lead?: BrandLead; error?: string };
      if (!res.ok || !json.lead) {
        setMessage(json.error || "Could not update lead.");
        return;
      }
      setLeads((prev) =>
        prev.map((lead) => (lead.id === json.lead!.id ? json.lead! : lead)),
      );
      const actRes = await fetch(
        `/api/dashboard/leads/${brandId}/${leadId}/activities`,
      );
      if (actRes.ok) {
        const actJson = (await actRes.json()) as { activities: LeadActivity[] };
        setActivities(actJson.activities);
      }
    } catch {
      setMessage("Could not update lead.");
    } finally {
      setBusy(null);
    }
  }

  async function addNote(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedId || !note.trim()) return;
    setBusy("note");
    setMessage("");
    try {
      const res = await fetch(
        `/api/dashboard/leads/${brandId}/${selectedId}/activities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: note }),
        },
      );
      const json = (await res.json()) as {
        activity?: LeadActivity;
        error?: string;
      };
      if (!res.ok || !json.activity) {
        setMessage(json.error || "Could not add note.");
        return;
      }
      setActivities((prev) => [json.activity!, ...prev]);
      setNote("");
    } catch {
      setMessage("Could not add note.");
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <p className="rounded-[10px] border-2 border-peach bg-white px-4 py-6 text-sm text-muted">
        Loading leads…
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
            label="All"
          />
          {LEAD_STATUSES.map((status) => (
            <FilterChip
              key={status}
              active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
              label={STATUS_LABELS[status]}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAdd((open) => !open)}
          className="rounded-[10px] bg-foreman px-3 py-2 text-sm font-bold text-white"
        >
          {showAdd ? "Cancel" : "Add phone lead"}
        </button>
      </div>

      {message ? (
        <p className="rounded-[10px] bg-cream px-4 py-3 text-sm font-semibold">
          {message}
        </p>
      ) : null}

      {showAdd ? (
        <form
          onSubmit={createLead}
          className="rounded-[10px] border-2 border-peach bg-white p-4 sm:p-5"
        >
          <h3 className="text-base font-extrabold tracking-tight">
            Log a phone lead
          </h3>
          <p className="mt-1 text-sm text-muted">
            Capture callers so they stay in the same pipeline as website
            inquiries.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Name
              <input
                required
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className={fieldClass}
                placeholder="Jane Smith"
              />
            </label>
            <label className="block text-sm font-semibold">
              Phone
              <input
                required
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
                className={fieldClass}
                placeholder="(555) 123-4567"
                inputMode="tel"
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Email <span className="font-normal text-muted">(optional)</span>
              <input
                value={addEmail}
                onChange={(e) => setAddEmail(e.target.value)}
                className={fieldClass}
                type="email"
                placeholder="jane@email.com"
              />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">
              Notes <span className="font-normal text-muted">(optional)</span>
              <textarea
                value={addComments}
                onChange={(e) => setAddComments(e.target.value)}
                className={fieldClass + " min-h-[88px]"}
                placeholder="What they need, when to call back…"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={busy === "create"}
            className="mt-4 rounded-[10px] bg-foreman px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy === "create" ? "Saving…" : "Save lead"}
          </button>
        </form>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="rounded-[10px] border-2 border-peach bg-white">
          {leads.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-base font-extrabold tracking-tight">
                No leads yet
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
                Leads from your site and phone calls show up here. Add a phone
                lead anytime someone calls in.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-peach">
              {leads.map((lead) => {
                const active = lead.id === selectedId;
                const displayName = [lead.firstName, lead.lastName]
                  .filter((part) => part && part !== "-")
                  .join(" ");
                return (
                  <li key={lead.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(lead.id)}
                      className={
                        "flex w-full flex-col gap-1 px-4 py-3.5 text-left transition " +
                        (active
                          ? "bg-cream"
                          : "hover:bg-[#f8fafc]")
                      }
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-bold text-cocoa">
                          {displayName || "Lead"}
                        </span>
                        <span className="shrink-0 text-xs font-semibold text-muted">
                          {formatAge(lead.createdAt)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="rounded-md bg-[#eef2f7] px-2 py-0.5 text-muted">
                          {channelLabel(lead.channel, lead.source)}
                        </span>
                        <span className="rounded-md bg-white px-2 py-0.5 text-cocoa ring-1 ring-peach">
                          {STATUS_LABELS[lead.status]}
                        </span>
                        {lead.phone ? (
                          <span className="text-muted">{lead.phone}</span>
                        ) : null}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-[10px] border-2 border-peach bg-white p-4 sm:p-5">
          {!selected ? (
            <div className="flex h-full min-h-[220px] items-center justify-center px-4 text-center">
              <p className="text-sm text-muted">
                Select a lead to update status, checklist, and notes.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-extrabold tracking-tight">
                  {[selected.firstName, selected.lastName]
                    .filter((part) => part && part !== "-")
                    .join(" ") || "Lead"}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {channelLabel(selected.channel, selected.source)} ·{" "}
                  {formatWhen(selected.createdAt)}
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  {selected.phone ? (
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      <a
                        href={`tel:${selected.phone}`}
                        className="text-foreman underline-offset-2 hover:underline"
                      >
                        {selected.phone}
                      </a>
                    </p>
                  ) : null}
                  {selected.email ? (
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-foreman underline-offset-2 hover:underline"
                      >
                        {selected.email}
                      </a>
                    </p>
                  ) : null}
                  {selected.comments ? (
                    <p className="rounded-[10px] bg-cream px-3 py-2 text-sm">
                      {selected.comments}
                    </p>
                  ) : null}
                </div>
              </div>

              <label className="block text-sm font-semibold">
                Status
                <select
                  value={selected.status}
                  disabled={busy === `patch-${selected.id}`}
                  onChange={(e) =>
                    void patchLead(selected.id, {
                      status: e.target.value as BrandLeadStatus,
                    })
                  }
                  className={fieldClass}
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </label>

              <fieldset>
                <legend className="text-sm font-semibold">Actions</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {CHECKLIST_KEYS.map((key) => (
                    <label
                      key={key}
                      className="flex items-center gap-2 rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-semibold"
                    >
                      <input
                        type="checkbox"
                        checked={selected.checklist[key]}
                        disabled={busy === `patch-${selected.id}`}
                        onChange={(e) =>
                          void patchLead(selected.id, {
                            checklist: { [key]: e.target.checked },
                          })
                        }
                        className="size-4 accent-foreman"
                      />
                      {CHECKLIST_LABELS[key]}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <h4 className="text-sm font-semibold">Notes</h4>
                <form onSubmit={addNote} className="mt-2 space-y-2">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={fieldClass + " min-h-[80px]"}
                    placeholder="Log a call, quote detail, or follow-up…"
                  />
                  <button
                    type="submit"
                    disabled={busy === "note" || !note.trim()}
                    className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman disabled:opacity-50"
                  >
                    {busy === "note" ? "Saving…" : "Add note"}
                  </button>
                </form>
                <div className="mt-4 space-y-2">
                  {activitiesLoading ? (
                    <p className="text-sm text-muted">Loading activity…</p>
                  ) : activities.length === 0 ? (
                    <p className="text-sm text-muted">No activity yet.</p>
                  ) : (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="rounded-[10px] border border-peach px-3 py-2 text-sm"
                      >
                        <div className="flex items-center justify-between gap-2 text-xs font-semibold text-muted">
                          <span>
                            {activity.outcomeSummary ||
                              (activity.type === "status_change"
                                ? "Status change"
                                : "Note")}
                          </span>
                          <span>{formatWhen(activity.createdAt)}</span>
                        </div>
                        {activity.notes ? (
                          <p className="mt-1 text-cocoa">{activity.notes}</p>
                        ) : null}
                        {activity.actorName ? (
                          <p className="mt-1 text-xs text-muted">
                            {activity.actorName}
                          </p>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-[10px] px-3 py-1.5 text-sm font-bold transition " +
        (active
          ? "bg-foreman text-white"
          : "border-2 border-peach bg-white text-cocoa hover:border-foreman")
      }
    >
      {label}
    </button>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-[10px] border-2 border-peach bg-white px-3 py-2 text-sm outline-none focus:border-foreman";

function formatAge(iso: string) {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return mins <= 1 ? "Just now" : `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
