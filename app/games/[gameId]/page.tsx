import { notFound } from "next/navigation";
import { GameWorkspace } from "@/components/games/GameWorkspace";
import { GAMES } from "@/data/week1/games";
import { getWeekCatalog } from "@/lib/catalog";
import { buildGameWorkspace } from "@/lib/game-workspace";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return GAMES.map((game) => ({ gameId: game.id }));
}

export default async function GameDeepDive({ params }: PageProps<"/games/[gameId]">) {
  const { gameId } = await params;
  const catalog = await getWeekCatalog();
  const game = catalog.games.find((row) => row.id === gameId) ?? GAMES.find((row) => row.id === gameId);
  if (!game) notFound();
  return <GameWorkspace game={game} vm={buildGameWorkspace(catalog, game)} />;
}
