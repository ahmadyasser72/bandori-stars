import type { Attribute } from "./raw";
import type { CardType } from "./raw/card";
import type { EventType } from "./raw/event";
import type { GachaType } from "./raw/gacha";

export default {
	regions: ["jp", "en"] as const,
	rarity: { min: 3, max: 5 },
	attributes: [
		"pure",
		"cool",
		"happy",
		"powerful",
	] as const satisfies Attribute[],
	cardTypes: [
		"permanent",
		"limited",
		"dreamfes",
		"birthday",
		"kirafes",
	] as const satisfies CardType[],
	gachaTypes: [
		"permanent",
		"limited",
		"dreamfes",
		"birthday",
		"kirafes",
	] as const satisfies GachaType[],
	eventTypes: [
		"story",
		"versus",
		"mission_live",
		"challenge",
		"live_try",
		"medley",
		"festival",
	] as const satisfies EventType[],
};
