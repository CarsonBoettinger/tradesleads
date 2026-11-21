"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      });
      const json = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error ?? "Could not update password.");
      }
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1.5 h-12 w-full rounded-[10px] border-2 border-peach bg-white px-3 outline-none focus:border-foreman";

  return (
    <div className="mx-auto max-w-md rounded-[16px] border border-peach bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-extrabold tracking-tight">
        Choose a new password
      </h1>
      <p className="mt-2 text-sm text-muted">
        You signed in with a temporary password. Set a new one before
        continuing to your dashboard.
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">
          New password
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-semibold">
          Confirm password
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldClass}
          />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[10px] bg-foreman py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
