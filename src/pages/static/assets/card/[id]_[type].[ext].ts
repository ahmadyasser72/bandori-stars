import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { shuffle } from "fast-shuffle";

import { card_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { hasNoPreTrained } from "~/lib/bestdori/asset";
import { IMAGE_FORMAT } from "~/lib/bestdori/constants";

export const prerender = true;

export const GET: APIRoute<Props, Params> = ({ props }) =>
	bestdori.asset.card(props).then((data) => new Response(data));

export const getStaticPaths = (() => {
	const allCards = [...card_map.values()];
	const kinds = ["icon", "full"] as const;

	const results = allCards.flatMap((card) =>
		kinds.flatMap((kind) =>
			[true, false]
				.filter((trained) => trained || !hasNoPreTrained(card))
				.map((trained) => ({
					params: {
						id: card.id,
						type: trained ? `${kind}_trained` : kind,
						ext: IMAGE_FORMAT,
					},
					props: { card, kind, trained },
				})),
		),
	);

	return shuffle(results);
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
