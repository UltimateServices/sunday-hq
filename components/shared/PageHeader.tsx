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
    <header className="mb-8 space-y-2">
      <p className="text-[13px] text-muted">{layer.replace("Layer 1 · ", "").replace("Layer 2 · ", "").replace("Layer 3 · ", "")}</p>
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-[32px] font-semibold tracking-tight">{title}</h1>
        {readiness && readiness !== "LIVE" ? (
          <StatusBadge tone={readiness === "PENDING" ? "purple" : "yellow"}>{readiness}</StatusBadge>
        ) : null}
      </div>
      <p className="max-w-2xl text-[15px] leading-relaxed text-muted">{lede}</p>
    </header>
  );
}
