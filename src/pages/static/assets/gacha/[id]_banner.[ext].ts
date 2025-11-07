import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { shuffle } from "fast-shuffle";

import { gacha_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { IMAGE_FORMAT } from "~/lib/bestdori/constants";

export const prerender = true;

export const GET: APIRoute<Props, Params> = async ({ props }) =>
	bestdori.asset.gachaBanner(props.data).then((data) => new Response(data));

export const getStaticPaths = (() =>
	shuffle(
		[...gacha_map.values()].map((data) => ({
			params: { id: data.id, ext: IMAGE_FORMAT },
			props: { data },
		})),
	)) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
