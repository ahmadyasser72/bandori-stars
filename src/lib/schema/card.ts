import type { Attribute, CardRarity, RegionTuple } from ".";

export type CardList = Record<string, Pick<Card, "rarity" | "type">>;

export interface Card {
	characterId: number;
	rarity: CardRarity;
	attribute: Attribute;
	prefix: RegionTuple<string>;
	releasedAt: RegionTuple<string>;
	source: RegionTuple<CardSource, {}>;
	type: CardType;
}

export interface CardSource {
	gacha: Record<string, CardGacha>;
}

export interface CardGacha {
	probability: number;
}

export type CardType =
	| "initial"
	| "permanent"
	| "event"
	| "limited"
	| "campaign"
	| "others"
	| "dreamfes"
	| "birthday"
	| "kirafes"
	| "special";
