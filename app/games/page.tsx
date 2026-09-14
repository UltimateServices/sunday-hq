import { PageHeader } from "@/components/shared/PageHeader";
import { GamesBoard } from "@/components/boards/GamesBoard";
import { WindowSwitch } from "@/components/games/WindowSwitch";
import { getWeekCatalog } from "@/lib/catalog";
import { buildGameDesk } from "@/lib/game-desk";

export const dynamic = "force-dynamic";

export default async function GamesPage({ searchParams }: PageProps<"/games">) {
  const catalog = await getWeekCatalog();
  const params = await searchParams;
  const windowFilter = typeof params.window === "string" ? params.window.toUpperCase() : "ALL";
  const rows = buildGameDesk(catalog).filter((row) => {
    if (windowFilter === "ALL") return true;
    if (windowFilter === "EARLY") return row.window === "EARLY";
    if (windowFilter === "LATE") return row.window === "LATE";
    if (windowFilter === "SNF") return row.window === "SNF";
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        layer="This Sunday"
        title="Games"
        lede="Window is bookmarkable. Expand a card for environment scores and script. Tap through for the full desk."
      />
      <WindowSwitch active={["ALL", "EARLY", "LATE", "SNF"].includes(windowFilter) ? windowFilter : "ALL"} />
      <GamesBoard rows={rows} />
    </div>
  );
}
