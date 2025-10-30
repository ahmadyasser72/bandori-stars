import { z } from "astro:content";
import type { ZodTypeAny } from "astro:schema";

import { sum } from "./math";
import type { Attribute, RegionTuple } from "./schema";
import type { Card, CardType } from "./schema/card";
import type { Event, EventType } from "./schema/event";
import type { Gacha, GachaType } from "./schema/gacha";
import { emptyObjectIsNull } from "./utilities";

export type Region = (typeof constants.regions)[number];

export const constants = {
	regions: ["jp", "en"] as const,
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

export const parse = {
	regionTuple: <T>([jp, en]: RegionTuple<T>) => ({ jp, en }),

	timestamp: (timestamps: RegionTuple<string>) =>
		parse.regionTuple(
			timestamps.map((timestamp) => {
				const n = Number(timestamp ?? NaN);
				return Number.isNaN(n) ? null : new Date(n);
			}) as RegionTuple<Date>,
		),

	card: {
		gacha: (sources: Card["source"]) =>
			parse.regionTuple(
				sources
					.map(emptyObjectIsNull)
					.map((source) =>
						source
							? Object.entries(source.gacha).map(
									([gachaId, { probability: rate }]) => ({ gachaId, rate }),
								)
							: null,
					) as RegionTuple<{ gachaId: string; rate: number }[]>,
			),
	},

	event: {
		pointRewards: (tuple: Event["pointRewards"]) =>
			parse.regionTuple(
				tuple.map((rewards) =>
					rewards
						? rewards
								.filter(({ rewardType }) => rewardType === "star")
								.map(({ point, rewardQuantity }) => ({
									point: Number(point),
									stars: Number(rewardQuantity),
								}))
						: null,
				) as RegionTuple<{ point: number; stars: number }[]>,
			),
		rankingRewards: (tuple: Event["rankingRewards"]) =>
			parse.regionTuple(
				tuple.map((rewards) =>
					rewards
						? rewards
								.filter(({ rewardType }) => rewardType === "star")
								.map(({ toRank, rewardQuantity }) => ({
									rank: Number(toRank),
									stars: Number(rewardQuantity),
								}))
						: null,
				) as RegionTuple<{ rank: number; stars: number }[]>,
			),
		storyRewards: (stories: Event["stories"]) =>
			sum(
				stories.flatMap(({ rewards }) =>
					rewards
						.filter(({ rewardType }) => rewardType === "star")
						.map(({ rewardQuantity: stars }) => Number(stars)),
				),
			),
	},

	gacha: {
		rateUp: (detailsTuple: Gacha["details"], ratesTuple: Gacha["rates"]) =>
			parse.regionTuple(
				detailsTuple.map((details, tupleId) =>
					details
						? Object.entries(details)
								.filter(([, { pickup }]) => pickup)
								.map(([cardId, { rarityIndex: rarity, weight }]) => {
									const { rate, weightTotal } = ratesTuple[tupleId]![rarity];
									return {
										cardId,
										rarity,
										rate: (weight / weightTotal) * rate,
									};
								})
						: null,
				) as RegionTuple<{ cardId: string; rarity: number; rate: number }>,
			),
	},
};

export const schema = {
	multiRegion: <T extends ZodTypeAny>(schema: T) =>
		z.object({ jp: schema, en: schema.nullable() }),
};
