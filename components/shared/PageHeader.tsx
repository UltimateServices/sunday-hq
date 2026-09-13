import type { RouteReadiness } from "@/lib/types/domain";
import { StatusBadge } from "./StatusBadge";

export function PageHeader({
  layer,
  title,
  lede,
  readiness,
}: {
  layer: string;
  title: string;
  lede: string;
  readiness?: RouteReadiness;
}) {
  return (
    <header className="mb-6 space-y-2">
      <p className="text-[10px] tracking-[0.2em] text-gold uppercase">{layer}</p>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {readiness && readiness !== "LIVE" ? (
          <StatusBadge tone={readiness === "PENDING" ? "purple" : "yellow"}>{readiness}</StatusBadge>
        ) : null}
      </div>
      <p className="max-w-3xl text-sm text-muted">{lede}</p>
    </header>
  );
}
