"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brandPreviewUrl } from "@/lib/hosts";
import {
  HOUR_TIME_OPTIONS,
  dayRowsToTextarea,
  hoursToDayRows,
  type DayHoursRow,
} from "@/lib/sites/hours";
import { SocialCadenceSettings } from "@/components/dashboard/social-cadence-settings";
import { SocialsPanel } from "@/components/dashboard/socials-panel";
import { LeadsPanel } from "@/components/dashboard/leads-panel";
import {
  GENERATION_PHASE_LABELS,
  type Brand,
  type BrandAsset,
  type BrandProfilePayload,
  type GenerationJob,
  type GenerationPhase,
  type QaChecklistItem,
  type SiteConfig,
  type SiteContent,
  type SiteSeo,
} from "@/lib/sites/types";

type Member = {
  id: string;
  role: string;
  userId: string;
  profile: { email?: string | null; full_name?: string | null } | null;
};

type SectionId =
  | "website"
  | "leads"
  | "socials"
  | "brand"
  | "launch"
  | "settings";

const SECTIONS: Array<{
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  staffOnly?: boolean;
}> = [
  { id: "website", label: "Website", icon: <IconGlobe /> },
  { id: "leads", label: "Leads", icon: <IconLeads /> },
  { id: "socials", label: "Socials", icon: <IconShare /> },
  { id: "brand", label: "Brand", icon: <IconPalette /> },
  {
    id: "launch",
    label: "Launch",
    icon: <IconRocket />,
    staffOnly: true,
  },
  { id: "settings", label: "Settings", icon: <IconSettings /> },
];

const fieldClass =
  "mt-1.5 w-full rounded-[10px] border-2 border-peach bg-white px-3 py-2 text-sm outline-none focus:border-foreman";

export function BrandDetail({
  brandId,
  initialBrand,
  initialConfig,
  initialAssets,
  initialJob,
  initialMembers,
  initialHours,
  role,
  userEmail,
}: {
  brandId: string;
  initialBrand: Brand;
  initialConfig: SiteConfig | null;
  initialAssets: BrandAsset[];
  initialJob: GenerationJob | null;
  initialMembers: Member[];
  initialHours?: BrandProfilePayload["hours"];
  role: "staff" | "client";
  userEmail: string | null;
}) {
  const [section, setSection] = useState<SectionId>("website");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("section");
    if (
      q === "socials" ||
      q === "brand" ||
      q === "settings" ||
      q === "website" ||
      q === "leads" ||
      q === "launch"
    ) {
      if (q === "launch" && role !== "staff") return;
      setSection(q);
    }
  }, [role]);

  useEffect(() => {
    if (section === "launch" && role !== "staff") {
      setSection("website");
    }
  }, [section, role]);
  const [brand, setBrand] = useState(initialBrand);
  const [config, setConfig] = useState(initialConfig);
  const [assets, setAssets] = useState(initialAssets);
  const [job, setJob] = useState(initialJob);
  const [members, setMembers] = useState(initialMembers);
  const [hoursRows, setHoursRows] = useState<DayHoursRow[]>(() =>
    hoursToDayRows(initialHours ?? []),
  );
  const [label, setLabel] = useState(
    initialJob
      ? GENERATION_PHASE_LABELS[initialJob.phase as GenerationPhase] ??
          initialJob.phase
      : "",
  );
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [message, setMessage] = useState("");
  const [temporaryCredentials, setTemporaryCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const preview = brandPreviewUrl(brand.slug);
  const logo = assets.find((a) => a.kind === "logo" && a.public_url);
  const isGenerating =
    job?.status === "queued" ||
    job?.status === "running" ||
    brand.status === "generating";

  const refresh = useCallback(async () => {
    const response = await fetch(`/api/dashboard/brands/${brandId}`);
    if (!response.ok) return;
    const json = (await response.json()) as {
      brand: Brand;
      config: SiteConfig | null;
      assets: BrandAsset[];
      job: GenerationJob | null;
      members?: Member[];
      hours?: BrandProfilePayload["hours"];
    };
    setBrand(json.brand);
    setConfig(json.config);
    setAssets(json.assets);
    setJob(json.job);
    if (json.members) setMembers(json.members);
    if (json.hours) setHoursRows(hoursToDayRows(json.hours));
  }, [brandId]);

  useEffect(() => {
    if (!isGenerating) return;
    let cancelled = false;

    async function poll() {
      const response = await fetch(`/api/dashboard/brands/${brandId}/job`);
      if (!response.ok || cancelled) return;
      const json = (await response.json()) as {
        job: GenerationJob | null;
        label?: string;
      };
      if (json.job) setJob(json.job);
      if (json.label) setLabel(json.label);
      if (json.job?.status === "ready" || json.job?.status === "failed") {
        await refresh();
      }
    }

    poll();
    const timer = setInterval(poll, 2000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [brandId, isGenerating, refresh]);

  const qaItems = useMemo(() => {
    const items =
      (config?.qa?.items as QaChecklistItem[] | undefined) ??
      (job?.qa?.items as QaChecklistItem[] | undefined) ??
      [];
    return items;
  }, [config, job]);

  async function regenerate() {
    setMessage("");
    const response = await fetch(`/api/dashboard/brands/${brandId}/generate`, {
      method: "POST",
    });
    const json = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(json.error ?? "Could not start generation.");
      return;
    }
    setBrand((b) => ({ ...b, status: "generating" }));
    setSection("website");
    setMessage("Generation started.");
  }

  async function publish() {
    setMessage("");
    const response = await fetch(`/api/dashboard/brands/${brandId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    const json = (await response.json()) as { error?: string };
    if (!response.ok) {
      setMessage(json.error ?? "Publish failed.");
      return;
    }
    await refresh();
    setMessage("Published.");
  }

  async function removeBrand() {
    if (deleting) return;
    const confirmed = window.confirm(
      `Delete ${brand.name}? This permanently removes the site, assets, and client access.`,
    );
    if (!confirmed) return;

    setDeleting(true);
    setMessage("");
    const response = await fetch(`/api/dashboard/brands/${brandId}`, {
      method: "DELETE",
    });
    const json = (await response.json()) as { error?: string };
    setDeleting(false);
    if (!response.ok) {
      setMessage(json.error ?? "Could not delete brand.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function assignClient(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");
    setTemporaryCredentials(null);
    setCopied(false);
    const response = await fetch(`/api/dashboard/brands/${brandId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: clientEmail, fullName: clientName }),
    });
    const json = (await response.json()) as {
      error?: string;
      members?: Member[];
      created?: boolean;
      email?: string;
      emailSent?: boolean;
      emailError?: string | null;
      temporaryPassword?: string | null;
    };
    if (!response.ok) {
      setMessage(json.error ?? "Could not assign client.");
      return;
    }
    if (json.members) setMembers(json.members);
    setClientEmail("");
    setClientName("");
    if (json.created && json.temporaryPassword && json.email) {
      setTemporaryCredentials({
        email: json.email,
        password: json.temporaryPassword,
      });
      if (json.emailSent) {
        setMessage(
          "Client invited and email sent. Temporary password is also shown once below.",
        );
      } else {
        setMessage(
          json.emailError
            ? `Client invited, but email did not send (${json.emailError}). Share the temporary password below.`
            : "Client invited. Share the temporary password below - it is shown only once.",
        );
      }
    } else {
      setMessage("Existing client assigned to this brand.");
    }
  }

  async function copyTemporaryPassword() {
    if (!temporaryCredentials) return;
    try {
      await navigator.clipboard.writeText(
        `Email: ${temporaryCredentials.email}\nTemporary password: ${temporaryCredentials.password}\nSign in: /dashboard/login\nThey must change this password on first sign-in.`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
      setMessage("Could not copy credentials. Copy the password manually.");
    }
  }

  const editableContent =
    config?.content?.hero &&
    config.content.about &&
    config.content.contact &&
    config.seo?.title
      ? config.content
      : null;

  async function saveBrandDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/dashboard/brands/${brandId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hoursText: dayRowsToTextarea(hoursRows),
        brand: {
          phone: String(form.get("phone") ?? brand.phone ?? ""),
          email: String(form.get("email") ?? brand.email ?? ""),
          address: String(form.get("address") ?? brand.address ?? ""),
        },
      }),
    });
    setSaving(false);
    if (!response.ok) {
      const json = (await response.json()) as { error?: string };
      setMessage(json.error ?? "Save failed.");
      return;
    }
    await refresh();
    setMessage("Business details saved.");
  }

  async function saveSiteCopy(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editableContent || !config?.seo || role !== "staff") return;
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const content: SiteContent = {
      ...editableContent,
      hero: {
        ...editableContent.hero,
        h1: String(form.get("h1") ?? editableContent.hero.h1),
        subhead: String(form.get("subhead") ?? editableContent.hero.subhead),
      },
      about: {
        ...editableContent.about,
        body: String(form.get("about") ?? editableContent.about.body),
      },
      contact: {
        ...editableContent.contact,
        body: String(form.get("contactBody") ?? editableContent.contact.body),
      },
    };
    const seo: SiteSeo = {
      ...config.seo,
      title: String(form.get("metaTitle") ?? config.seo.title),
      description: String(
        form.get("metaDescription") ?? config.seo.description,
      ),
    };
    const response = await fetch(`/api/dashboard/brands/${brandId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, seo }),
    });
    setSaving(false);
    if (!response.ok) {
      const json = (await response.json()) as { error?: string };
      setMessage(json.error ?? "Save failed.");
      return;
    }
    await refresh();
    setMessage("Site copy saved.");
  }

  function selectSection(next: SectionId) {
    if (next === "launch" && role !== "staff") return;
    setSection(next);
    setMobileNavOpen(false);
  }

  const navSections = useMemo(
    () => SECTIONS.filter((item) => !item.staffOnly || role === "staff"),
    [role],
  );

  const sectionTitle =
    navSections.find((item) => item.id === section)?.label ?? "Website";

  return (
    <div className="flex min-h-dvh overflow-x-clip">
      {/* Mobile overlay */}
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-30 bg-cocoa/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <aside
        className={
          "flex h-dvh w-[260px] shrink-0 flex-col border-r border-peach bg-white transition-transform duration-200 " +
          "fixed inset-y-0 left-0 z-40 lg:static lg:z-auto lg:translate-x-0 " +
          (mobileNavOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="border-b border-peach px-5 py-5">
          <Link href="/dashboard" className="inline-flex items-center gap-2.5">
            <Image
              src="/brand/kalvez-logo.png"
              alt="Kalvez"
              width={132}
              height={36}
              className="h-8 w-auto"
              priority
            />
          </Link>
          <p className="mt-3 truncate text-xs font-semibold text-muted">
            {brand.name}
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navSections.map((item) => {
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectSection(item.id)}
                className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                  active
                    ? "bg-foreman text-white"
                    : "text-cocoa hover:bg-cream"
                }`}
              >
                <span
                  className={active ? "text-white" : "text-muted"}
                  aria-hidden
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-peach px-4 py-4">
          <Link
            href="/dashboard"
            className="mb-3 block text-sm font-semibold text-muted hover:text-cocoa"
          >
            ← All brands
          </Link>
          <p className="truncate text-xs text-muted">{userEmail}</p>
          <form action="/api/dashboard/auth/signout" method="post" className="mt-2">
            <button
              type="submit"
              className="text-sm font-semibold text-cocoa hover:text-foreman"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-peach bg-white/95 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="rounded-[10px] border-2 border-peach px-2.5 py-2 lg:hidden"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
              >
                <IconMenu />
              </button>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {[brand.trade, brand.status].filter(Boolean).join(" · ")}
                </p>
                <h1 className="truncate text-xl font-extrabold tracking-tight sm:text-2xl">
                  {brand.name}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(brand.status === "ready" || brand.status === "published") && (
                <a
                  href={preview}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman"
                >
                  Open preview
                </a>
              )}
              {role === "staff" ? (
                <button
                  type="button"
                  onClick={regenerate}
                  className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman"
                >
                  Regenerate
                </button>
              ) : null}
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">
                {sectionTitle}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {section === "website"
                  ? "Live preview of the generated site."
                  : section === "leads"
                    ? "Track website and phone leads through status and follow-up actions."
                    : section === "socials"
                      ? "Connect accounts and manage the posting calendar."
                      : section === "brand"
                        ? "Logo and brand colors."
                        : section === "launch"
                          ? "Connect the client domain, verify DNS, and go live."
                          : "Posting frequency, business details, and account controls."}
              </p>
            </div>
          </div>

          {message ? (
            <p className="mb-5 rounded-[10px] bg-cream px-4 py-3 text-sm font-semibold">
              {message}
            </p>
          ) : null}

          {section === "website" ? (
            <WebsiteSection
              brand={brand}
              preview={preview}
              isGenerating={isGenerating}
              job={job}
              label={label}
              setMessage={setMessage}
            />
          ) : null}

          {section === "launch" && role === "staff" ? (
            <LaunchSection
              brand={brand}
              brandId={brandId}
              preview={preview}
              setBrand={setBrand}
              setMessage={setMessage}
              onPublish={publish}
            />
          ) : null}

          {section === "leads" ? <LeadsPanel brandId={brandId} /> : null}

          {section === "socials" ? (
            <SocialsPanel brandId={brandId} />
          ) : null}

          {section === "brand" ? (
            <BrandSection
              brandId={brandId}
              brand={brand}
              config={config}
              logo={logo}
              role={role}
              qaItems={qaItems}
              editableContent={editableContent}
              saving={saving}
              setSaving={setSaving}
              setMessage={setMessage}
              setConfig={setConfig}
              setAssets={setAssets}
              onSaveSiteCopy={saveSiteCopy}
              fieldClass={fieldClass}
            />
          ) : null}

          {section === "settings" ? (
            <SettingsSection
              brandId={brandId}
              brand={brand}
              role={role}
              members={members}
              hoursRows={hoursRows}
              setHoursRows={setHoursRows}
              saving={saving}
              clientEmail={clientEmail}
              setClientEmail={setClientEmail}
              clientName={clientName}
              setClientName={setClientName}
              temporaryCredentials={temporaryCredentials}
              copied={copied}
              deleting={deleting}
              fieldClass={fieldClass}
              onSaveBusinessDetails={saveBrandDetails}
              onAssignClient={assignClient}
              onCopyTemporaryPassword={copyTemporaryPassword}
              onRemoveBrand={removeBrand}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}

function WebsiteSection({
  brand,
  preview,
  isGenerating,
  job,
  label,
  setMessage,
}: {
  brand: Brand;
  preview: string;
  isGenerating: boolean;
  job: GenerationJob | null;
  label: string;
  setMessage: (value: string) => void;
}) {
  const [previewCopied, setPreviewCopied] = useState(false);

  async function copyPreview() {
    try {
      await navigator.clipboard.writeText(preview);
      setPreviewCopied(true);
      setTimeout(() => setPreviewCopied(false), 2000);
    } catch {
      setMessage("Could not copy preview link.");
    }
  }

  if (isGenerating) {
    const statusLabel =
      label ||
      (job
        ? GENERATION_PHASE_LABELS[job.phase as GenerationPhase]
        : "Starting generation");

    return (
      <section className="flex min-h-[min(78dvh,820px)] flex-col items-center justify-center rounded-[14px] border border-peach bg-white px-6 py-16 text-center">
        <span
          className="size-10 animate-spin rounded-full border-[3px] border-foreman/20 border-t-foreman"
          aria-hidden
        />
        <p className="mt-5 text-lg font-extrabold tracking-tight">
          Building your website
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted">{statusLabel}</p>
      </section>
    );
  }

  if (job?.status === "failed") {
    return (
      <section className="rounded-[14px] border-2 border-dashed border-red-200 bg-white px-6 py-16 text-center">
        <p className="font-semibold text-red-700">Generation failed</p>
        <p className="mt-2 text-sm text-muted">
          {job.error_message || "Try regenerating from the header."}
        </p>
      </section>
    );
  }

  if (brand.status !== "ready" && brand.status !== "published") {
    return (
      <section className="rounded-[14px] border-2 border-dashed border-peach bg-white px-6 py-16 text-center">
        <p className="font-semibold">Preview not ready yet</p>
        <p className="mt-2 text-sm text-muted">
          Use Regenerate in the header to build this site, then the live preview
          will show here.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[14px] border border-peach bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-muted">
              Private preview
            </h3>
            <p className="mt-1 break-all font-mono text-sm text-foreman">
              {preview}
            </p>
            <p className="mt-1 text-sm text-muted">
              Unguessable link for sharing. Not indexed.
            </p>
          </div>
          <button
            type="button"
            onClick={copyPreview}
            className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman"
          >
            {previewCopied ? "Copied" : "Copy link"}
          </button>
        </div>
      </section>

      <section className="rounded-[14px] border border-peach bg-white p-5">
        <div className="overflow-hidden rounded-[12px] border border-peach">
          <iframe
            title="Website preview"
            src={preview}
            className="h-[min(78dvh,820px)] w-full bg-white"
          />
        </div>
      </section>
    </div>
  );
}

function LaunchSection({
  brand,
  brandId,
  preview,
  setBrand,
  setMessage,
  onPublish,
}: {
  brand: Brand;
  brandId: string;
  preview: string;
  setBrand: React.Dispatch<React.SetStateAction<Brand>>;
  setMessage: (value: string) => void;
  onPublish: () => void | Promise<void>;
}) {
  const [domainInput, setDomainInput] = useState(brand.custom_domain ?? "");
  const [includeWww, setIncludeWww] = useState(brand.custom_domain_www !== false);
  const [dnsRows, setDnsRows] = useState<
    Array<{ hostname: string; type: string; value: string; note: string }>
  >([]);
  const [domainBusy, setDomainBusy] = useState(false);
  const [previewCopied, setPreviewCopied] = useState(false);

  useEffect(() => {
    setDomainInput(brand.custom_domain ?? "");
    setIncludeWww(brand.custom_domain_www !== false);
  }, [brand.custom_domain, brand.custom_domain_www]);

  useEffect(() => {
    let cancelled = false;
    async function loadDomain() {
      const response = await fetch(`/api/dashboard/brands/${brandId}/domain`);
      if (!response.ok || cancelled) return;
      const json = (await response.json()) as {
        dns?: Array<{
          hostname: string;
          type: string;
          value: string;
          note: string;
        }>;
      };
      if (json.dns) setDnsRows(json.dns);
    }
    loadDomain();
    return () => {
      cancelled = true;
    };
  }, [brandId, brand.custom_domain, brand.domain_status]);

  async function copyPreview() {
    try {
      await navigator.clipboard.writeText(preview);
      setPreviewCopied(true);
      setTimeout(() => setPreviewCopied(false), 2000);
    } catch {
      setMessage("Could not copy preview link.");
    }
  }

  async function domainAction(action: "save" | "verify" | "ssl") {
    setDomainBusy(true);
    setMessage("");
    const response = await fetch(`/api/dashboard/brands/${brandId}/domain`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        customDomain: domainInput,
        customDomainWww: includeWww,
      }),
    });
    const json = (await response.json()) as {
      error?: string;
      brand?: Brand;
      dns?: Array<{
        hostname: string;
        type: string;
        value: string;
        note: string;
      }>;
      ok?: boolean;
    };
    setDomainBusy(false);
    if (!response.ok) {
      setMessage(json.error ?? "Domain update failed.");
      if (json.brand) setBrand(json.brand);
      if (json.dns) setDnsRows(json.dns);
      return;
    }
    if (json.brand) setBrand(json.brand);
    if (json.dns) setDnsRows(json.dns);
    if (action === "save") setMessage("Domain saved. Point DNS, then verify.");
    if (action === "verify") {
      setMessage(
        json.ok
          ? "DNS looks good. Provision SSL next."
          : json.error ?? "DNS not ready yet.",
      );
    }
    if (action === "ssl") setMessage("Domain is live. You can publish now.");
  }

  const domainStatusLabel = brand.domain_status?.replaceAll("_", " ") ?? "none";
  const canPublish =
    brand.status !== "published" &&
    brand.domain_status === "live" &&
    Boolean(brand.custom_domain);

  return (
    <div className="space-y-5">
      <section className="rounded-[14px] border border-peach bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold uppercase tracking-wide text-muted">
              Private preview
            </h3>
            <p className="mt-1 break-all font-mono text-sm text-foreman">
              {preview}
            </p>
            <p className="mt-1 text-sm text-muted">
              Share this unguessable link before the client domain is live.
            </p>
          </div>
          <button
            type="button"
            onClick={copyPreview}
            className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman"
          >
            {previewCopied ? "Copied" : "Copy link"}
          </button>
        </div>
      </section>

      <section className="rounded-[14px] border border-peach bg-white p-5">
        <div>
          <h3 className="text-lg font-extrabold tracking-tight">
            Custom domain
          </h3>
          <p className="mt-1 text-sm text-muted">
            Status: {domainStatusLabel}
            {brand.domain_error ? ` — ${brand.domain_error}` : ""}
          </p>
        </div>

        <label className="mt-4 block text-sm font-semibold">
          Domain
          <input
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="example.com"
            className={fieldClass}
            autoComplete="off"
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            checked={includeWww}
            onChange={(e) => setIncludeWww(e.target.checked)}
          />
          Also attach www subdomain
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={domainBusy}
            onClick={() => domainAction("save")}
            className="rounded-[10px] bg-foreman px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            Save domain
          </button>
          <button
            type="button"
            disabled={domainBusy || !brand.custom_domain}
            onClick={() => domainAction("verify")}
            className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman disabled:opacity-50"
          >
            Check DNS
          </button>
          <button
            type="button"
            disabled={
              domainBusy ||
              !brand.custom_domain ||
              (brand.domain_status !== "pending_ssl" &&
                brand.domain_status !== "live" &&
                brand.domain_status !== "pending_dns")
            }
            onClick={() => domainAction("ssl")}
            className="rounded-[10px] border-2 border-peach px-3 py-2 text-sm font-bold hover:border-foreman disabled:opacity-50"
          >
            Provision SSL
          </button>
        </div>

        {dnsRows.length > 0 ? (
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-peach text-muted">
                  <th className="py-2 pr-3 font-semibold">Host</th>
                  <th className="py-2 pr-3 font-semibold">Type</th>
                  <th className="py-2 pr-3 font-semibold">Value</th>
                </tr>
              </thead>
              <tbody>
                {dnsRows.map((row) => (
                  <tr key={row.hostname} className="border-b border-peach/60">
                    <td className="py-2 pr-3 font-mono text-xs">
                      {row.hostname}
                    </td>
                    <td className="py-2 pr-3">{row.type}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-muted">
              After DNS propagates, Check DNS then Provision SSL. Publish only
              when status is live.
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-[14px] border border-peach bg-white p-5">
        <h3 className="text-lg font-extrabold tracking-tight">Publish</h3>
        <p className="mt-1 text-sm text-muted">
          Makes the site indexable on the client domain. Requires a live custom
          domain.
        </p>
        <button
          type="button"
          onClick={() => void onPublish()}
          disabled={!canPublish && brand.status !== "published"}
          title={
            brand.status === "published"
              ? "Already published"
              : brand.domain_status !== "live"
                ? "Launch on a live custom domain before publishing"
                : undefined
          }
          className="mt-4 rounded-[10px] bg-foreman px-3 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {brand.status === "published" ? "Published" : "Publish site"}
        </button>
      </section>
    </div>
  );
}

function BrandSection({
  brandId,
  brand,
  config,
  logo,
  role,
  qaItems,
  editableContent,
  saving,
  setSaving,
  setMessage,
  setConfig,
  setAssets,
  onSaveSiteCopy,
  fieldClass,
}: {
  brandId: string;
  brand: Brand;
  config: SiteConfig | null;
  logo: BrandAsset | undefined;
  role: "staff" | "client";
  qaItems: QaChecklistItem[];
  editableContent: SiteContent | null;
  saving: boolean;
  setSaving: (value: boolean) => void;
  setMessage: (value: string) => void;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
  setAssets: React.Dispatch<React.SetStateAction<BrandAsset[]>>;
  onSaveSiteCopy: (event: React.FormEvent<HTMLFormElement>) => void;
  fieldClass: string;
}) {
  const theme = config?.theme;
  const [primary, setPrimary] = useState(theme?.primary ?? "#162a4a");
  const [secondary, setSecondary] = useState(theme?.secondary ?? "#0f2d4a");
  const [accent, setAccent] = useState(theme?.accent ?? "#ef7230");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [applyColorsFromLogo, setApplyColorsFromLogo] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPrimary(theme?.primary ?? "#162a4a");
    setSecondary(theme?.secondary ?? "#0f2d4a");
    setAccent(theme?.accent ?? "#ef7230");
  }, [theme?.primary, theme?.secondary, theme?.accent]);

  async function saveColors(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/dashboard/brands/${brandId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: { primary, secondary, accent },
        }),
      });
      const json = (await res.json()) as {
        theme?: SiteConfig["theme"];
        error?: string;
      };
      if (!res.ok) {
        setMessage(json.error ?? "Could not save colors.");
        return;
      }
      if (json.theme) {
        setConfig((prev) =>
          prev ? { ...prev, theme: json.theme! } : prev,
        );
        setPrimary(json.theme.primary);
        setSecondary(json.theme.secondary);
        setAccent(json.theme.accent);
      }
      setMessage("Brand colors saved. Refresh the website preview to see them.");
    } finally {
      setSaving(false);
    }
  }

  async function onLogoSelected(file: File | null) {
    if (!file) return;
    setUploadingLogo(true);
    setMessage("");
    try {
      const body = new FormData();
      body.set("logo", file);
      body.set("applyColors", applyColorsFromLogo ? "true" : "false");
      const res = await fetch(`/api/dashboard/brands/${brandId}/logo`, {
        method: "POST",
        body,
      });
      const json = (await res.json()) as {
        assets?: BrandAsset[];
        theme?: SiteConfig["theme"];
        error?: string;
      };
      if (!res.ok) {
        setMessage(json.error ?? "Logo upload failed.");
        return;
      }
      if (json.assets) setAssets(json.assets);
      if (json.theme) {
        setConfig((prev) =>
          prev ? { ...prev, theme: json.theme! } : prev,
        );
        setPrimary(json.theme.primary);
        setSecondary(json.theme.secondary);
        setAccent(json.theme.accent);
      }
      setMessage(
        json.theme
          ? "Logo uploaded and colors updated from the logo."
          : "Logo uploaded.",
      );
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[18px] border border-peach bg-white">
        <div
          className="h-28 sm:h-36"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 55%, ${accent} 100%)`,
          }}
        />
        <div className="relative px-5 pb-6 pt-0 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="flex size-24 items-center justify-center rounded-[18px] border border-peach bg-white p-3 shadow-sm sm:size-28">
                  {logo?.public_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo.public_url}
                      alt={`${brand.name} logo`}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-center text-xs font-bold text-muted">
                      No logo
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  onChange={(e) =>
                    void onLogoSelected(e.target.files?.[0] ?? null)
                  }
                />
                <button
                  type="button"
                  disabled={uploadingLogo || saving}
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 w-full rounded-[10px] border-2 border-peach bg-white px-2 py-1.5 text-xs font-bold hover:border-foreman disabled:opacity-50"
                >
                  {uploadingLogo
                    ? "Uploading…"
                    : logo?.public_url
                      ? "Replace logo"
                      : "Upload logo"}
                </button>
              </div>
              <div className="pb-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {[brand.trade, brand.town].filter(Boolean).join(" · ") ||
                    "Brand"}
                </p>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {brand.name}
                </h3>
                <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted">
                  <input
                    type="checkbox"
                    checked={applyColorsFromLogo}
                    onChange={(e) => setApplyColorsFromLogo(e.target.checked)}
                  />
                  Update colors from logo on upload
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={saveColors} className="mt-6">
            <p className="text-sm font-bold">Brand colors</p>
            <p className="mt-1 text-xs text-muted">
              These drive buttons, headers, and accents on the generated site.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ColorField
                label="Primary"
                value={primary}
                onChange={setPrimary}
                fieldClass={fieldClass}
              />
              <ColorField
                label="Secondary"
                value={secondary}
                onChange={setSecondary}
                fieldClass={fieldClass}
              />
              <ColorField
                label="Accent"
                value={accent}
                onChange={setAccent}
                fieldClass={fieldClass}
              />
            </div>
            <button
              type="submit"
              disabled={saving || uploadingLogo}
              className="mt-4 rounded-[10px] bg-foreman px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save colors"}
            </button>
          </form>
        </div>
      </section>

      {role === "staff" ? (
        <section className="rounded-[14px] border border-peach bg-white p-5 sm:p-6">
          <h3 className="font-extrabold">SEO quality</h3>
          <p className="mt-1 text-sm text-muted">Staff only</p>
          <ul className="mt-4 space-y-2">
            {qaItems.length === 0 ? (
              <li className="text-sm text-muted">No QA results yet.</li>
            ) : (
              qaItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <span>
                    {item.pass ? "✓" : "✗"} {item.label}
                  </span>
                  <span className="text-muted">{item.detail}</span>
                </li>
              ))
            )}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-peach pt-4 text-sm">
            <div>
              <dt className="font-semibold text-muted">Primary keyword</dt>
              <dd>{config?.keywords?.primary || "-"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Title</dt>
              <dd>{config?.seo?.title || "-"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Meta description</dt>
              <dd>{config?.seo?.description || "-"}</dd>
            </div>
          </dl>
        </section>
      ) : null}

      {role === "staff" && editableContent && config?.seo?.title ? (
        <section className="rounded-[14px] border border-peach bg-white p-5 sm:p-6">
          <h3 className="font-extrabold">Edit site copy</h3>
          <p className="mt-1 text-sm text-muted">Staff only</p>
          <form onSubmit={onSaveSiteCopy} className="mt-4 grid gap-4">
            <label className="text-sm font-semibold">
              H1
              <input
                name="h1"
                defaultValue={editableContent.hero.h1}
                className={fieldClass}
              />
            </label>
            <label className="text-sm font-semibold">
              Hero subhead
              <textarea
                name="subhead"
                defaultValue={editableContent.hero.subhead}
                rows={3}
                className={fieldClass}
              />
            </label>
            <label className="text-sm font-semibold">
              About
              <textarea
                name="about"
                defaultValue={editableContent.about.body}
                rows={5}
                className={fieldClass}
              />
            </label>
            <label className="text-sm font-semibold">
              Contact copy
              <textarea
                name="contactBody"
                defaultValue={editableContent.contact.body}
                rows={3}
                className={fieldClass}
              />
            </label>
            <label className="text-sm font-semibold">
              Meta title
              <input
                name="metaTitle"
                defaultValue={config.seo.title}
                className={fieldClass}
              />
            </label>
            <label className="text-sm font-semibold">
              Meta description
              <textarea
                name="metaDescription"
                defaultValue={config.seo.description ?? ""}
                rows={3}
                className={fieldClass}
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="w-fit rounded-[10px] bg-cocoa px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save site copy"}
            </button>
          </form>
        </section>
      ) : null}
    </div>
  );
}

function SettingsSection({
  brand,
  role,
  members,
  hoursRows,
  setHoursRows,
  saving,
  brandId,
  clientEmail,
  setClientEmail,
  clientName,
  setClientName,
  temporaryCredentials,
  copied,
  deleting,
  fieldClass,
  onSaveBusinessDetails,
  onAssignClient,
  onCopyTemporaryPassword,
  onRemoveBrand,
}: {
  brandId: string;
  brand: Brand;
  role: "staff" | "client";
  members: Member[];
  hoursRows: DayHoursRow[];
  setHoursRows: React.Dispatch<React.SetStateAction<DayHoursRow[]>>;
  saving: boolean;
  clientEmail: string;
  setClientEmail: (value: string) => void;
  clientName: string;
  setClientName: (value: string) => void;
  temporaryCredentials: { email: string; password: string } | null;
  copied: boolean;
  deleting: boolean;
  fieldClass: string;
  onSaveBusinessDetails: (event: React.FormEvent<HTMLFormElement>) => void;
  onAssignClient: (event: React.FormEvent) => void;
  onCopyTemporaryPassword: () => void;
  onRemoveBrand: () => void;
}) {
  function updateHourRow(index: number, patch: Partial<DayHoursRow>) {
    setHoursRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  return (
    <div className="space-y-6">
      <SocialCadenceSettings brandId={brandId} />

      <section className="rounded-[14px] border border-peach bg-white p-5 sm:p-6">
        <h3 className="font-extrabold">Business details</h3>
        <p className="mt-1 text-sm text-muted">
          Address, email, phone, and hours shown on the website.
        </p>
        <form onSubmit={onSaveBusinessDetails} className="mt-5 grid gap-4">
          <label className="text-sm font-semibold">
            Address
            <input
              name="address"
              defaultValue={brand.address ?? ""}
              className={fieldClass}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Email
              <input
                name="email"
                type="email"
                defaultValue={brand.email ?? ""}
                className={fieldClass}
              />
            </label>
            <label className="text-sm font-semibold">
              Phone
              <input
                name="phone"
                defaultValue={brand.phone ?? ""}
                className={fieldClass}
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-semibold">Operating hours</p>
            <p className="mt-1 text-xs text-muted">
              Set open and close times for each day. Mark a day closed if needed.
            </p>
            <ul className="mt-3 space-y-2">
              {hoursRows.map((row, index) => (
                <li
                  key={row.day}
                  className="grid items-center gap-2 rounded-[12px] border border-peach bg-cream/40 px-3 py-2.5 sm:grid-cols-[7.5rem_1fr_auto_1fr_auto]"
                >
                  <span className="text-sm font-bold">{row.day}</span>
                  <select
                    disabled={row.closed || saving}
                    value={row.open}
                    onChange={(e) =>
                      updateHourRow(index, { open: e.target.value })
                    }
                    className="w-full rounded-[10px] border-2 border-peach bg-white px-2 py-1.5 text-sm outline-none focus:border-foreman disabled:opacity-50"
                    aria-label={`${row.day} open time`}
                  >
                    {!HOUR_TIME_OPTIONS.includes(row.open) ? (
                      <option value={row.open}>{row.open}</option>
                    ) : null}
                    {HOUR_TIME_OPTIONS.map((t) => (
                      <option key={`o-${t}`} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="hidden text-center text-xs text-muted sm:block">
                    to
                  </span>
                  <select
                    disabled={row.closed || saving}
                    value={row.close}
                    onChange={(e) =>
                      updateHourRow(index, { close: e.target.value })
                    }
                    className="w-full rounded-[10px] border-2 border-peach bg-white px-2 py-1.5 text-sm outline-none focus:border-foreman disabled:opacity-50"
                    aria-label={`${row.day} close time`}
                  >
                    {!HOUR_TIME_OPTIONS.includes(row.close) ? (
                      <option value={row.close}>{row.close}</option>
                    ) : null}
                    {HOUR_TIME_OPTIONS.map((t) => (
                      <option key={`c-${t}`} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted">
                    <input
                      type="checkbox"
                      checked={row.closed}
                      disabled={saving}
                      onChange={(e) =>
                        updateHourRow(index, { closed: e.target.checked })
                      }
                    />
                    Closed
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded-[10px] bg-foreman px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save details"}
          </button>
        </form>
      </section>

      {role === "staff" ? (
        <>
          <section className="rounded-[14px] border border-peach bg-white p-5">
            <h3 className="font-extrabold">Assign client</h3>
            <p className="mt-1 text-sm text-muted">
              New clients get a temporary password by email. They must change it
              on first sign-in.
            </p>
            <form
              onSubmit={onAssignClient}
              className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
            >
              <input
                type="email"
                required
                placeholder="client@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className={fieldClass}
              />
              <input
                placeholder="Full name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={fieldClass}
              />
              <button
                type="submit"
                className="rounded-[10px] bg-foreman px-4 py-2 text-sm font-bold text-white"
              >
                Assign
              </button>
            </form>
            {temporaryCredentials ? (
              <div className="mt-4 rounded-[12px] border-2 border-foreman/30 bg-[#f7fafc] p-4 text-sm">
                <p className="font-bold text-cocoa">Temporary credentials</p>
                <p className="mt-2">
                  Email:{" "}
                  <span className="font-mono">
                    {temporaryCredentials.email}
                  </span>
                </p>
                <p className="mt-1">
                  Password:{" "}
                  <span className="font-mono">
                    {temporaryCredentials.password}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={onCopyTemporaryPassword}
                  className="mt-3 rounded-[10px] border-2 border-peach px-3 py-1.5 text-sm font-semibold hover:border-foreman"
                >
                  {copied ? "Copied" : "Copy for client"}
                </button>
              </div>
            ) : null}
            <ul className="mt-4 space-y-2 text-sm">
              {members.length === 0 ? (
                <li className="text-muted">No clients assigned yet.</li>
              ) : (
                members.map((member) => (
                  <li key={member.id}>
                    {member.profile?.full_name || "Client"} ·{" "}
                    {member.profile?.email} · {member.role}
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-[14px] border border-red-200 bg-white p-5">
            <h3 className="font-extrabold text-red-700">Danger zone</h3>
            <p className="mt-1 text-sm text-muted">
              Permanently delete {brand.name}, its site, assets, and client
              access.
            </p>
            <button
              type="button"
              onClick={onRemoveBrand}
              disabled={deleting}
              className="mt-4 rounded-[10px] border-2 border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:border-red-500 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete brand"}
            </button>
          </section>
        </>
      ) : null}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
  fieldClass,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fieldClass: string;
}) {
  const hex = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#162a4a";
  return (
    <label className="rounded-[12px] border border-peach bg-cream/50 px-3 py-3 text-sm font-semibold">
      {label}
      <div className="mt-2 flex items-center gap-2">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="size-10 shrink-0 cursor-pointer rounded-[8px] border border-peach bg-white p-0.5"
          aria-label={`${label} color picker`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className={`${fieldClass} mt-0 font-mono uppercase`}
          placeholder="#162A4A"
        />
      </div>
    </label>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3 10h14M10 3c2.2 2.2 3.3 4.5 3.3 7S12.2 14.8 10 17c-2.2-2.2-3.3-4.5-3.3-7S7.8 5.2 10 3z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function IconRocket() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
      <path
        d="M12.8 3.4c1.8.2 3.6 2 3.8 3.8l-5.2 7.4-3.2-3.2 4.6-8z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 11.4l-3.4 1.1 1.1-3.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12.2" cy="7.8" r="1.1" fill="currentColor" />
      <path
        d="M4.2 15.8c.8-.2 1.8-.7 2.5-1.4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLeads() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
      <path
        d="M6.5 16.5v-2.2c0-1.5 1.2-2.8 2.8-2.8h1.4c1.5 0 2.8 1.3 2.8 2.8v2.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="10" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3.5 16.2v-1.6c0-1.1.8-2 1.9-2.2M16.5 16.2v-1.6c0-1.1-.8-2-1.9-2.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconShare() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
      <circle cx="14.5" cy="5" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="5.5" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="14.5" cy="15" r="2.25" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M7.4 8.9l5.2-2.8M7.4 11.1l5.2 2.8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPalette() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
      <path
        d="M10 3.2a6.8 6.8 0 1 0 0 13.6c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.2-.2-.3-.5-.3-.9 0-.8.7-1.5 1.5-1.5h1.8A3.7 3.7 0 0 0 17.8 8c0-2.7-3.5-4.8-7.8-4.8z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="7" cy="8" r="1" fill="currentColor" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
      <circle cx="13" cy="8" r="1" fill="currentColor" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M10 3.2v1.4M10 15.4v1.4M3.2 10h1.4M15.4 10h1.4M5.2 5.2l1 1M13.8 13.8l1 1M14.8 5.2l-1 1M6.2 13.8l-1 1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
      <path
        d="M3.5 5.5h13M3.5 10h13M3.5 14.5h13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
