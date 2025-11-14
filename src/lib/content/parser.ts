import { dayjs } from "~/lib/date";
import { sum } from "~/lib/math";
import type { Card, Event, Gacha, RegionTuple, Song } from "~/lib/schema";
import { emptyObjectIsNull } from "~/lib/utilities";
import constants from "./constants";

export const regionTuple = <T>([jp, en]: RegionTuple<T>) => ({ jp, en });

export const timestamp = (timestamps: RegionTuple<string>) =>
	regionTuple(
		timestamps.map((timestamp) => {
			const n = Number(timestamp ?? NaN);
			return Number.isNaN(n) ? null : dayjs(n);
		}) as RegionTuple<dayjs.Dayjs>,
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
							.sort((a, b) => a.point - b.point)
							.reduce(
								(acc, next) => {
									const previous = acc.length > 0 ? acc.at(-1)!.stars : 0;
									acc.push({ point: next.point, stars: next.stars + previous });
									return acc;
								},
								[] as { point: number; stars: number }[],
							)
					: null,
			) as RegionTuple<{ point: number; stars: number }[]>,
		),
	rankingRewards: (tuple: Event["rankingRewards"]) =>
		regionTuple(
			tuple.map((rewards) =>
				rewards
					? [
							...rewards
								.filter(({ rewardType }) => rewardType === "star")
								.map(({ toRank, rewardQuantity }) => ({
									rank: Number(toRank),
									stars: Number(rewardQuantity),
								}))
								.sort((a, b) => a.rank - b.rank)
								.reduce(
									(map, next) => map.set(next.stars, next),
									new Map<number, { rank: number; stars: number }>(),
								)
								.values(),
						]
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
							.filter(
								([, { pickup, rarityIndex }]) =>
									pickup &&
									Number(rarityIndex) >= constants.rarity.min &&
									Number(rarityIndex) <= constants.rarity.max,
							)
							.map(([card, { rarityIndex: rarity, weight }]) => {
								const { rate, weightTotal } = ratesTuple[tupleId]![rarity];
								const weightedRate = (weight / weightTotal) * rate;
								return {
									card,
									rarity,
									rate: Math.round((weightedRate + Number.EPSILON) * 100) / 100,
								};
							})
					: null,
			) as RegionTuple<{ card: string; rarity: number; rate: number }>,
		),
};

export const song = {
	rewards: (
		achievements: Song["achievements"],
		difficulty: Song["difficulty"],
	) => {
		const getStarReward = (
			type: Song["achievements"][number]["achievementType"],
		) =>
			achievements.find(
				({ achievementType, rewardType }) =>
					achievementType === type && rewardType === "star",
			)!.quantity;

		return {
			fullComboRewards: {
				hard: {
					level: difficulty[2].playLevel,
					stars: getStarReward("full_combo_hard"),
				},
				expert: {
					level: difficulty[3].playLevel,
					stars: getStarReward("full_combo_expert"),
				},
				special:
					difficulty[4] !== undefined
						? {
								level: difficulty[4].playLevel,
								stars: getStarReward("full_combo_special"),
							}
						: null,
			},
			scoreRewards: {
				s: getStarReward("score_rank_s"),
				ss: getStarReward("score_rank_ss"),
			},
		};
	},
};
