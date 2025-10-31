import { sum } from "~/lib/math";
import type { Card, Event, Gacha, RegionTuple } from "~/lib/schema";
import { emptyObjectIsNull } from "~/lib/utilities";

export const regionTuple = <T>([jp, en]: RegionTuple<T>) => ({ jp, en });

export const timestamp = (timestamps: RegionTuple<string>) =>
	regionTuple(
		timestamps.map((timestamp) => {
			const n = Number(timestamp ?? NaN);
			return Number.isNaN(n) ? null : new Date(n);
		}) as RegionTuple<Date>,
	);

export const card = {
	gacha: (sources: Card["source"]) =>
		regionTuple(
			sources
				.map(emptyObjectIsNull)
				.map((source) =>
					source ? Object.keys(source.gacha) : null,
				) as RegionTuple<string[]>,
		),
};

export const event = {
	pointRewards: (tuple: Event["pointRewards"]) =>
		regionTuple(
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
		regionTuple(
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
};

export const gacha = {
	rateUp: (detailsTuple: Gacha["details"], ratesTuple: Gacha["rates"]) =>
		regionTuple(
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
};
