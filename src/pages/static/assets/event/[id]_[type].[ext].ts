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

export const GET: APIRoute<Props, Params> = ({ props }) =>
	bestdori.asset.event(props).then((data) => new Response(data));

export const getStaticPaths = (() => {
	const allEvents = [...event_map.values()];
	const kinds = ["banner", "background"] as const;

	const results = allEvents.flatMap((event) =>
		kinds.flatMap((kind) => ({
			params: { id: event.id, type: kind, ext: IMAGE_FORMAT },
			props: { event, kind },
		})),
	);

	return shuffle(results);
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
