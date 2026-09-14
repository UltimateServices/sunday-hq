export const GLOSSARY: Record<string, string> = {
  CLV: "Closing line value. How the line you took compares to the last pre-kick number. REAL only when a closing snapshot exists.",
  EV: "Expected value at the ranked price. Assumed −110 is ESTIMATE for ranking — never a DraftKings price.",
  "Market Heat": "How active a stored move looks. QUIET / WARM / STEAM from seed or ingest notes — not a live steam feed.",
  "Environment Score": "0–100 ESTIMATE from posted total, indoor flag, weather impact, and known QB downgrades. Not a trained model.",
  "Role Stability": "How locked the usage looks from seed notes and depth. ROLE UNCERTAIN when sources disagree.",
  "Projection Spread": "Gap between sources. HIGH DISAGREEMENT is a badge, not a hidden average.",
  Edge: "Model minus book line (yards) or model probability minus implied (TD). Missing DK odds stay unavailable.",
  Confidence: "A+ through PASS. Week 1 seed does not award A / A+ (low sample + placeholder model).",
  "Data Health": "System tape only. Healthy / Degraded. Player availability never says healthy.",
};

export type GlossaryKey = keyof typeof GLOSSARY;
