import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { shuffle } from "fast-shuffle";

import { song_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { IMAGE_FORMAT } from "~/lib/bestdori/constants";

export const prerender = true;

export const GET: APIRoute<Props, Params> = async ({ props }) =>
	bestdori.asset.songAlbumCover(props).then((data) => new Response(data));

export const getStaticPaths = (() =>
	shuffle(
		[...song_map.values()].map((song) => ({
			params: { id: song.id, ext: IMAGE_FORMAT },
			props: { song },
		})),
	)) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
