import clsx from "clsx";
import { Document } from "flexsearch";

import { band_map, card_map, type Entry } from "@/contents/data";
import { constants } from "~/lib/content";
import { documentOptions, doSearch, type Filter } from ".";

type Data = Record<"character" | "name", string>;
export const searchCard = (query: string, oldestFirst: boolean) => {
	const document = new Document<Data>({
		...documentOptions,
		document: { id: "card_names", index: ["character", "name"] },
	});

	const entries = [...card_map.entries()];
	if (!oldestFirst) entries.reverse();
	for (const [id, data] of entries)
		document.add(Number(id), {
			name: data.name,
			character: data.character.name,
		});

	return doSearch(document, query);
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
		getValue: (entry) => entry.band.id,
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
		getValue: (entry) => constants.cardTypes.indexOf(entry.type).toString(),
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
		getValue: (entry) =>
			constants.attributes.indexOf(entry.attribute).toString(),
	},
] satisfies Filter<Entry<"card_map">>[];
