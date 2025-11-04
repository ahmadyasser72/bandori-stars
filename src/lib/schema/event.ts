import type { Attribute } from ".";
import type { RegionTuple } from "./utilities";

export type EventList = Record<string, Pick<Event, "startAt" | "endAt">>;

export interface Event {
	eventType: EventType;
	eventName: RegionTuple<string>;
	attributes: AttributeElement[];
	characters: Character[];
	startAt: RegionTuple<string>;
	endAt: RegionTuple<string>;
	pointRewards: RegionTuple<PointReward[]>;
	rankingRewards: RegionTuple<RankingReward[]>;
	stories: Story[];
}

export type EventType =
	| "story"
	| "versus"
	| "mission_live"
	| "challenge"
	| "live_try"
	| "medley"
	| "festival";

export interface AttributeElement {
	attribute: Attribute;
}

export interface Character {
	characterId: string | number;
}

export type Type =
	| "degree"
	| "voice_stamp"
	| "practice_ticket"
	| "star"
	| "coin"
	| "item"
	| "costume_3d_making_item"
	| "situation"
	| "stamp"
	| "live_boost_recovery_item";

export interface Reward {
	rewardType: Type;
	rewardQuantity: string | number;
}

export interface PointReward extends Reward {
	point: string | number;
}

export interface RankingReward extends Reward {
	toRank: string | number;
}

export interface Story {
	rewards: StoryReward[];
}

export type StoryReward = Reward;
