import type {
  MarketType,
  MeasuredNumber,
  PropMarket,
  QualifierGrade,
  QualifierLens,
  Side,
} from "@/lib/types/domain";

const AS_OF = "2026-09-13T12:00:00-04:00";

function consensus(value: number, note?: string): MeasuredNumber {
  return {
    value,
    quality: "CONSENSUS",
    source: "Owner Week 1 seed / consensus desk",
    asOf: AS_OF,
    note: note ?? "Not a verified live DraftKings player-prop price.",
  };
}

function estimate(value: number, note: string): MeasuredNumber {
  return {
    value,
    quality: "ESTIMATE",
    source: "Phase 2 placeholder model",
    asOf: AS_OF,
    note,
  };
}

function unavailable(note: string): MeasuredNumber {
  return {
    value: null,
    quality: "UNAVAILABLE",
    source: "sunday-hq",
    asOf: null,
    note,
  };
}

function lowSample(value: number, note: string): MeasuredNumber {
  return {
    value,
    quality: "LOW_SAMPLE",
    source: "Phase 2 placeholder model",
    asOf: AS_OF,
    note,
  };
}

const unknownLenses: Record<QualifierLens, QualifierGrade> = {
  GOOD_PLAYER: "UNKNOWN",
  GOOD_MATCHUP: "UNKNOWN",
  GOOD_PROJECTION: "UNKNOWN",
  GOOD_BET: "UNKNOWN",
};

function prop(partial: Omit<PropMarket, "oddsAmerican" | "median" | "confidence"> & {
  oddsAmerican?: MeasuredNumber;
  median?: MeasuredNumber;
  confidence?: MeasuredNumber;
}): PropMarket {
  return {
    oddsAmerican: unavailable("DraftKings player-prop odds not ingested. Do not assume -110 is the DK price."),
    median: unavailable("Median from a trained distribution is Phase 3."),
    confidence: lowSample(0.42, "Week 1. No 2026 in-season sample. Placeholder confidence only."),
    ...partial,
  };
}

export const PROPS: PropMarket[] = [
  prop({
    id: "prop-burrow-pass-over",
    playerId: "burrow",
    gameId: "tb-cin",
    market: "PASS_YDS",
    side: "OVER",
    book: "CONSENSUS",
    line: consensus(269.5, "Owner seed consensus Burrow 269.5."),
    model: estimate(276, "Placeholder: highest Sunday total (50.5) + TB/CIN pace. Not a trained model."),
    matchupNote: "Highest-total Sunday environment. Matchup engine PENDING — this is script, not coverage grade.",
    weatherNote: "Outdoor CIN. Hourly forecast UNAVAILABLE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: [
      "Game total 50.5 is the Sunday ceiling (DK via ESPN).",
      "Consensus pass line already prices a full Burrow game.",
      "Placeholder model sits 6.5 yards over consensus — edge is small and unpriced.",
    ],
    risks: [
      "Outdoor weather unknown.",
      "Week 1 LOW SAMPLE.",
      "Projection > line is not a bet without DK odds/EV.",
    ],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "LEAN",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "HIGH",
  }),
  prop({
    id: "prop-burrow-pass-under",
    playerId: "burrow",
    gameId: "tb-cin",
    market: "PASS_YDS",
    side: "UNDER",
    book: "CONSENSUS",
    line: consensus(269.5),
    model: estimate(276, "Same placeholder mean as the over. Under is the other side — no over bias."),
    matchupNote: "If the game is a shootout, the under needs script failure or weather.",
    weatherNote: "Outdoor CIN. Hourly forecast UNAVAILABLE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: [
      "Listed so the board is two-sided.",
      "Placeholder mean is above the line, so this side is the weaker model lean.",
    ],
    risks: ["Do not fade just to 'have an under'.", "EV UNAVAILABLE without DK odds."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "NO",
      GOOD_PROJECTION: "NO",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "HIGH",
  }),
  prop({
    id: "prop-chase-rec-over",
    playerId: "chase",
    gameId: "tb-cin",
    market: "REC_YDS",
    side: "OVER",
    book: "CONSENSUS",
    line: consensus(85.5, "Owner seed consensus Chase 85.5."),
    model: estimate(91, "Placeholder: high total, featured WR. Camp knee scare resolved enough to play per reporting."),
    matchupNote: "GOOD PLAYER in a high-total game. Coverage grade PENDING.",
    weatherNote: "Outdoor CIN. Hourly forecast UNAVAILABLE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: [
      "Featured target in the highest-total Sunday game.",
      "Placeholder mean 91 vs 85.5 consensus.",
    ],
    risks: [
      "Camp knee scare — not listed as NO KNOWN LIMITATION.",
      "Higgins also expected to play; target share not verified.",
    ],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "LEAN",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "HIGH",
    tdRole: "PRIMARY",
  }),
  prop({
    id: "prop-gibbs-rush-over",
    playerId: "gibbs",
    gameId: "no-det",
    market: "RUSH_YDS",
    side: "OVER",
    book: "CONSENSUS",
    line: consensus(84.5, "Owner seed consensus Gibbs 84.5."),
    model: estimate(89, "Placeholder: DET -7 indoor, Saints volume uncertainty (Kamara conflict)."),
    matchupNote: "Favorite at home, indoor. Run-defense grade PENDING.",
    weatherNote: "Indoor — weather NONE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: [
      "Lions implied team total is the Sunday RB environment leader (derived).",
      "Kamara SOURCE CONFLICT may pull NO from a clean box.",
    ],
    risks: ["Montgomery split not modeled.", "Blowout script can also cut closing rushes."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "LEAN",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "HIGH",
    tdRole: "PRIMARY",
  }),
  prop({
    id: "prop-henry-rush-over",
    playerId: "henry",
    gameId: "bal-ind",
    market: "RUSH_YDS",
    side: "OVER",
    book: "CONSENSUS",
    line: consensus(78.5, "Owner seed consensus Henry 78.5."),
    model: estimate(83, "Placeholder: BAL -3.5 indoor. Independent of Lamar rushing (not double-counted)."),
    matchupNote: "Road favorite, indoor. Box-count engine PENDING.",
    weatherNote: "Indoor — weather NONE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: ["Workhorse profile in a mid-total indoor game.", "Placeholder mean 83 vs 78.5."],
    risks: ["Lamar goal-line vulture.", "Week 1 LOW SAMPLE."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "UNKNOWN",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "HIGH",
    tdRole: "PRIMARY",
  }),
  prop({
    id: "prop-etienne-rush-over",
    playerId: "etienne",
    gameId: "no-det",
    market: "RUSH_YDS",
    side: "OVER",
    book: "CONSENSUS",
    line: consensus(56.5, "Owner seed consensus Etienne 56.5."),
    model: estimate(
      62,
      "Placeholder: Kamara SOURCE CONFLICT. If Kamara is OUT, volume should sit higher; model does not assume the inactive.",
    ),
    matchupNote: "Road dog in a 49.5 indoor game. Negative script can raise receiving, cut rushing.",
    weatherNote: "Indoor — weather NONE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: [
      "Owner seed: Kamara Out → Etienne.",
      "Board will not promote this to GOOD BET until Kamara is a verified inactive and a DK price exists.",
    ],
    risks: [
      "SOURCE CONFLICT on Kamara.",
      "DET front. Matchup engine PENDING.",
      "If Kamara plays passing downs, rush volume compresses.",
    ],
    lenses: {
      GOOD_PLAYER: "LEAN",
      GOOD_MATCHUP: "NO",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "HIGH",
    tdRole: "SECONDARY",
  }),
  prop({
    id: "prop-nico-rec-over",
    playerId: "nico",
    gameId: "buf-hou",
    market: "REC_YDS",
    side: "OVER",
    book: "CONSENSUS",
    line: consensus(69.5, "Owner seed consensus Nico 69.5."),
    model: estimate(71, "Placeholder: indoor, 44.5 total, small model-vs-line gap."),
    matchupNote: "Bills coverage grade PENDING. Do not invent a 'great matchup'.",
    weatherNote: "Indoor — weather NONE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: ["Featured HOU target.", "Model only 1.5 yards over consensus — not a price."],
    risks: ["Tiny placeholder edge.", "EV UNAVAILABLE."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "UNKNOWN",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "MED",
  }),
  prop({
    id: "prop-mayer-rec-over",
    playerId: "mayer",
    gameId: "mia-lv",
    market: "REC_YDS",
    side: "OVER",
    book: "CONSENSUS",
    line: consensus(39.5, "Owner seed consensus Mayer 39.5 with Bowers OUT."),
    model: estimate(45, "Placeholder: Bowers meniscus OUT. Mayer is the on-roster TE residual, not a WR1."),
    matchupNote: "MIA TE coverage PENDING. Indoor 41.5 total is not a shootout.",
    weatherNote: "Indoor — weather NONE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: ["Verified Bowers OUT.", "Consensus 39.5 already moves off a backup TE baseline."],
    risks: [
      "Target vacuum can go to Jeanty / WRs.",
      "Low total.",
      "GOOD PLAYER is LEAN at best — this is opportunity, not talent spike.",
    ],
    lenses: {
      GOOD_PLAYER: "LEAN",
      GOOD_MATCHUP: "UNKNOWN",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "MED",
    tdRole: "DEVICE",
  }),
  prop({
    id: "prop-rush-pass-under",
    playerId: "rush",
    gameId: "atl-pit",
    market: "PASS_YDS",
    side: "UNDER",
    book: "UNKNOWN",
    line: {
      value: 199.5,
      quality: "ESTIMATE",
      source: "Research desk estimate",
      asOf: AS_OF,
      note: "No consensus or DK pass line ingested for Cooper Rush. Research estimate only.",
    },
    model: estimate(188, "Placeholder: emergency Week 1 start, 42.5 total, PIT home."),
    matchupNote: "QB_DOWNGRADE environment. Not a GOOD PLAYER lean.",
    weatherNote: "Outdoor PIT. Hourly forecast UNAVAILABLE.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: [
      "Tua and Penix both OUT. Rush is the starter.",
      "Under is the structurally honest side if a line exists near 200.",
    ],
    risks: [
      "Line is ESTIMATE, not DK.",
      "If DK prices 175.5, this under is wrong-sided.",
      "Bijan/London can still score without Rush yardage.",
    ],
    lenses: {
      GOOD_PLAYER: "NO",
      GOOD_MATCHUP: "NO",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "LOW",
  }),
  prop({
    id: "prop-lawrence-pass-under",
    playerId: "lawrence",
    gameId: "cle-jax",
    market: "PASS_YDS",
    side: "UNDER",
    book: "UNKNOWN",
    line: {
      value: 219.5,
      quality: "ESTIMATE",
      source: "Research desk estimate",
      asOf: AS_OF,
      note: "No DK/consensus pass line ingested. Research estimate only.",
    },
    model: estimate(205, "Placeholder: JAX -8.5, 40.5 total, significant heat/storm flag."),
    matchupNote: "Weather + script can cap passing. Coverage engine PENDING.",
    weatherNote: "SIGNIFICANT heat/storms (owner seed ESTIMATE).",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: [
      "Lowest-tier scoring environment besides NYJ@TEN.",
      "Weather flag is the under thesis — still ESTIMATE.",
    ],
    risks: ["If storms miss the window, the under thesis weakens.", "Line itself is not DK."],
    lenses: {
      GOOD_PLAYER: "LEAN",
      GOOD_MATCHUP: "NO",
      GOOD_PROJECTION: "LEAN",
      GOOD_BET: "UNKNOWN",
    },
    volumeTag: "MED",
  }),
  prop({
    id: "prop-nabers-rec-over",
    playerId: "nabers",
    gameId: "dal-nyg",
    market: "REC_YDS",
    side: "OVER",
    book: "UNKNOWN",
    line: unavailable("No consensus Nabers yard line in the owner seed. DK price not ingested."),
    model: unavailable("Will not invent a projection on a GAME-TIME ACL return without a line."),
    matchupNote: "DAL pass defense grade PENDING. Prior 2025 tape vs DAL is stale relative to 2026 roster.",
    weatherNote: "Outdoor MetLife. Wind UNKNOWN.",
    movement: { direction: "UNKNOWN", note: "No DK player-prop tape ingested." },
    why: ["Full practice, but decision is his.", "Do not force a number onto a GTD."],
    risks: ["GAME-TIME DECISION.", "Snap count unknown.", "GOOD BET cannot be YES."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "UNKNOWN",
      GOOD_PROJECTION: "UNKNOWN",
      GOOD_BET: "NO",
    },
    volumeTag: "HIGH",
    tdRole: "PRIMARY",
  }),
  prop({
    id: "prop-gibbs-atd",
    playerId: "gibbs",
    gameId: "no-det",
    market: "ANYTIME_TD",
    side: "OVER",
    book: "UNKNOWN",
    line: { value: 0.5, quality: "ESTIMATE", source: "anytime-td-threshold", asOf: AS_OF },
    model: unavailable("Anytime TD model + DK price PENDING (Phase 3)."),
    matchupNote: "Lead back on the highest derived home team total. Not a priced bet.",
    weatherNote: "Indoor.",
    movement: { direction: "UNKNOWN", note: "DK anytime odds not ingested." },
    why: ["Volume + implied DET team total."],
    risks: ["Split with Montgomery unknown.", "No price, no EV."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "LEAN",
      GOOD_PROJECTION: "UNKNOWN",
      GOOD_BET: "UNKNOWN",
    },
    tdRole: "PRIMARY",
    volumeTag: "HIGH",
  }),
  prop({
    id: "prop-henry-atd",
    playerId: "henry",
    gameId: "bal-ind",
    market: "ANYTIME_TD",
    side: "OVER",
    book: "UNKNOWN",
    line: { value: 0.5, quality: "ESTIMATE", source: "anytime-td-threshold", asOf: AS_OF },
    model: unavailable("Anytime TD model + DK price PENDING (Phase 3)."),
    matchupNote: "Goal-line competition with Lamar.",
    weatherNote: "Indoor.",
    movement: { direction: "UNKNOWN", note: "DK anytime odds not ingested." },
    why: ["Workhorse goal-line profile."],
    risks: ["Lamar vultures.", "No price, no EV."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "UNKNOWN",
      GOOD_PROJECTION: "UNKNOWN",
      GOOD_BET: "UNKNOWN",
    },
    tdRole: "PRIMARY",
    volumeTag: "HIGH",
  }),
  prop({
    id: "prop-chase-atd",
    playerId: "chase",
    gameId: "tb-cin",
    market: "ANYTIME_TD",
    side: "OVER",
    book: "UNKNOWN",
    line: { value: 0.5, quality: "ESTIMATE", source: "anytime-td-threshold", asOf: AS_OF },
    model: unavailable("Anytime TD model + DK price PENDING (Phase 3)."),
    matchupNote: "Highest-total game. Red-zone share PENDING.",
    weatherNote: "Outdoor CIN. UNKNOWN.",
    movement: { direction: "UNKNOWN", note: "DK anytime odds not ingested." },
    why: ["Featured WR in 50.5 environment."],
    risks: ["No price, no EV.", "Camp knee not clean."],
    lenses: {
      GOOD_PLAYER: "YES",
      GOOD_MATCHUP: "LEAN",
      GOOD_PROJECTION: "UNKNOWN",
      GOOD_BET: "UNKNOWN",
    },
    tdRole: "PRIMARY",
  }),
];

export const PROP_BY_ID = Object.fromEntries(PROPS.map((p) => [p.id, p]));

export const YARDAGE_MARKETS: MarketType[] = [
  "PASS_YDS",
  "RUSH_YDS",
  "REC_YDS",
  "COMPLETIONS",
  "RECEPTIONS",
];

export function propsForPosition(position: "QB" | "RB" | "WR" | "TE"): PropMarket[] {
  const map: Record<typeof position, MarketType[]> = {
    QB: ["PASS_YDS", "PASS_TD", "RUSH_YDS", "COMPLETIONS"],
    RB: ["RUSH_YDS", "REC_YDS", "RECEPTIONS", "RUSH_TD", "ANYTIME_TD"],
    WR: ["REC_YDS", "RECEPTIONS", "REC_TD", "ANYTIME_TD"],
    TE: ["REC_YDS", "RECEPTIONS", "REC_TD", "ANYTIME_TD"],
  };
  return PROPS.filter((p) => map[position].includes(p.market));
}

export function propsBySide(side: Side): PropMarket[] {
  return PROPS.filter((p) => p.side === side && p.market !== "ANYTIME_TD");
}
