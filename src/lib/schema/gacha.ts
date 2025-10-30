import type { CardRarity } from ".";
import type { RegionTuple } from "./utilities";

export type GachaList = Record<string, { type: GachaType }>;

export interface Gacha {
	details: RegionTuple<Record<string, GachaDetail>>;
	rates: RegionTuple<Record<string, GachaRate>>;
	gachaName: RegionTuple<string>;
	publishedAt: RegionTuple<string>;
	closedAt: RegionTuple<string>;
	type: GachaType;
}

export interface GachaDetail {
	rarityIndex: CardRarity;
	weight: number;
	pickup: boolean;
}

export interface GachaRate {
	rate: number;
	weightTotal: number;
}

export type GachaType =
	| "permanent"
	| "special"
	| "limited"
	| "dreamfes"
	| "miracle"
	| "free"
	| "birthday"
	| "kirafes";
