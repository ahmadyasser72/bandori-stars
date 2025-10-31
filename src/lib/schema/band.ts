import type { RegionTuple } from "./utilities";

export type Bands = Record<BandId, { bandName: RegionTuple<string> }>;

export type BandId = "1" | "2" | "3" | "4" | "5" | "18" | "21" | "45";
