import type { RoofState } from "@/lib/types/domain";

export type VenueSpec = {
  gameId: string;
  name: string;
  lat: number;
  lon: number;
  roof: "FIXED_INDOOR" | "RETRACTABLE" | "OUTDOOR";
  defaultRoof: RoofState;
};

export const VENUES: VenueSpec[] = [
  { gameId: "tb-cin", name: "Paycor Stadium", lat: 39.0954, lon: -84.516, roof: "OUTDOOR", defaultRoof: "OPEN" },
  { gameId: "no-det", name: "Ford Field", lat: 42.34, lon: -83.0456, roof: "FIXED_INDOOR", defaultRoof: "FIXED" },
  { gameId: "nyj-ten", name: "Nissan Stadium", lat: 36.1665, lon: -86.7713, roof: "OUTDOOR", defaultRoof: "OPEN" },
  { gameId: "bal-ind", name: "Lucas Oil Stadium", lat: 39.7601, lon: -86.1639, roof: "RETRACTABLE", defaultRoof: "UNKNOWN" },
  { gameId: "atl-pit", name: "Acrisure Stadium", lat: 40.4468, lon: -80.0158, roof: "OUTDOOR", defaultRoof: "OPEN" },
  { gameId: "chi-car", name: "Bank of America Stadium", lat: 35.2258, lon: -80.8528, roof: "OUTDOOR", defaultRoof: "OPEN" },
  { gameId: "cle-jax", name: "EverBank Stadium", lat: 30.3239, lon: -81.6373, roof: "OUTDOOR", defaultRoof: "OPEN" },
  { gameId: "buf-hou", name: "NRG Stadium", lat: 29.6847, lon: -95.4107, roof: "RETRACTABLE", defaultRoof: "UNKNOWN" },
  { gameId: "mia-lv", name: "Allegiant Stadium", lat: 36.0908, lon: -115.183, roof: "FIXED_INDOOR", defaultRoof: "FIXED" },
  { gameId: "gb-min", name: "U.S. Bank Stadium", lat: 44.9738, lon: -93.2575, roof: "FIXED_INDOOR", defaultRoof: "FIXED" },
  { gameId: "was-phi", name: "Lincoln Financial Field", lat: 39.9008, lon: -75.1675, roof: "OUTDOOR", defaultRoof: "OPEN" },
  { gameId: "ari-lac", name: "SoFi Stadium", lat: 33.9535, lon: -118.339, roof: "FIXED_INDOOR", defaultRoof: "FIXED" },
  { gameId: "dal-nyg", name: "MetLife Stadium", lat: 40.8136, lon: -74.0744, roof: "OUTDOOR", defaultRoof: "OPEN" },
];

export const VENUE_BY_GAME = Object.fromEntries(VENUES.map((row) => [row.gameId, row]));
