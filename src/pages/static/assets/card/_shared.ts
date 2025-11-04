import type {
	APIRoute as AstroAPIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { card_map } from "@/contents/data";

export const getStaticPaths = (() =>
	[...card_map.values()].map((data) => ({
		params: { id: data.id },
		props: { data },
	}))) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
export type APIRoute = AstroAPIRoute<Props, Params>;
