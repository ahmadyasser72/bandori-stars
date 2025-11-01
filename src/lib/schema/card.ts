import type { Attribute, CardRarity, RegionTuple } from ".";
import type { CharacterId } from "./character";

export type CardList = Record<string, Pick<Card, "rarity" | "type">>;

export interface Card {
	characterId: CharacterId;
	rarity: CardRarity;
	attribute: Attribute;
	resourceSetName: string;
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
