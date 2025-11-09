import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { shuffle } from "fast-shuffle";

import { event_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { IMAGE_FORMAT } from "~/lib/bestdori/constants";

export const prerender = true;

export const GET: APIRoute<Props, Params> = async ({ props }) =>
	bestdori.asset.eventBanner(props).then((data) => new Response(data));

export const getStaticPaths = (() =>
	shuffle(
		[...event_map.values()].map((event) => ({
			params: {
				id: event.id,
				ext: IMAGE_FORMAT,
			},
			props: { event },
		})),
	)) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
