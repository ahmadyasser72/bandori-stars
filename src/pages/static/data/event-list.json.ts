import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const prerender = true;

export const GET: APIRoute = async () => {
	const eventList = await getCollection("event");

	return new Response(JSON.stringify(eventList.map(({ data }) => data)), {
		headers: { "content-type": "application/json" },
	});
};
