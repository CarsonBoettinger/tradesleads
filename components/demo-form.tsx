"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { formatPhone, parseEmail, parsePhone } from "@/lib/contact";
import { demoCta, primaryButtonClass } from "@/components/ui";
import { REPORT_TRADES } from "@/lib/report/keywords";

type FieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "business"
  | "town"
  | "trade"
  | "time"
  | "source"
  | "comments"
  | "consent";

type FormState = Record<FieldName, string>;

const empty: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  business: "",
  town: "",
  trade: "",
  time: "",
  source: "",
  comments: "",
  consent: "",
};

const trades = REPORT_TRADES;

const times = ["Morning", "Afternoon", "Evening"];

const sources = [
  "Google",
  "A neighbour",
  "Another owner",
  "Somewhere else",
];

const fieldClass =
  "h-[52px] w-full rounded-[10px] border-2 border-peach bg-white px-5 text-[17px] text-cocoa outline-none transition-colors focus:border-foreman";

function validate(values: FormState) {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!values.firstName.trim()) errors.firstName = "Add your first name.";
  if (!values.lastName.trim()) errors.lastName = "Add your last name.";

  const emailParsed = parseEmail(values.email);
  if (!emailParsed.ok) errors.email = emailParsed.error;

  const phoneParsed = parsePhone(values.phone);
  if (!phoneParsed.ok) errors.phone = phoneParsed.error;

  if (!values.business.trim()) errors.business = "Add your business name.";
  if (!values.town.trim()) errors.town = "Add your town.";
  if (!values.trade) errors.trade = "Choose a trade.";
  if (!values.time) errors.time = "Choose a time.";
  if (!values.consent) errors.consent = "Tick this so you can be contacted about the demo.";
  return errors;
}

export function DemoForm() {
  const baseId = useId();
  const successRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  function update(name: FieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError(null);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setSubmitError(null);
    if (Object.keys(nextErrors).length > 0) return;

    const emailParsed = parseEmail(values.email);
    const phoneParsed = parsePhone(values.phone);
    if (!emailParsed.ok || !phoneParsed.ok) return;

    const normalized = {
      ...values,
      email: emailParsed.email,
      phone: phoneParsed.phone,
    };
    setValues(normalized);

    setSubmitting(true);
    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...normalized,
          consent: normalized.consent === "yes",
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setSubmitError(
          payload?.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      setDone(true);
    } catch {
      setSubmitError("Could not reach the server. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status">
        <h2
          ref={successRef}
          tabIndex={-1}
          className="text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] text-cocoa outline-none"
        >
          Got it, {values.firstName.trim()}.
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          We have your demo request. Someone from Kalvez will call you at the
          time that works best.
        </p>
      </div>
    );
  }

  const errorList = Object.values(errors).filter(Boolean);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div>
        <h2 className="text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] text-cocoa">
          Book a free demo
        </h2>
        <p className="mt-2 text-[17px] text-muted">It takes 20 minutes.</p>
      </div>
      {errorList.length > 0 ? (
        <div
          role="alert"
          className="rounded-xl border-2 border-peach bg-peach px-5 py-4 text-base font-bold text-cocoa"
        >
          Check the highlighted fields and try again.
        </div>
      ) : null}
      {submitError ? (
        <div
          role="alert"
          className="rounded-xl border-2 border-peach bg-peach px-5 py-4 text-base font-bold text-cocoa"
        >
          {submitError}
        </div>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${baseId}-first`}
          label="First name"
          value={values.firstName}
          error={errors.firstName}
          autoComplete="given-name"
          onChange={(value) => update("firstName", value)}
        />
        <Field
          id={`${baseId}-last`}
          label="Last name"
          value={values.lastName}
          error={errors.lastName}
          autoComplete="family-name"
          onChange={(value) => update("lastName", value)}
        />
      </div>
      <Field
        id={`${baseId}-email`}
        label="Email"
        value={values.email}
        error={errors.email}
        autoComplete="email"
        inputMode="email"
        placeholder="name@company.com"
        onChange={(value) => update("email", value)}
      />
      <Field
        id={`${baseId}-phone`}
        label="Mobile number"
        value={values.phone}
        error={errors.phone}
        autoComplete="tel"
        inputMode="tel"
        placeholder="(519) 555-0123"
        onChange={(value) => update("phone", formatPhone(value))}
      />
      <Field
        id={`${baseId}-business`}
        label="Business name"
        value={values.business}
        error={errors.business}
        autoComplete="organization"
        onChange={(value) => update("business", value)}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${baseId}-town`}
          label="Town"
          value={values.town}
          error={errors.town}
          autoComplete="address-level2"
          onChange={(value) => update("town", value)}
        />
        <SelectField
          id={`${baseId}-trade`}
          label="Trade"
          value={values.trade}
          error={errors.trade}
          placeholder="Choose your trade"
          options={trades}
          onChange={(value) => update("trade", value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          id={`${baseId}-time`}
          label="Best time to reach you"
          value={values.time}
          error={errors.time}
          placeholder="Choose a time"
          options={times}
          onChange={(value) => update("time", value)}
        />
        <SelectField
          id={`${baseId}-source`}
          label="How did you hear about Kalvez?"
          value={values.source}
          error={errors.source}
          placeholder="Choose one"
          options={sources}
          required={false}
          onChange={(value) => update("source", value)}
        />
      </div>
      <div>
        <label
          htmlFor={`${baseId}-comments`}
          className="mb-2 block text-base font-bold text-cocoa"
        >
          Comments and questions
        </label>
        <textarea
          id={`${baseId}-comments`}
          value={values.comments}
          rows={4}
          onChange={(event) => update("comments", event.target.value)}
          className="min-h-32 w-full rounded-xl border-2 border-peach bg-white px-5 py-4 text-[17px] text-cocoa outline-none transition-colors focus:border-foreman"
        />
      </div>
      <div>
        <label className="flex items-start gap-3 text-[15px] leading-relaxed text-muted">
          <input
            type="checkbox"
            checked={values.consent === "yes"}
            onChange={(event) => update("consent", event.target.checked ? "yes" : "")}
            className="mt-1 size-5 shrink-0 accent-foreman"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${baseId}-consent-error` : undefined}
          />
          <span>
            I agree to be contacted about this demo. This is only about the
            demo, not a standing list.
          </span>
        </label>
        {errors.consent ? (
          <p id={`${baseId}-consent-error`} className="mt-2 text-base font-bold text-foreman">
            {errors.consent}
          </p>
        ) : null}
      </div>
      <div>
        <button
          type="submit"
          disabled={submitting}
          className={`${primaryButtonClass} w-full disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {submitting ? "Sending…" : demoCta}
        </button>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          We only use these details to book and run your demo.
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  error,
  autoComplete,
  inputMode,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  autoComplete: string;
  inputMode?: "email" | "tel";
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-base font-bold text-cocoa">
        {label}
        <Required />
      </label>
      <input
        id={id}
        value={value}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  error,
  placeholder,
  options,
  required = true,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  placeholder: string;
  options: string[];
  required?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-base font-bold text-cocoa">
        {label}
        {required ? <Required /> : null}
      </label>
      <select
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} select-field appearance-none pr-12`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
    </div>
  );
}

function Required() {
  return (
    <span className="text-cocoa" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-2 text-base font-bold text-foreman">
      {children}
    </p>
  );
}
