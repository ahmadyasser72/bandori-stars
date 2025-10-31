import { getCollectionConfig } from "~/lib/content";

export const collections = {
	band: getCollectionConfig("band"),
	character: getCollectionConfig("character"),

	card: getCollectionConfig("card"),
	event: getCollectionConfig("event"),
	gacha: getCollectionConfig("gacha"),
};
