import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";
import { getCollection } from "astro:content";

import { collections, toJsonResponse } from "~/lib/collection";

export const prerender = true;

export const GET: APIRoute<Props, Params> = ({ props }) =>
	toJsonResponse({ keys: props.keys });

export const getStaticPaths = (() =>
	Promise.all(
		collections.map(async (name) => ({
			params: { name },
			props: { keys: (await getCollection(name)).map(({ id }) => id) },
		})),
	)) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;
