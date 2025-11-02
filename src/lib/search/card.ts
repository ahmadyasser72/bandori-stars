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

export const index = new Document(config);
for (const [id, data] of [...card_list.entries()].reverse())
	index.add(Number(id), data);
