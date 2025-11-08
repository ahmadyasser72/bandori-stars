import type {
	APIRoute,
	GetStaticPaths,
	InferGetStaticParamsType,
	InferGetStaticPropsType,
} from "astro";

import { shuffle } from "fast-shuffle";

import { card_map } from "@/contents/data";
import { bestdori } from "~/lib/bestdori";
import { BLURHASH_IMAGE_FORMAT, IMAGE_FORMAT } from "~/lib/bestdori/constants";

export const prerender = true;

export const GET: APIRoute<Props, Params> = ({ props }) =>
	bestdori.asset.card(props).then((data) => new Response(data));

export const getStaticPaths = (() => {
	const allCards = [...card_map.values()];

	const kinds = ["icon", "full"] as const;
	const trainedVariant = [true, false];

	const results = allCards.flatMap((card) =>
		trainedVariant.flatMap((trained) =>
			kinds.flatMap((kind) => {
				const blurhashOptions = kind === "full" ? [true, false] : [false];

				return blurhashOptions.map((blurhash) => ({
					params: {
						id: card.id,
						type: trained ? `${kind}_trained` : kind,
						ext: blurhash ? BLURHASH_IMAGE_FORMAT : IMAGE_FORMAT,
					},
					props: { card, kind, trained, blurhash },
				}));
			}),
		),
	);

	return shuffle(results);
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;
type Params = InferGetStaticParamsType<typeof getStaticPaths>;
