const trades = [
  "Plumbing",
  "Roofing",
  "Electrical",
  "HVAC",
  "General contracting",
  "Landscaping",
  "Pressure washing",
  "Auto repair",
  "Welding",
  "Tree service",
];

export function TradeStrip() {
  return (
    <section
      className="border-y-2 border-peach bg-white py-5"
      aria-label="Trades Kalvez is built for"
    >
      <div className="marquee">
        <div className="marquee-track">
          <TradeRow />
          <TradeRow hidden />
        </div>
      </div>
    </section>
  );
}

function TradeRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex items-center" aria-hidden={hidden || undefined}>
      {trades.map((trade) => (
        <li key={trade} className="flex items-center pr-10">
          <span className="text-lg font-extrabold tracking-[-0.02em] text-cocoa">
            {trade}
          </span>
          <span
            className="ml-10 size-1.5 shrink-0 rounded-full bg-sunrise"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );
}
