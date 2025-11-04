import { Document, type DocumentOptions } from "flexsearch";

import { band_map, card_map, type Entry } from "@/contents/data";

import { constants } from "~/lib/content";
import { regionValue } from "~/lib/utilities";

type CardEntry = Omit<Entry<"card_map">, "releasedAt" | "rateUp">;
export const config: DocumentOptions<CardEntry> = {
	preset: "match",
	resolution: 3,
	cache: false,
	store: false,

	document: {
		id: "card_map",
		index: ["character:name", "name:en", "attribute", "band:name", "type"],
	},
};

export const createIndex = (oldestFirst: boolean) => {
	const index = new Document(config);

	const entries = [...card_map.entries()];
	if (!oldestFirst) entries.reverse();
	for (const [id, data] of entries) index.add(Number(id), data);

	return index;
};

export const filterList = [
	{
		label: "Band",
		props: { class: "color-band", name: "band" as const },
		options: [...band_map.values()].map(({ id, name }) => ({
			"data-band-id": id,
			"aria-label": regionValue.unwrap(name),
			value: id,
		})),
		getValue: (entry: CardEntry) => entry.band.id,
	},
	{
		label: "Type",
		props: { class: "text-accent-content bg-accent", name: "type" as const },
		options: constants.cardTypes.map((type, idx) => ({
			"aria-label": type.toUpperCase(),
			value: idx.toString(),
		})),
		getValue: (entry: CardEntry) =>
			constants.cardTypes.indexOf(entry.type).toString(),
	},
	{
		label: "Attribute",
		props: { class: "color-attribute", name: "attribute" as const },
		options: constants.attributes.map((attribute, idx) => ({
			"data-attribute": attribute,
			"aria-label": attribute.toUpperCase(),
			value: idx.toString(),
		})),
		getValue: (entry: CardEntry) =>
			constants.attributes.indexOf(entry.attribute).toString(),
	},
] satisfies {
	label: string;
	props: { name: string } & Record<string, string>;
	options: ({ value: string } & Record<string, string>)[];
	getValue: (entry: CardEntry) => string;
}[];
