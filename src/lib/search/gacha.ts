import clsx from "clsx";
import { Document } from "flexsearch";

import { character_map, gacha_map, type Entry } from "@/contents/data";
import { constants } from "~/lib/content";
import { documentOptions, doSearch, type Filter } from ".";
import { regionValue } from "../utilities";

type Data = { name: string; characters: string[] };
export const searchGacha = (query: string, oldestFirst: boolean) => {
	const document = new Document<Data>({
		...documentOptions,
		document: { id: "gacha_names", index: ["name", "characters"] },
	});

	const entries = [...gacha_map.entries()];
	if (!oldestFirst) entries.reverse();
	for (const [id, data] of entries)
		document.add(Number(id), {
			name: data.name,
			characters:
				regionValue
					.unwrap(data.rateUp)
					?.map(({ card }) => card.character.name) ?? [],
		});

	return doSearch(document, query);
};

export const filterList = [
	{
		label: "Character",
		props: {
			class: clsx(
				"border-bandori-band bg-bandori-band hover:bg-bandori-band-alt text-bandori-band-content",
			),
			name: "character" as const,
		},
		options: [...character_map.values()].map(({ id, name, band }) => ({
			"data-band-id": band.id,
			"aria-label": name,
			value: id,
		})),
		getValue: (entry) => [
			...new Set(
				regionValue.unwrap(entry.rateUp)!.map(({ card }) => card.character.id),
			),
		],
	},
	{
		label: "Type",
		props: {
			class: clsx("border-accent bg-accent text-accent-content"),
			name: "type" as const,
		},
		options: constants.gachaTypes.map((type, idx) => ({
			"aria-label": type.toUpperCase(),
			value: idx.toString(),
		})),
		getValue: (entry) => constants.gachaTypes.indexOf(entry.type).toString(),
	},
] satisfies Filter<Entry<"gacha_map">>[];
