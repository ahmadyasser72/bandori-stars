import type { APIRoute, GetStaticPaths } from "astro";

import {
	collectionList,
	collections,
	toJsonResponse,
	type CollectionId,
} from "~/lib/collection";

export const prerender = true;

export const GET: APIRoute = ({ params }) =>
	collectionList(params.name as CollectionId).then(toJsonResponse);

export const getStaticPaths: GetStaticPaths = () =>
	collections.map((name) => ({ params: { name } }));
