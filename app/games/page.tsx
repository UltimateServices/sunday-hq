import { PageHeader } from "@/components/shared/PageHeader";
import { SeedBanner } from "@/components/shared/SeedBanner";
import { GamesBoard } from "@/components/boards/GamesBoard";
import { getWeekCatalog } from "@/lib/catalog";
import { buildGameDesk } from "@/lib/game-desk";

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const catalog = await getWeekCatalog();
  return (
    <div className="space-y-6">
      <PageHeader
        layer="This Sunday"
        title="Games"
        lede="Window chips live in the header. Expand a card for environment scores and script — tap through for the full desk."
      />
      <SeedBanner>{catalog.staleWarning ?? catalog.liveBanner}</SeedBanner>
      <GamesBoard rows={buildGameDesk(catalog)} />
    </div>
  );
}
