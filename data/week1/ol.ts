import type { DataQuality } from "@/lib/types/domain";

export type OlUnit = {
  teamId: string;
  starters: string[];
  grade: number;
  quality: DataQuality;
  qbImpact: number;
  rbImpact: number;
  note: string;
};

/** Week 1 ESTIMATE OL desk — not PFF ranks. Affects QB/RB matchup grades only. */
export const OL_UNITS: OlUnit[] = [
  { teamId: "cin", starters: ["Brown", "Cappa", "Karras", "Volson", "Mims"], grade: 6.4, quality: "ESTIMATE", qbImpact: 0.4, rbImpact: 0.2, note: "Pass-game OL lean. Not a 2025 rank recycled as fact." },
  { teamId: "det", starters: ["Decker", "Glasgow", "Ragnow", "Zeitler", "Sewell"], grade: 7.8, quality: "ESTIMATE", qbImpact: 0.6, rbImpact: 0.8, note: "Interior + Sewell support rush + play-action." },
  { teamId: "atl", starters: ["Matthews", "Lindstrom", "McGary"], grade: 4.2, quality: "ESTIMATE", qbImpact: -1.2, rbImpact: 0.1, note: "Emergency QB caps designed pass pro value." },
  { teamId: "pit", starters: ["Frazier", "Seumalo", "Jones"], grade: 5.6, quality: "LOW_SAMPLE", qbImpact: 0.1, rbImpact: 0.3, note: "Home OL. Feature store is LOW SAMPLE." },
  { teamId: "no", starters: ["Penning", "McCoy", "Ruiz"], grade: 5.1, quality: "ESTIMATE", qbImpact: 0, rbImpact: 0.2, note: "Road dog. OL does not create Kamara/Etienne volume." },
  { teamId: "bal", starters: ["Stanley", "Linderbaum", "Cleveland"], grade: 6.8, quality: "ESTIMATE", qbImpact: 0.5, rbImpact: 0.7, note: "Run-game OL lean for Henry / Lamar." },
  { teamId: "ind", starters: ["Nelson", "Raimann", "Kelly"], grade: 6.6, quality: "ESTIMATE", qbImpact: 0.3, rbImpact: 0.5, note: "Retractable roof UNKNOWN. OL grade is independent of weather." },
  { teamId: "jax", starters: ["Hainsey", "Strange", "Little"], grade: 5.0, quality: "ESTIMATE", qbImpact: -0.2, rbImpact: 0.1, note: "Heat/storm game. OL does not cancel weather tax." },
  { teamId: "cle", starters: ["Bitonio", "Teller", "Wills"], grade: 6.2, quality: "ESTIMATE", qbImpact: 0.2, rbImpact: 0.4, note: "Road + weather. Rush more honest than pass." },
  { teamId: "lv", starters: ["Parham", "Meredith", "Miller"], grade: 4.8, quality: "ESTIMATE", qbImpact: -0.3, rbImpact: 0.2, note: "Bowers OUT is the TE story, not OL." },
  { teamId: "mia", starters: ["Armstead", "Eichenberg", "Hunt"], grade: 5.4, quality: "ESTIMATE", qbImpact: 0.1, rbImpact: 0.2, note: "Indoor LV. OL is not the limiter." },
  { teamId: "phi", starters: ["Mailata", "Becton", "Jurgens"], grade: 7.2, quality: "ESTIMATE", qbImpact: 0.5, rbImpact: 0.9, note: "Favorite script + OL supports Saquon volume." },
  { teamId: "was", starters: ["Leno", "Allegretti", "Wylie"], grade: 4.6, quality: "ESTIMATE", qbImpact: -0.4, rbImpact: -0.1, note: "Road dog. Negative script can cut designed rush." },
  { teamId: "nyg", starters: ["Thomas", "Runyan", "Schlottmann"], grade: 4.4, quality: "ESTIMATE", qbImpact: -0.5, rbImpact: -0.2, note: "SNF home dog. OL does not invent a rush environment." },
  { teamId: "dal", starters: ["Smith", "Martin", "Steele"], grade: 6.9, quality: "ESTIMATE", qbImpact: 0.4, rbImpact: 0.4, note: "Favorite on the road. OL is a lean, not a lock." },
  { teamId: "min", starters: ["O'Neill", "Darrisaw", "Bradbury"], grade: 6.5, quality: "ESTIMATE", qbImpact: 0.4, rbImpact: 0.3, note: "Indoor. OL supports designed pass if JJ is the QB." },
  { teamId: "gb", starters: ["Tom", "Jenkins", "Myers"], grade: 6.0, quality: "ESTIMATE", qbImpact: 0.2, rbImpact: 0.3, note: "Road indoor. OL is not a coverage grade." },
  { teamId: "lac", starters: ["Slater", "Bozeman", "Salyer"], grade: 6.3, quality: "ESTIMATE", qbImpact: 0.3, rbImpact: 0.4, note: "Home favorite indoor. OL lean for Herbert / RB." },
  { teamId: "ari", starters: ["Williams", "Froholdt", "Jones"], grade: 4.9, quality: "ESTIMATE", qbImpact: -0.3, rbImpact: 0, note: "Big road dog. Negative script." },
  { teamId: "hou", starters: ["Tunsil", "Howard", "Patterson"], grade: 6.1, quality: "ESTIMATE", qbImpact: 0.3, rbImpact: 0.2, note: "Retractable roof UNKNOWN." },
  { teamId: "buf", starters: ["Brown", "McGovern", "Edwards"], grade: 6.4, quality: "ESTIMATE", qbImpact: 0.4, rbImpact: 0.3, note: "Slight favorite on the road." },
  { teamId: "ten", starters: ["Leribeus", "Radunz", "Skoronski"], grade: 4.7, quality: "ESTIMATE", qbImpact: -0.2, rbImpact: 0.1, note: "Sunday floor total. OL does not create pace." },
  { teamId: "nyj", starters: ["Simpson", "Tippmann", "Fashanu"], grade: 5.2, quality: "ESTIMATE", qbImpact: 0, rbImpact: 0.1, note: "Road floor game." },
  { teamId: "car", starters: ["Christensen", "Corbett", "Mays"], grade: 4.8, quality: "ESTIMATE", qbImpact: -0.2, rbImpact: 0.1, note: "Home dog vs CHI." },
  { teamId: "chi", starters: ["Jones", "Bates", "Thuney"], grade: 5.8, quality: "ESTIMATE", qbImpact: 0.2, rbImpact: 0.4, note: "Road favorite. OL lean for designed rush." },
  { teamId: "tb", starters: ["Wirfs", "Mauch", "Barton"], grade: 6.6, quality: "ESTIMATE", qbImpact: 0.4, rbImpact: 0.3, note: "Highest-total road game. OL is not coverage." },
];

export const OL_BY_TEAM = Object.fromEntries(OL_UNITS.map((row) => [row.teamId, row]));
