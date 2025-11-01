import type { APIRoute, GetStaticPaths } from "astro";
import { getEntry } from "astro:content";

import { bestdoriAsset } from "~/lib/bestdori";
import { collectionList } from "~/lib/collection";

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
	const entry = await getEntry("card", params.id!)!;

	const icon = await bestdoriAsset.card("icon", false, entry);
	return new Response(icon);
};

export const getStaticPaths: GetStaticPaths = async () =>
	collectionList("card").then(({ keys }) =>
		keys.map((id) => ({ params: { id } })),
	);
