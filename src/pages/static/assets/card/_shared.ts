import type {
	APIRoute as AstroAPIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { card_map } from "@/contents/data";

import { IMAGE_FORMAT } from "~/lib/bestdori/client";

export const getStaticPaths = (() =>
	[...card_map.values()].map((data) => ({
		params: { id: data.id, ext: IMAGE_FORMAT },
		props: { data },
	}))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
export type APIRoute = AstroAPIRoute<Props, Params>;
