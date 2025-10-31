import { getCollection } from "astro:content";

import type { loader } from "./content";

export type CollectionId = keyof typeof loader;
export const collections: CollectionId[] = [
	"band",
	"character",
	"card",
	"event",
	"gacha",
];

export const collectionList = (collection: CollectionId) =>
	getCollection(collection).then((values) => ({
		keys: values.map(({ id }) => id),
	}));

const cachedEntries = new Map<CollectionId, Set<string>>();
export const createCollectionIsDefined = async (collection: CollectionId) => {
	const entries =
		cachedEntries.get(collection) ??
		(await collectionList(collection).then((data) => new Set(data.keys)))!;

	if (!cachedEntries.has(collection)) cachedEntries.set(collection, entries);

	return (id: string) => entries.has(id);
};

export const toJsonResponse = <T extends object>(o: T) => {
	const json = JSON.stringify(o);
	return new Response(json, {
		headers: {
			"content-type": "application/json",
			"content-length": json.length.toString(),
		},
	});
};
