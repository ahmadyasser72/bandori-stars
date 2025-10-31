import { getCollection } from "~/lib/content";

export const collections = {
	band: getCollection("band"),
	character: getCollection("character"),

	card: getCollection("card"),
	event: getCollection("event"),
	gacha: getCollection("gacha"),
};
