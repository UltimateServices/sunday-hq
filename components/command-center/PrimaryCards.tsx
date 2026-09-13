import Link from "next/link";
import type { SummaryCard } from "@/lib/command-center";
import { ToneChip } from "@/components/ds/badges";

export function PrimaryCards({ cards }: { cards: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.id} href={card.href} className="rounded-lg border border-line bg-card p-3 hover:border-gold/40">
          <p className="text-[10px] tracking-[0.14em] text-muted uppercase">{card.label}</p>
          <p className="mt-1 text-sm font-semibold text-ink">{card.value}</p>
          <p className="mt-1 text-[11px] text-muted">{card.sub}</p>
          <div className="mt-2">
            <ToneChip tone={card.tone}>{card.label}</ToneChip>
          </div>
        </Link>
      ))}
    </div>
  );
}
