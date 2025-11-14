import type { Attribute } from "~/lib/schema";
import type { CardType } from "~/lib/schema/card";
import type { EventType } from "~/lib/schema/event";
import type { GachaType } from "~/lib/schema/gacha";

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
