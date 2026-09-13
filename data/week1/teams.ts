import type { Team } from "@/lib/types/domain";

export const TEAMS: Team[] = [
  { id: "ari", abbr: "ARI", city: "Arizona", name: "Cardinals", conference: "NFC", division: "West" },
  { id: "atl", abbr: "ATL", city: "Atlanta", name: "Falcons", conference: "NFC", division: "South" },
  { id: "bal", abbr: "BAL", city: "Baltimore", name: "Ravens", conference: "AFC", division: "North" },
  { id: "buf", abbr: "BUF", city: "Buffalo", name: "Bills", conference: "AFC", division: "East" },
  { id: "car", abbr: "CAR", city: "Carolina", name: "Panthers", conference: "NFC", division: "South" },
  { id: "chi", abbr: "CHI", city: "Chicago", name: "Bears", conference: "NFC", division: "North" },
  { id: "cin", abbr: "CIN", city: "Cincinnati", name: "Bengals", conference: "AFC", division: "North" },
  { id: "cle", abbr: "CLE", city: "Cleveland", name: "Browns", conference: "AFC", division: "North" },
  { id: "dal", abbr: "DAL", city: "Dallas", name: "Cowboys", conference: "NFC", division: "East" },
  { id: "det", abbr: "DET", city: "Detroit", name: "Lions", conference: "NFC", division: "North" },
  { id: "gb", abbr: "GB", city: "Green Bay", name: "Packers", conference: "NFC", division: "North" },
  { id: "hou", abbr: "HOU", city: "Houston", name: "Texans", conference: "AFC", division: "South" },
  { id: "ind", abbr: "IND", city: "Indianapolis", name: "Colts", conference: "AFC", division: "South" },
  { id: "jax", abbr: "JAX", city: "Jacksonville", name: "Jaguars", conference: "AFC", division: "South" },
  { id: "lv", abbr: "LV", city: "Las Vegas", name: "Raiders", conference: "AFC", division: "West" },
  { id: "lac", abbr: "LAC", city: "Los Angeles", name: "Chargers", conference: "AFC", division: "West" },
  { id: "mia", abbr: "MIA", city: "Miami", name: "Dolphins", conference: "AFC", division: "East" },
  { id: "min", abbr: "MIN", city: "Minnesota", name: "Vikings", conference: "NFC", division: "North" },
  { id: "no", abbr: "NO", city: "New Orleans", name: "Saints", conference: "NFC", division: "South" },
  { id: "nyg", abbr: "NYG", city: "New York", name: "Giants", conference: "NFC", division: "East" },
  { id: "nyj", abbr: "NYJ", city: "New York", name: "Jets", conference: "AFC", division: "East" },
  { id: "phi", abbr: "PHI", city: "Philadelphia", name: "Eagles", conference: "NFC", division: "East" },
  { id: "pit", abbr: "PIT", city: "Pittsburgh", name: "Steelers", conference: "AFC", division: "North" },
  { id: "tb", abbr: "TB", city: "Tampa Bay", name: "Buccaneers", conference: "NFC", division: "South" },
  { id: "ten", abbr: "TEN", city: "Tennessee", name: "Titans", conference: "AFC", division: "South" },
  { id: "was", abbr: "WAS", city: "Washington", name: "Commanders", conference: "NFC", division: "East" },
];

export const TEAM_BY_ID = Object.fromEntries(TEAMS.map((t) => [t.id, t]));
