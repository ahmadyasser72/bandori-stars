import { defineCollection } from "astro:content";

import { loader, schema } from "~/lib/content";

const card = defineCollection({
	loader: loader.card,
	schema: schema.loader.card,
});

const event = defineCollection({
	loader: loader.event,
	schema: schema.loader.event,
});

const gacha = defineCollection({
	loader: loader.gacha,
	schema: schema.loader.gacha,
});

export const collections = { card, event, gacha };
