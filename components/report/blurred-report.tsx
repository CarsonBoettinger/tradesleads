"use client";

import { GateForm } from "@/components/report/gate-form";

export function BlurredReport({
  businessName,
  onUnlock,
}: {
  businessName: string;
  onUnlock: (input: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    consent: boolean;
  }) => Promise<void>;
}) {
  return (
    <section className="relative overflow-hidden rounded-[12px] border-2 border-peach bg-white">
      <div
        className="pointer-events-none select-none p-6 blur-[7px] sm:p-8"
        aria-hidden="true"
      >
        <p className="text-base font-bold tracking-[0.16em] uppercase text-foreman">
          Report card
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-cocoa">{businessName}</h2>
        <p className="mt-3 max-w-2xl text-lg text-muted">
          Homeowners in your area are searching - you are only catching part of
          that demand.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[12px] bg-peach/60 p-5">
            <p className="text-sm font-bold tracking-[0.14em] uppercase text-cocoa">
              Rough monthly miss
            </p>
            <p className="mt-2 text-3xl font-extrabold text-cocoa">
              $4,800–$8,200
            </p>
            <p className="mt-2 text-base text-muted">
              About 6–11 jobs/month based on local ranking gaps.
            </p>
          </div>
          <div className="rounded-[12px] bg-peach/60 p-5">
            <p className="text-sm font-bold tracking-[0.14em] uppercase text-cocoa">
              Among nearby competitors
            </p>
            <p className="mt-2 text-3xl font-extrabold text-cocoa">#4 of 7</p>
            <ul className="mt-3 space-y-2 text-base text-muted">
              <li>• Missing the map pack on most trade searches.</li>
              <li>• Review volume is behind stronger competitors.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center bg-cream/55 px-4 py-8 backdrop-blur-[2px]">
        <div className="w-full max-w-xl rounded-[12px] border-2 border-peach bg-white p-5 shadow-[0_18px_50px_rgba(22,42,74,0.16)] sm:p-7">
          <GateForm compact onUnlock={onUnlock} />
        </div>
      </div>
    </section>
  );
}
