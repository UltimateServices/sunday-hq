import { GAME_BY_ID } from "@/data/week1/games";
import { PROPS } from "@/data/week1/props";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import type { WeekCatalog } from "@/lib/catalog";
import { matchesWindow } from "@/lib/game-window";
import { toPropView, type PropView } from "@/lib/prop-view";
import { environmentFor } from "@/lib/team-totals";
import type { EnvironmentTier, GameWindowFilter, Position } from "@/lib/types/domain";
import { STABILITY_ORDER, volumeStability, type VolumeStability } from "@/lib/volume-stability";

export type VolumeBoardTab = "SAFE" | "CEILING" | "FLOOR";

export type VolumeRow = {
  view: PropView;
  stability: VolumeStability;
  projectedOpps: string;
  recentOpps: string;
  environment: EnvironmentTier;
  weatherRisk: boolean;
};

export function volumeSource(catalog?: Pick<WeekCatalog, "props">): PropView[] {
  const source = catalog?.props && catalog.props.length > 0 ? catalog.props : PROPS;
  return source.map((prop) => toPropView(prop));
}

export function volumeRows(views: PropView[]): VolumeRow[] {
  return views
    .filter((view) => view.market !== "ANYTIME_TD" && view.side === "OVER")
    .map((view) => {
      const game = GAME_BY_ID[view.gameId];
      const wx = WEATHER_BY_GAME[view.gameId];
      return {
        view,
        stability: volumeStability(view),
        projectedOpps: "DATA UNAVAILABLE",
        recentOpps: "DATA UNAVAILABLE",
        environment: game
          ? environmentFor(game, {
              qbDowngrade: game.id === "atl-pit",
              weatherRisk: wx?.impact === "SIGNIFICANT",
            })
          : "NEUTRAL",
        weatherRisk: wx?.impact === "SIGNIFICANT",
      };
    });
}

export function filterVolumeRows(
  rows: VolumeRow[],
  tab: VolumeBoardTab,
  filters?: { pos?: Position | "ALL"; window?: GameWindowFilter; stability?: VolumeStability | "ALL" },
): VolumeRow[] {
  let next = [...rows];
  if (filters?.pos && filters.pos !== "ALL") next = next.filter((row) => row.view.position === filters.pos);
  if (filters?.window && filters.window !== "ALL") {
    next = next.filter((row) => matchesWindow(GAME_BY_ID[row.view.gameId], filters.window!));
  }
  if (filters?.stability && filters.stability !== "ALL") {
    next = next.filter((row) => row.stability === filters.stability);
  }

  if (tab === "SAFE") {
    next = next.filter(
      (row) =>
        (row.stability === "ELITE" || row.stability === "HIGH") &&
        (row.view.health === "NO_KNOWN_LIMITATION" || row.view.health === "MINOR_CONCERN") &&
        !row.weatherRisk,
    );
  } else if (tab === "FLOOR") {
    next = next.filter((row) => row.stability === "ELITE" || row.stability === "HIGH");
  } else {
    next = next.filter(
      (row) =>
        row.view.volumeTag === "HIGH" &&
        (row.view.tdRole === "PRIMARY" || row.view.tdRole === "DEVICE" || row.environment === "SHOOTOUT"),
    );
  }

  next.sort((a, b) => {
    if (tab === "CEILING") {
      const env = Number(b.environment === "SHOOTOUT") - Number(a.environment === "SHOOTOUT");
      if (env !== 0) return env;
      return (b.view.model.value ?? b.view.line.value ?? 0) - (a.view.model.value ?? a.view.line.value ?? 0);
    }
    const stability = STABILITY_ORDER[a.stability] - STABILITY_ORDER[b.stability];
    if (stability !== 0) return stability;
    return (b.view.line.value ?? 0) - (a.view.line.value ?? 0);
  });

  return next;
}

export function topVolumeRows(views: PropView[], limit = 12): VolumeRow[] {
  return volumeRows(views)
    .filter((row) => row.view.volumeTag === "HIGH")
    .sort((a, b) => {
      const stability = STABILITY_ORDER[a.stability] - STABILITY_ORDER[b.stability];
      if (stability !== 0) return stability;
      return (b.view.line.value ?? 0) - (a.view.line.value ?? 0);
    })
    .slice(0, limit);
}
