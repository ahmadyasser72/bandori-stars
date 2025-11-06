import clsx from "clsx";
import { Document, type DocumentOptions } from "flexsearch";

import { band_map, card_map, type Entry } from "@/contents/data";

import { constants } from "~/lib/content";

type CardName = Record<"character" | "name", string>;
export const config: DocumentOptions<CardName> = {
	tokenize: "tolerant",
	cache: false,
	store: false,

	document: { id: "card_names", index: ["character", "name"] },
};

export const createIndex = (oldestFirst: boolean) => {
	const index = new Document(config);

	const entries = [...card_map.entries()];
	if (!oldestFirst) entries.reverse();
	for (const [id, data] of entries)
		index.add(Number(id), {
			name: data.name,
			character: data.character.name,
		});

	return index;
};

export const filterList = [
	{
		label: "Band",
		props: {
			class: clsx(
				"border-bandori-band bg-bandori-band hover:bg-bandori-band-alt text-bandori-band-content",
			),
			name: "band" as const,
		},
		options: [...band_map.values()].map(({ id, name }) => ({
			"data-band-id": id,
			"aria-label": name,
			value: id,
		})),
		getValue: (entry: Entry<"card_map">) => entry.band.id,
	},
	{
		label: "Type",
		props: {
			class: clsx("border-accent bg-accent text-accent-content"),
			name: "type" as const,
		},
		options: constants.cardTypes.map((type, idx) => ({
			"aria-label": type.toUpperCase(),
			value: idx.toString(),
		})),
		getValue: (entry: Entry<"card_map">) =>
			constants.cardTypes.indexOf(entry.type).toString(),
	},
	{
		label: "Attribute",
		props: {
			class: clsx(
				"border-bandori-attribute bg-bandori-attribute hover:bg-bandori-attribute-alt text-bandori-attribute-content",
			),
			name: "attribute" as const,
		},
		options: constants.attributes.map((attribute, idx) => ({
			"data-attribute": attribute,
			"aria-label": attribute.toUpperCase(),
			value: idx.toString(),
		})),
		getValue: (entry: Entry<"card_map">) =>
			constants.attributes.indexOf(entry.attribute).toString(),
	},
] satisfies {
	label: string;
	props: { name: string } & Record<string, string>;
	options: ({ value: string } & Record<string, string>)[];
	getValue: (entry: Entry<"card_map">) => string;
}[];
