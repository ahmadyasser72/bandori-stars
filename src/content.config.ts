import { getCollection } from "~/lib/content";

export const collections = {
	card: getCollection("card"),
	event: getCollection("event"),
	gacha: getCollection("gacha"),
};
