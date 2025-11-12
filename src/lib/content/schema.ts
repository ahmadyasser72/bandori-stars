import { z, ZodType } from "zod";

import { dayjs } from "~/lib/date";
import constants from "./constants";

export const types = {
	attribute: z.enum(constants.attributes),
	card: z.enum(constants.cardTypes),
	gacha: z.enum(constants.gachaTypes),
	event: z.enum(constants.eventTypes),
};

export const createMultiRegion = <T extends ZodType>(schema: T) =>
	z.object({ jp: schema, en: schema.nullable() });

export const id = z.string().nonempty();
export const name = createMultiRegion(z.string().nonempty());
export const timestamp = createMultiRegion(
	z.custom<dayjs.Dayjs>((it) => dayjs.isDayjs(it)),
);

export const schema = {
	band: z.strictObject({ id, name }),
	character: z.strictObject({ id, name, band: id }),

	card: z.strictObject({
		id,
		resourceId: id,
		name,
		character: id,
		rarity: z.number().min(2).max(5),
		type: types.card,
		attribute: types.attribute,
		releasedAt: timestamp,
		gacha: createMultiRegion(z.array(id)),
	}),

	event: z.strictObject({
		id,
		name,
		type: types.event,
		attribute: types.attribute,
		characters: z.array(id),
		startAt: timestamp,
		endAt: timestamp,
		assetBundleName: id,
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
		startAt: timestamp,
		endAt: timestamp,
		bannerAssetBundleName: id,
		rateUp: createMultiRegion(
			z.array(
				z.strictObject({
					card: id,
					rarity: z.number().nonnegative(),
					rate: z.number().nonnegative(),
				}),
			),
		),
	}),

	song: z.strictObject({
		id,
		title: name,
		releasedAt: timestamp,
		specialReleasedAt: timestamp.optional(),
		rewards: z.strictObject({
			fullCombo: z.strictObject({
				hard: z.number().nonnegative(),
				expert: z.number().nonnegative(),
				special: z.number().nonnegative().optional(),
			}),
			score: z.record(z.enum(["S", "SS"]), z.number().nonnegative()),
		}),
	}),
};

export type SchemaKeys = keyof typeof schema;
export type Schema<K extends SchemaKeys> = z.infer<(typeof schema)[K]>;
