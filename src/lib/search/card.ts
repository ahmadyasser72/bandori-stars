import { Document, type DocumentOptions } from "flexsearch";

import { card_list, type Entry } from "@/contents/data";

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
