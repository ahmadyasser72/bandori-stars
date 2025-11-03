import { Document, type DocumentOptions } from "flexsearch";

import { band_list, card_list, type Entry } from "@/contents/data";

import { constants } from "~/lib/content";
import { regionValue } from "~/lib/utilities";

type CardEntry = Omit<Entry<"card_list">, "releasedAt" | "rateUp">;
export const config: DocumentOptions<CardEntry> = {
	preset: "match",
	resolution: 3,
	cache: false,
	store: false,

	document: {
		id: "card_list",
		index: ["character:name", "name:en", "attribute", "band:name", "type"],
	},
};

export const createIndex = (oldestFirst: boolean) => {
	const index = new Document(config);

	const entries = [...card_list.entries()];
	if (!oldestFirst) entries.reverse();
	for (const [id, data] of entries) index.add(Number(id), data);

	return index;
};

export const filterList = [
	{
		label: "Band",
		props: { class: "color-band", name: "band" },
		options: [...band_list.values()].map(({ id, name }) => {
			const value = regionValue.unwrap(name);
			return {
				"data-band-id": id,
				"aria-label": value,
				value,
			};
		}),
		getValue: (entry: CardEntry) => entry.band.name,
	},
	{
		label: "Type",
		props: { class: "text-accent-content bg-accent", name: "type" },
		options: constants.cardTypes.map((type) => ({
			"aria-label": type.toUpperCase(),
			value: type,
		})),
		getValue: (entry: CardEntry) => entry.type,
	},
	{
		label: "Attribute",
		props: { class: "color-attribute", name: "attribute" },
		options: constants.attributes.map((attribute) => ({
			"data-attribute": attribute,
			"aria-label": attribute.toUpperCase(),
			value: attribute,
		})),
		getValue: (entry: CardEntry) => entry.attribute,
	},
];
