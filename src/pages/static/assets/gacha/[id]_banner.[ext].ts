import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { shuffle } from "fast-shuffle";

import { gacha_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { BLURHASH_FORMAT, IMAGE_FORMAT } from "~/lib/bestdori/constants";

export const prerender = true;

export const GET: APIRoute<Props, Params> = async ({ props }) =>
	bestdori.asset.gachaBanner(props).then((data) => new Response(data));

export const getStaticPaths = (() =>
	shuffle(
		[...gacha_map.values()].flatMap((gacha) =>
			[true, false].map((blurhash) => ({
				params: {
					id: gacha.id,
					ext: blurhash ? BLURHASH_FORMAT : IMAGE_FORMAT,
				},
				props: { gacha, blurhash },
			})),
		),
	)) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
