import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
	const gachaList = await getCollection("gacha");

	return new Response(JSON.stringify(gachaList.map(({ data }) => data)), {
		headers: { "content-type": "application/json" },
	});
};
