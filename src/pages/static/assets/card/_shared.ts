import type {
	APIRoute as AstroAPIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { card_map } from "@/contents/data";
import { IMAGE_FORMAT } from "~/lib/bestdori/client";

export const getStaticPaths = (() =>
	[...card_map.values()].flatMap((data) =>
		(["icon", "full"] as const).map((type) => ({
			params: { id: data.id, type, ext: IMAGE_FORMAT },
			props: { data },
		})),
	)) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
export type APIRoute = AstroAPIRoute<Props, Params>;
