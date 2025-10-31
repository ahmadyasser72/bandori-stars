import { z, type ZodTypeAny } from "astro:schema";

import constants from "./constants";

export const types = {
	attribute: z.enum(constants.attributes),
	card: z.enum(constants.cardTypes),
	gacha: z.enum(constants.gachaTypes),
	event: z.enum(constants.eventTypes),
};

export const createMultiRegion = <T extends ZodTypeAny>(schema: T) =>
	z.object({ jp: schema, en: schema.nullable() });

export const id = z.string().nonempty();
export const name = createMultiRegion(z.string().nonempty());

export const loader = {
	band: z.strictObject({ id, name }),
	character: z.strictObject({ id, name, bandId: id }),

	card: z.strictObject({
		id,
		name,
		characterId: id,
		rarity: z.number().min(2).max(5),
		type: types.card,
		attribute: types.attribute,
		releasedAt: createMultiRegion(z.date()),
		gacha: createMultiRegion(z.array(id)),
	}),

	event: z.strictObject({
		id,
		name,
		type: types.event,
		attribute: types.attribute,
		characters: z.array(z.number().nonnegative()),
		startAt: createMultiRegion(z.date()),
		endAt: createMultiRegion(z.date()),
		pointRewards: createMultiRegion(
			z.array(
				z.strictObject({
					point: z.number().nonnegative(),
					stars: z.number().nonnegative(),
				}),
			),
		),
		rankingRewards: createMultiRegion(
			z.array(
				z.strictObject({
					rank: z.number().nonnegative(),
					stars: z.number().nonnegative(),
				}),
			),
		),
		storyRewards: z.number(),
	}),

	gacha: z.strictObject({
		id,
		name,
		type: types.gacha,
		startAt: createMultiRegion(z.date()),
		endAt: createMultiRegion(z.date()),
		rateUp: createMultiRegion(
			z.array(
				z.strictObject({
					cardId: id,
					rarity: z.number().nonnegative(),
					rate: z.number().nonnegative(),
				}),
			),
		),
	}),
};
