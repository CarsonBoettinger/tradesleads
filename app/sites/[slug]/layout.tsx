export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-white text-slate-900 antialiased">
      {children}
    </div>
  );
}
