import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
	const cardList = await getCollection("card");

	return new Response(JSON.stringify(cardList.map(({ data }) => data)), {
		headers: { "content-type": "application/json" },
	});
};
