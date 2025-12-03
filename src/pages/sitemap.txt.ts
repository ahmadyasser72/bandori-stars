import type { APIRoute } from "astro";

import { gacha_map } from "@/contents/data";

export const GET: APIRoute = ({ url }) => {
	const entries = [] as string[];
	const add = (path: string) => entries.push(new URL(path, url.origin).href);

	add("");
	add("/select/card");
	add("/select/gacha");

	for (const { id } of [...gacha_map.values()]) add(`/calculate/${id}`);

	return new Response(entries.join("\n"), {
		headers: { "content-type": "text/plain" },
	});
};
