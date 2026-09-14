import Link from "next/link";
import type { MarketHero } from "@/lib/markets-heroes";

export function MarketsHeroCards({ cards }: { cards: MarketHero[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.id} href={card.href} className="surface block p-4 hover:bg-card-hover">
          <p className="text-[12px] text-muted">{card.label}</p>
          <p className="mt-1 text-[17px] font-semibold tracking-tight">{card.value}</p>
          <p className="mt-1 text-[13px] text-muted">{card.sub}</p>
        </Link>
      ))}
    </div>
  );
}
