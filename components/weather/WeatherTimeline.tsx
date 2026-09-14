import type { WeatherTimelineSlot } from "@/lib/weather-page";

export function WeatherTimeline({ slots }: { slots: WeatherTimelineSlot[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-5">
      {slots.map((slot) => (
        <li key={slot.slot} className="surface p-3">
          <p className="text-[11px] tracking-wide text-muted uppercase">{slot.slot}</p>
          <p className={`mt-1 text-[13px] ${slot.pending ? "text-muted" : "text-ink"}`}>{slot.value}</p>
        </li>
      ))}
    </ol>
  );
}
