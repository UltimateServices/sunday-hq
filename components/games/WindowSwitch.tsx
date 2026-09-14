import Link from "next/link";

const WINDOWS = [
  { id: "ALL", label: "All" },
  { id: "EARLY", label: "Early" },
  { id: "LATE", label: "Late" },
  { id: "SNF", label: "SNF" },
] as const;

export function WindowSwitch({ active }: { active: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto" aria-label="Game window">
      {WINDOWS.map((item) => {
        const href = item.id === "ALL" ? "/games" : `/games?window=${item.id}`;
        const on = active === item.id;
        return (
          <Link key={item.id} href={href} className={`action-btn shrink-0 ${on ? "bg-card text-ink" : ""}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
