import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-dvh place-items-center text-sm text-muted">
          Loading…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
