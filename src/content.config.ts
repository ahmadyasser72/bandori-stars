import { defineCollection, z } from "astro:content";

import { bestdori } from "~/lib/bestdori";
import { constants, parse, schema } from "~/lib/content";
import * as Bandori from "~/lib/schema";

const card = defineCollection({
	loader: async () => {
		const cardList = await bestdori<Bandori.CardList>("api/cards/all.5.json");

		const gacha = ["permanent", "limited", "dreamfes", "birthday", "kirafes"];
		const results = await Promise.all(
			Object.entries(cardList)
				.filter(([, { type }]) => gacha.includes(type))
				.map(async ([id]) => {
					const card = await bestdori<Bandori.Card>(`api/cards/${id}.json`);

					const {
						characterId,
						rarity,
						attribute,
						type,
						prefix,
						releasedAt,
						source,
					} = card;

					return {
						id,
						characterId: characterId.toString(),
						rarity,
						name: parse.regionTuple(prefix),
						type,
						attribute,
						releasedAt: parse.timestamp(releasedAt),
						gacha: parse.card.gacha(source),
					};
				}),
		);

		return results.filter(({ name }) => name.jp !== null);
	},
	schema: z.strictObject({
		id: schema.id,
		characterId: schema.id,
		rarity: z.number().min(2).max(5),
		name: schema.createMultiRegion(z.string().nonempty()),
		type: schema.types.card,
		attribute: z.enum(constants.attributes),
		releasedAt: schema.createMultiRegion(z.date()),
		gacha: schema.createMultiRegion(z.array(schema.id)),
	}),
});

const event = defineCollection({
	loader: async () => {
		const eventList = await bestdori<Bandori.EventList>(
			"api/events/all.5.json",
		);

		const results = await Promise.all(
			Object.keys(eventList).map(async (eventId) => {
				const bandoriEvent = await bestdori<Bandori.Event>(
					`api/events/${eventId}.json`,
				);

				const {
					eventType,
					eventName,
					attributes,
					characters,
					startAt,
					endAt,
					pointRewards,
					rankingRewards,
					stories,
				} = bandoriEvent;

				return {
					id: eventId,
					name: parse.regionTuple(eventName),
					type: eventType,
					attribute: attributes[0].attribute,
					characters: characters.map(({ characterId }) => Number(characterId)),
					startAt: parse.timestamp(startAt),
					endAt: parse.timestamp(endAt),
					pointRewards: parse.event.pointRewards(pointRewards),
					rankingRewards: parse.event.rankingRewards(rankingRewards),
					storyRewards: parse.event.storyRewards(stories),
				};
			}),
		);

		return results.filter(({ name }) => name.jp !== null);
	},
	schema: z.strictObject({
		id: schema.id,
		name: schema.createMultiRegion(z.string().nonempty()),
		type: schema.types.event,
		attribute: z.enum(constants.attributes),
		characters: z.array(z.number().nonnegative()),
		startAt: schema.createMultiRegion(z.date()),
		endAt: schema.createMultiRegion(z.date()),
		pointRewards: schema.createMultiRegion(
			z.array(
				z.strictObject({
					point: z.number().nonnegative(),
					stars: z.number().nonnegative(),
				}),
			),
		),
		rankingRewards: schema.createMultiRegion(
			z.array(
				z.strictObject({
					rank: z.number().nonnegative(),
					stars: z.number().nonnegative(),
				}),
			),
		),
		storyRewards: z.number(),
	}),
});

const gacha = defineCollection({
	loader: async () => {
		const gachaList = await bestdori<Bandori.GachaList>("api/gacha/all.5.json");

		const f2p = ["permanent", "limited", "dreamfes", "birthday", "kirafes"];
		const results = await Promise.all(
			Object.entries(gachaList)
				.filter(([, { type }]) => f2p.includes(type))
				.map(async ([id]) => {
					const gacha = await bestdori<Bandori.Gacha>(`api/gacha/${id}.json`);

					const { gachaName, type, publishedAt, closedAt, details, rates } =
						gacha;

					return {
						id,
						name: parse.regionTuple(gachaName),
						type,
						startAt: parse.timestamp(publishedAt),
						endAt: parse.timestamp(closedAt),
						rateUp: parse.gacha.rateUp(details, rates),
					};
				}),
		);

		return results.filter(({ name }) => name.jp !== null);
	},
	schema: z.strictObject({
		id: schema.id,
		name: schema.createMultiRegion(z.string().nonempty()),
		type: schema.types.gacha,
		startAt: schema.createMultiRegion(z.date()),
		endAt: schema.createMultiRegion(z.date()),
		rateUp: schema.createMultiRegion(
			z.array(
				z.strictObject({
					cardId: schema.id,
					rarity: z.number().nonnegative(),
					rate: z.number().nonnegative(),
				}),
			),
		),
	}),
});

export const collections = { card, event, gacha };
