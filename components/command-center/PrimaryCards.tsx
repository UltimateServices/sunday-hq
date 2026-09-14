import Link from "next/link";
import type { SummaryCard } from "@/lib/command-center";

export function PrimaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.id} href={card.href} className="surface block p-4 transition-colors hover:bg-card-hover">
          <p className="text-[13px] text-muted">{card.label}</p>
          <p className="mt-1 text-[17px] font-semibold tracking-tight text-ink">{card.value}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">{card.sub}</p>
        </Link>
      ))}
    </div>
  );
}
